import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  location: string;
  slug: string;
}

export const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, start_date, location, slug')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      time: date.toLocaleDateString('en-US', { 
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-6">Upcoming Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us for worship, fellowship, and community activities throughout the week.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {events.map((event) => {
              const dateInfo = formatEventDate(event.start_date);
              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{dateInfo.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-accent/10 rounded-lg p-3 text-center min-w-[60px]">
                        <div className="text-xl font-bold text-accent">{dateInfo.day}</div>
                        <div className="text-xs text-accent font-medium">{dateInfo.month}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link to={`/events/${event.slug}`}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for announcements about our next gatherings and activities.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">
                Stay Updated
              </Link>
            </Button>
          </div>
        )}

        {events.length > 0 && (
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/events" className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>View All Events</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};