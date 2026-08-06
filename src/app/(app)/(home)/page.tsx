import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-views";
import { DEFAULT_LIMIT } from "@/constants";
interface CategoriesProps {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: CategoriesProps) => {
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
    { limit: DEFAULT_LIMIT, ...filters },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
      }
    }
  ));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView/>
    </HydrationBoundary>
  )
}

export default Page