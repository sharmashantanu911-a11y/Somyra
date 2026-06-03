import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, X, Globe, ThumbsUp, MessageSquare, Repeat, Send, User, Check, Copy } from 'lucide-react';

interface LinkedInPreviewProps {
  content: string;
  user: any;
}

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({ content, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const engagementCount = useMemo(() => {
    const counts = [47, 83, 124, 167, 203, 289, 341];
    return counts[Math.floor(Math.random() * counts.length)];
  }, []);

  const userName = useMemo(() => {
    if (!user?.email) return 'User';
    const username = user.email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }, [user]);

  const profilePic = user?.user_metadata?.avatar_url;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Character count logic
  const charCount = content.length;
  const charCountColor = charCount < 1300 ? 'text-emerald-400' : charCount <= 2000 ? 'text-orange-400' : 'text-red-400';
  const charCountNote = charCount > 3000 ? 'Too long for optimal reach' : '';

  // Read time estimation (avg 200-250 wpm)
  const wordCount = content.trim().split(/\s+/).length;
  const readTimeSeconds = Math.max(1, Math.round((wordCount / 225) * 60));

  // Hashtag analyzer
  const hashtags = content.match(/#[a-z0-9_]+/gi) || [];

  // Format content with colored hashtags
  const formatContent = (text: string) => {
    const parts = text.split(/(#[a-z0-9_]+)/gi);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return <span key={i} className="text-[#0A66C2]">{part}</span>;
      }
      return part;
    });
  };

  // See more logic
  const lines = content.split('\n');
  const shouldShowSeeMore = lines.length > 3 && !isExpanded;
  const displayedContent = isExpanded ? content : lines.slice(0, 3).join('\n');

  return (
    <div className="w-full bg-[#F3F2EF] rounded-xl p-4 md:p-6 mt-6 overflow-hidden">
      <div className="max-w-[552px] mx-auto space-y-4">
        {/* Mock LinkedIn Card */}
        <div className="bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)] overflow-hidden font-sans text-left">
          {/* Profile Row */}
          <div className="p-3 md:px-4 md:pt-3 flex items-start gap-2 relative">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#E9E9E9] flex items-center justify-center">
              {profilePic ? (
                <img src={profilePic} alt={userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#000000E6] truncate">{userName}</h4>
              <p className="type-caption text-[#00000099] truncate">Your LinkedIn Headline</p>
              <div className="flex items-center gap-1 type-caption text-[#00000099]">
                <span>1st degree</span>
                <span>•</span>
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#00000099]">
              <MoreHorizontal className="w-5 h-5 cursor-pointer" />
              <X className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-2 mt-2">
            <motion.div 
              layout
              className="text-sm text-[#000000E6] leading-[1.42857] whitespace-pre-wrap"
            >
              {formatContent(displayedContent)}
              {shouldShowSeeMore && (
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-[#0000008C] hover:text-[#0A66C2] hover:underline ml-1 font-semibold"
                >
                  ...see more
                </button>
              )}
            </motion.div>
          </div>

          {/* Reactions Row */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-[#0000001A]">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center border border-white">
                  <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <div className="w-4 h-4 rounded-full bg-[#DF704D] flex items-center justify-center border border-white">
                  <span className="text-[8px]">❤️</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#70B5F9] flex items-center justify-center border border-white">
                  <span className="text-[8px]">💡</span>
                </div>
              </div>
              <span className="type-caption text-[#00000099]">{engagementCount}</span>
            </div>
            <div className="type-caption text-[#00000099]">
              12 comments • 8 reposts
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="px-2 py-1 flex justify-around">
            <button className="flex items-center gap-1 p-3 rounded hover:bg-black/5 text-[#00000099] font-semibold text-sm transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span className="hidden md:inline">Like</span>
            </button>
            <button className="flex items-center gap-1 p-3 rounded hover:bg-black/5 text-[#00000099] font-semibold text-sm transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="hidden md:inline">Comment</span>
            </button>
            <button className="flex items-center gap-1 p-3 rounded hover:bg-black/5 text-[#00000099] font-semibold text-sm transition-colors">
              <Repeat className="w-5 h-5" />
              <span className="hidden md:inline">Repost</span>
            </button>
            <button className="flex items-center gap-1 p-3 rounded hover:bg-black/5 text-[#00000099] font-semibold text-sm transition-colors">
              <Send className="w-5 h-5" />
              <span className="hidden md:inline">Send</span>
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#00000099]">
            <span>Character count: <span className={charCountColor}>{charCount}</span></span>
            {charCountNote && <span className="text-red-400 font-bold">• {charCountNote}</span>}
          </div>
          <div className="text-xs font-medium text-[#00000099]">
            Estimated read time: {readTimeSeconds} sec read
          </div>
        </div>

        {/* Hashtag Analyzer */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#00000099] uppercase tracking-wider">Hashtags detected:</span>
            {hashtags.length > 0 ? (
              hashtags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-teal-accent/10 border border-teal-accent/20 rounded-md type-overline font-bold text-teal-accent">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#00000099] italic">Consider adding 1 to 3 relevant hashtags for better reach</span>
            )}
          </div>
          {hashtags.length > 5 && (
            <div className="type-overline text-orange-500 font-bold">
              ⚠️ Too many hashtags can reduce reach. Keep it under 3
            </div>
          )}
        </div>

        {/* Footer & Copy Button */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <p className="type-overline text-[#00000099] italic">
            This is a preview only. Copy your post and paste it on LinkedIn to publish.
          </p>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 px-6 py-2 bg-teal-accent text-black text-xs font-bold rounded-lg hover:bg-teal-accent/80 transition-all shadow-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Post'}
          </button>
        </div>
      </div>
    </div>
  );
};
