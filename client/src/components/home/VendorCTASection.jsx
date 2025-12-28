import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Users,
    title: "Reach More Students",
    description: "Connect with thousands of students actively looking for services like yours.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Get quality leads and increase your occupancy rates significantly.",
  },
  {
    icon: BadgeCheck,
    title: "Build Trust",
    description: "Verified badge and genuine reviews help you stand out from competition.",
  },
];

export function VendorCTASection() {
  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">For Service Providers</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              List Your Service & Grow Your Business
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg">
              Join 500+ vendors who are already reaching thousands of students through 
              CO-PARENTS. Simple listing process, powerful dashboard, real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="accent" size="xl">
                Start Listing Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
