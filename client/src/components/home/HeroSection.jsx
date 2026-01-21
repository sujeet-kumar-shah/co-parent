import { motion } from "framer-motion";
import { Zap, Tag, Headphones, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

const stats = [
  { value: "10,000+", label: "Verified Listings" },
  // { value: "50+", label: "Cities" },
  { value: "25,000+", label: "Happy Students" },
  { value: "500+", label: "Trusted Vendors" },
];

// const features = [
//   { icon: Zap, title: "Quick & Easy Bookings", desc: "Time is money. Save both when you book with us." },
//   { icon: Tag, title: "Price-Match Guarantee", desc: "Find a lower price and we'll match it." },
//   { icon: Headphones, title: "24x7 Assistance", desc: "If you have a doubt or a query, we're always a call away." },
//   { icon: Shield, title: "100% Verified Listings", desc: "We promise to deliver what you see on the website." },
// ];

export function HeroSection() {
  return (
    <>
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Students studying together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent font-medium text-sm mb-6">
                🎓 Your Student Guardian Ecosystem
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Find Your Perfect
              <br />
              <span className="text-accent">Student Services</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary-foreground/80 text-lg md:text-xl mb-12 max-w-xl"
            >
              Discover hostels, PGs, coaching centers, libraries, and mess services
              . Trusted by thousands of students across India.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-primary-foreground/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section
      <section className="py-2 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose CO-PARENTS?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Book Your Perfect Accommodation – Take the hassle out of securing your student home for the best years of your life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-6 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section> */}
    </>
  );
}
