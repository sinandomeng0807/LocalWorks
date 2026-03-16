import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/usersStore";
import { Phone, MapPin, Mail, FileText, Briefcase, User, Calendar } from "lucide-react";

interface UserProfileModalProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: number, status: UserProfile["status"]) => void;
  onDelete: (id: number) => void;
}

const UserProfileModal = ({ user, open, onOpenChange, onUpdateStatus, onDelete }: UserProfileModalProps) => {
  const statusColor = {
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    not_active: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
                <Badge className={`text-xs ${statusColor[user.status]}`}>
                  {user.status === "not_active" ? "Not Active" : user.status === "active" ? "Active" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" /> <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" /> <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" /> <span>Joined {user.createdAt}</span>
            </div>
            {user.role === "worker" && user.skills && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" /> <span>{user.skills}</span>
              </div>
            )}
            {user.role === "employer" && user.companyName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" /> <span>{user.companyName} — {user.industry}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" /> <span>Reports submitted: {user.reportsSubmitted}</span>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="border-t border-border pt-3 space-y-2">
            <p className="text-sm font-medium text-foreground">Uploaded Documents</p>
            {user.role === "worker" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" /> <span>CV / Resume</span>
                  </div>
                  {user.resumeUrl ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Uploaded</Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Missing</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" /> <span>Profile Photo</span>
                  </div>
                  {user.photoUrl ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Uploaded</Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Missing</Badge>
                  )}
                </div>
              </div>
            )}
            {user.role === "employer" && (
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" /> <span>Business / Company Permit</span>
                </div>
                {user.permitUrl ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Uploaded</Badge>
                ) : (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Missing</Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {user.status !== "active" && (
              <Button size="sm" className="flex-1" onClick={() => { onUpdateStatus(user.id, "active"); onOpenChange(false); }}>
                Activate
              </Button>
            )}
            {user.status !== "not_active" && (
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { onUpdateStatus(user.id, "not_active"); onOpenChange(false); }}>
                Deactivate
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={() => { onDelete(user.id); onOpenChange(false); }}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
