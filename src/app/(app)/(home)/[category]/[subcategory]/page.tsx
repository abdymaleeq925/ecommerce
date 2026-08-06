import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-views";
import { DEFAULT_LIMIT } from "@/constants";

interface SubcategoriesProps {
  params: Promise<{subcategory: string}>,
  searchParams: Promise<SearchParams>
}

const Page = async ({ params, searchParams }: SubcategoriesProps) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
    { category: subcategory, limit: DEFAULT_LIMIT, ...filters },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
      }
    }
  ));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory}/>
    </HydrationBoundary>
  )
}

export default Page