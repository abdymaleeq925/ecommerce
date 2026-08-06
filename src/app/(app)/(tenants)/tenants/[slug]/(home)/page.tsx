import { SearchParams } from "nuqs/server"

import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { DEFAULT_LIMIT } from "@/constants"
import { getQueryClient, trpc } from "@/trpc/server"


import { ProductListView } from "@/modules/products/ui/views/product-list-views"
import { loadProductFilters } from "@/modules/products/search-params"

interface PageProps {
  searchParams: Promise<SearchParams>,
  params: Promise<{ slug: string }>
}

const Page = async({ searchParams, params }:PageProps) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
    { tenantSlug: slug, limit: DEFAULT_LIMIT, ...filters },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
      }
    }
  ));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView/>
    </HydrationBoundary>
  )
}

export default Page