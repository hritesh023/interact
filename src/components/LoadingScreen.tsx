"use client";

import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <img src="/interact_logo.png" alt="Interact Logo" className="w-32 h-32 animate-pulse mb-4" />
      <p className="text-xl font-semibold">Loading Interact...</p>
    </div>
  );
};

export default LoadingScreen;