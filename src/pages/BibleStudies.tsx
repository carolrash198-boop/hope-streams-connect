import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Play, Download, Calendar, User, BookOpen, Search, Filter, Clock, Tag, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  series: string | null;
  scripture_passages: string[];
  tags: string[];
  format: 'audio' | 'video' | 'both';
  duration_minutes: number | null;
  download_count: number;
  slug: string;
  show_notes: string | null;
}

const BibleStudies = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeries, setFilterSeries] = useState("all");
  const [filterPreacher, setFilterPreacher] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const [allSeries, setAllSeries] = useState<string[]>([]);
  const [allPreachers, setAllPreachers] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching sermons:', error);
        return;
      }

      setSermons(data || []);
      
      // Extract unique values for filters
      const series = [...new Set(data?.map(s => s.series).filter(Boolean) as string[])];
      const preachers = [...new Set(data?.map(s => s.preacher) || [])];
      const tags = [...new Set(data?.flatMap(s => s.tags) || [])];
      
      setAllSeries(series);
      setAllPreachers(preachers);
      setAllTags(tags);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedSermons = sermons
    .filter(sermon => {
      const matchesSearch = searchTerm === "" || 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.scripture_passages.some(passage => 
          passage.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesSeries = filterSeries === "all" || sermon.series === filterSeries;
      const matchesPreacher = filterPreacher === "all" || sermon.preacher === filterPreacher;
      const matchesTag = filterTag === "all" || sermon.tags.includes(filterTag);

      return matchesSearch && matchesSeries && matchesPreacher && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "popular":
          return b.download_count - a.download_count;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Bible Studies & Sermons</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Dive deeper into God's Word with our collection of sermons, Bible studies, 
              and devotional resources designed to strengthen your faith.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="#latest">Browse Sermons</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60">
                <a href="#live" target="_blank">Watch Live</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sermons, topics, scripture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Series Filter */}
                <Select value={filterSeries} onValueChange={setFilterSeries}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    {allSeries.map(series => (
                      <SelectItem key={series} value={series}>{series}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Preacher Filter */}
                <Select value={filterPreacher} onValueChange={setFilterPreacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Preachers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Preachers</SelectItem>
                    {allPreachers.map(preacher => (
                      <SelectItem key={preacher} value={preacher}>{preacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Tag Filter */}
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-muted-foreground">
                Found {filteredAndSortedSermons.length} sermon{filteredAndSortedSermons.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </section>

        {/* Sermons Grid */}
        <section id="latest" className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-xl"></div>
                    <div className="p-6 bg-white rounded-b-xl border border-t-0">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedSermons.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Sermons Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSeries("all");
                    setFilterPreacher("all");
                    setFilterTag("all");
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedSermons.map((sermon) => (
                  <Card key={sermon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Sermon Image/Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {sermon.format === 'both' ? 'Audio & Video' : 
                           sermon.format === 'video' ? 'Video' : 'Audio'}
                        </Badge>
                      </div>
                      {sermon.duration_minutes && (
                        <Badge className="absolute bottom-2 right-2 text-xs">
                          {formatDuration(sermon.duration_minutes)}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      {/* Series Badge */}
                      {sermon.series && (
                        <Badge variant="outline" className="text-xs mb-3">
                          {sermon.series}
                        </Badge>
                      )}

                      {/* Title */}
                      <h3 className="font-semibold mb-3 line-clamp-2">
                        {sermon.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{sermon.preacher}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(sermon.date)}</span>
                        </div>
                        {sermon.scripture_passages.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="line-clamp-1">
                              {sermon.scripture_passages.join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>{sermon.download_count} downloads</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {sermon.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {sermon.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {sermon.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{sermon.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link to={`/bible-studies/${sermon.slug}`}>
                            <Play className="h-4 w-4 mr-2" />
                            Listen
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Live Streaming Section */}
        <section id="live" className="py-20 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="mb-6">Join Us Live</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Can't make it to church in person? Join our live stream every Sunday morning 
                and be part of our worship experience from anywhere.
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-accent" />
                      Service Times
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Morning Service:</span> 9:00 AM</p>
                      <p><span className="font-medium">Contemporary Service:</span> 11:00 AM</p>
                      <p><span className="font-medium">Wednesday Bible Study:</span> 7:00 PM</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-accent" />
                      How to Watch
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• YouTube Live Stream</p>
                      <p>• Facebook Live</p>
                      <p>• Church Website</p>
                      <p>• Mobile App</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                      Watch on YouTube
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      Watch on Facebook
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BibleStudies;