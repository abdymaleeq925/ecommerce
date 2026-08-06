"use client"

import Image from "next/image"
import Link from "next/link"
import { StarIcon } from "lucide-react"

import { generateTenantURL } from "@/lib/utils"

interface ProductCardProps {
  id: string,
  name: string,
  imageUrl?: string | null,
  tenantSlug: string,
  tenantImageUrl?: string | null,
  reviewRating: number,
  reviewCount: number,
  price: number
}

const ProductCard = ({ id, name, imageUrl, tenantSlug, tenantImageUrl, reviewRating, reviewCount, price }: ProductCardProps) => {
  return (
    <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
      <Link href={`/products/${id}`} className="contents">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"}
            className="object-cover"
          />
        </div>
        <div className="px-4 pt-4 flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
        </div>
      </Link>

      <div className="p-4 border-b flex flex-col gap-3">
        <Link
          href={generateTenantURL(tenantSlug)}
          className="flex items-center gap-2 w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          {tenantImageUrl && (
            <Image
              alt={tenantSlug ?? name}
              src={tenantImageUrl || '/placeholder.png'}
              width={16}
              height={16}
              className="rounded-full border shrink-0 size-[16px]"
            />
          )}
          <p className="text-sm underline font-medium">{tenantSlug}</p>
        </Link>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <StarIcon className="size-3.5 fill-black" />
            <p className="text-sm font-medium">{reviewRating} ({reviewCount})</p>
          </div>
        )}
      </div>

      <Link href={`/products/${id}`} className="p-4 block">
        <div className="relative px-2 py-1 border bg-pink-400 w-fit">
          <p className="text-sm font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(Number(price))}
          </p>
        </div>
      </Link>
    </div>
  )
}

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  )
}

export default ProductCard