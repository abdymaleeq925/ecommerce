"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { useProductFilters } from "../../hooks/use-product-filters";
import ProductCard, { ProductCardSkeleton } from "./product-card";
import { getMediaUrl } from "../../hooks/media";

interface ProductListProps {
  category?: string
}

export const ProductList = ({ category }: ProductListProps) => {
  const trpc = useTRPC();
  const [filters] = useProductFilters();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
      {
        ... filters,
        category,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        }
      }
    ));

    if(data.pages?.[0]?.docs.length === 0) {
      return (
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon/>
          <p className="text-base font-medium">No products found</p>
        </div>
      )
    }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages.flatMap((page) => page.docs).map((product) => {
          const tenant = product.tenant && typeof product.tenant !== "string" ? product.tenant : null;
          return (
            <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.image?.url || "/placeholder.png"}
            authorUsername={tenant?.name ?? null}
            authorImageUrl={getMediaUrl(tenant?.image)}
            reviewRating={3}
            reviewCount={5}
            price={product.price}
          />
          )
})}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant="elevated"
          >
            Load more
          </Button>
        )}
      </div>
    </>
  )
}

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({length: DEFAULT_LIMIT}).map((_, index) => (
        <ProductCardSkeleton key={index}/>
      ))}
    </div>
  )
}