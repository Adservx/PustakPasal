"use client"

import { motion } from "framer-motion"
import { Heart, Truck, ShieldCheck, BookOpen } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Curated Collection",
    description: "Handpicked Nepali literature and international bestsellers"
  },
  {
    icon: Heart,
    title: "Passion for Reading",
    description: "Connecting readers with stories that inspire and transform"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery across Nepal"
  },
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    description: "Authentic books with quality guarantee"
  }
]

export function GatewaySection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-foreground">
            Why Choose Us?
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-4 sm:p-6 rounded-2xl glass-card hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
