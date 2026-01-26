import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, Clock, Building2, Filter, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const mockJobs = [
  {
    id: 1,
    title: "Construction Worker",
    company: "BuildRight Construction",
    location: "Downtown, Metro City",
    salary: "$18-25/hr",
    type: "Full-time",
    posted: "2 days ago",
    description: "Looking for experienced construction workers for a commercial building project.",
    tags: ["Construction", "Physical Labor", "Experience Required"],
  },
  {
    id: 2,
    title: "Delivery Driver",
    company: "FastTrack Logistics",
    location: "Eastside District",
    salary: "$15-20/hr",
    type: "Part-time",
    posted: "1 day ago",
    description: "Deliver packages within the city. Must have valid driver's license.",
    tags: ["Driving", "Flexible Hours", "License Required"],
  },
  {
    id: 3,
    title: "Restaurant Server",
    company: "The Golden Spoon",
    location: "Central Business District",
    salary: "$12/hr + tips",
    type: "Full-time",
    posted: "3 hours ago",
    description: "Friendly and energetic server needed for busy restaurant.",
    tags: ["Hospitality", "Customer Service", "Tips"],
  },
  {
    id: 4,
    title: "Warehouse Associate",
    company: "MegaStore Distribution",
    location: "Industrial Zone",
    salary: "$16-18/hr",
    type: "Full-time",
    posted: "5 days ago",
    description: "Picking, packing, and shipping orders in fast-paced warehouse.",
    tags: ["Warehouse", "Physical Labor", "Night Shift Available"],
  },
  {
    id: 5,
    title: "House Cleaner",
    company: "Sparkle Clean Services",
    location: "Various Locations",
    salary: "$20-30/hr",
    type: "Contract",
    posted: "1 week ago",
    description: "Professional house cleaning for residential clients.",
    tags: ["Cleaning", "Flexible Schedule", "Transportation Provided"],
  },
  {
    id: 6,
    title: "Security Guard",
    company: "SafeWatch Security",
    location: "Multiple Sites",
    salary: "$14-18/hr",
    type: "Full-time",
    posted: "4 days ago",
    description: "Security personnel needed for various commercial properties.",
    tags: ["Security", "Night Shift", "Training Provided"],
  },
];

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(filtered);
  };

  const handleLogout = () => {
    navigate("/");
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
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome, Worker!</span>
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
          <h1 className="text-3xl font-bold mb-2">Find Your Next Job</h1>
          <p className="text-muted-foreground mb-6">Browse available job openings in your area</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or skills..."
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
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
        </p>

        {/* Job Listings */}
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant={job.type === "Full-time" ? "default" : "secondary"}>
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.posted}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full sm:w-auto">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No jobs found matching your search.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setFilteredJobs(mockJobs); }}>
              Clear search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerDashboard;
