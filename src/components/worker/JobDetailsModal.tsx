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
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  CheckCircle
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  tags: string[];
}

interface JobDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  isApplied?: boolean;
  onApply?: () => void;
}

// Mock extended job data
const getExtendedJobDetails = (job: Job) => ({
  ...job,
  requirements: [
    "Minimum 1 year of relevant experience",
    "Valid government-issued ID",
    "Physically fit and able to perform job duties",
    "Reliable and punctual",
  ],
  benefits: [
    "Competitive hourly rate",
    "Weekly pay schedule",
    "Safety equipment provided",
    "Opportunity for overtime",
  ],
  schedule: "Monday to Friday, 8:00 AM - 5:00 PM",
  startDate: "Immediate",
  positions: 3,
  applicationDeadline: "February 15, 2026",
});

const JobDetailsModal = ({
  open,
  onOpenChange,
  job,
  isApplied = false,
  onApply,
}: JobDetailsModalProps) => {
  if (!job) return null;

  const extendedJob = getExtendedJobDetails(job);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Job Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{extendedJob.title}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Building2 className="w-4 h-4" />
                <span className="text-lg">{extendedJob.company}</span>
              </div>
            </div>
            <Badge variant={extendedJob.type === "Full-time" ? "default" : "secondary"}>
              {extendedJob.type}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {extendedJob.location}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {extendedJob.salary}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Posted {extendedJob.posted}
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Description
          </h3>
          <p className="text-muted-foreground">{extendedJob.description}</p>
        </div>

        <Separator />

        {/* Requirements */}
        <div>
          <h3 className="font-semibold mb-3">Requirements</h3>
          <ul className="space-y-2">
            {extendedJob.requirements.map((req, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Benefits */}
        <div>
          <h3 className="font-semibold mb-3">Benefits</h3>
          <ul className="space-y-2">
            {extendedJob.benefits.map((benefit, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Schedule</p>
              <p className="font-medium">{extendedJob.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{extendedJob.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Positions Available</p>
              <p className="font-medium">{extendedJob.positions}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Apply Before</p>
              <p className="font-medium">{extendedJob.applicationDeadline}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Skills/Tags */}
        <div>
          <h3 className="font-semibold mb-3">Skills & Tags</h3>
          <div className="flex flex-wrap gap-2">
            {extendedJob.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-4">
          {isApplied ? (
            <Button disabled className="w-full gap-2">
              <CheckCircle className="w-4 h-4" />
              Already Applied
            </Button>
          ) : (
            <Button className="w-full" size="lg" onClick={onApply}>
              Apply Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
