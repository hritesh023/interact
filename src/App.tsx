import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import CreatePage from "./pages/CreatePage";
import MomentsPage from "./pages/MomentsPage";
import ThoughtsPage from "./pages/ThoughtsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import { supabase } from "./lib/supabase"; // Import supabase client

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow container mx-auto p-4">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null); // State to hold Supabase session

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false); // Stop loading after checking session
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false); // Stop loading after auth state change
    });

    // Cleanup listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage />} />
            <Route
              path="/"
              element={session ? <AppLayout /> : <Navigate to="/auth" replace />}
            >
              <Route index element={<HomePage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="create" element={<CreatePage />} />
              <Route path="moments" element={<MomentsPage />} />
              <Route path="thoughts" element={<ThoughtsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;