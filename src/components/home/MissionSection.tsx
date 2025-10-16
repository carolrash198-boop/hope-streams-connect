import { Heart, Users, BookOpen, Church, HandHeart, Baby } from "lucide-react";

export const MissionSection = () => {
  const values = [
    {
      icon: Church,
      title: "Reaching Out",
      description: "We reach out to souls, plant churches, and make disciples in communities near and far."
    },
    {
      icon: BookOpen,
      title: "Discipleship",
      description: "Through conferences and teaching, we produce Christ-like men and women rooted in God's word."
    },
    {
      icon: HandHeart,
      title: "Holistic Care",
      description: "We touch lives holistically through mercy ministry, feeding programs, and community support."
    }
  ];

  return (
    <section className="py-20 bg-church-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="mb-6">Our Vision</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Knowing Jesus and making Him known through reaching out and making disciples, 
            touching people's lives holistically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-2xl mx-auto">
            <h3 className="mb-4">Ready to Take the Next Step?</h3>
            <p className="text-muted-foreground mb-6">
              Whether you're new to faith or have been walking with God for years, 
              there's a place for you in our church family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/services" 
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium transition-colors"
              >
                Plan Your Visit
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 text-sm font-medium transition-colors"
              >
                Get Connected
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};