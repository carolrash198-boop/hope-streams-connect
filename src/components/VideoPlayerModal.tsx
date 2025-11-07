import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';

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
  const { isOpen, videoUrl, videoTitle, isMinimized, closeVideo, toggleMinimize } = useVideoPlayer();

  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <>
      {/* Backdrop for fullscreen mode */}
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          onClick={closeVideo}
        />
      )}

      {/* Video Player Container */}
      <Draggable
        handle=".drag-handle"
        disabled={!isMinimized}
        bounds="parent"
      >
        <div
          className={cn(
            "fixed z-50",
            isMinimized
              ? "cursor-move"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
          style={isMinimized ? { bottom: '20px', right: '20px' } : {}}
        >
          <Resizable
            defaultSize={{
              width: isMinimized ? 400 : 900,
              height: isMinimized ? 250 : 550,
            }}
            minWidth={320}
            minHeight={200}
            maxWidth={isMinimized ? 600 : 1400}
            maxHeight={isMinimized ? 400 : 900}
            enable={isMinimized ? {
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            } : false}
            className={cn(
              "bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col",
            )}
          >
            {/* Header */}
            <div className={cn(
              "bg-background border-b border-border p-3 flex items-center justify-between",
              isMinimized && "drag-handle cursor-move"
            )}>
              <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                {videoTitle || 'Live Stream'}
              </h3>
              <div className="flex gap-2">
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
            <div className="relative bg-black flex-1">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoTitle || 'Live Stream'}
              />
            </div>
          </Resizable>
        </div>
      </Draggable>
    </>
  );
};
