import { Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Shipping Information</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about how we deliver your books to your doorstep.
                    </p>
                </div>

                {/* Shipping Options */}
                <div className="grid sm:grid-cols-2 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                Standard Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kathmandu Valley</span>
                                <span className="font-medium">3-5 days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Other Areas</span>
                                <span className="font-medium">5-7 days</span>
                            </div>
                            <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Free shipping on orders above Rs. 1,500
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Rs. 100 flat rate for orders below Rs. 1,500
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Express Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kathmandu Valley</span>
                                <span className="font-medium">1-2 days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Other Areas</span>
                                <span className="font-medium">2-3 days</span>
                            </div>
                            <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Additional Rs. 150 for express delivery
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Available for select locations only
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Delivery Process */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                    <div className="grid sm:grid-cols-4 gap-4">
                        {[
                            { icon: Package, title: "Order Placed", desc: "Your order is confirmed" },
                            { icon: CheckCircle, title: "Processing", desc: "We prepare your books" },
                            { icon: Truck, title: "Shipped", desc: "On the way to you" },
                            { icon: MapPin, title: "Delivered", desc: "At your doorstep" }
                        ].map((step, idx) => (
                            <div key={idx} className="text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <step.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-1">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Areas */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Delivery Areas</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Kathmandu Valley
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Kathmandu</li>
                                        <li>• Lalitpur</li>
                                        <li>• Bhaktapur</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Other Major Cities
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Pokhara</li>
                                        <li>• Birganj</li>
                                        <li>• Biratnagar</li>
                                        <li>• Chitwan</li>
                                        <li>• And 70+ other districts</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Important Notes */}
                <div className="bg-muted/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Important Notes</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Delivery times may vary during festivals and peak seasons</li>
                        <li>• You'll receive SMS/email notifications at each delivery stage</li>
                        <li>• Someone must be available to receive the package at the delivery address</li>
                        <li>• For bulk orders (10+ books), please contact us for special shipping rates</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm">
                            Have questions about shipping?{" "}
                            <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
                            {" "}or check our{" "}
                            <Link href="/faq" className="text-primary hover:underline">FAQs</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
