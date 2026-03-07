import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MessageSquare } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import { motion } from 'framer-motion';

const MentorsPage = () => {
    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http') || imageUrl.startsWith('blob') || imageUrl.startsWith('data:')) {
            return imageUrl;
        }
        return getApiUrl(`/uploads/${imageUrl}`);
    };
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const response = await fetch(getApiUrl('/api/query/mentors'));
            if (response.ok) {
                const data = await response.json();
                setMentors(data.data);
            }
        } catch (error) {
            console.error('Error fetching mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 py-12">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold font-display mb-4">Our Mentors</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Connect with IITians, NEET toppers, and experienced professionals who have been through the same journey.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : mentors.length === 0 ? (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-medium">No mentors available yet</h3>
                            <p className="text-muted-foreground">Check back soon for our expert mentors!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mentors.map((mentor, index) => (
                                <motion.div
                                    key={mentor._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 group">
                                        <div className="h-48 bg-primary/5 relative overflow-hidden">
                                            {mentor.imageUrl ? (
                                                <img
                                                    src={getImageSrc(mentor.imageUrl)}
                                                    alt={mentor.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-20 h-20 text-primary/20" />
                                                </div>
                                            )}
                                            <Badge className="absolute top-4 right-4 bg-white/90 text-primary border-none backdrop-blur-sm">
                                                {mentor.counselingType}
                                            </Badge>
                                        </div>
                                        <CardHeader className="pb-2">
                                            <h3 className="text-xl font-bold">{mentor.name}</h3>
                                            <p className="text-sm text-primary font-medium">{mentor.counselingType} Expert</p>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm line-clamp-4 mb-6">
                                                {mentor.description}
                                            </p>
                                            <button
                                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                                                onClick={() => navigate('/counseling', { state: { mentorId: mentor._id } })}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Get Consultation
                                            </button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MentorsPage;
