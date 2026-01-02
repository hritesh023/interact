"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusCircle, Video, MessageSquare, User, Search, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from './ThemeToggle'; // Import ThemeToggle

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Discover', icon: Compass, path: '/discover' },
  { name: 'Create', icon: PlusCircle, path: '/create' },
  { name: 'Moments', icon: Video, path: '/moments' },
  { name: 'Thoughts', icon: MessageSquare, path: '/thoughts' },
  { name: 'Profile', icon: User, path: '/profile' },
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/interact_logo.png" alt="Interact Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground hidden md:block">Interact</span>
        </Link>

        {/* Search Bar (Desktop) */}
        {!isMobile && (
          <div className="flex-grow max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Interact..."
                className="pl-9 w-full"
              />
            </div>
          </div>
        )}

        {/* Navigation Links (Desktop) / Icons (Mobile) */}
        <div className="flex items-center gap-4">
          {!isMobile ? (
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Navigation (Bottom Bar) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 shadow-lg z-50">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.name}</span> {/* Screen reader only for mobile */}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;