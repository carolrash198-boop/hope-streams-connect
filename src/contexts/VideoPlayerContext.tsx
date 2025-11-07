import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoPlayerContextType {
  isOpen: boolean;
  videoUrl: string;
  videoTitle: string;
  isMinimized: boolean;
  isFloating: boolean;
  openVideo: (url: string, title: string) => void;
  closeVideo: () => void;
  toggleMinimize: () => void;
  toggleFloating: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  const openVideo = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setIsOpen(true);
    setIsMinimized(false);
    setIsFloating(false);
  };

  const closeVideo = () => {
    setIsOpen(false);
    setVideoUrl('');
    setVideoTitle('');
    setIsMinimized(false);
    setIsFloating(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setIsFloating(true);
    }
  };

  const toggleFloating = () => {
    setIsFloating(!isFloating);
    if (isFloating) {
      setIsMinimized(false);
    }
  };

  return (
    <VideoPlayerContext.Provider
      value={{
        isOpen,
        videoUrl,
        videoTitle,
        isMinimized,
        isFloating,
        openVideo,
        closeVideo,
        toggleMinimize,
        toggleFloating,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
};
