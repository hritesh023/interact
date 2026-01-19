import { supabase } from './supabase';
import { Thought, Vote, Like, CreateThoughtData, VoteData, LikeData, ThoughtMedia } from '@/types/thoughts';

// Thoughts API
export const getThoughts = async (limit = 20, offset = 0) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const query = supabase
      .from('thoughts')
      .select(`
        *
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    // Get vote counts for each thought
    if (data) {
      const thoughtIds = data.map(thought => thought.id);
      
      // Get upvotes and downvotes counts
      const { data: upvotes } = await supabase
        .from('votes')
        .select('thought_id')
        .eq('vote_type', 'upvote')
        .in('thought_id', thoughtIds);

      const { data: downvotes } = await supabase
        .from('votes')
        .select('thought_id')
        .eq('vote_type', 'downvote')
        .in('thought_id', thoughtIds);

      // Count votes per thought
      const upvoteCounts: { [key: string]: number } = {};
      const downvoteCounts: { [key: string]: number } = {};
      
      if (upvotes) {
        upvotes.forEach(vote => {
          upvoteCounts[vote.thought_id] = (upvoteCounts[vote.thought_id] || 0) + 1;
        });
      }
      
      if (downvotes) {
        downvotes.forEach(vote => {
          downvoteCounts[vote.thought_id] = (downvoteCounts[vote.thought_id] || 0) + 1;
        });
      }

      // Add vote counts to each thought
      data.forEach(thought => {
        thought.upvotes_count = upvoteCounts[thought.id] || 0;
        thought.downvotes_count = downvoteCounts[thought.id] || 0;
      });
    }

    // Get user votes for each thought
    if (user && data) {
      const thoughtIds = data.map(thought => thought.id);
      const { data: votes } = await supabase
        .from('votes')
        .select('thought_id, vote_type')
        .eq('user_id', user.id)
        .in('thought_id', thoughtIds);

      const { data: likes } = await supabase
        .from('likes')
        .select('thought_id')
        .eq('user_id', user.id)
        .in('thought_id', thoughtIds);

      if (votes) {
        // Add user_vote to each thought
        data.forEach(thought => {
          const vote = votes.find(v => v.thought_id === thought.id);
          thought.user_vote = vote?.vote_type || null;
        });
      }

      if (likes) {
        // Add user_has_liked to each thought
        data.forEach(thought => {
          const like = likes.find(l => l.thought_id === thought.id);
          thought.user_has_liked = !!like;
        });
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return { data: null, error };
  }
};

// Function to validate video duration
export const validateVideoDuration = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(video.src);
      resolve(duration <= 300); // 5 minutes = 300 seconds
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(false); // If we can't load metadata, reject the video
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// Function to validate thought media before creation
export const validateThoughtMedia = async (media?: ThoughtMedia[]): Promise<{ isValid: boolean; error?: string }> => {
  if (!media || media.length === 0) {
    return { isValid: true };
  }

  for (const mediaItem of media) {
    if (mediaItem.type === 'video') {
      if (mediaItem.duration && mediaItem.duration > 300) {
        return { 
          isValid: false, 
          error: 'Video duration must be less than 5 minutes (300 seconds)' 
        };
      }
      
      // If duration is not provided in metadata, we can't validate server-side
      // This should be validated client-side before upload
    }
  }

  return { isValid: true };
};

export const createThought = async (thoughtData: CreateThoughtData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate media before creating thought
    const validation = await validateThoughtMedia(thoughtData.media);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid media');
    }

    const { data, error } = await supabase
      .from('thoughts')
      .insert({
        ...thoughtData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating thought:', error);
    return { data: null, error };
  }
};

export const deleteThought = async (thoughtId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('thoughts')
      .delete()
      .eq('id', thoughtId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting thought:', error);
    return { error };
  }
};

// Votes API
export const voteOnThought = async (voteData: VoteData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('thought_id', voteData.thought_id)
      .single();

    let result;
    
    if (existingVote) {
      // Update existing vote
      if (existingVote.vote_type === voteData.vote_type) {
        // Remove vote if same type
        result = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('thought_id', voteData.thought_id);
      } else {
        // Change vote type
        result = await supabase
          .from('votes')
          .update({ vote_type: voteData.vote_type })
          .eq('user_id', user.id)
          .eq('thought_id', voteData.thought_id);
      }
    } else {
      // Create new vote
      result = await supabase
        .from('votes')
        .insert({
          ...voteData,
          user_id: user.id,
        });
    }

    if (result.error) throw result.error;
    
    // Get updated vote counts
    const { data: thought } = await supabase
      .from('thoughts')
      .select('likes_count')
      .eq('id', voteData.thought_id)
      .single();

    // Get upvotes and downvotes count
    const { data: upvotes } = await supabase
      .from('votes')
      .select('id')
      .eq('thought_id', voteData.thought_id)
      .eq('vote_type', 'upvote');

    const { data: downvotes } = await supabase
      .from('votes')
      .select('id')
      .eq('thought_id', voteData.thought_id)
      .eq('vote_type', 'downvote');

    return { 
      data: {
        upvotes_count: upvotes?.length || 0,
        downvotes_count: downvotes?.length || 0,
        user_vote: existingVote?.vote_type === voteData.vote_type ? null : voteData.vote_type
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error voting on thought:', error);
    return { data: null, error };
  }
};

export const getThoughtVotes = async (thoughtId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get vote counts
    const { data: upvotes } = await supabase
      .from('votes')
      .select('id')
      .eq('thought_id', thoughtId)
      .eq('vote_type', 'upvote');

    const { data: downvotes } = await supabase
      .from('votes')
      .select('id')
      .eq('thought_id', thoughtId)
      .eq('vote_type', 'downvote');

    let userVote = null;
    if (user) {
      const { data: userVoteData } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('thought_id', thoughtId)
        .eq('user_id', user.id)
        .single();
      
      userVote = userVoteData?.vote_type || null;
    }

    return {
      data: {
        upvotes_count: upvotes?.length || 0,
        downvotes_count: downvotes?.length || 0,
        user_vote: userVote
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting thought votes:', error);
    return { data: null, error };
  }
};

// Likes API
export const likeThought = async (likeData: LikeData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('thought_id', likeData.thought_id)
      .single();

    let result;
    let liked = false;
    
    if (existingLike) {
      // Remove like
      result = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('thought_id', likeData.thought_id);
      liked = false;
    } else {
      // Create new like
      result = await supabase
        .from('likes')
        .insert({
          ...likeData,
          user_id: user.id,
        });
      liked = true;
    }

    if (result.error) throw result.error;
    
    // Get updated likes count
    const { data: likesCount } = await supabase
      .from('likes')
      .select('id')
      .eq('thought_id', likeData.thought_id);

    // Update thoughts table with new likes count
    await supabase
      .from('thoughts')
      .update({ likes_count: likesCount?.length || 0 })
      .eq('id', likeData.thought_id);

    return { 
      data: {
        likes_count: likesCount?.length || 0,
        user_has_liked: liked
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error liking thought:', error);
    return { data: null, error };
  }
};

export const getThoughtLikes = async (thoughtId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get likes count
    const { data: likes } = await supabase
      .from('likes')
      .select('id')
      .eq('thought_id', thoughtId);

    let userHasLiked = false;
    if (user) {
      const { data: userLikeData } = await supabase
        .from('likes')
        .select('id')
        .eq('thought_id', thoughtId)
        .eq('user_id', user.id)
        .single();
      
      userHasLiked = !!userLikeData;
    }

    return {
      data: {
        likes_count: likes?.length || 0,
        user_has_liked: userHasLiked
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting thought likes:', error);
    return { data: null, error };
  }
};
