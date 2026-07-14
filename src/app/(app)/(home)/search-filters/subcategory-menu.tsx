import Link from 'next/link'

import { Category } from '@/payload-types'

import { CustomCategory } from '../types'

interface SubcategoryMenuProps {
  category: CustomCategory,
  isOpen: boolean,
  position: { top: number, left: number }
}

export const SubcategoryMenu = ({ category, isOpen, position }: SubcategoryMenuProps) => {
  if (!isOpen || !category.subcategories || category.subcategories?.length === 0) {
    return null
  }

  const backgroundColor = category.color || "F5F5F5";


  return (
    <div
      className="fixed z-100"
      style={{ top: position.top, left: position.left }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-4 w-60" />
      <div
        style={{ backgroundColor }}
        className="w-60 text-black rounded-md overflow-hidden border shadow[4px_4px_0_0_rgba(0,0,0,1) -translate-x-2 -translate-y-2"
      >
        <div className="">
          {
            category.subcategories?.map((subcategory: Category) => (
              <Link
                key={subcategory.slug}
                href={`/${category.slug}/${subcategory.slug}`}
                className="w-full text-left p-4 hover:text-white hover:bg-black flex justify-between items-center underline font-medium"
              >
                {subcategory.name}
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default SubcategoryMenu