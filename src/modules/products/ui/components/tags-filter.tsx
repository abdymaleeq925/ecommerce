import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client"

interface TagsFilterProps {
  value?: string[] | null,
  onChange: (value: string[] | null) => void
}

const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions(
    {
      limit: DEFAULT_LIMIT
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
      }
    }
  ));
  const onClick = (tag: string) => {
    const current = value ?? [];
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    onChange(next.length > 0 ? next : null);
  }
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-between cursor-pointer">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <label
              key={tag.id}
              htmlFor={`tag-${tag.id}`}
              className="flex items-center justify-between cursor-pointer"
            >
              {tag.name}
              <Checkbox
                id={`tag-${tag.id}`}
                checked={!!value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </label>
          ))
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
        >
          Load more...
        </button>
      )

      }
    </div>
  )
}

export default TagsFilter