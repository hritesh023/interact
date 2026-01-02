"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Removed Chrome icon import as Google Sign-In is being removed
// import { Chrome } from 'lucide-react'; 
// Removed supabase import as it was only used for Google Sign-In here
// import { supabase } from '@/lib/supabase'; 

const AuthPage = () => {
  // Removed handleGoogleSignIn function

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email Sign-In clicked");
    // Integrate with email/password sign-in here
    // For now, this is a placeholder. You would add your Supabase email/password auth logic here.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <img src="/interact_logo.png" alt="Interact Logo" className="w-24 h-24 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome to Interact</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Removed Google Sign-In Button */}
          {/* Removed "OR" divider */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <a href="#" className="text-primary hover:underline">Sign Up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;