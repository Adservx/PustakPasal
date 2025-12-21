"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, Linkedin, MessageCircle, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getSocialLinks, SocialLink } from "@/lib/site-settings"

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

const socialIconMap: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    x: XIcon,
    youtube: Youtube,
    tiktok: TikTokIcon,
    whatsapp: MessageCircle,
    linkedin: Linkedin,
    telegram: Send,
}

export function Footer() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

    useEffect(() => {
        getSocialLinks().then(setSocialLinks)
    }, [])

    const enabledSocialLinks = socialLinks.filter(link => link.enabled && link.url)

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
                        {enabledSocialLinks.length > 0 && (
                            <div className="flex gap-4 xs:gap-6 pt-2">
                                {enabledSocialLinks.map((link) => {
                                    const IconComponent = socialIconMap[link.platform] || Facebook
                                    const platformName = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
                                    return (
                                        <Link 
                                            key={link.id} 
                                            href={link.url} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <IconComponent className="h-9 w-9 xs:h-10 xs:w-10" />
                                            <span className="text-xs xs:text-sm mt-1">{platformName}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 xs:space-y-4">
                        <h4 className="font-bold text-base xs:text-lg">Explore</h4>
                        <ul className="space-y-1.5 xs:space-y-2 text-sm xs:text-base">
                            <li><Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">All Books</Link></li>
                            <li><Link href="/books?bestseller=true" className="text-muted-foreground hover:text-primary transition-colors">Bestsellers</Link></li>
                            <li><Link href="/books?sort=newest" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">My Cart</Link></li>
                            <li><Link href="/wishlist" className="text-muted-foreground hover:text-primary transition-colors">My Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-3 xs:space-y-4">
                        <h4 className="font-bold text-base xs:text-lg">Support</h4>
                        <ul className="space-y-1.5 xs:space-y-2 text-sm xs:text-base">
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</Link></li>
                            <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/track-order" className="text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 xs:space-y-4 col-span-2 sm:col-span-1 lg:col-span-1">
                        <h4 className="font-bold text-base xs:text-lg">Contact Us</h4>
                        <div className="space-y-2 xs:space-y-2.5 text-xs xs:text-sm text-muted-foreground">
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
