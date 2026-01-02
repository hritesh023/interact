"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MomentsPage = () => {
  const moments = [
    {
      id: 'm1',
      user: 'TravelExplorer',
      avatar: 'https://github.com/shadcn.png',
      time: '1 day ago',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
      caption: 'Exploring the beautiful mountains! #travel #adventure',
      likes: 345,
      comments: 23,
      shares: 10,
    },
    {
      id: 'm2',
      user: 'FoodieCreator',
      avatar: 'https://github.com/shadcn.png',
      time: '3 days ago',
      video: 'https://www.w3schools.com/html/movie.mp4', // Placeholder video
      caption: 'My latest cooking experiment! So delicious. #foodie #cooking',
      likes: 210,
      comments: 18,
      shares: 7,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moments</h1>

      {moments.map((moment) => (
        <Card key={moment.id} className="p-4">
          <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={moment.avatar} />
              <AvatarFallback>{moment.user.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{moment.user}</CardTitle>
              <p className="text-sm text-muted-foreground">{moment.time}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <p className="mb-4">{moment.caption}</p>
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video controls className="w-full h-full object-contain">
                <source src={moment.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* You could add a custom play button overlay here */}
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {moment.likes}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {moment.comments}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> {moment.shares}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {moments.length === 0 && (
        <p className="text-center text-muted-foreground">No moments to display yet. Be the first to share one!</p>
      )}
    </div>
  );
};

export default MomentsPage;