import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Flag, Edit } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import DeleteButton from '@/components/ui/DeleteButton';

interface PostMenuProps {
  postId: string;
  postUserId?: string;
  currentUserId?: string;
  isProfilePage?: boolean;
  onReport: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit?: (postId: string) => void;
  className?: string;
}

const PostMenu: React.FC<PostMenuProps> = ({
  postId,
  postUserId,
  currentUserId,
  isProfilePage = false,
  onReport,
  onDelete,
  onEdit,
  className = ''
}) => {
  const isOwnPost = currentUserId && postUserId && currentUserId === postUserId;

  const handleReport = () => {
    onReport(postId);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(postId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-muted-foreground hover:text-foreground ${className}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Report option - always available */}
        <DropdownMenuItem onClick={handleReport} className="text-red-600 focus:text-red-600">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </DropdownMenuItem>

        {/* Edit option - only on profile pages and for own posts */}
        {isProfilePage && isOwnPost && onEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </>
        )}

        {/* Delete option - only for own posts */}
        {isOwnPost && (
          <>
            <DropdownMenuSeparator />
            <div className="p-1">
              <DeleteButton
                onDelete={() => onDelete(postId)}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2 text-sm"
                confirmationTitle="Delete this post?"
                confirmationDescription="This action cannot be undone. This will permanently delete your post and remove it from your profile."
                confirmButtonText="Delete Post"
                showIcon={true}
              />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
