import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Zap, Tag, Headphones, Shield } from "lucide-react";
import { getApiUrl } from "@/config/api";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

const features = [
  { icon: Zap, title: "Quick & Easy Bookings", desc: "Time is money. Save both when you book with us." },
  { icon: Tag, title: "Price-Match Guarantee", desc: "Find a lower price and we'll match it." },
  { icon: Headphones, title: "24x7 Assistance", desc: "If you have a doubt or a query, we're always a call away." },
  { icon: Shield, title: "100% Verified Listings", desc: "We promise to deliver what you see on the website." },
];

const fallbackTestimonials = [
  {
    _id: "1",
    name: "Priya Sharma",
    rating: 5,
    message: "CO-PARENTS helped me find the perfect PG near my college within hours. The verified listings and genuine reviews made my decision so much easier!",
  },
  {
    _id: "2",
    name: "Rahul Verma",
    rating: 5,
    message: "Found an amazing coaching center and a nearby library through this platform. The filter options are really helpful for students with specific needs.",
  },
  {
    _id: "3",
    name: "Ananya Patel",
    rating: 5,
    message: "Relocating to a new city was stressful until I found CO-PARENTS. Got my hostel, mess, and even a study library sorted before even arriving!",
  },
];

export function TestimonialsSection() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(getApiUrl('/api/query/feedback'));
        if (response.data.success && response.data.data.length > 0) {
          setFeedback(response.data.data);
        } else {
          setFeedback(fallbackTestimonials);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedback(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // 🔁 Auto slide every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <>
      <section className="py-16 bg-background overflow-hidden">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm tracking-wider uppercase">
              Student Stories
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
              Loved by Students
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who found their perfect services through CO-PARENTS.
            </p>
          </motion.div>

          <div className="relative group max-w-6xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {(feedback.length > 0 ? feedback : fallbackTestimonials).map((item, index) => (
                  <div key={item._id || index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full relative bg-card rounded-2xl p-8 shadow-card border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground/80 mb-8 leading-relaxed italic text-lg">
                        "{item.message || item.text}"
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {item.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <p className="text-muted-foreground text-sm">Verified Student</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container px-4">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-8 bg-card rounded-2xl shadow-card border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
