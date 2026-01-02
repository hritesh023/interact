"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ThoughtsPage = () => {
  const thoughts = [
    {
      id: 't1',
      user: 'TechGuru',
      avatar: 'https://github.com/shadcn.png',
      time: '1 hour ago',
      content: 'The future of AI is going to be more integrated into our daily lives than we can imagine. What are your thoughts?',
      likes: 55,
      comments: 12,
      shares: 3,
    },
    {
      id: 't2',
      user: 'DailyPhilosopher',
      avatar: 'https://github.com/shadcn.png',
      time: '4 hours ago',
      content: 'Sometimes, the simplest solutions are the most profound. Overthinking can be our biggest enemy.',
      likes: 88,
      comments: 20,
      shares: 6,
    },
    {
      id: 't3',
      user: 'BookWorm',
      avatar: 'https://github.com/shadcn.png',
      time: 'Yesterday',
      content: 'Just finished reading an amazing book! Highly recommend "Project Hail Mary" by Andy Weir. So captivating!',
      likes: 150,
      comments: 30,
      shares: 15,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Thoughts</h1>

      {thoughts.map((thought) => (
        <Card key={thought.id} className="p-4">
          <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={thought.avatar} />
              <AvatarFallback>{thought.user.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{thought.user}</CardTitle>
              <p className="text-sm text-muted-foreground">{thought.time}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <p className="mb-4">{thought.content}</p>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {thought.likes}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {thought.comments}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> {thought.shares}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {thoughts.length === 0 && (
        <p className="text-center text-muted-foreground">No thoughts to display yet. Share what's on your mind!</p>
      )}
    </div>
  );
};

export default ThoughtsPage;