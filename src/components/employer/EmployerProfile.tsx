import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Briefcase, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus } from "lucide-react";
import DashboardHeader from "@/components/employer/DashboardHeader";
import CompanyProfile from "@/components/employer/CompanyProfile";
import WorkerApplications from "@/components/employer/WorkerApplications";
import BrowseWorkers from "@/components/employer/BrowseWorkers";
import PostJobModal from "@/components/employer/PostJobModal";
import WriteReviewModal from "@/components/WriteReviewModal";
import EditProfileModal from "./EditProfileModal";
axios.defaults.withCredentials = true;


  const EmployerProfileInfo = () => { return (
    <div>Employer Profile Info</div>
  );
};

const EmployerProfile = () => {
    const [postJobOpen, setPostJobOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("applications")
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  // Mock worker data
  const worker = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "Metro City, State",
    title: "Construction Worker",
    experience: "5 years",
    bio: "Experienced construction worker with expertise in commercial and residential projects. Skilled in operating heavy machinery, reading blueprints, and working with various materials.",
    skills: ["Construction", "Heavy Machinery", "Blueprint Reading", "Concrete Work", "Carpentry", "Safety Compliance"],
    availability: "Full-time",
    expectedSalary: "$20-30/hr",
    appliedJobs: 12,
    interviews: 3,
  };

  const viewProfile = async () => {
    const { data } = await axios.get("http://localhost:8920/api/pro/employer/information", {
      withCredentials: true
    })

    return data
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: viewProfile
  })

  if (error) return <div>Error: {error.message}</div>
  if (isLoading) return <div>Loading...</div>

  const { EmployerProf } = data

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onWriteReview={() => setReviewOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        {/* Company Profile Section */}
        <div className="mb-8">

        {/* Tabs for Applications and Browse Workers */}
        <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {EmployerProf.email}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{EmployerProf.email}</h2>
                  <p className="text-muted-foreground">{EmployerProf.phone}</p>
                </div>
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {EmployerProf.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {EmployerProf.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {EmployerProf.company}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  {EmployerProf.industry}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      </Card>

      

      
      
    </div>
        </div>
      </main>

      {/* Post Job Modal */}
      <PostJobModal open={postJobOpen} onOpenChange={setPostJobOpen} />
      <WriteReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        userName="Employer"
        userRole="Business Owner"
      />
    </div>
  )
}

export default EmployerProfile;
