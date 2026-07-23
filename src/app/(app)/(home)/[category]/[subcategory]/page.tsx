import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";

interface SubcategoriesProps {
  params: Promise<{subcategory: string}>
}

const Page = async ({ params }: SubcategoriesProps) => {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category: subcategory}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton/>}>
        <ProductList category={subcategory}/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page