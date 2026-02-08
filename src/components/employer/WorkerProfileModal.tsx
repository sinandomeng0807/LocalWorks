import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Star, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  FileText,
  Check,
  X
} from "lucide-react";

interface WorkerProfile {
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
  // Extended profile info
  email?: string;
  phone?: string;
  bio?: string;
  education?: string;
  certifications?: string[];
  previousJobs?: { title: string; company: string; duration: string }[];
  availability?: string;
}

interface WorkerProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: WorkerProfile | null;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Mock extended data - in real app, this would come from database
const getExtendedProfile = (worker: WorkerProfile) => ({
  ...worker,
  email: `${worker.name.toLowerCase().replace(" ", ".")}@email.com`,
  phone: "+63 912 345 6789",
  bio: `Experienced ${worker.title.toLowerCase()} with ${worker.experience} of hands-on experience. Dedicated professional who takes pride in quality work and maintaining strong relationships with clients and team members.`,
  education: "Vocational Training Certificate",
  certifications: ["Safety Training Certified", "First Aid Certified"],
  previousJobs: [
    { title: worker.title, company: "Previous Company Inc.", duration: "2 years" },
    { title: "Junior " + worker.title, company: "Starter Corp.", duration: "1 year" },
  ],
  availability: "Available immediately",
});

const WorkerProfileModal = ({
  open,
  onOpenChange,
  worker,
  onAccept,
  onReject,
  showActions = true,
}: WorkerProfileModalProps) => {
  if (!worker) return null;

  const extendedWorker = getExtendedProfile(worker);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Worker Profile</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={extendedWorker.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {getInitials(extendedWorker.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{extendedWorker.name}</h2>
            <p className="text-lg text-muted-foreground">{extendedWorker.title}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{extendedWorker.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{extendedWorker.location}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{extendedWorker.experience}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Applied For Badge */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Applied for</p>
          <p className="font-semibold text-primary">{extendedWorker.appliedFor}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Applied {extendedWorker.appliedDate}
          </p>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{extendedWorker.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{extendedWorker.phone}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bio */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            About
          </h3>
          <p className="text-sm text-muted-foreground">{extendedWorker.bio}</p>
        </div>

        <Separator />

        {/* Skills */}
        <div>
          <h3 className="font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {extendedWorker.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Certifications */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certifications
          </h3>
          <ul className="space-y-1">
            {extendedWorker.certifications?.map((cert) => (
              <li key={cert} className="text-sm flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                {cert}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Work History */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Work History
          </h3>
          <div className="space-y-3">
            {extendedWorker.previousJobs?.map((job, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{job.title}</p>
                <p className="text-muted-foreground">
                  {job.company} • {job.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            <strong>Availability:</strong> {extendedWorker.availability}
          </span>
        </div>

        {/* Action Buttons */}
        {showActions && worker.status === "pending" && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button className="flex-1 gap-2" onClick={onAccept}>
                <Check className="w-4 h-4" />
                Accept Application
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={onReject}>
                <X className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkerProfileModal;
