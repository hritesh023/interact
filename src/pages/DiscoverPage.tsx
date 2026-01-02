"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Users, Eye } from 'lucide-react';

const DiscoverPage = () => {
  const trendingTopics = [
    { id: 't1', name: '#AIRevolution', posts: '1.2M' },
    { id: 't2', name: '#GamingNews', posts: '800K' },
    { id: 't3', name: '#TravelVlog', posts: '500K' },
    { id: 't4', name: '#CodingLife', posts: '300K' },
  ];

  const liveStreams = [
    { id: 'l1', title: 'Morning Coffee Chat', streamer: 'CoffeeLover', viewers: '2.5K', thumbnail: 'https://via.placeholder.com/300x180/FF6347/FFFFFF?text=Live+Stream+1' },
    { id: 'l2', title: 'Gaming Marathon', streamer: 'ProGamerX', viewers: '1.8K', thumbnail: 'https://via.placeholder.com/300x180/4682B4/FFFFFF?text=Live+Stream+2' },
    { id: 'l3', title: 'Art Tutorial: Landscapes', streamer: 'CreativeBrush', viewers: '900', thumbnail: 'https://via.placeholder.com/300x180/3CB371/FFFFFF?text=Live+Stream+3' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Discover</h1>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="flex flex-col p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <span className="font-semibold text-primary">{topic.name}</span>
              <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Stream Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-red-500" /> Live Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveStreams.map((stream) => (
            <div key={stream.id} className="relative rounded-lg overflow-hidden shadow-md group">
              <img src={stream.thumbnail} alt={stream.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                <span className="text-white text-sm font-semibold mb-1">{stream.title}</span>
                <div className="flex items-center justify-between text-xs text-gray-200">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {stream.streamer}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {stream.viewers}
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 h-auto">LIVE</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Other Discover Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">More personalized content will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverPage;