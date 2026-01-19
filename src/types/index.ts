export interface FullscreenContent {
  id: string;
  type?: 'post' | 'live' | 'video' | 'moment' | 'image' | 'thought' | 'reacted' | 'story';
  src?: string;
  thumbnail?: string;
  title?: string;
  user?: string;
  avatar?: string;
  time?: string;
  content?: string;
  likes?: number;
  comments?: number;
  [key: string]: unknown;
}

export interface Post {
  id: string;
  user: string;
  avatar?: string;
  time?: string;
  content?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  image?: string;
  videoUrl?: string;
  media?: string;
  thumbnail?: string;
  duration?: string;
  reacts?: number;
  views?: number;
  type?: 'post' | 'thought' | 'reacted' | 'moment' | 'video' | 'story';
  originalAuthor?: string;
  originalPostId?: string;
  engagement?: number;
  relevanceScore?: number;
  tags?: string[];
  categories?: string[];
  upvotes_count?: number;
  downvotes_count?: number;
  user_vote?: 'upvote' | 'downvote' | null;
  mediaType?: 'video' | 'image' | 'moment';
  isLive?: boolean;
  savedAt?: string;
  video?: string;
  caption?: string;
  title?: string;
  creator?: string;
  published?: string;
  fallbackImage?: string;
  aspectRatio?: string;
  forcePortrait?: boolean;
  verified?: boolean;
  subscribers?: number;
  [key: string]: unknown;
}

export interface Moment {
  id: string;
  user: string;
  content: string;
  image?: string;
  video?: string;
  thumbnail?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  time?: string;
  avatar?: string;
  fallbackImage?: string;
  media?: string;
  mediaType?: 'video' | 'image' | 'moment';
  videoUrl?: string;
  views?: number;
  userId?: string;
  createdAt?: string;
}

export interface Story {
  id: string;
  user: string;
  avatar?: string;
  image: string;
  time?: string;
  userId?: string;
  createdAt?: string;
}
