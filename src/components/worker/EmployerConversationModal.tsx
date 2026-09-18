import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Building2, 
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Application {
  id: string;
  worker: string;
  job: {
    title: string;
    company: string;
    location: string;
    appliedDate: string;
    description: string;
    email: string;
    phone: string;
    salary: string;
  }
  status: string;
  interviewDate?: string;
  createdAt: string;
}

interface ApplicationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onWithdraw?: () => void;
}


const UTC_Converter = (createdAt) => {
  const splitDateAndTime = createdAt.split("T")
  const date = splitDateAndTime[0].split("-")
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  return months[Number(date[1])] + " " + date[1+1] + ", " + date[0]
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "Pending Review":
      return { 
        label: "Pending Review", 
        icon: <Clock className="w-5 h-5" />,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        description: "Your application is being reviewed by the employer. You'll be notified once they make a decision."
      };
    case "Interview Scheduled":
      return { 
        label: "Interview Scheduled", 
        icon: <Calendar className="w-5 h-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-200 dark:border-blue-800",
        description: "Congratulations! The employer wants to interview you. Check the interview details below."
      };
    case "Accepted":
      return { 
        label: "Accepted", 
        icon: <CheckCircle className="w-5 h-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
        description: "Great news! Your application has been accepted. The employer will contact you with next steps."
      };
    case "Not Selected":
      return { 
        label: "Not Selected", 
        icon: <XCircle className="w-5 h-5" />,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
        description: "Unfortunately, your application was not selected for this position. Don't give up – keep applying!"
      };
    default:
      return { 
        label: status, 
        icon: <AlertCircle className="w-5 h-5" />,
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        borderColor: "border-border",
        description: "Status information unavailable."
      };
  }
};

// Mock extended application data
const getExtendedApplicationDetails = (application: Application) => ({
  ...application,
  jobType: "Full-time",
  jobDescription: "Looking for dedicated professionals to join our team. This role requires attention to detail and strong work ethic.",
  timeline: [
    { date: UTC_Converter(application.createdAt), event: "Application Submitted", completed: true },
    { date: "In Progress", event: "Application Review", completed: application.status !== "Pending Review" },
    { date: application.interviewDate || "N/A", event: "Interview Scheduled", completed: application.status === "Accepted" || application.status === "Not Selected" },
    { date: application.status === "Accepted" || application.status === "Not Selected" ? application.status : "Pending", event: "Final Decision", completed: application.status === "Accepted" || application.status === "Not Selected" },
  ],
  contactEmail: "hr@" + application.job.company.toLowerCase().replace(/\s+/g, "") + ".com",
  contactPhone: "+63 912 345 6789",
});

const EmployerConversationModal = ({
  open,
  onOpenChange,
  application,
  onWithdraw,
}: ApplicationDetailsModalProps) => {
  if (!application) return null;

  const ResponsesEmployer = async () => {
    const result = await axios.get(`http://localhost:8920/api/pro/responses/${application}`)
    return result.data
  }

  const { data, isLoading, error } = useQuery({
    queryFn: ResponsesEmployer,
    queryKey: ["responses"]
  })

  if (isLoading) return <div></div>
  if (error) return <div></div>


  const extendedApp = getExtendedApplicationDetails(application);
  const statusInfo = getStatusInfo(application.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Employer Information Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">{extendedApp.job.title}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Building2 className="w-4 h-4" />
            <span className="text-lg">{extendedApp.job.company}</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {extendedApp.job.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Applied: {UTC_Converter(extendedApp.createdAt)}
            </div>
            <span className="font-medium text-foreground">
              {extendedApp.job.salary}
            </span>
          </div>
        </div>

        <Separator />

        {/* Employer Responses */}
        <div className="">

          {/* Source: https://tailwindcss.com/docs/width */}
          {/* Source: https://www.geeksforgeeks.org/css/tailwind-css-fixed-width-not-working-with-other-element-in-flex/
          https://tailwindcss.com/docs/max-width
          https://tailwindcss.com/docs/padding
          https://tailwindcss.com/docs/border-width
          https://tailwindcss.com/docs/flex-direction */}
          <div>
            {data.EmployerResponses.map((response) => {
              return (
                <>
                  <div className="flex">
                  <div >
                    <img src="" alt="Profile" className="" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <span className="font-bold">Employer Email: {response.employerId}</span>
                    <span className="flex-col">Company Name</span>
                  </div>
                </div>
                <div className="pr-19">
                  <h1 className="text-xl font-bold">You did not work for 15 years.</h1>
                  <span>Unfortunately, you are not qualified to work at our company because you do not have enough years of experience, but it doesn't mean that we assume that you do not have enough skills. As much as I wanted to hire you, I can't because of your years of experience, but I assure you if you come back, you will have enough years of experience, and I can tell you will be a great employee at our company. I can't wait to hire you one day when the time is right.</span>
                </div>
                </>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h3 className="font-semibold mb-3">Employer Contact</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span className="font-medium">{extendedApp.job.email}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              <span className="font-medium">{extendedApp.job.phone}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {application.status === "pending" && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={onWithdraw}
              >
                Withdraw Application
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployerConversationModal;
