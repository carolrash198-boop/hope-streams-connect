import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { X, Maximize2, Minimize2, Square } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const getEmbedUrl = (url: string) => {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  // Facebook
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
  }
  return url;
};

export const VideoPlayerModal = () => {
  const { isOpen, videoUrl, videoTitle, isMinimized, isFloating, closeVideo, toggleMinimize, toggleFloating } = useVideoPlayer();

  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <>
      {/* Backdrop for non-floating mode */}
      {!isFloating && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          onClick={closeVideo}
        />
      )}

      {/* Video Player Container */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300",
          isMinimized
            ? "bottom-4 right-4 w-80 h-48 shadow-2xl"
            : isFloating
            ? "bottom-4 right-4 w-96 h-64 md:w-[500px] md:h-[320px] shadow-2xl"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[85vh] md:w-[90vw] md:h-[80vh] max-w-6xl"
        )}
      >
        {/* Header */}
        <div className="bg-background border border-border rounded-t-lg p-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground truncate flex-1">
            {videoTitle || 'Live Stream'}
          </h3>
          <div className="flex gap-2">
            {!isMinimized && (
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFloating}
                className="h-8 w-8 p-0"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMinimize}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={closeVideo}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black rounded-b-lg overflow-hidden" 
          style={{ 
            height: isMinimized 
              ? 'calc(100% - 48px)' 
              : isFloating 
              ? 'calc(100% - 48px)'
              : 'calc(100% - 48px)' 
          }}
        >
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoTitle || 'Live Stream'}
          />
        </div>
      </div>
    </>
  );
};
