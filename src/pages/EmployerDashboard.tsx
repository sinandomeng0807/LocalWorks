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

const EmployerDashboard = () => {
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onWriteReview={() => setReviewOpen(true)} />

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

        {/* Tabs for Applications and Browse Workers */}
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
          </TabsList>

          <TabsContent value="applications">
            <WorkerApplications />
          </TabsContent>

          <TabsContent value="browse">
            <BrowseWorkers />
          </TabsContent>
        </Tabs>
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
  );
};

export default EmployerDashboard;
