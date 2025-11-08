import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
}

export const FeaturedGallerySlideshow = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    fetchFeaturedImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const fetchFeaturedImages = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching featured images:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl animate-pulse" />
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <p className="text-white/60 text-center px-4">No featured images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <div className="w-full h-full overflow-hidden rounded-2xl">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg animate-fade-in">{image.title}</h3>
              {image.description && (
                <p className="text-white/80 text-sm mt-1 animate-fade-in">{image.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-6" : "bg-white/50 w-2"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
