"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/Button"

const serviceItems = [
  { title: "Mobile Recharge", href: "/recharge", description: "Recharge your mobile phone" },
  { title: "FasTag Recharge", href: "/fastag", description: "Recharge your FasTag account" },
  { title: "Electricity Bill", href: "/electricity", description: "Pay your electricity bill" },
  { title: "Offers & Deals", href: "/offers", description: "View current offers and deals" },
]

export function Navbar() {
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  // Desktop Navigation
  if (!isMobile) {
    return (
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/recharge"
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    >
                      <div className="mb-2 text-lg font-medium sm:mt-4">
                        Mobile Recharge
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Recharge your mobile phone instantly.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/fastag" title="FasTag Recharge">
                  Recharge your FasTag account quickly.
                </ListItem>
                <ListItem href="/electricity" title="Electricity Bill">
                  Pay your electricity bill online.
                </ListItem>
                <ListItem href="/offers" title="Offers & Deals">
                  View current offers and deals.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={link.href}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  // Mobile Navigation with Hamburger Menu
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent className="w-full sm:max-w-sm">
          <div className="flex flex-col h-full pt-8 relative">
            <SheetClose onClick={() => setMobileMenuOpen(false)} />
            <nav className="flex-1 space-y-4">
              <div>
                <h3 className="px-4 mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Services
                </h3>
                <ul className="space-y-1">
                  {serviceItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex flex-col px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <span>{item.title}</span>
                        <span className="text-sm text-gray-500">{item.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
            <div className="border-t border-gray-200 pt-4 pb-6 px-4 space-y-2">
              <Button className="w-full" variant="outline" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Button>
              <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                Signup
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
