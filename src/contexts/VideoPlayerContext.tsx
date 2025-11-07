import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoPlayerContextType {
  isOpen: boolean;
  videoUrl: string;
  videoTitle: string;
  isMinimized: boolean;
  openVideo: (url: string, title: string) => void;
  closeVideo: () => void;
  toggleMinimize: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const openVideo = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeVideo = () => {
    setIsOpen(false);
    setVideoUrl('');
    setVideoTitle('');
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <VideoPlayerContext.Provider
      value={{
        isOpen,
        videoUrl,
        videoTitle,
        isMinimized,
        openVideo,
        closeVideo,
        toggleMinimize,
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
