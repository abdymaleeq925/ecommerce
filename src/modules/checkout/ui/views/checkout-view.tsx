"use client"
import { useEffect } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";

import { generateTenantURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "../../hooks/use-cart";
import CheckoutItem from "../components/checkout-item";
import CheckoutSidebar from "../components/checkout-sidebar";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface CheckoutViewProps {
  tenantSlug: string
}

const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);
  const { data, error, isLoading, refetch } = useQuery(trpc.checkout.getProducts.queryOptions({ ids: productIds, tenantSlug }));

  const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
    onMutate: () => { setStates({ success: false, cancel: false }) },
    onSuccess: (data) => {
      if (!data.url) {
        toast.error("Something went wrong, please try again");
        return;
      }
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = data.url;
    },
    onError: (error) => { 
      if (error.data?.code === "UNAUTHORIZED") {
        // TODO: Modify when subdomains enabled
        router.push("/sign-in"); 
      } 
      toast.error(error.message) 
    }
  }));

  const verify = useMutation(trpc.checkout.verify.mutationOptions({
    onSuccess: () => {
      clearCart();
      setStates({ success: false, cancel: false, session_id: null });
      // TODO: Invalidate library
      router.push("/products");
    },
    onError: (error) => {
      // оплата не подтвердилась сервером — корзину НЕ трогаем,
      // просто сообщаем пользователю и убираем "грязные" параметры из URL
      setStates({ success: false, cancel: false, session_id: null });
      toast.error(error.message || "Could not verify your payment. Please contact support if you were charged.");
    }
  }));


  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      // TODO: Invalidate library
      router.push("/products")
    }
  }, [states.success, clearCart, router])

  useEffect(() => {
    // раньше здесь просто доверяли states.success из URL и сразу чистили корзину —
    // теперь success служит лишь триггером для реальной серверной проверки session_id
    if (states.success && states.session_id && !verify.isPending) {
      verify.mutate({ sessionId: states.session_id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.success, states.session_id])

  if (isLoading) return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <LoaderIcon className="text-muted-foreground animate-spin" />
      </div>
    </div>
  )

  if (error && error.data?.code !== "NOT_FOUND") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Something went wrong while loading your checkout. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="secondary">
          Retry
        </Button>
      </div>
    );
  }

  if (error?.data?.code === "NOT_FOUND") {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">Invalid products found, cart is cleared</p>
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    </div>
  )

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {
              data?.docs.map((product, index) => (
                <CheckoutItem
                  key={product.id}
                  isLast={index === data.docs.length - 1}
                  imageUrl={product.image?.url}
                  name={product.name}
                  productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                  tenantUrl={generateTenantURL(product.tenant.slug)}
                  tenantName={product.tenant.name}
                  price={product.price}
                  onRemove={() => removeProduct(product.id)}
                />
              ))
            }
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutView