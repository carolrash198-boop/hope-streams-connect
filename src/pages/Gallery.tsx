import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, Calendar, Camera, Filter, Grid, List, Heart, Users, BookOpen, Music } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  album: string | null;
  photographer: string | null;
  event_date: string | null;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAlbum, setFilterAlbum] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const [allAlbums, setAllAlbums] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Sample data since we don't have real images
  const sampleGallery: GalleryItem[] = [
    {
      id: '1',
      title: 'Easter Sunday Celebration 2024',
      description: 'Our joyful Easter service with the full congregation celebrating Christ\'s resurrection.',
      image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop',
      album: 'Easter 2024',
      photographer: 'Sarah Johnson',
      event_date: '2024-03-31',
      tags: ['worship', 'celebration', 'easter'],
      is_featured: true,
      created_at: '2024-04-01'
    },
    {
      id: '2', 
      title: 'Community Food Bank Service',
      description: 'Volunteers serving meals to families in need at our monthly food bank.',
      image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      album: 'Outreach',
      photographer: 'Mike Chen',
      event_date: '2024-03-15',
      tags: ['outreach', 'service', 'community'],
      is_featured: true,
      created_at: '2024-03-16'
    },
    {
      id: '3',
      title: 'Youth Group Mission Trip',
      description: 'Our youth team building homes in Guatemala during summer mission trip.',
      image_url: 'https://images.unsplash.com/photo-1559113202-03e4ba05de68?w=800&h=600&fit=crop',
      album: 'Missions',
      photographer: 'Pastor Mark',
      event_date: '2024-07-20',
      tags: ['youth', 'missions', 'service'],
      is_featured: false,
      created_at: '2024-07-25'
    },
    {
      id: '4',
      title: 'Christmas Choir Performance',
      description: 'Our amazing choir performing traditional Christmas carols during the Christmas Eve service.',
      image_url: 'https://images.unsplash.com/photo-1482575832494-771f74bf6c9e?w=800&h=600&fit=crop',
      album: 'Christmas 2023',
      photographer: 'Lisa Martinez',
      event_date: '2023-12-24',
      tags: ['worship', 'music', 'christmas'],
      is_featured: true,
      created_at: '2023-12-25'
    },
    {
      id: '5',
      title: 'Sunday School Kids Activity',
      description: 'Children learning about Noah\'s Ark through creative crafts and storytelling.',
      image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
      album: 'Sunday School',
      photographer: 'Rachel Davis',
      event_date: '2024-02-10',
      tags: ['children', 'education', 'sunday-school'],
      is_featured: false,
      created_at: '2024-02-11'
    },
    {
      id: '6',
      title: 'Men\'s Prayer Breakfast',
      description: 'Monthly men\'s fellowship gathering for prayer, discussion, and breakfast.',
      image_url: 'https://images.unsplash.com/photo-1556909114-c5d3b1a9b1ad?w=800&h=600&fit=crop',
      album: 'Fellowship',
      photographer: 'David Thompson',
      event_date: '2024-01-20',
      tags: ['fellowship', 'prayer', 'men'],
      is_featured: false,
      created_at: '2024-01-21'
    },
    {
      id: '7',
      title: 'Baptism Sunday',
      description: 'Eight new believers being baptized in our beautiful baptismal pool.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      album: 'Baptisms',
      photographer: 'Jennifer Lee',
      event_date: '2024-05-12',
      tags: ['baptism', 'celebration', 'faith'],
      is_featured: true,
      created_at: '2024-05-13'
    },
    {
      id: '8',
      title: 'Senior Adult Ministry Outing',
      description: 'Our senior adults enjoying a day trip to the botanical gardens.',
      image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
      album: 'Senior Ministry',
      photographer: 'Carol White',
      event_date: '2024-04-08',
      tags: ['seniors', 'fellowship', 'outreach'],
      is_featured: false,
      created_at: '2024-04-09'
    }
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery:", error);
      // Fallback to sample data on error
      setGalleryItems(sampleGallery);
    } else if (data && data.length > 0) {
      setGalleryItems(data as GalleryItem[]);
    } else {
      // Use sample data if database is empty
      setGalleryItems(sampleGallery);
    }

    // Extract unique values for filters
    const items = data && data.length > 0 ? data : sampleGallery;
    const albums = [...new Set(items.map(item => item.album).filter(Boolean) as string[])];
    const tags = [...new Set(items.flatMap(item => item.tags || []))];
    
    setAllAlbums(albums);
    setAllTags(tags);
    setLoading(false);
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAlbum = filterAlbum === "all" || item.album === filterAlbum;
    const matchesTag = filterTag === "all" || (item.tags && item.tags.includes(filterTag));

    return matchesSearch && matchesAlbum && matchesTag;
  });

  const featuredItems = galleryItems.filter(item => item.is_featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'worship':
      case 'music':
        return Music;
      case 'outreach':
      case 'service':
        return Heart;
      case 'fellowship':
        return Users;
      case 'education':
      case 'sunday-school':
        return BookOpen;
      default:
        return Camera;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-church-green to-church-green/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Photo Gallery</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Celebrating God's faithfulness through captured moments of worship, fellowship, 
              service, and community life at Free Pentecostal Fellowship Church of Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="#featured">View Featured</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60">
                <a href="#all-photos">Browse All Photos</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Photos */}
        <section id="featured" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Featured Photos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Highlights from our recent events, worship services, and community activities.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedImage(item)}>
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                      <Badge className="absolute top-3 left-3">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      {item.album && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {item.album}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search photos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Album Filter */}
                <Select value={filterAlbum} onValueChange={setFilterAlbum}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Albums" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Albums</SelectItem>
                    {allAlbums.map(album => (
                      <SelectItem key={album} value={album}>{album}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Tag Filter */}
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredItems.length} photo{filteredItems.length !== 1 ? 's' : ''} found
                </p>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Photos */}
        <section id="all-photos" className="pb-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className={`bg-muted rounded-xl ${viewMode === 'grid' ? 'aspect-video' : 'h-32'}`}></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Photos Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterAlbum("all");
                    setFilterTag("all");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredItems.map((item) => (
                  <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}
                        onClick={() => setSelectedImage(item)}>
                    <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'aspect-video' : 'w-32 h-32 shrink-0'}`}>
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                      {item.is_featured && viewMode === 'grid' && (
                        <Badge className="absolute top-2 left-2 text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                        {item.is_featured && viewMode === 'list' && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          {item.album && (
                            <Badge variant="outline" className="text-xs">
                              {item.album}
                            </Badge>
                          )}
                          {item.event_date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(item.event_date)}</span>
                            </div>
                          )}
                        </div>
                        
                        {item.photographer && (
                          <div className="flex items-center space-x-1">
                            <Camera className="h-3 w-3" />
                            <span>{item.photographer}</span>
                          </div>
                        )}
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.slice(0, 3).map((tag, index) => {
                            const IconComponent = getTagIcon(tag);
                            return (
                              <Badge key={index} variant="secondary" className="text-xs flex items-center space-x-1">
                                <IconComponent className="h-3 w-3" />
                                <span>{tag}</span>
                              </Badge>
                            );
                          })}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Image Modal/Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
               onClick={() => setSelectedImage(null)}>
            <div className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
                 onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  {selectedImage.album && (
                    <div>
                      <span className="font-medium">Album:</span> {selectedImage.album}
                    </div>
                  )}
                  {selectedImage.photographer && (
                    <div>
                      <span className="font-medium">Photographer:</span> {selectedImage.photographer}
                    </div>
                  )}
                  {selectedImage.event_date && (
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(selectedImage.event_date)}
                    </div>
                  )}
                </div>

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedImage.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedImage(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gallery;