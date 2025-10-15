import { Button } from "@/components/ui/button";
import { Play, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-white mb-6 text-5xl md:text-7xl font-bold leading-tight">
            Free Pentecostal Fellowship Church of Kenya
          </h1>
          
          {/* Tagline */}
          <div className="mb-8">
            <p className="text-accent text-2xl md:text-3xl font-semibold mb-2">
              Hope. Freedom. Community.
            </p>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We gather to worship, heal, and serve. Join us Sundays at 9:00 AM & 11:00 AM — all are welcome.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3">
              <Link to="/services" className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Join Us</span>
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3">
              <Link to="/bible-studies" className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Live</span>
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white border border-white/20 hover:bg-white/20 text-lg px-8 py-3">
              <Link to="/donate" className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Give</span>
              </Link>
            </Button>
          </div>

          {/* Next Service Info */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-white font-heading text-lg font-semibold mb-2">Next Service</h3>
            <p className="text-white/90 text-sm mb-1">Sunday Worship</p>
            <p className="text-accent font-semibold">This Sunday at 9:00 AM</p>
            <p className="text-white/80 text-sm mt-2">Main Sanctuary • Baringo County, Kenya</p>
          </div>
        </div>
      </div>
    </section>
  );
};