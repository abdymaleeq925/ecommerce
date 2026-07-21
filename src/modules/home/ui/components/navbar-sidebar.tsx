import Link from "next/link";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarItem {
  href: string,
  children: React.ReactNode
}
interface NavbarSidebarProps {
  items: NavbarItem[],
  open: boolean,
  isAuthenticated: boolean,
  onOpenChange: (open: boolean) => void;
}

const NavbarSidebar = ({ items, open, isAuthenticated, onOpenChange }: NavbarSidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t">
            {
              isAuthenticated ? (
                <Link
                  href="/admin"
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                  onClick={() => onOpenChange(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                    onClick={() => onOpenChange(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                    onClick={() => onOpenChange(false)}
                  >
                    Start Selling
                  </Link>
                </>
              )
            }

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default NavbarSidebar