import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-views";
interface CategoriesProps {
  params: Promise<{ category: string }>,
  searchParams: Promise<SearchParams>
}

const Page = async ({ params, searchParams }: CategoriesProps) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category, ...filters }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category}/>
    </HydrationBoundary>
  )
}

export default Page