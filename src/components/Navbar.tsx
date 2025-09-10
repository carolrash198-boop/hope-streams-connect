import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Sunday School", href: "/sunday-school" },
    { name: "Outreach", href: "/outreach" },
    { name: "Bible Studies", href: "/bible-studies" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <span className="font-heading text-xl font-bold">Deliverance Church</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Donate Button */}
          <div className="hidden md:flex">
            <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/donate" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Give a Gift</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground mt-6">
                  <Link to="/donate" className="flex items-center justify-center space-x-2" onClick={() => setIsOpen(false)}>
                    <Heart className="h-4 w-4" />
                    <span>Give a Gift</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Sticky Donate Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
          <Link to="/donate" className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Give</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
};