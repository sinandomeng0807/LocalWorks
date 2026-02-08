import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Briefcase, User, FileText, UserCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkerProfile from "@/components/worker/WorkerProfile";
import EditProfileModal from "@/components/worker/EditProfileModal";
import JobListings from "@/components/worker/JobListings";
import MyApplications from "@/components/worker/MyApplications";
import WriteReviewModal from "@/components/WriteReviewModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.avif";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  const handleLogout = () => {
    navigate("/");
  };

  const handleViewProfile = () => {
    setActiveTab("profile");
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleMyApplications = () => {
    setActiveTab("applications");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center p-1 overflow-hidden">
              <img src={logo} alt="LocalWorks" className="h-full w-full object-cover rounded-full" />
            </div>
            <span className="text-xl font-bold text-foreground">LocalWorks</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="John" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <UserCircle className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">John</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={handleViewProfile} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleEditProfile} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleMyApplications} className="cursor-pointer">
                <Briefcase className="mr-2 h-4 w-4" />
                My Applications
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setReviewOpen(true)} className="cursor-pointer">
                <Star className="mr-2 h-4 w-4" />
                Write a Review
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-fit">
            <TabsTrigger value="jobs" className="gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Find Jobs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobListings />
          </TabsContent>

          <TabsContent value="applications">
            <MyApplications />
          </TabsContent>

          <TabsContent value="profile">
            <WorkerProfile onEdit={() => setEditProfileOpen(true)} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      <WriteReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        userName="John Smith"
        userRole="Construction Worker"
      />
    </div>
  );
};

export default WorkerDashboard;
