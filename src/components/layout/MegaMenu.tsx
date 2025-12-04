"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const genres = [
    {
        title: "Fiction",
        href: "/books?genre=Fiction",
        description: "Novels, mysteries, sci-fi, and more.",
    },
    {
        title: "Non-Fiction",
        href: "/books?genre=Non-Fiction",
        description: "Biographies, history, science, and self-help.",
    },
    {
        title: "Young Adult",
        href: "/books?genre=Young Adult",
        description: "Trending stories for teens and young adults.",
    },
    {
        title: "Fantasy",
        href: "/books?genre=Fantasy",
        description: "Epic adventures and magical worlds.",
    },
]

const formats = [
    {
        title: "Hardcover",
        href: "/books?format=hardcover",
        description: "Premium quality for your collection.",
    },
    {
        title: "Paperback",
        href: "/books?format=paperback",
        description: "Lightweight and portable.",
    },
    {
        title: "E-Books",
        href: "/books?format=ebook",
        description: "Instant download for your e-reader.",
    },
    {
        title: "Audiobooks",
        href: "/books?format=audiobook",
        description: "Listen on the go with our app.",
    },
]

export function MegaMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Books</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/10 to-primary/20 p-6 no-underline outline-none focus:shadow-md hover:bg-gradient-to-b hover:from-primary/20 hover:to-primary/30 transition-all border border-primary/10"
                                        href="/books?new=true"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium text-foreground">
                                            New Releases
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Check out the hottest books dropping this week.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            {genres.map((genre) => (
                                <ListItem
                                    key={genre.title}
                                    title={genre.title}
                                    href={genre.href}
                                >
                                    {genre.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Formats</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {formats.map((format) => (
                                <ListItem
                                    key={format.title}
                                    title={format.title}
                                    href={format.href}
                                >
                                    {format.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/books?bestseller=true" className={navigationMenuTriggerStyle()}>
                            Best Sellers
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<typeof Link>,
    React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
