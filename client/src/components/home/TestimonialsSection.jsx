import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Home, Utensils, Landmark, BookOpen, HeartHandshake, School } from "lucide-react";
import { getApiUrl } from "@/config/api";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

const features = [
  {
    icon: Home,
    title: "Safe & Budget Living Support",
    bgGradient: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/10",
    hoverBorderColor: "group-hover:border-blue-500/30",
    iconColor: "text-blue-500",
    accent: "group-hover:text-blue-500",
    hoverShadow: "hover:shadow-blue-500/10",
    points: [
      "Verified PG / Hostel / Flats",
      "Budget-based recommendations",
      "Safe locations near coaching institutes",
      "Regular monitoring & support"
    ]
  },
  {
    icon: Utensils,
    title: "Food & Mess Support System",
    bgGradient: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/10",
    hoverBorderColor: "group-hover:border-orange-500/30",
    iconColor: "text-orange-500",
    accent: "group-hover:text-orange-500",
    hoverShadow: "hover:shadow-orange-500/10",
    points: [
      "Shortlisted hygienic mess options",
      "Monthly food quality monitoring",
      "Menu sharing with parents",
      "Home-style tiffin from local families"
    ]
  },
  {
    icon: Landmark,
    title: "Coaching Admission Support",
    bgGradient: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/10",
    hoverBorderColor: "group-hover:border-emerald-500/30",
    iconColor: "text-emerald-500",
    accent: "group-hover:text-emerald-500",
    hoverShadow: "hover:shadow-emerald-500/10",
    points: [
      "Minimum possible fee negotiation",
      "Scholarship guidance",
      "Right batch selection assistance"
    ]
  },
  {
    icon: BookOpen,
    title: "Academic & Mentorship Support",
    bgGradient: "from-violet-500/20 to-violet-500/5",
    borderColor: "border-violet-500/10",
    hoverBorderColor: "group-hover:border-violet-500/30",
    iconColor: "text-violet-500",
    accent: "group-hover:text-violet-500",
    hoverShadow: "hover:shadow-violet-500/10",
    points: [
      "Extra study materials",
      "Doubt-solving support",
      "Mentorship from IIT / Medical students",
      "Weekly performance tracking & updates"
    ]
  },
  {
    icon: HeartHandshake,
    title: "Emotional & Exam Support",
    bgGradient: "from-rose-500/20 to-rose-500/5",
    borderColor: "border-rose-500/10",
    hoverBorderColor: "group-hover:border-rose-500/30",
    iconColor: "text-rose-500",
    accent: "group-hover:text-rose-500",
    hoverShadow: "hover:shadow-rose-500/10",
    points: [
      "Regular check-ins",
      "Stress management during exams",
      "Complete JEE/NEET form filling support",
      "College counselling & admission assistance"
    ]
  },
  {
    icon: School,
    title: "School & Board Support",
    bgGradient: "from-amber-500/20 to-amber-500/5",
    borderColor: "border-amber-500/10",
    hoverBorderColor: "group-hover:border-amber-500/30",
    iconColor: "text-amber-500",
    accent: "group-hover:text-amber-500",
    hoverShadow: "hover:shadow-amber-500/10",
    points: [
      "Dummy school admission guidance",
      "Board registration support",
      "Documentation assistance"
    ]
  },
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
      <section className="py-8 bg-background overflow-hidden">
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
      <section className="py-24 relative overflow-hidden bg-background">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
              The CO-PARENTS Advantage
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">CO-PARENTS?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Your Local Guardians in Kota – Providing complete support from living to college admissions, ensuring a stress-free environment for students and parents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative p-8 bg-card/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-border/50 hover:shadow-2xl ${feature.hoverShadow} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner border ${feature.borderColor} ${feature.hoverBorderColor}`}>
                      <Icon className={`w-8 h-8 ${feature.iconColor} transition-transform duration-500`} />
                    </div>
                    <h3 className={`font-display text-2xl font-bold mb-4 ${feature.accent} transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                    <ul className="text-muted-foreground leading-relaxed text-[15px] space-y-2.5">
                      {feature.points.map((point, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`${feature.iconColor} mr-2 text-lg leading-none mt-[2px] opacity-80`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
