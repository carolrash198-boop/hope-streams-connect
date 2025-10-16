import { Users, Baby, Heart, Utensils, GraduationCap, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const MinistriesSection = () => {
  const ministries = [
    {
      icon: GraduationCap,
      title: "Youth Empowerment",
      description: "Equipping young people with spiritual growth, life skills, and purpose-driven leadership."
    },
    {
      icon: Baby,
      title: "Children's Ministry",
      description: "Nurturing the faith of our youngest members with meals every Sunday and engaging programs."
    },
    {
      icon: UsersRound,
      title: "Couples Conference",
      description: "Strengthening marriages and families through biblical teaching and fellowship."
    },
    {
      icon: Users,
      title: "Women's Ministry",
      description: "Empowering women to grow in faith, support one another, and serve their communities."
    },
    {
      icon: Heart,
      title: "Mercy Ministry",
      description: "Visiting and feeding the poor and needy, demonstrating Christ's compassion in action."
    },
    {
      icon: Utensils,
      title: "Feeding Program",
      description: "Providing nutritious meals to our children every Sunday as part of our holistic care."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="mb-6">Our Ministries</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We serve our community through various ministries designed to reach people at every stage of life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ministries.map((ministry, index) => {
            const Icon = ministry.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{ministry.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {ministry.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
