"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"

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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
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
        <SheetContent side="right" className="w-[40%] min-w-[320px] max-w-[400px] p-0 [&>button]:top-6 [&>button]:right-6">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            {/* Header with Logo */}
            <div className="flex items-center px-6 pt-6 pb-4 border-b border-border">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <Image
                  src="/logo-pink.png"
                  alt="Payshati Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Navigation Content */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {/* Services Section */}
              <div className="space-y-3">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Services
                </h3>
                <ul className="space-y-1">
                  {serviceItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex flex-col px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item.title}
                        </span>
                        <span className="text-sm text-muted-foreground mt-0.5">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation Links Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:translate-x-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Footer with Action Buttons */}
            <div className="border-t border-border bg-muted/30 p-4 space-y-3">
              <Button
                className="w-full"
                variant="outline"
                asChild
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button
                className="w-full"
                asChild
              >
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
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
