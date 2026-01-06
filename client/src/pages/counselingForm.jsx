import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
const CounselingForm = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(user);
        const data = e.currentTarget
        const formData = new FormData(data);
        formData.append ('userId',user._id);
        const payloadObject = Object.fromEntries(formData.entries())
        const url = "http://localhost:5000/api/query/counselingForm"
       try {
         axios.post(url,payloadObject)
         .then(function(responce){
            console.log(responce)
         })
        .catch(function (error) {
            console.log(error);
        });

       } catch (error) {
         console.log(error)
       }
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Message Sent!",
                description: "We'll get back to you as soon as possible.",
            });
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-16 md:pt-20 py-12">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold font-display mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Need help with admissions, exams, or career planning? Send us your query and our experts will connect with you soon.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Email Us</h3>
                                            <p className="text-muted-foreground">support@coparents.com</p>
                                            <p className="text-muted-foreground">info@coparents.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Call Us</h3>
                                            <p className="text-muted-foreground">+91 905 717 6565</p>
                                            <p className="text-muted-foreground hidden">Mon - Fri, 9am - 6pm</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Visit Us</h3>
                                            <p className="text-muted-foreground">
                                                123 Education Hub, Knowledge Park<br />
                                                Pune, Maharashtra 411001
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Name</Label>
                                        <Input id="name" name="name" required placeholder="John"  />
                                    </div>
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" required placeholder="Doe" />
                                    </div> */}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number">Contact number</Label>
                                    <Input 
                                    id="contact_number"
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                           e.preventDefault();
                                        }
                                    }} 
                                    maxLength="10" minLength="10" name="contact_number" required placeholder="90571 76565" />
                                </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="percentage">Percentage(class 12)</Label>
                                    <Input id="percentage" type="number" name="percentage" required placeholder="" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="query_type">Counseling For</Label>
                                    <select
                                        id="query_type"
                                        name="query_type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="jee">JEE</option>
                                        <option value="neet">NEET</option>
                                        <option value="privateCollage">Private Collage</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" required name="message" placeholder="Your message here..." className="min-h-[150px]" />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
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

export default CounselingForm;
