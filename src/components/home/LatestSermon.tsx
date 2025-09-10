import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Calendar, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  series: string;
  scripture_passages: string[];
  tags: string[];
  slug: string;
}

export const LatestSermon = () => {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestSermon();
  }, []);

  const fetchLatestSermon = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('id, title, preacher, date, series, scripture_passages, tags, slug')
        .eq('is_published', true)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching sermon:', error);
        return;
      }

      setSermon(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-16"></div>
            <div className="max-w-4xl mx-auto">
              <div className="h-64 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sermon) {
    return null;
  }

  const formattedDate = new Date(sermon.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-6">Latest Sermon</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Catch up on our most recent message and dive deeper into God's word.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="relative">
              {/* Sermon Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium">Listen to Sermon</p>
                </div>
              </div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-full w-16 h-16 p-0"
                >
                  <Link to={`/bible-studies/${sermon.slug}`}>
                    <Play className="h-6 w-6 ml-1" />
                    <span className="sr-only">Play sermon</span>
                  </Link>
                </Button>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sermon Details */}
                <div className="lg:col-span-2">
                  {sermon.series && (
                    <div className="text-accent font-medium text-sm mb-2">
                      {sermon.series}
                    </div>
                  )}
                  
                  <h3 className="mb-4">{sermon.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                    {sermon.scripture_passages.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{sermon.scripture_passages[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {sermon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {sermon.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link to={`/bible-studies/${sermon.slug}`}>
                      Listen to Sermon
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/bible-studies">
                      Browse All Sermons
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};