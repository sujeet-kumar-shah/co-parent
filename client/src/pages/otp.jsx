import { useState,useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function forget() {

  const [seconds, setSeconds] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
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
  formData.phone = phone
  const handleForget = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.otp) {
      toast({ title: "Failed", description: "Please enter the OTP.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const payload = { ...formData, purpose: 'reset' };
      const result = await otpVerify(payload);

      if (!result || result.success === false) {
        toast({ title: "Failed", description: result?.message || "Invalid OTP.", variant: "destructive" });
        return;
      }

      // If this was a reset flow, server will return a resetToken
      if (result.resetToken) {
        toast({ title: "Verified", description: "OTP verified. Please reset your password." });
        navigate('/reset-password', { replace: true, state: { resetToken: result.resetToken, phone } });
        return;
      }

      // Signup/login flow
      if (result.user) {
        toast({ title: "Registration successful!", description: "Welcome to CO-PARENTS." });
        if (result.user.type === 'vendor') {
          navigate('/vendor/dashboard', { replace: true });
        } else if (result.user.type === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      toast({ title: "Error", description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const resendOtp = () => {
    // Call your backend API here to request a new OTP
    console.log("Resending OTP...");
    // Reset timer and activate
    
    setSeconds(60);
    setIsActive(true);
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
          <img src="/logo.png" alt="CO-PARENTS" className="w-18 h-16 rounded-xl object-contain" />
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
                    }
                  }}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  maxLength="4"
                />
              </div>
            </div>
            <div className="hidden">
              {seconds > 0 ? (
                <p>Time Remaining: {seconds < 10 ? `0${seconds}` : seconds}s</p>
              ) : (
                <div className="flex" >
                <p>Didn't receive the code?</p> <Button  onClick={resendOtp}>Resend OTP</Button>
              </div>
              )}
              
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
