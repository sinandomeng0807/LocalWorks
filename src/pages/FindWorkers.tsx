import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Star, Briefcase, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import SignUpModal from "@/components/SignUpModal";
import AuthPromptModal from "@/components/AuthPromptModal";

const FindWorkers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const workers = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      title: "Construction Worker",
      location: "Quezon City",
      experience: "5 years",
      rating: 4.8,
      reviews: 24,
      verified: true,
      availability: "Available",
      skills: ["Construction", "Heavy Machinery", "Blueprint Reading"],
      bio: "Experienced construction worker with expertise in commercial and residential projects.",
    },
    {
      id: 2,
      name: "Pedro Santos",
      title: "Licensed Electrician",
      location: "Makati City",
      experience: "8 years",
      rating: 4.9,
      reviews: 42,
      verified: true,
      availability: "Available",
      skills: ["Electrical Work", "Wiring", "Troubleshooting", "Safety"],
      bio: "Licensed electrician specializing in residential and commercial electrical systems.",
    },
    {
      id: 3,
      name: "Maria Garcia",
      title: "Professional Plumber",
      location: "Pasig City",
      experience: "6 years",
      rating: 4.7,
      reviews: 31,
      verified: true,
      availability: "Busy",
      skills: ["Plumbing", "Pipe Fitting", "Maintenance"],
      bio: "Skilled plumber offering reliable plumbing services for homes and businesses.",
    },
    {
      id: 4,
      name: "Roberto Reyes",
      title: "Master Carpenter",
      location: "Mandaluyong",
      experience: "10 years",
      rating: 5.0,
      reviews: 56,
      verified: true,
      availability: "Available",
      skills: ["Carpentry", "Furniture Making", "Woodworking", "Cabinet Installation"],
      bio: "Master carpenter with a decade of experience in custom furniture and installations.",
    },
    {
      id: 5,
      name: "Antonio Cruz",
      title: "Certified Welder",
      location: "Taguig City",
      experience: "7 years",
      rating: 4.6,
      reviews: 18,
      verified: false,
      availability: "Available",
      skills: ["Welding", "Metal Fabrication", "Steel Work"],
      bio: "Certified welder experienced in industrial and residential welding projects.",
    },
  ];

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !location || worker.location.toLowerCase().includes(location.toLowerCase());
    const matchesSkill = !skill || skill === "all" || worker.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
    return matchesSearch && matchesLocation && matchesSkill;
  });

  const handleHire = () => {
    setAuthPromptOpen(true);
  };

  const handleChooseLogin = () => {
    setAuthPromptOpen(false);
    setLoginOpen(true);
  };

  const handleChooseSignUp = () => {
    setAuthPromptOpen(false);
    setSignUpOpen(true);
  };

  const handleSwitchToSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const handleSwitchToLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Skilled <span className="text-primary">Workers</span>
            </h1>
            <p className="text-muted-foreground">
              Browse talented local workers ready to help with your projects
            </p>
          </div>

          {/* Search Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-lg p-4 border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workers or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={skill} onValueChange={setSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Skill Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Welding">Welding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Worker Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-6">
            Showing {filteredWorkers.length} workers
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {worker.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{worker.name}</CardTitle>
                        {worker.verified && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{worker.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{worker.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({worker.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {worker.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {worker.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {worker.experience}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {worker.skills.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                    {worker.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{worker.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={worker.availability === "Available" ? "default" : "secondary"}
                    >
                      {worker.availability}
                    </Badge>
                    <Button size="sm" onClick={handleHire}>
                      Hire Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWorkers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No workers found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <AuthPromptModal
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        onLogin={handleChooseLogin}
        onSignUp={handleChooseSignUp}
        action="hire"
      />
      <LoginModal 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default FindWorkers;
