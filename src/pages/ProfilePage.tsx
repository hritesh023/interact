"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Edit, ThumbsUp, MessageCircle, Share2, Video, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const userProfile = {
    name: 'John Doe',
    username: '@johndoe',
    avatar: 'https://github.com/shadcn.png',
    bio: 'Passionate creator, sharing my journey and thoughts. Love coding, photography, and exploring new ideas!',
    followers: '1.5K',
    following: '300',
    posts: [
      { id: 'p1', type: 'thought', content: 'Just launched my new project! Check it out!', likes: 120, comments: 15, shares: 5, time: '2h ago' },
      { id: 'p2', type: 'moment', content: 'Sunset vibes from the beach!', media: 'https://via.placeholder.com/400x250/FFD700/000000?text=Sunset', likes: 85, comments: 8, shares: 2, time: '1d ago' },
      { id: 'p3', type: 'thought', content: 'Learning new things everyday is key to growth.', likes: 60, comments: 7, shares: 1, time: '3d ago' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={userProfile.avatar} />
          <AvatarFallback>{userProfile.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{userProfile.name}</h1>
        <p className="text-muted-foreground mb-2">{userProfile.username}</p>
        <p className="text-center max-w-md mb-4">{userProfile.bio}</p>
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col items-center">
            <span className="font-bold">{userProfile.followers}</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">{userProfile.following}</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* User Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="moments">Moments</TabsTrigger>
          <TabsTrigger value="thoughts">Thoughts</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6 space-y-4">
          {userProfile.posts.map((post) => (
            <Card key={post.id} className="p-4">
              <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
                {post.type === 'moment' ? <Video className="h-5 w-5 text-primary" /> : <MessageSquare className="h-5 w-5 text-primary" />}
                <div>
                  <CardTitle className="text-base capitalize">{post.type}</CardTitle>
                  <p className="text-sm text-muted-foreground">{post.time}</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="mb-4">{post.content}</p>
                {post.media && (
                  <img src={post.media} alt="Post media" className="w-full rounded-lg mb-4 object-cover max-h-60" />
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
          {userProfile.posts.length === 0 && (
            <p className="text-center text-muted-foreground">No posts yet. Share something!</p>
          )}
        </TabsContent>
        <TabsContent value="moments" className="mt-6 space-y-4">
          {userProfile.posts.filter(p => p.type === 'moment').map((post) => (
            <Card key={post.id} className="p-4">
              <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base capitalize">{post.type}</CardTitle>
                  <p className="text-sm text-muted-foreground">{post.time}</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="mb-4">{post.content}</p>
                {post.media && (
                  <img src={post.media} alt="Post media" className="w-full rounded-lg mb-4 object-cover max-h-60" />
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
          {userProfile.posts.filter(p => p.type === 'moment').length === 0 && (
            <p className="text-center text-muted-foreground">No moments yet. Share a moment!</p>
          )}
        </TabsContent>
        <TabsContent value="thoughts" className="mt-6 space-y-4">
          {userProfile.posts.filter(p => p.type === 'thought').map((post) => (
            <Card key={post.id} className="p-4">
              <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base capitalize">{post.type}</CardTitle>
                  <p className="text-sm text-muted-foreground">{post.time}</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="mb-4">{post.content}</p>
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
          {userProfile.posts.filter(p => p.type === 'thought').length === 0 && (
            <p className="text-center text-muted-foreground">No thoughts yet. Share what's on your mind!</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;