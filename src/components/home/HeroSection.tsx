import { Button } from "@/components/ui/button";
import { Play, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useVideoPlayer } from "@/contexts/VideoPlayerContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeaturedGallerySlideshow } from "./FeaturedGallerySlideshow";
import { HeroAdvertisements } from "./HeroAdvertisements";

interface HeroSettings {
  heading: string;
  tagline: string;
  subtitle: string;
  next_service_title: string;
  service_name: string;
  service_time: string;
  service_location: string;
}

export const HeroSection = () => {
  const { openVideo } = useVideoPlayer();
  const [liveStreamUrl, setLiveStreamUrl] = useState<string>('');
  const [liveStreamTitle, setLiveStreamTitle] = useState<string>('');
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    heading: 'Free Pentecostal Fellowship Church of Kenya',
    tagline: 'Hope. Freedom. Community.',
    subtitle: 'We gather to worship, heal, and serve. Join us Sundays at 9:00 AM & 11:00 AM — all are welcome.',
    next_service_title: 'Next Service',
    service_name: 'Sunday Worship',
    service_time: 'This Sunday at 9:00 AM',
    service_location: 'Main Sanctuary • Baringo County, Kenya',
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch live stream settings
      const { data: liveStream } = await supabase
        .from('live_stream_settings')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      
      if (liveStream) {
        setLiveStreamUrl(liveStream.youtube_url || liveStream.facebook_url || '');
        setLiveStreamTitle(liveStream.service_name || 'Live Stream');
      }

      // Fetch hero settings
      const { data: hero } = await supabase
        .from('hero_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (hero) {
        setHeroSettings({
          heading: hero.heading,
          tagline: hero.tagline,
          subtitle: hero.subtitle,
          next_service_title: hero.next_service_title,
          service_name: hero.service_name,
          service_time: hero.service_time,
          service_location: hero.service_location,
        });
      }
    };
    fetchData();
  }, []);

  const handleWatchLive = () => {
    if (liveStreamUrl) {
      openVideo(liveStreamUrl, liveStreamTitle);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Three Column Layout */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Column 1: Featured Gallery Slideshow */}
          <div className="lg:col-span-3 h-[400px] lg:h-[600px]">
            <FeaturedGallerySlideshow />
          </div>

          {/* Column 2: Hero Content */}
          <div className="lg:col-span-6 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-white mb-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {heroSettings.heading}
              </h1>
              
              {/* Tagline */}
              <div className="mb-8">
                <p className="text-accent text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
                  {heroSettings.tagline}
                </p>
                <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                  {heroSettings.subtitle}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base md:text-lg px-6 md:px-8 py-3">
                  <Link to="/services" className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Join Us</span>
                  </Link>
                </Button>
                
                {liveStreamUrl ? (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60 text-base md:text-lg px-6 md:px-8 py-3"
                    onClick={handleWatchLive}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    <span>Watch Live</span>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60 text-base md:text-lg px-6 md:px-8 py-3">
                    <Link to="/bible-studies" className="flex items-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Watch Live</span>
                    </Link>
                  </Button>
                )}
                
                <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white border border-white/20 hover:bg-white/20 text-base md:text-lg px-6 md:px-8 py-3">
                  <Link to="/donate" className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Give</span>
                  </Link>
                </Button>
              </div>

              {/* Next Service Info */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 md:p-6 max-w-md mx-auto">
                <h3 className="text-white font-heading text-base md:text-lg font-semibold mb-2">{heroSettings.next_service_title}</h3>
                <p className="text-white/90 text-sm mb-1">{heroSettings.service_name}</p>
                <p className="text-accent font-semibold text-sm md:text-base">{heroSettings.service_time}</p>
                <p className="text-white/80 text-xs md:text-sm mt-2">{heroSettings.service_location}</p>
              </div>
            </div>
          </div>

          {/* Column 3: Advertisements */}
          <div className="lg:col-span-3">
            <HeroAdvertisements />
          </div>

        </div>
      </div>
    </section>
  );
};