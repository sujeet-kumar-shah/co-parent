import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {  Phone, ArrowLeft,Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function forget() {
  
 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone:"",
    otp: "",
  });

  const { otpVerify } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

//   const from = location.state?.from || "/";
  const phone = location.state?.phone
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
formData.phone =  phone
  const handleForget = async (e) => {
    e.preventDefault();
    setIsLoading(true);
   if (formData.otp ) {
      const result = await otpVerify(formData);
      if (result) {
        toast({
            title: "Registration successful! ",
            description: "Welcome to CO-PARENTS.",
        });

        
        if (result.user.type === 'vendor') {
          navigate("/vendor/dashboard", { replace: true });
        } else if (result.user.type === 'admin') {
          navigate("/admin/dashboard", { replace: true });
        } else if(result.user.type === 'student'){
          navigate('/', { replace: true });
        }
      } else {
        toast({
          title: "Failed",
          description: result.message || "Please enter valid credentials.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Failed",
        description: "Please enter valid credentials.",
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
          to="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="CO-PARENTS" className="w-16 h-16 rounded-xl object-contain" />
          <span className="font-display font-bold text-2xl">CO-PARENTS</span>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h1 className="font-display text-2xl font-bold mb-2">
           Verify Otp
          </h1>
          <p className="text-muted-foreground mb-6">
            Please enter 4 digit code send to your number 
              +91 ******{phone?.slice(-4)}
          </p>
              <form onSubmit={handleForget} className="space-y-4">
               
                 <div className="space-y-2 ">
                  <Label htmlFor="login-phone">Enter otp</Label>
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-otp"
                      name="otp"
                      placeholder="Enter your otp"
                       onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            } }}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      maxLength="4"
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Submit"}
                </Button>
              </form>
            
        </div>
      </motion.div>
    </div>
  );
}
