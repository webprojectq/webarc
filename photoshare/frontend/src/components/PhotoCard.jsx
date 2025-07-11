import React, { useState } from 'react';  
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';  
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';  
import api from '../services/api';  
import { useAuth } from '../contexts/AuthContext';  

const PhotoCard = ({ photo }) => {  
  const [liked, setLiked] = useState(photo.is_liked);  
  const [likeCount, setLikeCount] = useState(photo.like_count);  
  const [comment, setComment] = useState('');  
  const [showComments, setShowComments] = useState(false);  
  const { user } = useAuth();  

  const handleLike = async () => {  
    try {  
      if (liked) {  
        await api.delete(`/photos/${photo.id}/like/`);  
        setLikeCount(likeCount - 1);  
      } else {  
        await api.post(`/photos/${photo.id}/like/`);  
        setLikeCount(likeCount + 1);  
      }  
      setLiked(!liked);  
    } catch (err) {  
      console.error('Like error:', err);  
    }  
  };  

  return (  
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">  
      {/* Header */}  
      <div className="flex items-center p-4 border-b">  
        <img  
          src={photo.user.profile_pic || '/default-avatar.png'}  
          alt={photo.user.username}  
          className="w-10 h-10 rounded-full mr-3"  
        />  
        <div>  
          <h3 className="font-bold">{photo.user.username}</h3>  
          <p className="text-xs text-gray-500">  
            {new Date(photo.created_at).toLocaleDateString()}  
          </p>  
        </div>  
      </div>  

      {/* Photo */}  
      <img  
        src={photo.image}  
        alt={photo.caption}  
        className="w-full h-auto object-cover"  
      />  

      {/* Actions */}  
      <div className="p-4">  
        <div className="flex space-x-4 mb-2">  
          <button onClick={handleLike} className="focus:outline-none">  
            {liked ? (  
              <HeartSolid className="w-6 h-6 text-red-500" />  
            ) : (  
              <HeartIcon className="w-6 h-6" />  
            )}  
          </button>  
          <button onClick={() => setShowComments(!showComments)}>  
            <ChatBubbleLeftIcon className="w-6 h-6" />  
          </button>  
        </div>  

        {/* Likes */}  
        {likeCount > 0 && (  
          <p className="font-semibold mb-2">{likeCount} likes</p>  
        )}  

        {/* Caption & AI Description */}  
        <p className="mb-1">  
          <span className="font-bold mr-2">{photo.user.username}</span>  
          {photo.caption}  
        </p>
        {photo.ai_description && (  
          <p className="text-gray-500 text-sm mb-4">  
            AI Description: {photo.ai_description}  
          </p>  
        )}  

        {/* Tags */}  
        {photo.tags.length > 0 && (  
          <div className="flex flex-wrap gap-2 mb-4">  
            {photo.tags.map((tag, index) => (  
              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">  
                #{tag}  
              </span>  
            ))}  
          </div>  
        )}  

        {/* Comment Input */}  
        <div className="flex mt-4">  
          <input  
            type="text"  
            value={comment}  
            onChange={(e) => setComment(e.target.value)}  
            placeholder="Add a comment..."  
            className="flex-1 border rounded-l-lg p-2"  
          />  
          <button className="bg-indigo-600 text-white px-4 rounded-r-lg">  
            Post  
          </button>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default PhotoCard;  