"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Google } from 'lucide-react'; // Using a generic Google icon for now

const AuthPage = () => {
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
    // Integrate with Google Sign-In here
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email Sign-In clicked");
    // Integrate with email/password sign-in here
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
          <Button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2">
            <Google className="h-5 w-5" /> Sign in with Google
          </Button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
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