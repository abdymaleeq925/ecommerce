"use client"

import Link from "next/link"
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"

interface SearchInputProps {
  disabled?: boolean,
  onOpenSidebar?: () => void
}

export const SearchInput = ({ disabled, onOpenSidebar }: SearchInputProps) => {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input className="pl-8" placeholder="Search Products" disabled={disabled} />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={onOpenSidebar}
        aria-label="Browse categories"
      >
        <ListFilterIcon />
      </Button>
      {
        session.isPending ? (
          <div className="size-12 shrink-0 bg-neutral-200 animate-pulse rounded-md" />
        ) : (
          session.data?.user && (
            <Button asChild variant="elevated">
              <Link href="/library">
                <BookmarkCheckIcon />
                Library
              </Link>
            </Button>
          )
        )
      }
    </div>
  )
}