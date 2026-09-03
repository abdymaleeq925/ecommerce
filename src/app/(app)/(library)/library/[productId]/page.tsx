import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { caller, getQueryClient, trpc } from "@/trpc/server";

import { ProductView } from "@/modules/library/ui/views/product-view";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ productId: string }>;
}

const Page = async ({ params }: Props) => {
  const { productId } = await params;
  const session = await caller.auth.session();
  if (!session?.user) redirect("/sign-in");
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({ productId }),
  );
  await queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({ productId }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
};

export default Page;
