"use client"

import { ChangeEvent, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  minPrice?: string | null,
  maxPrice?: string | null,
  onMinPriceChange: (value: string) => void,
  onMaxPriceChange: (value: string) => void
}

export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "");

  const [whole = "", fraction] = numericValue.split(".");
  const formattedValue = `${whole}${fraction !== undefined ? `.${fraction.slice(0, 2)}` : ""}`;

  if (!formattedValue) return ""

  const numberValue = parseFloat(formattedValue);
  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numberValue);
}

const PriceFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: PriceFilterProps) => {
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get raw input value and extract only numeric values
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numericValue);
  }
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get raw input value and extract only numeric values
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numericValue);
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum Price</Label>
        <Input
          type="text"
          placeholder="0$"
          value={ isMinFocused ? minPrice ?? "" : minPrice ? formatAsCurrency(minPrice) : ""
          }
          onChange={handleMinPriceChange}
          onFocus={() => setIsMinFocused(true)}
          onBlur={() => setIsMinFocused(false)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum Price</Label>
        <Input
          type="text"
          placeholder="∞"
          value={ isMaxFocused ? maxPrice ?? "" : maxPrice ? formatAsCurrency(maxPrice) : "" }
          onChange={handleMaxPriceChange}
          onFocus={() => setIsMaxFocused(true)}
          onBlur={() => setIsMaxFocused(false)}
        />
      </div>
    </div>
  )
}

export default PriceFilter