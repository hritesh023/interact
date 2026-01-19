import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, X } from 'lucide-react';
import StoryViewer from './StoryViewer';

interface Story {
  id: string;
  user: string;
  avatar: string;
  image: string;
  time: string;
  isFollowing?: boolean;
  isOwn?: boolean;
  userId?: string; // Future: User ID for backend filtering
  profileId?: string; // Future: Profile ID to match with story
  isBotContent?: boolean; // Current: Mark as bot content
  content?: string; // Optional story content/text
}

interface StoriesProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
  onAddStory?: () => void;
  onDeleteStory?: (storyId: string) => void;
  onSaveStory?: (storyId: string) => void;
  savedStories?: Set<string>;
}

const Stories: React.FC<StoriesProps> = ({ stories, onStoryClick, onAddStory, onDeleteStory, onSaveStory, savedStories = new Set() }) => {
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // CURRENT BEHAVIOR: Show bot content for demo purposes
  // FUTURE BEHAVIOR: When real users are involved, filter stories to show only:
  // 1. Stories uploaded by the current user (userId matches current session)
  // 2. Stories from profiles the user follows 
  // 3. Stories must match the profile they were uploaded from (profileId consistency)
  const filteredStories = stories.filter(story => story.isFollowing || story.isOwn);
  
  // Check if user has their own story
  const userOwnStory = stories.find(story => story.isOwn);
  const hasUserStory = !!userOwnStory;

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
    onStoryClick(index);
    
    // Log story click for debugging
    const allStories = hasUserStory ? [userOwnStory, ...filteredStories] : filteredStories;
    const selectedStory = allStories[index];
    console.log('Story clicked:', { index, story: selectedStory });
  };

  const handleNextStory = useCallback(() => {
    setCurrentStoryIndex(prevIndex => {
      const allStories = hasUserStory ? [userOwnStory, ...filteredStories] : filteredStories;
      if (prevIndex < allStories.length - 1) {
        return prevIndex + 1;
      } else {
        setShowStoryViewer(false);
        return prevIndex;
      }
    });
  }, [hasUserStory, userOwnStory, filteredStories]);

  const handlePreviousStory = useCallback(() => {
    setCurrentStoryIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  }, []);

  const handleCloseViewer = () => {
    setShowStoryViewer(false);
  };

  return (
    <>
      <Card className="p-4">
        <CardTitle className="mb-4 text-lg">Stories</CardTitle>
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {/* User's Own Story - Show when exists, otherwise show Add Story Button */}
          {hasUserStory ? (
            <div 
              className="flex-shrink-0 w-24 h-36 relative rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleStoryClick(0)} // User's story is always first when it exists
            >
              <img src={userOwnStory.image} alt={userOwnStory.user} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                <div className="relative">
                  <Avatar className="w-8 h-8 border-2 border-white mb-1">
                    <AvatarImage src={userOwnStory.avatar} />
                    <AvatarFallback>{userOwnStory.user.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-white text-xs font-semibold truncate">{userOwnStory.user}</span>
              </div>
            </div>
          ) : (
            onAddStory && (
              <div 
                className="flex-shrink-0 w-24 h-36 relative rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                onClick={onAddStory}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <Avatar className="w-8 h-8 border-2 border-white mb-1 mx-auto">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <span className="text-white text-xs font-semibold text-center block">Your Story</span>
                </div>
              </div>
            )
          )}
          
          {/* Stories from following accounts */}
          {filteredStories.map((story, index) => {
            // Adjust index based on whether user has their own story
            const adjustedIndex = hasUserStory ? index + 1 : index;
            return (
              <div 
                key={story.id} 
                className="flex-shrink-0 w-24 h-36 relative rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleStoryClick(adjustedIndex)}
              >
              <img src={story.image} alt={story.user} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                <div className="relative">
                  <Avatar className="w-8 h-8 border-2 border-white mb-1">
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.user.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {story.isFollowing && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="text-white text-xs font-semibold truncate">{story.user}</span>
              </div>
            </div>
            );
          })}
          
          {/* Show message when no stories from following accounts */}
          {filteredStories.length === 0 && (
            <div className="flex-shrink-0 w-48 h-36 relative rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-gray-500 text-sm">No stories from accounts you follow</p>
                <p className="text-gray-400 text-xs mt-1">Follow more accounts to see their stories</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Story Viewer */}
      {showStoryViewer && (
        <StoryViewer
          stories={hasUserStory ? [userOwnStory, ...filteredStories] : filteredStories}
          currentIndex={currentStoryIndex}
          onClose={handleCloseViewer}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
          onDeleteStory={onDeleteStory}
        />
      )}
    </>
  );
};

export default Stories;
