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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.withCredentials = true

interface Application {
  _id: string;
  worker: {
    name: string;
    yearsOfExperience: string;
    rating: string;
    skills: string[];
    photo: string; 
  };
  job: {
    title: string;
    location: string;
    createdAt: string;
  };
  status: "Pending Review" | "Accepted" | "Not Selected";
}


const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Accepted":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Accepted</Badge>;
    case "Not Selected":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
    default:
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
  }
};

const WorkerApplications = () => {
  const [DateInput, NewDateInput] = useState("")

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "accept" | "scheduled an interview" | "reject";
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
  
  const ViewApplications = async () => {
    const { data } = await axios.get("http://localhost:8920/api/pro/viewApplications/employer", { withCredentials: true })
    return data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['ViewApplicationsEmployer'],
    queryFn: ViewApplications
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { Applications } = data

  const pendingApplications = Applications.filter(app => app.status === "Pending Review");
  const scheduledInterviews = Applications.filter(app => app.status === "Interview Scheduled");
  const processedApplications = Applications.filter(app => app.status !== "Pending Review" && app.status !== "Interview Scheduled");

  
  const handleViewProfile = (application) => {
    setProfileModal({ open: true, application });
  };

  const handleAcceptClick = (application) => {
    setProfileModal({ open: false, application: null });
    setConfirmDialog({ open: true, type: "accept", application });
  };

  const handleInterviewClick = (application) => {
    setProfileModal({ open: false, application: null });
    setConfirmDialog({ open: true, type: "scheduled an interview", application });
  };

  const handleRejectClick = (application) => {
    setProfileModal({ open: false, application: null });
    setConfirmDialog({ open: true, type: "reject", application });
  };

  const UpdateApplicationStatus = async (_id, status, timeline) => {
    if (status === "Interview Scheduled" && timeline === "Interview") {
      await axios.put("http://localhost:8920/api/pro/date", { _id, interviewDate: DateInput }, {
        withCredentials: true
      }).catch((error) => { if (error.response) { alert(error.response.data.message) } })
    }

    await axios.put("http://localhost:8920/api/pro/update/application", { _id, status, timeline }, {
      withCredentials: true
    })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message)
        }
      })
  }
  
  const handleConfirmAction = () => {
    if (!confirmDialog.application) return;

    const { type, application } = confirmDialog;
    const newStatus = type === "accept" ? "accepted" : "rejected";
            
      if (type === "accept") {
        UpdateApplicationStatus(application._id, "Accepted", "Final Decision")
        toast.success(`${application.worker.name} has been accepted!`, {
          description: `They will be notified about the ${application.job.title} position.`,
        });
      } else if (type === "scheduled an interview") {
        if (DateInput === "") {
          toast.info(`Date has no input`, {
            description: "Please enter the date for the interview schedule.",
          });
        } else {

          UpdateApplicationStatus(application._id, "Interview Scheduled", "Interview")
          toast.success(`${application.worker.name} has been scheduled an interview!`, {
            description: `They will be notified about the ${application.job.title} interview schedule.`,
          });
        }
        
      } else {
        UpdateApplicationStatus(application._id, "Not Selected", "Final Decision")
        toast.info(`${application.worker.name}'s application has been declined.`, {
          description: "They will be notified of your decision.",
        });
      }
  };

  const styleDate = {
    border: "none",
    boxShadow: "0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1)",
    padding: "0.3rem",
    borderRadius: "15px"
  }

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
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={application.worker.photo} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(application.worker.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.worker.name}</CardTitle>
                      <CardDescription>{application.job.title}</CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{application.worker.rating}</span>
                      </div>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      Applied for: <span className="font-medium text-foreground">{application.job.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {application.job.location}
                    </div>
                    <div className="text-muted-foreground">
                      {application.worker.yearsOfExperience} experience • Applied {application.createdAt}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {application.worker.skills.map((skill) => (
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
                      className="flex-1 gap-2" 
                      size="sm"
                      onClick={() => handleInterviewClick(application)}
                    >
                      <Check className="w-4 h-4" />
                      Schedule Interview
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

      {/* Scheduled Applications */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          Scheduled Interviews ({scheduledInterviews.length})
        </h2>
        {scheduledInterviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No scheduled interviews at the moment.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {scheduledInterviews.map((application) => (
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={application.worker.photo} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(application.worker.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.worker.name}</CardTitle>
                      <CardDescription>{application.job.title}</CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{application.worker.rating}</span>
                      </div>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      Applied for: <span className="font-medium text-foreground">{application.job.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {application.job.location}
                    </div>
                    <div className="text-muted-foreground">
                      {application.worker.yearsOfExperience} experience • Applied {application.createdAt}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {application.worker.skills.map((skill) => (
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
              <Card key={application._id} className="opacity-75">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={application.worker.photo} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {getInitials(application.worker.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{application.worker.name}</CardTitle>
                      <CardDescription className="text-sm">{application.job.title}</CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Applied {application.createdAt}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-1"
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
        showActions={profileModal.application?.status === "Pending Review"}
      />

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "accept" ? "Accept Application" : confirmDialog.type === "scheduled an interview" ? "Interview the Worker" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "accept" ? (
                <>
                  Are you sure you want to accept <strong>{confirmDialog.application?.worker.name}</strong> for the <strong>{confirmDialog.application?.job.title}</strong> position?
                </>
              ) : confirmDialog.type === "scheduled an interview" ? (
                <>
                  <label htmlFor="interviewDate">Please set an Interview Date: </label>
                  <input style={styleDate} type="date" id="interviewDate" onChange={(event) => NewDateInput(event.target.value)} />
                </>
              ) : (
                <>
                  Are you sure you want to reject <strong>{confirmDialog.application?.worker.name}</strong>'s application for the <strong>{confirmDialog.application?.job.title}</strong> position?
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
              {confirmDialog.type === "accept" ? "Accept" : confirmDialog.type === "scheduled an interview" ? "Interview" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkerApplications;
