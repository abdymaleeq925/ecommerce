import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { ProductView } from "@/modules/products/ui/views/product-view";

interface PageProps {
  params: Promise<{productId: string, slug: string}>
}

const Page = async({ params }:PageProps) => {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));
  await queryClient.prefetchQuery(trpc.products.getOne.queryOptions({ id: productId, tenantSlug: slug }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} tenantSlug={slug}/>
    </HydrationBoundary>
  )
}

export default Page