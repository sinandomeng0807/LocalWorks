import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MapPin, Star, Briefcase, Mail, Phone, Check, X, Clock, Eye } from "lucide-react";
import { toast } from "sonner";
import WorkerProfileModal from "./WorkerProfileModal";

interface Application {
  id: number;
  name: string;
  title: string;
  location: string;
  experience: string;
  rating: number;
  skills: string[];
  appliedFor: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
  avatar: string;
}

const initialApplications: Application[] = [
  {
    id: 1,
    name: "John Martinez",
    title: "Construction Worker",
    location: "Downtown, Metro City",
    experience: "5 years",
    rating: 4.8,
    skills: ["Carpentry", "Masonry", "Electrical"],
    appliedFor: "Senior Construction Worker",
    appliedDate: "2 days ago",
    status: "pending",
    avatar: "",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Professional Cleaner",
    location: "Eastside District",
    experience: "3 years",
    rating: 4.9,
    skills: ["Residential Cleaning", "Commercial Cleaning"],
    appliedFor: "Office Cleaning Staff",
    appliedDate: "3 days ago",
    status: "pending",
    avatar: "",
  },
  {
    id: 3,
    name: "Michael Johnson",
    title: "Delivery Driver",
    location: "Central Business District",
    experience: "4 years",
    rating: 4.7,
    skills: ["Local Delivery", "Long Distance"],
    appliedFor: "Delivery Driver",
    appliedDate: "1 week ago",
    status: "accepted",
    avatar: "",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Restaurant Staff",
    location: "Various Locations",
    experience: "6 years",
    rating: 5.0,
    skills: ["Serving", "Bartending"],
    appliedFor: "Event Catering Staff",
    appliedDate: "1 week ago",
    status: "rejected",
    avatar: "",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "accepted":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Accepted</Badge>;
    case "rejected":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
    default:
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
  }
};

const WorkerApplications = () => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "accept" | "reject";
    application: Application | null;
  }>({
    open: false,
    type: "accept",
    application: null,
  });
  const [profileModal, setProfileModal] = useState<{
    open: boolean;
    application: Application | null;
  }>({
    open: false,
    application: null,
  });

  const pendingApplications = applications.filter(app => app.status === "pending");
  const processedApplications = applications.filter(app => app.status !== "pending");

  const handleViewProfile = (application: Application) => {
    setProfileModal({ open: true, application });
  };

  const handleAcceptClick = (application: Application) => {
    setProfileModal({ open: false, application: null });
    setConfirmDialog({ open: true, type: "accept", application });
  };

  const handleRejectClick = (application: Application) => {
    setProfileModal({ open: false, application: null });
    setConfirmDialog({ open: true, type: "reject", application });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.application) return;

    const { type, application } = confirmDialog;
    const newStatus = type === "accept" ? "accepted" : "rejected";

    setApplications(prev =>
      prev.map(app =>
        app.id === application.id ? { ...app, status: newStatus } : app
      )
    );

    if (type === "accept") {
      toast.success(`${application.name} has been accepted!`, {
        description: `They will be notified about the ${application.appliedFor} position.`,
      });
    } else {
      toast.info(`${application.name}'s application has been declined.`, {
        description: "They will be notified of your decision.",
      });
    }

    setConfirmDialog({ open: false, type: "accept", application: null });
  };

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          Pending Applicants ({pendingApplications.length})
        </h2>
        {pendingApplications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No pending applications at the moment.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={application.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(application.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.name}</CardTitle>
                      <CardDescription>{application.title}</CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{application.rating}</span>
                      </div>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      Applied for: <span className="font-medium text-foreground">{application.appliedFor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {application.location}
                    </div>
                    <div className="text-muted-foreground">
                      {application.experience} experience • Applied {application.appliedDate}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {application.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleViewProfile(application)}
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </Button>
                    <Button 
                      className="flex-1 gap-2" 
                      size="sm"
                      onClick={() => handleAcceptClick(application)}
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleRejectClick(application)}
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed Applications */}
      {processedApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Previous Applicants</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {processedApplications.map((application) => (
              <Card key={application.id} className="opacity-75">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={application.avatar} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {getInitials(application.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{application.name}</CardTitle>
                      <CardDescription className="text-sm">{application.appliedFor}</CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Applied {application.appliedDate}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-1"
                      onClick={() => handleViewProfile(application)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Worker Profile Modal */}
      <WorkerProfileModal
        open={profileModal.open}
        onOpenChange={(open) => setProfileModal(prev => ({ ...prev, open }))}
        worker={profileModal.application}
        onAccept={() => profileModal.application && handleAcceptClick(profileModal.application)}
        onReject={() => profileModal.application && handleRejectClick(profileModal.application)}
        showActions={profileModal.application?.status === "pending"}
      />

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "accept" ? "Accept Application" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "accept" ? (
                <>
                  Are you sure you want to accept <strong>{confirmDialog.application?.name}</strong> for the <strong>{confirmDialog.application?.appliedFor}</strong> position?
                </>
              ) : (
                <>
                  Are you sure you want to reject <strong>{confirmDialog.application?.name}</strong>'s application for the <strong>{confirmDialog.application?.appliedFor}</strong> position?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className={confirmDialog.type === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {confirmDialog.type === "accept" ? "Accept" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkerApplications;
