import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Heart, Calendar, Star, GraduationCap, Baby } from "lucide-react";
import { Link } from "react-router-dom";

const SundaySchool = () => {
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

  const teachers = [
    {
      name: "Sarah Johnson",
      role: "Children's Ministry Director",
      experience: "8 years",
      background: "Elementary Education, Child Development",
      bio: "Sarah has been working with children for over a decade and loves helping little ones discover God's love through creative activities and storytelling."
    },
    {
      name: "Mike & Lisa Chen", 
      role: "Elementary Coordinators",
      experience: "5 years",
      background: "Youth Ministry, Elementary Education",
      bio: "This dynamic couple brings energy and creativity to children's ministry, making Bible lessons come alive through interactive teaching methods."
    },
    {
      name: "David Thompson",
      role: "Pre-Teen Ministry Leader", 
      experience: "10 years",
      background: "Youth Pastor, Biblical Studies",
      bio: "David specializes in helping pre-teens navigate the transition to teenage years while building a strong foundation of faith and character."
    },
    {
      name: "Pastor Mark & Jennifer",
      role: "Youth Pastors",
      experience: "12 years", 
      background: "Youth Ministry, Family Counseling",
      bio: "Mark and Jennifer are passionate about helping teenagers discover their identity in Christ and prepare for their future calling."
    }
  ];

  const curriculumOverview = [
    {
      quarter: "Winter (Jan-Mar)",
      theme: "Foundations of Faith",
      focus: "Core beliefs, prayer, Bible study habits",
      keyVerses: ["John 3:16", "Romans 3:23", "Ephesians 2:8-9"]
    },
    {
      quarter: "Spring (Apr-Jun)", 
      theme: "Living Like Jesus",
      focus: "Character development, fruit of the Spirit, service",
      keyVerses: ["Galatians 5:22-23", "1 John 4:19", "Matthew 22:37-39"]
    },
    {
      quarter: "Summer (Jul-Sep)",
      theme: "Bible Heroes & Adventures", 
      focus: "Old Testament stories, courage, obedience",
      keyVerses: ["Joshua 1:9", "Proverbs 3:5-6", "Jeremiah 29:11"]
    },
    {
      quarter: "Fall (Oct-Dec)",
      theme: "God's Great Plan",
      focus: "Jesus' birth, salvation story, sharing faith",
      keyVerses: ["Luke 2:11", "Romans 10:9", "Matthew 28:19-20"]
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
                <Link to="#registration">Register Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-accent">
                <Link to="/contact">Visit a Class</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Age Groups */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-6">Age Groups & Classes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We offer engaging, age-appropriate classes for everyone from toddlers to adults. 
                All classes meet from 9:15-10:00 AM every Sunday.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ageGroups.map((group, index) => {
                const Icon = group.icon;
                const enrollmentPercentage = (group.enrolled / group.capacity) * 100;
                
                return (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-8 w-8 text-accent" />
                        <Badge variant={enrollmentPercentage > 80 ? "destructive" : "secondary"}>
                          {group.enrolled}/{group.capacity} enrolled
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{group.time}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium">Teacher:</span> {group.teacher}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {group.location}
                        </div>
                        <div>
                          <span className="font-medium">Curriculum:</span> {group.curriculum}
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="#registration">
                          {enrollmentPercentage > 90 ? "Join Waitlist" : "Register"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
              {curriculumOverview.map((quarter, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-accent">{quarter.quarter}</CardTitle>
                    <h3 className="text-lg font-semibold">{quarter.theme}</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{quarter.focus}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Verses:</h4>
                      <div className="space-y-1">
                        {quarter.keyVerses.map((verse, vIndex) => (
                          <Badge key={vIndex} variant="outline" className="text-xs">
                            {verse}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
              {teachers.map((teacher, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Users className="h-8 w-8 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{teacher.name}</h3>
                        <p className="text-accent text-sm font-medium mb-2">{teacher.role}</p>
                        <div className="text-xs text-muted-foreground mb-3 space-y-1">
                          <p><span className="font-medium">Experience:</span> {teacher.experience}</p>
                          <p><span className="font-medium">Background:</span> {teacher.background}</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {teacher.bio}
                        </p>
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