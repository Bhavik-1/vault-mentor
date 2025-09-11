import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Users, GraduationCap, Lock, Globe, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const features = [
  {
    icon: Shield,
    title: "Zero-Knowledge Security",
    description: "Your passwords are encrypted locally. We never see your data.",
  },
  {
    icon: Key,
    title: "Password Generator",
    description: "Create strong, unique passwords with customizable options.",
  },
  {
    icon: Globe,
    title: "Phishing Protection",
    description: "Check URLs for suspicious domains and potential threats.",
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Learn from peers and share security best practices.",
  },
  {
    icon: GraduationCap,
    title: "Educational Content",
    description: "Interactive lessons and simulations to boost security knowledge.",
  },
  {
    icon: Zap,
    title: "Gamified Learning",
    description: "Earn points and climb leaderboards as you improve security habits.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    content: "SafeStudy made password security actually fun to learn. The gamification kept me engaged!",
    rating: 5,
  },
  {
    name: "Miguel Rodriguez",
    role: "Engineering Student", 
    content: "Finally, a password manager that understands student life. Simple, secure, and educational.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Psychology Student",
    content: "The phishing checker saved me from a scam email. This app is a lifesaver for students!",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SafeStudy</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-gradient-hero hover:opacity-90 text-white shadow-soft">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Secure Passwords,
                  </span>
                  <br />
                  <span className="text-foreground">Smarter Students</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The only password manager built specifically for students. Learn cybersecurity 
                  while keeping your digital life secure with zero-knowledge encryption.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-hero hover:opacity-90 text-white shadow-soft text-lg px-8 py-6">
                    Start Learning & Securing
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Shield className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-success" />
                  <span>Zero-knowledge encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>Student-focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>Community driven</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full"></div>
              <img 
                src={heroImage} 
                alt="SafeStudy Password Manager" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Everything Students Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              SafeStudy combines enterprise-grade security with educational features 
              designed specifically for student life.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Loved by Students</h2>
            <p className="text-xl text-muted-foreground">
              See what students are saying about SafeStudy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-warning fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Join thousands of students who are already learning cybersecurity 
            while keeping their passwords secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Start Free Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SafeStudy</span>
            </div>
            
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SafeStudy. Built with ❤️ for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}