import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { Checkbox } from "@/components/ui/checkbox";

const ensureDarkTheme = () => {
  const root = window.document.documentElement;
  if (!root.classList.contains('dark')) {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

const AuthPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bypassEmail, setBypassEmail] = React.useState(false);

  React.useEffect(() => {
    ensureDarkTheme();
    
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          window.location.href = '/app/home';
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleResendConfirmation = async () => {
    if (!supabase || !email) {
      showError("Please enter your email address first.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: { emailRedirectTo: window.location.origin }
    });

    if (error) {
      if (error.code === 'over_email_send_rate_limit') {
        showError("Too many attempts. Please wait a few minutes before trying again.");
      } else {
        showError(error.message);
      }
    } else {
      showSuccess("Confirmation email resent! Please check your inbox.");
    }
    setIsLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!supabase) {
      showError("Interact Database (Supabase) is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSigningUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin }
        });

        if (error) {
          if (error.code === 'over_email_send_rate_limit') {
            showError("Too many signup attempts. Please wait a few minutes.");
          } else {
            showError(error.message);
          }
        } else if (data.user && !data.session) {
          if (bypassEmail) {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) showError(signInError.message);
            else window.location.href = '/app/home';
          } else {
            showSuccess("Account created! Please check your email.");
          }
        } else if (data.user && data.session) {
          window.location.href = '/app/home';
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.code === 'email_not_confirmed') {
            showError("Please check your email and confirm your account.");
          } else {
            showError(error.message);
          }
        } else if (data.user) {
          window.location.href = '/app/home';
        }
      }
    } catch (error) {
      showError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md p-6 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/10">
            <img src="/logo.jpg" alt="Interact Logo" className="w-full h-full object-cover" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            interact
          </CardTitle>
          <CardDescription className="text-lg">
            {isSigningUp ? "Join the conversation" : "Welcome back"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@interact.app"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-blue-500/50 transition-all h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-blue-500/50 transition-all h-12"
              />
            </div>

            {isSigningUp && (
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="bypass-email"
                  checked={bypassEmail}
                  onCheckedChange={(checked) => setBypassEmail(checked as boolean)}
                  className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor="bypass-email" className="text-xs text-muted-foreground font-normal">
                  Bypass confirmation (Dev Mode)
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (isSigningUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isSigningUp ? "Already have an account?" : "New to Interact?"}{" "}
              <button onClick={() => setIsSigningUp(!isSigningUp)} className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors ml-1">
                {isSigningUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            {!isSigningUp && (
              <button
                onClick={handleResendConfirmation}
                className="text-xs text-muted-foreground hover:text-white transition-colors"
                disabled={isLoading || !email}
              >
                Resend confirmation email
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;