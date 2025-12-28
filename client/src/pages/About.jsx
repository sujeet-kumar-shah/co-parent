import React from 'react';
import { Building2, Users, Heart, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const About = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-16 md:pt-20">
                {/* Hero Section */}
                <section className="relative py-20 bg-primary/5">
                    <div className="container px-4 mx-auto text-center">
                        <h1 className="text-4xl font-bold font-display mb-6">About CO-PARENTS</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Empowering students with a safe, reliable, and comprehensive ecosystem for their academic journey away from home.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-16">
                    <div className="container px-4 mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                                alt="Students Studying"
                                className="rounded-2xl shadow-xl"
                            />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Our Mission</h2>
                                </div>
                                <p className="text-muted-foreground">
                                    To bridge the gap between students and essential local service providers, ensuring that every student has access to safe accommodation, quality food, and educational resources in a new city.
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Our Vision</h2>
                                </div>
                                <p className="text-muted-foreground">
                                    To become the most trusted guardian-like ecosystem for students across the country, making the transition to student life seamless and worry-free.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats / Features */}
                <section className="py-16 bg-secondary/30">
                    <div className="container px-4 mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <Card className="border-none shadow-md">
                                <CardContent className="pt-6">
                                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Student Centric</h3>
                                    <p className="text-muted-foreground">Built with the specific needs of students living away from home in mind.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-md">
                                <CardContent className="pt-6">
                                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Verified Vendors</h3>
                                    <p className="text-muted-foreground">We strictly verify all hostels, PGs, and service providers for your safety.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-md">
                                <CardContent className="pt-6">
                                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Community First</h3>
                                    <p className="text-muted-foreground">Creating a supportive community where students can thrive together.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default About;
