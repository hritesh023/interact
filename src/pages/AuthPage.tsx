"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase'; // Import supabase client
import { showSuccess, showError } from '@/utils/toast'; // Import toast utilities

const AuthPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSigningUp) {
      // Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        showError(error.message);
        console.error("Error signing up:", error);
      } else if (data.user) {
        showSuccess("Account created! Please check your email to confirm your account.");
        console.log("Sign up successful:", data);
      } else {
        showError("An unexpected error occurred during sign up.");
      }
    } else {
      // Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showError(error.message);
        console.error("Error signing in:", error);
      } else if (data.user) {
        showSuccess("Successfully signed in!");
        console.log("Sign in successful:", data);
      } else {
        showError("An unexpected error occurred during sign in.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <img src="/interact_logo.png" alt="Interact Logo" className="w-24 h-24 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome to Interact</CardTitle>
          <CardDescription>
            {isSigningUp ? "Create an account to get started" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : (isSigningUp ? "Sign Up" : "Sign In")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)} className="p-0 h-auto text-primary hover:underline">
              {isSigningUp ? "Sign In" : "Sign Up"}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;