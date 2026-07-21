"use client";

import { useRef, useState } from 'react'
import Link from 'next/link';

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CategoryItem } from '@/modules/categories/types';

import { useDropdownPosition } from './use-dropdown-position';
import SubcategoryMenu from './subcategory-menu';

interface CategoryDropdownProps {
  category: CategoryItem,
  isActive?: boolean,
  isNavigationHovered?: boolean
}

export const CategoryDropdown = ({ category, isActive, isNavigationHovered }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);

  const hasSubcategories = Boolean(category.subcategories && category.subcategories.length > 0);

  const openMenu = () => {
    if (hasSubcategories) {
      setIsOpen(true);
    }
  }
  const closeMenu = () => setIsOpen(false);

  const handleFocus = () => {
    openMenu();
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if(!dropdownRef.current?.contains(event.relatedTarget as Node)) closeMenu()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if(event.key === "Escape" && isOpen) {
      closeMenu();
      dropdownRef.current?.querySelector('a')?.focus();
    }
  }

  const dropdownPosition = getDropdownPosition();

  // const toggleDropdown = () => {
  //   if(category.subcategories?.docs?.length) {
  //     setIsOpen(!isOpen);
  //   }
  // }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      // onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          asChild
          variant="elevated"
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigationHovered && "bg-white border-primary",
            isOpen && "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]"
          )}
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>
        {
          hasSubcategories && (
            <div
              className={cn(
                "absolute opacity-0 -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px]  border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
                isOpen && "opacity-100"
              )}
            />
          )
        }
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  )
}

export default CategoryDropdown