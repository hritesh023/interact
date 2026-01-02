"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2, Plus } from 'lucide-react';

const HomePage = () => {
  // Placeholder for stories (Facebook style but unique)
  const stories = [
    { id: '1', user: 'Alice', avatar: 'https://github.com/shadcn.png', image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Story1' },
    { id: '2', user: 'Bob', avatar: 'https://github.com/shadcn.png', image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Story2' },
    { id: '3', user: 'Charlie', avatar: 'https://github.com/shadcn.png', image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Story3' },
    { id: '4', user: 'Diana', avatar: 'https://github.com/shadcn.png', image: 'https://via.placeholder.com/150/FFFF33/000000?text=Story4' },
    { id: '5', user: 'Eve', avatar: 'https://github.com/shadcn.png', image: 'https://via.placeholder.com/150/FF33FF/FFFFFF?text=Story5' },
  ];

  // Placeholder for posts
  const posts = [
    {
      id: 'p1',
      user: 'Interact Official',
      avatar: 'https://github.com/shadcn.png',
      time: '2 hours ago',
      content: 'Welcome to Interact! We are excited to build this community with you. Share your first thought!',
      image: null,
      likes: 120,
      comments: 15,
      shares: 5,
    },
    {
      id: 'p2',
      user: 'Jane Doe',
      avatar: 'https://github.com/shadcn.png',
      time: '5 hours ago',
      content: 'Just posted a new moment! Check it out on my profile.',
      image: 'https://via.placeholder.com/600x400/8A2BE2/FFFFFF?text=My+Moment',
      likes: 85,
      comments: 8,
      shares: 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Story Panel */}
      <Card className="p-4">
        <CardTitle className="mb-4 text-lg">Stories</CardTitle>
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {/* Add Story Button */}
          <div className="flex-shrink-0 w-24 h-36 flex flex-col items-center justify-center bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Add Story</span>
          </div>
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 w-24 h-36 relative rounded-lg overflow-hidden shadow-md">
              <img src={story.image} alt={story.user} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                <Avatar className="w-8 h-8 border-2 border-white mb-1">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.user.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-white text-xs font-semibold truncate">{story.user}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Post Feed */}
      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatar} />
              <AvatarFallback>{post.user.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{post.user}</CardTitle>
              <p className="text-sm text-muted-foreground">{post.time}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <p className="mb-4">{post.content}</p>
            {post.image && (
              <img src={post.image} alt="Post content" className="w-full rounded-lg mb-4 object-cover max-h-96" />
            )}
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> {post.shares}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;