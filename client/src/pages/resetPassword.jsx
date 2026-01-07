import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetToken = location.state?.resetToken;
  const phone = location.state?.phone;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const maskPhone = (p) => {
    if (!p) return '';
    const s = p.toString();
    return s.startsWith('+') ? `${s.slice(0, s.length-4).replace(/.(?=...)/g,'*')}${s.slice(-4)}` : `+91 ******${s.slice(-4)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resetToken) {
      toast({ title: "Missing token", description: "Please retry the OTP flow", variant: "destructive" });
      return;
    }
    if (form.newPassword.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (form.newPassword !== form.confirm) {
      toast({ title: "Mismatch", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const payload = { resetToken, newPassword: form.newPassword }
      const res = await resetPassword(payload);
      if (res.success) {
        toast({ title: "Success", description: "Password updated. Please login." });
        navigate('/login', { replace: true });
      } else {
        toast({ title: "Failed", description: res.message || "Could not reset password", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.jpg" alt="CO-PARENTS" className="w-16 h-16 rounded-xl object-contain" />
          <span className="font-display font-bold text-2xl">CO-PARENTS</span>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-muted-foreground mb-6">
            Please set a new password{phone ? ` for ${maskPhone(phone)}` : ''}.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input id="newPassword" name="newPassword" type={showNew ? 'text' : 'password'} onChange={handleChange} className="pr-12" required />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  onClick={() => setShowNew((s) => !s)}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input id="confirm" name="confirm" type={showConfirm ? 'text' : 'password'} onChange={handleChange} className="pr-12" required />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Password'}</Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            <Link to="/login" className="underline">Back to Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
