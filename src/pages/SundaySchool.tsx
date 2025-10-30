import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Users, BookOpen, Heart, Calendar, Star, GraduationCap, Baby } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SundaySchoolClass {
  id: string;
  name: string;
  age_range: string;
  time_start: string;
  time_end: string;
  description: string | null;
  teacher_name: string | null;
  location: string | null;
  curriculum: string | null;
  current_enrollment: number;
  max_capacity: number | null;
}

const SundaySchool = () => {
  const [classes, setClasses] = useState<SundaySchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [visitFormData, setVisitFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    child_name: "",
    child_age: "",
    visit_date: "",
    message: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("sunday_school_classes")
        .select("*")
        .eq("is_active", true)
        .order("time_start", { ascending: true });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("class_visits")
        .insert([{
          ...visitFormData,
          class_id: selectedClassId,
          child_age: visitFormData.child_age ? parseInt(visitFormData.child_age) : null,
        }]);

      if (error) throw error;

      toast.success("Visit request submitted successfully! We'll contact you soon.");
      setVisitDialogOpen(false);
      setVisitFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        child_name: "",
        child_age: "",
        visit_date: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit visit request");
    }
  };

  const getIconForClass = (name: string) => {
    if (name.toLowerCase().includes("lamb") || name.toLowerCase().includes("2-4")) return Baby;
    if (name.toLowerCase().includes("kingdom") || name.toLowerCase().includes("5-8")) return Heart;
    if (name.toLowerCase().includes("disciple") || name.toLowerCase().includes("9-12")) return BookOpen;
    if (name.toLowerCase().includes("youth") || name.toLowerCase().includes("13-17")) return Users;
    if (name.toLowerCase().includes("young adult") || name.toLowerCase().includes("18-30")) return GraduationCap;
    return Star;
  };

  const [teachers, setTeachers] = useState<any[]>([]);
  const [curriculumItems, setCurriculumItems] = useState<any[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [teachersRes, curriculumRes] = await Promise.all([
        supabase.from("sunday_school_teachers").select("*").eq("is_active", true).order("display_order"),
        supabase.from("curriculum_items").select("*").eq("is_active", true).order("display_order")
      ]);

      if (teachersRes.error) throw teachersRes.error;
      if (curriculumRes.error) throw curriculumRes.error;

      setTeachers(teachersRes.data || []);
      setCurriculumItems(curriculumRes.data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const ageGroups = [
    {
      title: "Little Lambs (Ages 2-4)",
      icon: Baby,
      time: "9:15 - 10:00 AM",
      teacher: "Sarah Johnson",
      description: "Introduction to Bible stories through songs, crafts, and simple activities that help little ones learn about God's love.",
      curriculum: "Bible stories, memory verses, worship songs",
      location: "Room 101",
      capacity: 12,
      enrolled: 8
    },
    {
      title: "Kingdom Kids (Ages 5-8)",
      icon: Heart,
      time: "9:15 - 10:00 AM", 
      teacher: "Mike & Lisa Chen",
      description: "Interactive Bible lessons that help children understand God's character and develop a foundation of faith.",
      curriculum: "Old & New Testament stories, basic theology",
      location: "Room 103",
      capacity: 15,
      enrolled: 12
    },
    {
      title: "Young Disciples (Ages 9-12)",
      icon: BookOpen,
      time: "9:15 - 10:00 AM",
      teacher: "David Thompson",
      description: "Deeper Bible study with practical applications for daily life, preparing kids for their teenage years.",
      curriculum: "Character studies, Christian living, service projects", 
      location: "Room 105",
      capacity: 20,
      enrolled: 16
    },
    {
      title: "Youth Connection (Ages 13-17)",
      icon: Users,
      time: "9:15 - 10:00 AM",
      teacher: "Pastor Mark & Jennifer",
      description: "Relevant Bible teaching that addresses real-life challenges teens face while building strong peer relationships.",
      curriculum: "Apologetics, relationships, life skills, mission",
      location: "Youth Center",
      capacity: 25,
      enrolled: 18
    },
    {
      title: "Young Adults (Ages 18-30)",
      icon: GraduationCap,
      time: "9:15 - 10:00 AM",
      teacher: "Rachel Martinez",
      description: "Practical Bible study focused on career, relationships, and building a strong foundation for adult life.",
      curriculum: "Life transitions, spiritual disciplines, community",
      location: "Conference Room",
      capacity: 15,
      enrolled: 10
    },
    {
      title: "Adult Classes (Ages 31+)",
      icon: Star,
      time: "9:15 - 10:00 AM",
      teacher: "Various Teachers",
      description: "Multiple classes exploring different topics: Bible studies, parenting, marriage, and spiritual growth.",
      curriculum: "Rotating topics, book studies, topical series",
      location: "Multiple Rooms",
      capacity: 50,
      enrolled: 35
    }
  ];


  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-accent to-accent/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Sunday School</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Growing in faith together through age-appropriate Bible study, fellowship, and spiritual development for all ages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="#classes">View Classes</Link>
              </Button>
              <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white hover:border-white/60">
                    Visit a Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Visit a Sunday School Class</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleVisitSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          value={visitFormData.first_name}
                          onChange={(e) => setVisitFormData({ ...visitFormData, first_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={visitFormData.last_name}
                          onChange={(e) => setVisitFormData({ ...visitFormData, last_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={visitFormData.email}
                          onChange={(e) => setVisitFormData({ ...visitFormData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={visitFormData.phone}
                          onChange={(e) => setVisitFormData({ ...visitFormData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="class_id">Select Class *</Label>
                      <select
                        id="class_id"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      >
                        <option value="">Choose a class...</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.time_start} - {cls.time_end}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="child_name">Child's Name *</Label>
                        <Input
                          id="child_name"
                          value={visitFormData.child_name}
                          onChange={(e) => setVisitFormData({ ...visitFormData, child_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="child_age">Child's Age</Label>
                        <Input
                          id="child_age"
                          type="number"
                          min="0"
                          max="99"
                          value={visitFormData.child_age}
                          onChange={(e) => setVisitFormData({ ...visitFormData, child_age: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="visit_date">Preferred Visit Date</Label>
                      <Input
                        id="visit_date"
                        type="date"
                        value={visitFormData.visit_date}
                        onChange={(e) => setVisitFormData({ ...visitFormData, visit_date: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        value={visitFormData.message}
                        onChange={(e) => setVisitFormData({ ...visitFormData, message: e.target.value })}
                        placeholder="Any questions or special requests?"
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Visit Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Age Groups */}
        <section id="classes" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Age Groups & Classes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We offer engaging, age-appropriate classes for everyone from toddlers to adults. 
                All classes meet every Sunday morning.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => {
                  const Icon = getIconForClass(classItem.name);
                  const enrollmentPercentage = classItem.max_capacity 
                    ? (classItem.current_enrollment / classItem.max_capacity) * 100 
                    : 0;
                  
                  return (
                    <Card key={classItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className="h-8 w-8 text-accent" />
                          {classItem.max_capacity && (
                            <Badge variant={enrollmentPercentage > 80 ? "destructive" : "secondary"}>
                              {classItem.current_enrollment}/{classItem.max_capacity} enrolled
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{classItem.time_start} - {classItem.time_end}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {classItem.description && (
                          <p className="text-sm text-muted-foreground">
                            {classItem.description}
                          </p>
                        )}
                        
                        <div className="space-y-2 text-xs">
                          {classItem.teacher_name && (
                            <div>
                              <span className="font-medium">Teacher:</span> {classItem.teacher_name}
                            </div>
                          )}
                          {classItem.location && (
                            <div>
                              <span className="font-medium">Location:</span> {classItem.location}
                            </div>
                          )}
                          {classItem.curriculum && (
                            <div>
                              <span className="font-medium">Curriculum:</span> {classItem.curriculum}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedClassId(classItem.id);
                            setVisitDialogOpen(true);
                          }}
                        >
                          {enrollmentPercentage > 90 ? "Request Visit" : "Visit This Class"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Curriculum Overview */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Curriculum Overview</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our year-long curriculum is designed to provide a comprehensive foundation of biblical knowledge and spiritual growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {curriculumItems.map((quarter) => (
                <Card key={quarter.id}>
                  <CardHeader>
                    <CardTitle className="text-accent">{quarter.quarter}</CardTitle>
                    <h3 className="text-lg font-semibold">{quarter.theme}</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{quarter.focus}</p>
                    {quarter.key_verses && quarter.key_verses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Verses:</h4>
                        <div className="space-y-1">
                          {quarter.key_verses.map((verse: string, vIndex: number) => (
                            <Badge key={vIndex} variant="outline" className="text-xs">
                              {verse}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Teacher Bios */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Meet Our Teachers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our dedicated Sunday School teachers are passionate about helping people grow in their faith and knowledge of God's Word.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {teachers.map((teacher) => (
                <Card key={teacher.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Users className="h-8 w-8 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{teacher.name}</h3>
                        <p className="text-accent text-sm font-medium mb-2">{teacher.role}</p>
                        {(teacher.experience || teacher.background) && (
                          <div className="text-xs text-muted-foreground mb-3 space-y-1">
                            {teacher.experience && <p><span className="font-medium">Experience:</span> {teacher.experience}</p>}
                            {teacher.background && <p><span className="font-medium">Background:</span> {teacher.background}</p>}
                          </div>
                        )}
                        {teacher.bio && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {teacher.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Registration */}
        <section id="registration" className="py-20 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-6">Ready to Join?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Registration is simple and free. We'd love to have you join our Sunday School family and grow in faith together.
              </p>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-semibold mb-6">Registration Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-accent" />
                      When
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Every Sunday, 9:15 - 10:00 AM<br/>
                      Year-round classes with summer break
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-accent" />
                      Who
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      All ages welcome<br/>
                      New members can join anytime
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-accent" />
                      What to Bring
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Just yourself! We provide Bibles,<br/>
                      materials, and refreshments
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-accent" />
                      Cost
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Completely free<br/>
                      Optional materials fee: $20/year
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="flex-1">
                    <Link to="/contact">Register Online</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/contact">Ask Questions</Link>
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  You can also register in person on Sunday mornings at the Welcome Center
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SundaySchool;