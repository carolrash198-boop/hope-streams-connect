import { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import Draggable from 'react-draggable';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SermonPlayerProps {
  videoUrl: string | null;
  audioUrl: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SermonPlayer = ({ videoUrl, audioUrl, title, isOpen, onClose }: SermonPlayerProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({
    width: Math.min(640, window.innerWidth * 0.9),
    height: Math.min(480, window.innerHeight * 0.7),
  });

  const mediaUrl = videoUrl || audioUrl;
  const isVideo = !!videoUrl;

  useEffect(() => {
    const handleResize = () => {
      if (!isMaximized) {
        setSize({
          width: Math.min(640, window.innerWidth * 0.9),
          height: Math.min(480, window.innerHeight * 0.7),
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  if (!isOpen || !mediaUrl) return null;

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const playerContent = (
    <Card className="overflow-hidden shadow-2xl border-2">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between cursor-move">
        <h3 className="font-semibold text-sm md:text-base truncate flex-1">{title}</h3>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={toggleMaximize}
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Player */}
      <div className="bg-black flex items-center justify-center" style={{ height: isMaximized ? 'calc(100% - 52px)' : size.height - 52 }}>
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="w-full h-full"
            style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <audio src={mediaUrl} controls autoPlay className="w-full max-w-md" />
          </div>
        )}
      </div>
    </Card>
  );

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full h-full max-w-7xl max-h-[90vh]">
          {playerContent}
        </div>
      </div>
    );
  }

  return (
    <Draggable handle=".cursor-move" bounds="parent">
      <div className="fixed z-50" style={{ 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
      }}>
        <Resizable
          size={{ width: size.width, height: size.height }}
          onResizeStop={(e, direction, ref, d) => {
            setSize({
              width: size.width + d.width,
              height: size.height + d.height,
            });
          }}
          minWidth={320}
          minHeight={240}
          maxWidth={window.innerWidth * 0.95}
          maxHeight={window.innerHeight * 0.95}
          enable={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
        >
          {playerContent}
        </Resizable>
      </div>
    </Draggable>
  );
};
