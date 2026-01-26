import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, Briefcase, Filter, LogOut, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockWorkers = [
  {
    id: 1,
    name: "John Martinez",
    title: "Construction Worker",
    location: "Downtown, Metro City",
    experience: "5 years",
    rating: 4.8,
    skills: ["Carpentry", "Masonry", "Electrical"],
    availability: "Immediate",
    hourlyRate: "$22/hr",
    avatar: "",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Professional Cleaner",
    location: "Eastside District",
    experience: "3 years",
    rating: 4.9,
    skills: ["Residential Cleaning", "Commercial Cleaning", "Deep Cleaning"],
    availability: "Within 1 week",
    hourlyRate: "$25/hr",
    avatar: "",
  },
  {
    id: 3,
    name: "Michael Johnson",
    title: "Delivery Driver",
    location: "Central Business District",
    experience: "4 years",
    rating: 4.7,
    skills: ["Local Delivery", "Long Distance", "Fragile Items"],
    availability: "Immediate",
    hourlyRate: "$18/hr",
    avatar: "",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Restaurant Staff",
    location: "Various Locations",
    experience: "6 years",
    rating: 5.0,
    skills: ["Serving", "Bartending", "Event Catering"],
    availability: "Within 2 weeks",
    hourlyRate: "$15/hr + tips",
    avatar: "",
  },
  {
    id: 5,
    name: "David Kim",
    title: "Warehouse Associate",
    location: "Industrial Zone",
    experience: "2 years",
    rating: 4.6,
    skills: ["Forklift Operation", "Inventory Management", "Shipping"],
    availability: "Immediate",
    hourlyRate: "$17/hr",
    avatar: "",
  },
  {
    id: 6,
    name: "Lisa Thompson",
    title: "Security Guard",
    location: "Multiple Sites",
    experience: "8 years",
    rating: 4.9,
    skills: ["Armed Security", "Surveillance", "First Aid"],
    availability: "Within 1 week",
    hourlyRate: "$20/hr",
    avatar: "",
  },
];

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState(mockWorkers);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockWorkers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredWorkers(filtered);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-foreground">LocalWorks</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome, Employer!</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Workers</h1>
          <p className="text-muted-foreground mb-6">Browse available workers ready to join your team</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, job title, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </form>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? "s" : ""}
        </p>

        {/* Worker Listings */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(worker.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{worker.name}</CardTitle>
                    <CardDescription className="text-base">{worker.title}</CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{worker.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {worker.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {worker.experience} experience
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{worker.availability}</Badge>
                    <span className="font-semibold text-primary">{worker.hourlyRate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-4 mb-4">
                  {worker.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" size="sm">
                    <Mail className="w-4 h-4" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No workers found matching your search.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setFilteredWorkers(mockWorkers); }}>
              Clear search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployerDashboard;
