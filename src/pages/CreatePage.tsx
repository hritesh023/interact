"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text, Video, Camera, Mic, Zap, Upload } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreatePage = () => {
  const handleFileUpload = (type: string) => {
    console.log(`Uploading ${type}...`);
    // Logic for file upload
  };

  const handleLiveStream = () => {
    console.log("Starting live stream...");
    // Logic for starting a live stream
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Content</h1>

      {/* Content Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>What would you like to create?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col h-28 items-center justify-center gap-2">
            <Text className="h-8 w-8" />
            <span>Thought</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-28 items-center justify-center gap-2">
            <Video className="h-8 w-8" />
            <span>Video</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-28 items-center justify-center gap-2">
            <Camera className="h-8 w-8" />
            <span>Moment</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-28 items-center justify-center gap-2" onClick={handleLiveStream}>
            <Zap className="h-8 w-8 text-red-500" />
            <span>Go Live!</span>
          </Button>
        </CardContent>
      </Card>

      {/* Upload Story Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload a Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="story-file">Choose a photo or video for your story</Label>
            <Input id="story-file" type="file" accept="image/*,video/*" onChange={() => handleFileUpload('story')} />
          </div>
          <Textarea placeholder="Add a caption to your story (optional)" />
          <Button className="w-full">Post Story</Button>
        </CardContent>
      </Card>

      {/* General Upload Section (Example) */}
      <Card>
        <CardHeader>
          <CardTitle>Upload a Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="What's on your mind?" />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="post-media">Add media (optional)</Label>
            <Input id="post-media" type="file" accept="image/*,video/*" multiple onChange={() => handleFileUpload('post-media')} />
          </div>
          <Button className="w-full">Publish Post</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;