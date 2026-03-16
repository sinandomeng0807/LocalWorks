import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Trash2, MapPin, DollarSign, Clock, Building2, Mail, Phone } from "lucide-react";
import { Job } from "@/lib/jobsStore";

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: number, status: "accepted" | "rejected") => void;
  onDelete: (id: number) => void;
}

const JobDetailModal = ({ job, open, onOpenChange, onUpdateStatus, onDelete }: JobDetailModalProps) => {
  if (!job) return null;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Declined</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{job.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> {job.company}
              </DialogDescription>
            </div>
            {getStatusBadge(job.status)}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] px-6">
          <div className="space-y-5 pb-4">
            {/* Quick info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4 text-primary" /> {job.salary}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" /> {job.type}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Requirements</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Benefits</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {job.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}

            {/* Contact */}
            {(job.contactEmail || job.contactPhone) && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Contact</h4>
                <div className="space-y-1">
                  {job.contactEmail && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" /> {job.contactEmail}
                    </div>
                  )}
                  {job.contactPhone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" /> {job.contactPhone}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <p className="text-xs text-muted-foreground">Posted: {job.posted}</p>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 p-6 pt-2 border-t border-border">
          {job.status !== "accepted" && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
              onClick={() => { onUpdateStatus(job.id, "accepted"); onOpenChange(false); }}
            >
              <CheckCircle className="w-4 h-4" /> Accept
            </Button>
          )}
          {job.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5"
              onClick={() => { onUpdateStatus(job.id, "rejected"); onOpenChange(false); }}
            >
              <XCircle className="w-4 h-4" /> Decline
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            className="gap-1.5"
            onClick={() => { onDelete(job.id); onOpenChange(false); }}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
