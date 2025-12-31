import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, MapPin, Phone, Mail, Save, Loader2, ArrowLeft, Edit, Eye, EyeOff } from "lucide-react";

export default function Profile() {
    const { user, isAuthenticated, token, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        // location: "", // Not yet in backend, can add later
        password: "", // Optional
        confirmPassword: "",
        profileImage: "",
    });
    const resetForm = () => {
        // Reset controlled form values back to the user's current data
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            businessName: user?.businessName || "",
            password: "",
            confirmPassword: "",
            profileImage: user?.profileImage || "",
        });

        // Reset preview image back to user's saved image (or empty)
        setPreview(user?.profileImage || "");

        // Clear the file input value if present
        const fileInput = document.getElementById("user-image-input");
        if (fileInput) fileInput.value = "";
    };
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
            return;
        }
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                businessName: user.businessName || "",
                profileImage: user.profileImage || "",
            }));
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const [preview, setPreview] = useState("");

    useEffect(() => {
        // If user has profileImage set, use it for preview
        if (user && user.profileImage) {
            setPreview(user.profileImage);
        }
    }, [user]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    businessName: user.type === "vendor" ? formData.businessName : undefined,
                    password: formData.password || undefined,
                    profileImage: formData.profileImage || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Profile updated successfully",
                });
                window.location.reload();
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to update profile",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // Simple preview using FileReader -> data URL, and store in formData.profileImage
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setFormData((prev) => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-24 pb-16 container max-w-2xl">
                    <div className="text-center">Loading...</div>
                </main>
                <Footer />
            </div>
        );
    }
    const handleBack = () => {
        navigate(-1); 
    }
    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container max-w-2xl">
                <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6" id="backbutton" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4" />
                      Back
                </button>
                <div className="bg-card rounded-2xl shadow-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <label className={`relative w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer ${user.type === 'vendor' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`} htmlFor="user-image-input">
                            {preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                (user.type === 'vendor' ? <Building2 className="w-8 h-8" /> : <User className="w-8 h-8" />)
                            )}
                            {/* Edit icon overlay to indicate editability */}
                            <span className="sr-only">Edit profile image</span>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                <Edit className="w-4 h-4 text-gray-600" />
                            </div>
                        </label>
                        <input id="user-image-input" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                        <div>
                            <h1 className="font-display text-2xl font-bold">Profile Settings</h1>
                            <p className="text-muted-foreground">Manage your account information</p>
                        </div>
                    </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-9"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-9"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-9"
                                        placeholder="+91 90571 76565"
                                    />
                                </div>
                            </div>

                            {user.type === "vendor" && (
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="businessName"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            className="pl-9"
                                            placeholder="My Hostel"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border pt-6">
                            <h3 className="font-semibold mb-4">Change Password </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" size="lg" className="me-2" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
