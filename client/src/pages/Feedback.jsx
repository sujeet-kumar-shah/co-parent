import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import axios from 'axios';

const Feedback = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast({
                title: "Error",
                description: "Please provide a rating.",
                variant: "destructive"
            });
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/query/feedback`, {
                ...formData,
                rating
            });
            toast({
                title: "Feedback Submitted!",
                description: "Thank you for your valuable feedback.",
            });
            setFormData({ name: '', message: '' });
            setRating(0);
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: error.response?.data?.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-16 md:pt-20 py-12">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16 mt-5">
                        <h1 className="text-4xl font-bold font-display mb-4">Your Feedback Matters</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Help us improve our services by sharing your experience. We value your honest feedback.
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto">
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label>Rating</Label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="transition-colors duration-200"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${star <= (hover || rating)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-muted-foreground"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Your Message</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        placeholder="Tell us what you think..."
                                        className="min-h-[150px]"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Feedback"}
                                    {!loading && <Send className="w-4 h-4 ml-2" />}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Feedback;
