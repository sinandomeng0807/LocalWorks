import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Building2, MapPin, Calendar, Clock, Eye } from "lucide-react";
import { toast } from "sonner";
import ApplicationDetailsModal from "./ApplicationDetailsModal";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: string;
  salary: string;
  interviewDate?: string;
}

const initialApplications: Application[] = [
  {
    id: 1,
    jobTitle: "Construction Worker",
    company: "BuildRight Construction",
    location: "Downtown, Metro City",
    appliedDate: "Jan 28, 2026",
    status: "pending",
    salary: "$18-25/hr",
  },
  {
    id: 2,
    jobTitle: "Warehouse Associate",
    company: "MegaStore Distribution",
    location: "Industrial Zone",
    appliedDate: "Jan 25, 2026",
    status: "interview",
    salary: "$16-18/hr",
    interviewDate: "Feb 3, 2026",
  },
  {
    id: 3,
    jobTitle: "Delivery Driver",
    company: "FastTrack Logistics",
    location: "Eastside District",
    appliedDate: "Jan 20, 2026",
    status: "accepted",
    salary: "$15-20/hr",
  },
  {
    id: 4,
    jobTitle: "Security Guard",
    company: "SafeWatch Security",
    location: "Multiple Sites",
    appliedDate: "Jan 15, 2026",
    status: "rejected",
    salary: "$14-18/hr",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending Review</Badge>;
    case "interview":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Interview Scheduled</Badge>;
    case "accepted":
      return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>;
    case "rejected":
      return <Badge variant="destructive">Not Selected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<Application | null>(null);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleWithdrawClick = (application: Application) => {
    setApplicationToWithdraw(application);
    setWithdrawDialogOpen(true);
    setDetailsModalOpen(false);
  };

  const handleConfirmWithdraw = () => {
    if (applicationToWithdraw) {
      setApplications(prev => prev.filter(app => app.id !== applicationToWithdraw.id));
      toast.success("Application withdrawn", {
        description: `Your application to ${applicationToWithdraw.company} has been withdrawn.`,
      });
    }
    setWithdrawDialogOpen(false);
    setApplicationToWithdraw(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">My Applications</h2>
        <p className="text-muted-foreground">Track the status of your job applications</p>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-1">{application.jobTitle}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Building2 className="w-4 h-4" />
                    {application.company}
                  </CardDescription>
                </div>
                {getStatusBadge(application.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {application.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Applied: {application.appliedDate}
                </span>
                <span className="font-medium text-foreground">
                  {application.salary}
                </span>
              </div>

              {application.status === "interview" && application.interviewDate && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <p className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Clock className="w-4 h-4" />
                    Interview scheduled for {application.interviewDate}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleViewDetails(application)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                {application.status === "pending" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleWithdrawClick(application)}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">You haven't applied to any jobs yet.</p>
          <Button variant="link">Browse available jobs</Button>
        </div>
      )}

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        application={selectedApplication}
        onWithdraw={() => selectedApplication && handleWithdrawClick(selectedApplication)}
      />

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw your application for <strong>{applicationToWithdraw?.jobTitle}</strong> at <strong>{applicationToWithdraw?.company}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmWithdraw}
              className="bg-destructive hover:bg-destructive/90"
            >
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyApplications;
