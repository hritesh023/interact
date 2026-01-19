import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import { Toaster } from './components/ui/sonner';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary'; // Imported ErrorBoundary
import { NetworkProvider } from './contexts/NetworkContext';
import { AudioProvider } from './contexts/AudioContext';
import { supabase } from './lib/supabase';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import CreatePage from './pages/CreatePage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SearchPage from './pages/SearchPage';
import MomentsPage from './pages/MomentsPage';
import ThoughtsPage from './pages/ThoughtsPage';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  
  // Check authentication state
  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        console.error('❌ Supabase is not configured. Please set up your environment variables.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Checking authentication state...');
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📋 Session result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          userId: session?.user?.id, 
          userEmail: session?.user?.email,
          error 
        });
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        const currentUser = session?.user || null;
        console.log('👤 Setting user state to:', currentUser?.email || 'null');
        setUser(currentUser);
        setIsLoading(false);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('🔄 Auth state change event:', _event);
          console.log('📋 New session result:', { 
            hasSession: !!session, 
            hasUser: !!session?.user, 
            userId: session?.user?.id, 
            userEmail: session?.user?.email 
          });
          
          const newUser = session?.user || null;
          console.log('👤 Updating user state to:', newUser?.email || 'null');
          setUser(newUser);
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Error in checkAuth:', err);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAuthPage = location.pathname === '/auth';
  // Show navbar when user is authenticated and not on auth page
  // In development, always show navbar except on auth page
  const shouldShowNavbar = (user && !isAuthPage) || (!user && !isAuthPage && import.meta.env.DEV);
  
  
  const handleSignOut = async () => {
    if (!supabase) {
      console.error('❌ Cannot sign out: Supabase is not configured');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        setUser(null);
        window.location.href = '/auth';
      } else {
        console.error('Sign out error:', error);
      }
    } catch (err) {
      console.error('Sign out exception:', err);
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Interact...</p>
        </div>
      </div>
    );
  }

  // Show error if Supabase is not configured
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground">Configuration Required</h1>
          <p className="text-muted-foreground">
            Interact requires Supabase to function properly. Please configure your environment variables:
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <code className="text-sm">
              VITE_SUPABASE_URL=your_supabase_url<br/>
              VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
            </code>
          </div>
          <p className="text-sm text-muted-foreground">
            Please check your .env file and restart the application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {shouldShowNavbar && <Navbar user={user} onSignOut={handleSignOut} />}
      <main className={`flex-1 ${
        shouldShowNavbar 
          ? (location.pathname === '/moments' || location.pathname === '/app/moments' 
              ? 'w-full' 
              : user && window.innerWidth < 768 
                  ? 'mobile-main-content' 
                  : 'container mx-auto px-4 py-6 md:pb-20') 
          : 'w-full'
      }`}>
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Feature Routes */}
        <Route path="/app/home" element={<HomePage />} />
        <Route path="/app/discover" element={<DiscoverPage />} />
        <Route path="/app/create" element={<CreatePage />} />
        <Route path="/app/moments" element={<MomentsPage />} />
        <Route path="/app/thoughts" element={<ThoughtsPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/search" element={<SearchPage />} />

        {/* Direct Access Routes (for easier navigation) */}
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/moments" element={<MomentsPage />} />
        <Route path="/thoughts" element={<ThoughtsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Toaster />
  </div>
  );
};

const App = () => {
  const [showApp, setShowApp] = useState(false);

  // Show app after splash screen naturally finishes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowApp(true);
    }, 1500); // Shorter duration to match splash screen
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen first
  if (!showApp) {
    return <SplashScreen onFinish={() => setShowApp(true)} />;
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <AudioProvider>
        <NetworkProvider>
          <Router>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </Router>
        </NetworkProvider>
      </AudioProvider>
    </ThemeProvider>
  );
};

export default App;