"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import {
  CalendarDays,
  Film,
  Flame,
  Menu,
  Search,
  Sparkles,
  TrendingUp,
  Tv,
  Users2,
} from "lucide-react";
import { NavLink } from "./navlink";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";

type NavItem = {
  comp: React.ReactNode;
  href: string;
};

type NavItemWithSubItems = {
  comp: React.ReactNode;
  base: string;
  subItems: NavItem[];
};

const navItems: (NavItem | NavItemWithSubItems)[] = [
  {
    comp: (
      <span className="flex gap-1">
        <Film className="h-5 w-5" />
        Movies
      </span>
    ),
    base: "/movie",
    subItems: [
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Popular
            <Flame className="h-5 w-5 fill-transparent transition-all group-hover:scale-110 group-hover:fill-orange-600 group-hover:text-orange-600 group-focus:scale-110 group-focus:fill-orange-600 group-focus:text-orange-600 group-data-[active]:scale-110 group-data-[active]:fill-orange-600 group-data-[active]:text-orange-600" />
          </span>
        ),
        href: "/movie",
      },
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Trending
            <TrendingUp className="h-5 w-5 transition-all group-hover:scale-x-125 group-hover:scale-y-105 group-hover:text-primary group-focus:scale-x-125 group-focus:scale-y-105 group-focus:text-primary group-data-[active]:scale-x-125 group-data-[active]:scale-y-105 group-data-[active]:text-primary" />
          </span>
        ),
        href: "/movie/trending",
      },
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Top Rated
            <Sparkles className="h-5 w-5 fill-transparent transition-all group-hover:scale-110 group-hover:fill-yellow-500 group-hover:text-yellow-500 group-focus:scale-110 group-focus:fill-yellow-500 group-focus:text-yellow-500 group-data-[active]:scale-110 group-data-[active]:fill-yellow-500 group-data-[active]:text-yellow-500" />
          </span>
        ),
        href: "/movie/top",
      },
    ],
  },

  {
    comp: (
      <span className="flex gap-1">
        <Tv className="h-5 w-5" />
        TV Shows
      </span>
    ),
    base: "/tv",
    subItems: [
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Popular
            <Flame className="h-5 w-5 fill-transparent transition-all group-hover:scale-110 group-hover:fill-orange-600 group-hover:text-orange-600 group-focus:scale-110 group-focus:fill-orange-600 group-focus:text-orange-600 group-data-[active]:scale-110 group-data-[active]:fill-orange-600 group-data-[active]:text-orange-600" />
          </span>
        ),
        href: "/tv",
      },
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Trending
            <TrendingUp className="h-5 w-5 transition-all group-hover:scale-x-125 group-hover:scale-y-105 group-hover:text-primary group-focus:scale-x-125 group-focus:scale-y-105 group-focus:text-primary group-data-[active]:scale-x-125 group-data-[active]:scale-y-105 group-data-[active]:text-primary" />
          </span>
        ),
        href: "/tv/trending",
      },
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Top Rated
            <Sparkles className="h-5 w-5 fill-transparent transition-all group-hover:scale-110 group-hover:fill-yellow-500 group-hover:text-yellow-500 group-focus:scale-110 group-focus:fill-yellow-500 group-focus:text-yellow-500 group-data-[active]:scale-110 group-data-[active]:fill-yellow-500 group-data-[active]:text-yellow-500" />
          </span>
        ),
        href: "/tv/top",
      },
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Airing Today
            <CalendarDays className="h-5 w-5 fill-transparent transition-all group-hover:scale-110 group-hover:fill-primary-foreground group-hover:text-primary group-focus:scale-110 group-focus:fill-primary-foreground group-focus:text-primary group-data-[active]:scale-110 group-data-[active]:fill-primary-foreground group-data-[active]:text-primary" />
          </span>
        ),
        href: "/tv/today",
      },
    ],
  },

  {
    comp: (
      <span className="flex gap-1">
        <Users2 className="h-5 w-5" />
        People
      </span>
    ),
    base: "/person",
    subItems: [
      {
        comp: (
          <span className="flex w-full items-center justify-between gap-1">
            Popular
            <Flame className="h-5 w-5 fill-transparent transition-all group-hover:scale-110 group-hover:fill-orange-600 group-hover:text-orange-600 group-focus:scale-110 group-focus:fill-orange-600 group-focus:text-orange-600 group-data-[active]:scale-110 group-data-[active]:fill-orange-600 group-data-[active]:text-orange-600" />
          </span>
        ),
        href: "/person",
      },
    ],
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="navbar-wrapper"
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full max-w-full justify-center bg-background transition-all",
        isTop
          ? "border-transparent"
          : "border-b border-border shadow-[0px_2px_10px] shadow-black/15 dark:shadow-white/15",
      )}
    >
      <header className="container m-auto flex items-center">
        <div className="flex flex-1 items-center">
          <div>
            <Link className="text-xl font-bold" href="/">
              LM<span className="text-primary underline">DB</span>
            </Link>
          </div>
          <NavigationMenu
            className="ml-6 hidden md:block"
            viewportClassName="transition-all duration-250"
            delayDuration={100}
          >
            <NavigationMenuList>
              {navItems.map((item) => {
                if ("href" in item) {
                  return (
                    <NavigationMenuItem key={`main-nav-${item.href}`}>
                      <NavLink
                        matching="exact"
                        href={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.comp}
                      </NavLink>
                    </NavigationMenuItem>
                  );
                }

                const triggerActive =
                  pathname.startsWith(item.base) &&
                  item.subItems.some((subItem) => pathname === subItem.href)
                    ? { "data-active": true }
                    : {};
                return (
                  <NavigationMenuItem key={`main-nav-${item.subItems[0].href}`}>
                    <NavigationMenuTrigger {...triggerActive}>
                      {item.comp}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <ul className="w-[400px] p-4 lg:w-[500px]">
                          {item.subItems.map((subItem) => (
                            <ListItem
                              key={`sub-nav-${subItem.href}`}
                              href={subItem.href}
                              active={pathname === subItem.href}
                            >
                              {subItem.comp}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}

              <NavigationMenuIndicator />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-2">
          <Button
            className="justify-start border-2 px-2.5 font-medium sm:pe-6"
            variant="outline"
            asChild
          >
            <Link href="/search">
              <Search className="me-0 h-5 w-5 sm:me-2" />
              <span className="sr-only sm:not-sr-only">
                Search movie, tv show, person...
              </span>
            </Link>
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button className="border-2 px-2.5 md:hidden" variant="outline">
                <Menu className="me-0 h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-center font-bold">
                  LM<span className="text-primary underline">DB</span>
                </DrawerTitle>
              </DrawerHeader>
              <DrawerFooter>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue={
                    navItems.some(
                      (item) =>
                        "base" in item &&
                        pathname.startsWith(item.base) &&
                        item.subItems.some(
                          (subItem) => pathname === subItem.href,
                        ),
                    )
                      ? `/${pathname.split("/")[1] ?? ""}`
                      : undefined
                  }
                >
                  {navItems.map((item) => {
                    if ("href" in item) {
                      return (
                        <Fragment key={`mobile-main-nav-${item.href}`}>
                          <AccordionItem value={item.href}>
                            <DrawerClose>
                              <NavLink
                                matching="exact"
                                href={item.href}
                                className={navigationMenuTriggerStyle()}
                              >
                                {item.comp}
                              </NavLink>
                            </DrawerClose>
                          </AccordionItem>

                          <Separator />
                        </Fragment>
                      );
                    }

                    return (
                      <Fragment key={`mobile-main-nav-${item.base}`}>
                        <AccordionItem
                          value={item.base}
                          className="border-none"
                        >
                          <AccordionTrigger
                            className={cn(
                              buttonVariants({ variant: "ghost" }),
                              "flex justify-between hover:no-underline focus:no-underline",
                            )}
                          >
                            {item.comp}
                          </AccordionTrigger>
                          <AccordionContent>
                            {item.subItems.map((subItem) => (
                              <DrawerClose
                                key={`mobile-nav-subitem-${subItem.href}`}
                                asChild
                              >
                                <Button
                                  variant={
                                    pathname === subItem.href
                                      ? "secondary"
                                      : "ghost"
                                  }
                                  {...(pathname === subItem.href
                                    ? { "data-active": true }
                                    : {})}
                                  className="group flex justify-between"
                                  asChild
                                >
                                  <Link href={subItem.href}>
                                    {subItem.comp}
                                  </Link>
                                </Button>
                              </DrawerClose>
                            ))}
                          </AccordionContent>
                        </AccordionItem>

                        <Separator className="my-0.5" />
                      </Fragment>
                    );
                  })}
                </Accordion>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </header>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string; active?: boolean }
>(({ active = false, className, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} legacyBehavior passHref>
          <a
            ref={ref}
            className={cn(
              "group block select-none rounded-md p-3 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground",
              className,
            )}
            aria-current={active ? "page" : undefined}
            {...(active ? { "data-active": true } : {})}
            {...props}
          >
            {children}
          </a>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
