"use client"

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filters"

const ProductSort = () => {
  const [filters, setFilters] = useProductFilters(); 
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        aria-pressed={filters.sort === "curated"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "curated" && "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => setFilters({sort: "curated"})}
      >
        Curated
      </Button>
      <Button
        size="sm"
        aria-pressed={filters.sort === "old"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "old" && "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => setFilters({sort: "old"})}
      >
        Old
      </Button>
      <Button
        size="sm"
        aria-pressed={filters.sort === "hot_and_new"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "hot_and_new" && "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        variant="secondary"
        onClick={() => setFilters({sort: "hot_and_new"})}
      >
        Hot & New
      </Button>
    </div>
  )
}

export default ProductSort