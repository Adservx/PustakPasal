"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success("Message sent successfully! We'll get back to you soon.")
        setIsSubmitting(false)
        ;(e.target as HTMLFormElement).reset()
    }

    return (
        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="text-sm font-medium mb-1.5 block">Name</label>
                                        <Input id="name" placeholder="Your name" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="text-sm font-medium mb-1.5 block">Email</label>
                                        <Input id="email" type="email" placeholder="your@email.com" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="text-sm font-medium mb-1.5 block">Subject</label>
                                    <Input id="subject" placeholder="How can we help?" required />
                                </div>
                                <div>
                                    <label htmlFor="message" className="text-sm font-medium mb-1.5 block">Message</label>
                                    <Textarea id="message" placeholder="Your message..." rows={5} required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Sending..." : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground">hello@hamropustak.com</p>
                                        <p className="text-sm text-muted-foreground mt-1">We reply within 24 hours</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground">Sun - Fri: 10:00 AM - 6:00 PM</p>
                                        <p className="text-sm text-muted-foreground mt-1">Saturday: Closed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="font-semibold">Our Locations</h3>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-accent/10">
                                        <MapPin className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Kathmandu Branch</p>
                                        <p className="text-sm text-muted-foreground">Kathmandu, Nepal</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            <Phone className="h-3 w-3" /> +977 1-4567890
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-accent/10">
                                        <MapPin className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Birganj Branch</p>
                                        <p className="text-sm text-muted-foreground">Birganj, Nepal</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            <Phone className="h-3 w-3" /> +977 51-234567
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
