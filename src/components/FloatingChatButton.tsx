"use client";

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatSidebar from './ChatSidebar';

const FloatingChatButton = () => {
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed left-4 top-20 z-40">
        <Button
          onClick={() => setChatSidebarOpen(true)}
          size="lg"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-110"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={chatSidebarOpen} onClose={() => setChatSidebarOpen(false)} />
    </>
  );
};

export default FloatingChatButton;
