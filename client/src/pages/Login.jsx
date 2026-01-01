import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Building2, Mail, Lock, Phone, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [authType, setAuthType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    businessName: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from || "/";

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.email && formData.password) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to CO-PARENTS.",
        });

        if (result.user.type === 'vendor') {
          navigate("/vendor/dashboard", { replace: true });
        } else if (result.user.type === 'admin') {
          navigate("/admin/dashboard", { replace: true });
        } else if(result.user.type === 'student'){
          navigate('/listings', { replace: true });
        }
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Please enter valid credentials.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please enter valid credentials.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.email && formData.password && formData.name) {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        type: authType,
        businessName: authType === "vendor" ? formData.businessName : undefined,
      });

      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to CO-PARENTS.",
        });

        if (result.user.type === 'vendor') {
          navigate("/vendor/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Please fill all required fields.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Registration failed",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="CO-PARENTS" className="w-16 h-16 rounded-xl object-contain" />
          <span className="font-display font-bold text-2xl">CO-PARENTS</span>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h1 className="font-display text-2xl font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-6">
            Login to access your account
          </p>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">

                {/* User Type Selection for Registration */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div
                    onClick={() => setAuthType("student")}
                    className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${authType === 'student' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-gray-50'}`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Student</div>
                  </div>
                  <div
                    onClick={() => setAuthType("vendor")}
                    className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${authType === 'vendor' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-gray-50'}`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Vendor</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input
                    id="reg-name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {authType === "vendor" && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-business">Business Name</Label>
                    <Input
                      id="reg-business"
                      name="businessName"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
