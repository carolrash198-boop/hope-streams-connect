import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  type: string;
}

export const HeroAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(3);

      if (error) throw error;
      setAdvertisements(data || []);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (advertisements.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
        <p className="text-white/60">No advertisements available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {advertisements.map((ad) => (
        <div
          key={ad.id}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all"
        >
          <div className="relative h-40">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            {ad.type && (
              <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                {ad.type}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg mb-1">{ad.title}</h3>
            {ad.description && (
              <p className="text-white/80 text-sm mb-3 line-clamp-2">{ad.description}</p>
            )}
            {ad.link_url && (
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="w-full bg-white/20 text-white hover:bg-white/30"
              >
                <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
