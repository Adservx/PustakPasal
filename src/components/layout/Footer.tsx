import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background pt-12 xs:pt-16 pb-6 xs:pb-8">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 xs:gap-x-8 xs:gap-y-10 md:gap-12 mb-8 xs:mb-10 md:mb-12">
                    {/* Brand Column */}
                    <div className="space-y-3 xs:space-y-4 col-span-2 sm:col-span-1 lg:col-span-1">
                        <h3 className="text-xl xs:text-2xl font-serif font-bold text-gradient">
                            Hamro Pustak Pasal
                        </h3>
                        <p className="text-sm xs:text-base text-muted-foreground leading-relaxed">
                            Your digital gateway to a world of stories. We believe in the magic of reading and connecting people with their next favorite book.
                        </p>
                        <div className="flex gap-3 xs:gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-4 w-4 xs:h-5 xs:w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-4 w-4 xs:h-5 xs:w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-4 w-4 xs:h-5 xs:w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 xs:space-y-4">
                        <h4 className="font-bold text-base xs:text-lg">Explore</h4>
                        <ul className="space-y-1.5 xs:space-y-2 text-sm xs:text-base">
                            <li><Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">All Books</Link></li>
                            <li><Link href="/bestsellers" className="text-muted-foreground hover:text-primary transition-colors">Bestsellers</Link></li>
                            <li><Link href="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</Link></li>
                            <li><Link href="/gift-cards" className="text-muted-foreground hover:text-primary transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-3 xs:space-y-4">
                        <h4 className="font-bold text-base xs:text-lg">Support</h4>
                        <ul className="space-y-1.5 xs:space-y-2 text-sm xs:text-base">
                            <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-3 xs:space-y-4 col-span-2 sm:col-span-1 lg:col-span-1">
                        <h4 className="font-bold text-base xs:text-lg">Stay Updated</h4>
                        <p className="text-sm xs:text-base text-muted-foreground">Subscribe to get the latest book news and exclusive offers.</p>
                        <div className="flex flex-col xs:flex-row gap-2">
                            <Input placeholder="Enter your email" className="bg-background/50 border-border rounded-full focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-accent/50 text-sm xs:text-base h-10 xs:h-11" />
                            <Button className="rounded-full h-10 xs:h-11 text-sm xs:text-base whitespace-nowrap">Subscribe</Button>
                        </div>
                        <div className="pt-3 xs:pt-4 space-y-2 xs:space-y-2.5 text-xs xs:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 xs:gap-2">
                                <Mail className="h-3.5 w-3.5 xs:h-4 xs:w-4" /> <span className="text-xs xs:text-sm">hello@hamropustak.com</span>
                            </div>
                        </div>

                        {/* Branch Information */}
                        <div className="pt-3 xs:pt-4 space-y-2 xs:space-y-2.5 md:space-y-3">
                            <div className="p-2.5 xs:p-3 rounded-lg glass-card border border-border/50">
                                <h5 className="font-semibold text-xs xs:text-sm text-foreground mb-1">Kathmandu Branch</h5>
                                <div className="space-y-0.5 xs:space-y-1 text-[10px] xs:text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5 xs:gap-2">
                                        <MapPin className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-accent flex-shrink-0" /> <span className="truncate">Kathmandu, Nepal</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 xs:gap-2">
                                        <Phone className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-accent flex-shrink-0" /> <span className="truncate">+977 1-4567890</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2.5 xs:p-3 rounded-lg glass-card border border-border/50">
                                <h5 className="font-semibold text-xs xs:text-sm text-foreground mb-1">Birganj Branch</h5>
                                <div className="space-y-0.5 xs:space-y-1 text-[10px] xs:text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5 xs:gap-2">
                                        <MapPin className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-accent flex-shrink-0" /> <span className="truncate">Birganj, Nepal</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 xs:gap-2">
                                        <Phone className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-accent flex-shrink-0" /> <span className="truncate">+977 51-234567</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="mb-6 xs:mb-8" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 xs:gap-4 text-xs xs:text-sm text-muted-foreground">
                    <p className="text-center sm:text-left">© 2025 Hamro Pustak Pasal. All rights reserved.</p>
                    <div className="flex gap-4 xs:gap-6">
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
