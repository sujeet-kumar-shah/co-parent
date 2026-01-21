import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set launch date to March 1, 2026 at 00:00:00
      const launchDate = new Date('2026-03-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference <= 0) {
        setHasLaunched(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with your actual API endpoint
      // await fetch('/api/notify-launch', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      toast({
        title: 'Success!',
        description: 'We\'ll notify you when we launch on March 1st!',
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CountdownBox = ({ value, label }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-4 md:p-6 min-w-24 md:min-w-32">
        <div className="text-3xl md:text-5xl font-bold text-primary tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <p className="text-xs md:text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );

  if (hasLaunched) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <Rocket className="w-8 h-8 text-primary animate-bounce" />
              <span className="text-primary font-semibold">We've Launched! 🎉</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Welcome to CO-PARENTS!
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Your Student Guardian Ecosystem is now live. Explore our services and discover everything you need.
            </p>
            <Button size="lg" className="gap-2">
              <Rocket className="w-5 h-5" />
              Explore Now
            </Button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Coming Soon</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {/* <img src="/logo.png" alt="CO-PARENTS" className="w-18 h-16 rounded-xl object-contain" /> */}
            CO-PARENTS is Launching Soon
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your complete Student Guardian Ecosystem is coming on March 1st. Be the first to experience the future of student support services.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4 md:gap-6 mb-16"
        >
          <CountdownBox value={timeLeft.days} label="Days" />
          <div className="flex items-center text-3xl font-bold text-primary/40 -mb-4">:</div>
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <div className="flex items-center text-3xl font-bold text-primary/40 -mb-4">:</div>
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <div className="flex items-center text-3xl font-bold text-primary/40 -mb-4">:</div>
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </motion.div>

        {/* Email Notification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hidden">
            <h3 className="font-display text-xl font-bold mb-2 text-center">
              Be the First to Know
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-6">
              Get notified the moment we launch
            </p>
            <form onSubmit={handleNotifyMe} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                  disabled={isSubmitting}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Notify Me'}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              We'll send you an email when we launch. No spam, promise!
            </p>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-border"
        >
          <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
            What's Coming
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Accommodation', desc: 'Hostels, PGs & more' },
              { title: 'Education Support', desc: 'Coaching & counseling' },
              { title: 'Services', desc: 'Mess, libraries & more' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-secondary/50 border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
              >
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
