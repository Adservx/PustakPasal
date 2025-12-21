import { RotateCcw, Clock, CheckCircle, AlertCircle, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Returns & Refunds</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We want you to be completely satisfied with your purchase. Here's our hassle-free return policy.
                    </p>
                </div>

                {/* Return Policy Overview */}
                <div className="grid sm:grid-cols-3 gap-4 mb-12">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-1">7-Day Returns</h3>
                            <p className="text-sm text-muted-foreground">Return within 7 days of delivery</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <RotateCcw className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-1">Easy Process</h3>
                            <p className="text-sm text-muted-foreground">Simple online return request</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-1">Quick Refunds</h3>
                            <p className="text-sm text-muted-foreground">Refund within 5-7 business days</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Eligibility */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Return Eligibility</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    Eligible for Return
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Books in original, unused condition</li>
                                    <li>• Items with original packaging intact</li>
                                    <li>• Damaged or defective items on arrival</li>
                                    <li>• Wrong item received</li>
                                    <li>• Missing pages or printing errors</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="h-5 w-5" />
                                    Not Eligible
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Books with visible wear or damage by customer</li>
                                    <li>• Items returned after 7 days</li>
                                    <li>• Books with writing, highlighting, or marks</li>
                                    <li>• Items without original packaging</li>
                                    <li>• Digital products or gift cards</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* How to Return */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">How to Return</h2>
                    <div className="space-y-4">
                        {[
                            { step: 1, title: "Initiate Return", desc: "Go to My Orders, find your order, and click 'Request Return'" },
                            { step: 2, title: "Pack the Item", desc: "Pack the book securely in its original packaging" },
                            { step: 3, title: "Ship or Drop Off", desc: "Use our prepaid label or drop off at our nearest branch" },
                            { step: 4, title: "Get Refund", desc: "Once received and inspected, refund is processed within 5-7 days" }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refund Info */}
                <div className="bg-muted/50 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Refund Information</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Refunds are credited to your original payment method</li>
                        <li>• Bank transfers may take 3-5 additional business days</li>
                        <li>• Shipping charges are non-refundable unless item was defective</li>
                        <li>• For COD orders, refund is processed via bank transfer</li>
                    </ul>
                </div>

                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Need help with a return?</p>
                    <Link 
                        href="/contact" 
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    )
}
