import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, TrendingUp, Clock, Sparkles, Eye, Monitor, MessageCircle, Share2, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import SearchSuggest from '@/components/SearchSuggest';
import SEOHead from '@/components/SEOHead';
import SplitScreenView from '@/components/SplitScreenView';
import ReportButton from '@/components/ReportButton';
import SaveButton from '@/components/SaveButton';
import ShareButton from '@/components/ShareButton';
import CommentSection from '@/components/CommentSection';
import StandardPostMenu from '@/components/StandardPostMenu';
import FullscreenViewer from '@/components/FullscreenViewer';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';
import { FullscreenContent } from '@/types';

// Mock search results data
const mockSearchResults = [
  {
    id: '1',
    title: 'Amazing Sunset Photography Tips',
    description: 'Learn how to capture stunning sunset photos with these professional techniques',
    type: 'video' as const,
    creator: 'PhotoPro',
    views: '125K',
    thumbnail: 'https://picsum.photos/seed/sunset1/300/200',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Photography',
    tags: ['photography', 'sunset', 'tips'],
    duration: '10:24',
    publishedAt: '2 days ago'
  },
  {
    id: '2',
    title: 'Quick & Easy Dinner Recipes',
    description: 'Delicious recipes you can make in under 30 minutes',
    type: 'photo' as const,
    creator: 'FoodieLife',
    views: '89K',
    thumbnail: 'https://picsum.photos/seed/food1/300/200',
    imageUrl: 'https://picsum.photos/seed/food1/800/600',
    category: 'Food',
    tags: ['food', 'recipes', 'dinner'],
    publishedAt: '1 day ago'
  },
  {
    id: '3',
    title: 'Morning Yoga Flow for Beginners',
    description: 'Start your day with this gentle yoga sequence',
    type: 'video' as const,
    creator: 'YogaGuru',
    views: '234K',
    thumbnail: 'https://picsum.photos/seed/yoga1/300/200',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Fitness',
    tags: ['yoga', 'fitness', 'morning'],
    duration: '15:30',
    publishedAt: '3 days ago'
  }
];

interface SearchItem {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  creator?: string;
  views?: string;
  thumbnail?: string;
  videoUrl?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  duration?: string;
  publishedAt?: string;
  [key: string]: unknown;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'split'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [results, setResults] = useState<SearchItem[]>(mockSearchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showSplitScreen, setShowSplitScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string>('');
  const [currentPostUser, setCurrentPostUser] = useState<string>('');
  const [fullscreenContent, setFullscreenContent] = useState<FullscreenContent | null>(null);
  const [fullscreenType, setFullscreenType] = useState<'post' | 'live' | 'video' | 'moment' | 'image'>('image');
  const [showTagBar, setShowTagBar] = useState(false);
  const [currentTag, setCurrentTag] = useState<string>('');

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const handleComment = (postId: string, postUser: string) => {
    setCurrentPostId(postId);
    setCurrentPostUser(postUser);
    setShowCommentSection(true);
  };

  const handleShare = (item: SearchItem) => {
    showSuccess(`Sharing "${item.title}"...`);
    // Share functionality will be handled by ShareButton component
  };

  const handleOpenFullscreen = (content: FullscreenContent, type: 'post' | 'live' | 'video' | 'moment' | 'image') => {
    setFullscreenContent(content);
    setFullscreenType(type);
  };

  const handleCloseFullscreen = () => {
    setFullscreenContent(null);
  };

  const handleExpandFullscreen = () => {
    // This will be called when the expand button is clicked in minimized mode
    // The FullscreenViewer will handle restoring the content
  };

  // Related tags data based on popular categories
  const relatedTagsData: Record<string, string[]> = {
    'photography': ['camera', 'landscape', 'portrait', 'sunset', 'nature', 'street', 'blackandwhite', 'macro'],
    'food': ['recipes', 'cooking', 'dinner', 'lunch', 'breakfast', 'dessert', 'healthy', 'vegan'],
    'yoga': ['fitness', 'meditation', 'wellness', 'exercise', 'health', 'stretching', 'mindfulness', 'breathing'],
    'fitness': ['workout', 'gym', 'training', 'cardio', 'strength', 'weights', 'running', 'cycling'],
    'travel': ['adventure', 'vacation', 'explore', 'wanderlust', 'journey', 'destination', 'tourism', 'backpacking'],
    'art': ['painting', 'drawing', 'creative', 'design', 'illustration', 'abstract', 'modern', 'digital'],
    'music': ['song', 'melody', 'rhythm', 'beat', 'concert', 'album', 'playlist', 'audio'],
    'technology': ['tech', 'coding', 'programming', 'software', 'gadgets', 'innovation', 'digital', 'startup'],
    'fashion': ['style', 'outfit', 'trend', 'clothing', 'accessories', 'runway', 'designer', 'vintage'],
    'gaming': ['videogames', 'esports', 'streaming', 'console', 'pc', 'mobile', 'multiplayer', 'indie']
  };

  const getRelatedTags = (tag: string): string[] => {
    const lowerTag = tag.toLowerCase();
    return relatedTagsData[lowerTag] || [
      'tutorial', 'guide', 'tips', 'howto', 'learn', 'basics', 'advanced', 'best'
    ];
  };

  const handleTagBarClick = (tag: string) => {
    setCurrentTag(tag);
    setSearchParams({ q: tag });
    setShowTagBar(true);
  };

  // Menu handlers
  const handleReport = (postId: string) => {
    showSuccess(`Report submitted for content ${postId}`);
  };

  const handleHide = (postId: string) => {
    showSuccess('Content hidden from search results');
  };

  const handleCopyLink = (postId: string) => {
    const shareUrl = `${window.location.origin}/search/${postId}`;
    navigator.clipboard.writeText(shareUrl);
    showSuccess('🔗 Link copied to clipboard!');
  };

  // Memoized filtering logic to prevent unnecessary re-renders
  const filterResults = useCallback((searchQuery: string) => {
    return mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      result.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, []);

  // Simulate search loading with proper initial state handling
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filteredResults = filterResults(query);
        setResults(filteredResults);
        setIsLoading(false);
        setIsInitialLoad(false);
      }, 800);
    } else {
      setResults(mockSearchResults);
      setIsInitialLoad(false);
    }
  }, [query, filterResults]);

  // Show tag bar if URL contains a tag-like query
  useEffect(() => {
    if (query && !showTagBar) {
      // Check if query looks like a tag (single word, common tag categories)
      const isTagLike = query.trim().split(' ').length === 1 && 
                        Object.keys(relatedTagsData).some(tag => 
                          query.toLowerCase().includes(tag) || tag.includes(query.toLowerCase())
                        );
      
      if (isTagLike) {
        setCurrentTag(query);
        setShowTagBar(true);
      }
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setSearchParams({ q: searchQuery });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Implement sorting logic
    const sortedResults = [...results].sort((a, b) => {
      switch (value) {
        case 'views':
          return parseInt(b.views) - parseInt(a.views);
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        default:
          return 0;
      }
    });
    setResults(sortedResults);
  };

  const handleRelatedSearch = (searchQuery: string) => {
    setSearchParams({ q: searchQuery });
  };

  const handleCategoryFilter = (value: string) => {
    setFilterCategory(value);
    if (value === 'all') {
      setResults(mockSearchResults);
    } else {
      const filtered = mockSearchResults.filter(result => result.category === value);
      setResults(filtered);
    }
  };

  const handleSplitScreenToggle = () => {
    setShowSplitScreen(!showSplitScreen);
    if (!showSplitScreen && results.length > 0) {
      setSelectedItem(results[0]);
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    setSelectedItem(item);
  };

  const handleCloseSplitScreen = () => {
    setShowSplitScreen(false);
    setSelectedItem(null);
  };

  const categories = ['all', ...Array.from(new Set(mockSearchResults.map(r => r.category)))];

  return (
    <>
      <SEOHead
        title={query ? `Search results for "${query}"` : undefined}
        searchQuery={query}
        category={category}
        resultsCount={results.length}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <div className="min-h-screen bg-background">
        {/* Search Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border/50 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="w-full md:max-w-2xl">
                <SearchSuggest
                  onSearch={handleSearch}
                  placeholder="Search for content, users, tags..."
                  autoFocus={false}
                />
              </div>
              
              {/* Filters and View Mode */}
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterCategory} onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none border-l border-r"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'split' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleSplitScreenToggle}
                    className="rounded-l-none"
                    title="Split Screen View"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="container mx-auto px-4 py-6">
          {/* Results Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {query ? `Search results for "${query}"` : 'Discover Content'}
                </h1>
                <p className="text-muted-foreground">
                  {isLoading ? 'Searching...' : `Found ${results.length} results${query ? ` for "${query}"` : ''}`}
                </p>
              </div>
              
                {/* Search Suggestions - Simplified */}
                {query && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Try:</span>
                    <div className="flex gap-2">
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleRelatedSearch(`${query} tutorial`)}
                      >
                        {query} tutorial
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleRelatedSearch(`best ${query}`)}
                      >
                        best {query}
                      </Badge>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Tag Bar */}
          {showTagBar && currentTag && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Browsing tag:</span>
                  <Badge variant="default" className="text-sm">
                    #{currentTag}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagBar(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground self-center">Related tags:</span>
                {getRelatedTags(currentTag).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200"
                    onClick={() => handleTagBarClick(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Loading State with Skeletons */}
          {(isLoading || isInitialLoad) && (
            <div className="space-y-6">
              {/* Results Header Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              
              {/* Search Results Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Split Screen View */}
          {showSplitScreen && (
            <SplitScreenView
              items={results}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              onClose={handleCloseSplitScreen}
            />
          )}

          {/* Results Grid/List */}
          {!isLoading && !isInitialLoad && !showSplitScreen && results.length > 0 && (
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            )}>
              {results.map((result) => (
                <Card key={result.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleOpenFullscreen(result, result.type === 'video' ? 'video' : 'image')}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="relative">
                        <img 
                          src={result.thumbnail} 
                          alt={result.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {result.type === 'video' && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {result.duration}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-t-lg flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => handleOpenFullscreen(result, result.type === 'video' ? 'video' : 'image')}
                          >
                            {result.type === 'video' ? 'Play' : 'View'}
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>{result.creator}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {result.views} views
                          </span>
                          </div>
                          <span>{result.publishedAt}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                          {result.tags?.slice(0, 2).map(tag => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Show tag bar and open content in fullscreen
                                handleTagBarClick(tag);
                                handleOpenFullscreen(result, result.type === 'video' ? 'video' : 'image');
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                          <div className="ml-auto flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComment(result.id, result.creator);
                              }}
                              title="Comment"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                            <StandardPostMenu
                              postId={result.id}
                              onReport={handleReport}
                              onHide={handleHide}
                              onCopyLink={handleCopyLink}
                              onShare={() => handleShare(result)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <div className="flex gap-4 p-4">
                      <img 
                        src={result.thumbnail} 
                        alt={result.title}
                        className="w-32 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                          {result.tags?.slice(0, 2).map(tag => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Show tag bar and open content in fullscreen
                                handleTagBarClick(tag);
                                handleOpenFullscreen(result, result.type === 'video' ? 'video' : 'image');
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>{result.creator}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {result.views} views
                          </span>
                            {result.type === 'video' && (
                              <>
                                <span>•</span>
                                <span>{result.duration}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComment(result.id, result.creator);
                              }}
                              title="Comment"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                            <StandardPostMenu
                              postId={result.id}
                              onReport={handleReport}
                              onHide={handleHide}
                              onCopyLink={handleCopyLink}
                              onShare={() => handleShare(result)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            />
                          </div>
                          <span>{result.publishedAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {result.category}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenFullscreen(result, result.type === 'video' ? 'video' : 'image')}
                          >
                            {result.type === 'video' ? 'Play' : 'View'}
                          </Button>
                          <StandardPostMenu
                            postId={result.id}
                            onReport={handleReport}
                            onHide={handleHide}
                            onCopyLink={handleCopyLink}
                            onShare={() => handleShare(result)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !isInitialLoad && results.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                {query ? `No results found for "${query}"` : 'No content available'}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using more general terms</li>
                  <li>• Using different keywords</li>
                  <li>• Browsing categories</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comment Section */}
      <CommentSection
        isOpen={showCommentSection}
        onClose={() => setShowCommentSection(false)}
        postId={currentPostId}
        postUser={currentPostUser}
      />

      {/* Fullscreen Viewer */}
      {fullscreenContent && (
        <FullscreenViewer
          content={fullscreenContent}
          type={fullscreenType}
          onClose={handleCloseFullscreen}
          onExpand={handleExpandFullscreen}
        />
      )}
    </>
  );
};

export default SearchPage;
