import { supabase } from './supabase';
import { Post, Moment, Story } from '@/types';

// Fetch real posts from Supabase
export const fetchPosts = async (userId?: string, limit = 50): Promise<Post[]> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty posts');
      return [];
    }

    let query = supabase
      .from('thoughts') // Changed from 'posts' to 'thoughts'
      .select(`
        *,
        author:profiles!thoughts_user_id_fkey (
          username,
          avatar_url,
          full_name
        ),
        likes_count:likes(count),
        comments_count:comments(count),
        reacts_count:reacts(count),
        shares_count:shares(count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // If user is logged in, get posts from people they follow plus their own posts
    if (userId) {
      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);

      const followingIds = following?.map(f => f.following_id) || [];
      followingIds.push(userId); // Include user's own posts

      query = query.in('user_id', followingIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data?.map(post => ({
      id: post.id,
      user: post.author?.username || 'Unknown User',
      avatar: post.author?.avatar_url || '',
      time: formatTimeAgo(post.created_at),
      content: post.content,
      image: post.image_url,
      likes: post.likes_count || 0,
      reacts: post.reacts_count || 0,
      comments: post.comments_count || 0,
      shares: post.shares_count || 0,
      type: post.type || 'post',
      tags: post.tags || [],
      categories: post.categories || [],
      userId: post.user_id,
      createdAt: post.created_at
    })) || [];
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    return [];
  }
};

// Fetch real moments from Supabase
export const fetchMoments = async (limit = 20): Promise<Moment[]> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty moments');
      return [];
    }

    const { data, error } = await supabase
      .from('thoughts') // Changed from 'moments' to 'thoughts'
      .select(`
        *,
        author:profiles!thoughts_user_id_fkey (
          username,
          avatar_url,
          full_name
        ),
        likes_count:likes(count),
        comments_count:comments(count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching moments:', error);
      return [];
    }

    return data?.map(moment => ({
      id: moment.id,
      user: moment.author?.username || 'Unknown User',
      content: moment.content,
      media: moment.video_url || '',
      thumbnail: moment.thumbnail_url,
      mediaType: 'video' as const,
      videoUrl: moment.video_url,
      likes: moment.likes_count || 0,
      comments: moment.comments_count || 0,
      views: moment.views || 0,
      time: formatTimeAgo(moment.created_at),
      userId: moment.user_id,
      createdAt: moment.created_at
    })) || [];
  } catch (error) {
    console.error('Error in fetchMoments:', error);
    return [];
  }
};

// Fetch real stories from Supabase
export const fetchStories = async (limit = 20): Promise<Story[]> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty stories');
      return [];
    }

    // Stories table doesn't exist in the current database schema
    // Return empty array for now until stories are implemented
    console.warn('Stories table not found in database schema');
    return [];

    // Original code commented out until stories table is created:
    // const { data, error } = await supabase
    //   .from('profiles')
    //   .select(`
    //     *,
    //     author:profiles!profiles_user_id_fkey (
    //       username,
    //       avatar_url,
    //       full_name
    //     )
    //   `)
    //   .order('created_at', { ascending: false })
    //   .limit(limit);

    // if (error) {
    //   console.error('Error fetching stories:', error);
    //   return [];
    // }

    // return data?.map(story => ({
    //   id: story.id,
    //   user: story.author?.username || 'Unknown User',
    //   avatar: story.author?.avatar_url || 'https://github.com/shadcn.png',
    //   image: story.image_url,
    //   time: formatTimeAgo(story.created_at),
    //   userId: story.user_id,
    //   createdAt: story.created_at
    // })) || [];
  } catch (error) {
    console.error('Error in fetchStories:', error);
    return [];
  }
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

// Create a new post
export const createPost = async (postData: {
  content: string;
  image_url?: string;
  type?: 'post' | 'thought';
  tags?: string[];
  categories?: string[];
}): Promise<{ success: boolean; post?: Post; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('thoughts') // Changed from 'posts' to 'thoughts'
      .insert({
        user_id: user.id,
        content: postData.content,
        image_url: postData.image_url,
        type: postData.type || 'post',
        tags: postData.tags || [],
        categories: postData.categories || []
      })
      .select(`
        *,
        author:profiles!thoughts_user_id_fkey (
          username,
          avatar_url,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }

    const post: Post = {
      id: data.id,
      user: data.author?.username || user.email || 'Unknown User',
      avatar: data.author?.avatar_url || '',
      time: 'just now',
      content: data.content,
      image: data.image_url,
      likes: 0,
      reacts: 0,
      comments: 0,
      shares: 0,
      type: data.type || 'post',
      tags: data.tags || [],
      categories: data.categories || [],
      userId: data.user_id,
      createdAt: data.created_at
    };

    return { success: true, post };
  } catch (error) {
    console.error('Error in createPost:', error);
    return { success: false, error: 'Failed to create post' };
  }
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  try {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};
