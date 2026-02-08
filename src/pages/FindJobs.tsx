import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, MapPin, Briefcase, Clock, Building2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import SignUpModal from "@/components/SignUpModal";
import AuthPromptModal from "@/components/AuthPromptModal";

const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const jobs = [
    {
      id: 1,
      title: "Construction Worker",
      company: "BuildRight Construction",
      location: "Quezon City",
      type: "Full-time",
      salary: "₱18,000 - ₱25,000/mo",
      posted: "2 days ago",
      description: "Looking for experienced construction workers for a commercial building project.",
      skills: ["Construction", "Heavy Lifting", "Teamwork"],
    },
    {
      id: 2,
      title: "Electrician",
      company: "PowerFlow Electric",
      location: "Makati City",
      type: "Contract",
      salary: "₱800 - ₱1,200/day",
      posted: "1 day ago",
      description: "Need licensed electricians for residential wiring projects.",
      skills: ["Electrical Work", "Wiring", "Safety Compliance"],
    },
    {
      id: 3,
      title: "Plumber",
      company: "AquaFix Services",
      location: "Pasig City",
      type: "Part-time",
      salary: "₱600 - ₱900/day",
      posted: "3 days ago",
      description: "Seeking skilled plumbers for maintenance and repair work.",
      skills: ["Plumbing", "Pipe Fitting", "Problem Solving"],
    },
    {
      id: 4,
      title: "Carpenter",
      company: "WoodCraft PH",
      location: "Mandaluyong",
      type: "Full-time",
      salary: "₱20,000 - ₱28,000/mo",
      posted: "5 days ago",
      description: "Experienced carpenter needed for furniture and fixture installation.",
      skills: ["Carpentry", "Woodworking", "Blueprint Reading"],
    },
    {
      id: 5,
      title: "Welder",
      company: "MetalWorks Inc.",
      location: "Taguig City",
      type: "Contract",
      salary: "₱900 - ₱1,500/day",
      posted: "1 week ago",
      description: "Certified welders needed for industrial fabrication projects.",
      skills: ["Welding", "Metal Fabrication", "Safety"],
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = !jobType || jobType === "all" || job.type === jobType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleApplyClick = (jobId: number) => {
    if (!isLoggedIn) {
      setSelectedJobId(jobId);
      setAuthPromptOpen(true);
    } else {
      setSelectedJobId(jobId);
      setConfirmApplyOpen(true);
    }
  };

  const handleConfirmApply = () => {
    if (selectedJobId) {
      setAppliedJobs([...appliedJobs, selectedJobId]);
      const job = jobs.find(j => j.id === selectedJobId);
      toast.success(`Application submitted for ${job?.title}!`, {
        description: `Your application to ${job?.company} has been sent.`,
      });
    }
    setConfirmApplyOpen(false);
    setSelectedJobId(null);
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLoginOpen(false);
    toast.success("Logged in successfully!");
    // If there was a pending job application, show confirmation
    if (selectedJobId) {
      setConfirmApplyOpen(true);
    }
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    setSignUpOpen(false);
    toast.success("Account created successfully!");
    // If there was a pending job application, show confirmation
    if (selectedJobId) {
      setConfirmApplyOpen(true);
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Next <span className="text-primary">Opportunity</span>
            </h1>
            <p className="text-muted-foreground">
              Browse available jobs from local employers in your area
            </p>
          </div>

          {/* Search Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-lg p-4 border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs or skills..."
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
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-6">
            Showing {filteredJobs.length} jobs
          </p>

          <div className="grid gap-4">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);
              return (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      {isApplied ? (
                        <Button variant="outline" disabled className="gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Applied
                        </Button>
                      ) : (
                        <Button onClick={() => handleApplyClick(job.id)}>Apply Now</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <span className="font-semibold text-primary">{job.salary}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Confirm Apply Dialog */}
      <AlertDialog open={confirmApplyOpen} onOpenChange={setConfirmApplyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to apply for <strong>{selectedJob?.title}</strong> at <strong>{selectedJob?.company}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApply}>Submit Application</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auth Modals */}
      <AuthPromptModal
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        onLogin={handleChooseLogin}
        onSignUp={handleChooseSignUp}
        action="apply"
      />
      <LoginModal 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
        onSwitchToSignUp={handleSwitchToSignUp}
        onSuccess={handleLoginSuccess}
      />
      <SignUpModal 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen} 
        onSwitchToLogin={handleSwitchToLogin}
        onSuccess={handleSignUpSuccess}
      />
    </div>
  );
};

export default FindJobs;
