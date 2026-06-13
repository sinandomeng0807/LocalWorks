import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Contacts from "@/components/employer/Contacts";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus, MessageSquare } from "lucide-react";
import DashboardHeader from "@/components/employer/DashboardHeader";
import CompanyProfile from "@/components/employer/CompanyProfile";
import WorkerApplications from "@/components/employer/WorkerApplications";
import BrowseWorkers from "@/components/employer/BrowseWorkers";
import PostJobModal from "@/components/employer/PostJobModal";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import axios from "axios";
import EmployerNotifications from "@/components/employer/EmployerNotifications";

axios.defaults.withCredentials = true

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const [postJobOpen, setPostJobOpen] = useState(false);

  const isEmployerLogged = async () => {
    const result = await axios.get("http://localhost:8920/api/pro/isEmployerLogged", { withCredentials: true })
    return result.data
  }

  const { isLoading, error } = useQuery({
    queryKey: ['isEmployerLogged'],
    queryFn: isEmployerLogged
  })
  
  const styleCenter = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "40px"
  }

  if (isLoading) return <div style={styleCenter}>Loading...</div>
  if (error) {
    navigate("/", { replace: true })
    toast.info("Please Login as Employer to use the Employer Dashboard.")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Company Profile Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={() => setPostJobOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Post a Job
            </Button>
          </div>
          <CompanyProfile />
        </div>

        {/* Tabs for Applications, Browse Workers, and Contacts */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="applications" className="gap-2">
              <Users className="w-4 h-4" />
              Applications
            </TabsTrigger>

            <TabsTrigger value="browse" className="gap-2">
              <Search className="w-4 h-4" />
              Browse Workers
            </TabsTrigger>

            <TabsTrigger value="contacts" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Contacts
            </TabsTrigger>

            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <WorkerApplications />
          </TabsContent>

          <TabsContent value="browse">
            <BrowseWorkers />
          </TabsContent>

          <TabsContent value="contacts">
            <Contacts />
          </TabsContent>

          <TabsContent value="notifications">
            <EmployerNotifications />
          </TabsContent>
        </Tabs>
      </main>

      {/* Post Job Modal */}
      <PostJobModal open={postJobOpen} onOpenChange={setPostJobOpen} />
    </div>
  );
};

export default EmployerDashboard;
