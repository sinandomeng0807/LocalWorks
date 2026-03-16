import { useState } from "react";
import { Search, Filter, Building2, UserCircle, Info, FileText, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "job_posted" | "verification" | "application" | "report";
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: "job" | "account";
  details?: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "job_posted",
    title: "New Job Posted for Construction by Client [Manila Corp]",
    description: "New Job Posted for Construction by Client Manila Corp.",
    time: "5 mins ago",
    read: false,
    category: "job",
    details: "A new Construction job has been posted by Manila Corp. The position requires 3 years of experience and is located in Manila. Please review and approve/reject the listing.",
  },
  {
    id: "2",
    type: "verification",
    title: "Worker Account Pending Verification",
    description: "Worker Account Pending Verification for your Client Worker.",
    time: "1 hour ago",
    read: false,
    category: "account",
    details: "A new worker account has been created and is pending verification. The worker has uploaded their CV/Resume for review. Please verify the documents and approve or reject the account.",
  },
  {
    id: "3",
    type: "application",
    title: "Job Application Accepted for Warehouse Role",
    description: "Job Application Accepted for Warehouse Role in mow accepted.",
    time: "1 hour ago",
    read: false,
    category: "job",
    details: "The job application for the Warehouse Role has been accepted by the employer. The worker has been notified and can now proceed with the onboarding process.",
  },
  {
    id: "4",
    type: "report",
    title: "Weekly Summary Report Ready for Review",
    description: "Weekly Summary Report ready for Review in eare update for your accounts.",
    time: "Yesterday",
    read: true,
    category: "account",
    details: "Your weekly summary report is now available. It includes updates on new registrations, job postings, applications, and platform activity for the past week.",
  },
  {
    id: "5",
    type: "job_posted",
    title: "New Job Posted for Plumbing by Client [Quezon Services]",
    description: "New Job Posted for Plumbing by Client Quezon Services.",
    time: "2 days ago",
    read: true,
    category: "job",
    details: "A new Plumbing job has been posted by Quezon Services. The position is full-time and located in Quezon City. Please review the listing.",
  },
  {
    id: "6",
    type: "verification",
    title: "Employer Account Pending Verification",
    description: "Employer Account Pending Verification for ABC Company.",
    time: "3 days ago",
    read: true,
    category: "account",
    details: "A new employer account has been created by ABC Company and is pending verification. Business permit has been uploaded for review.",
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "job_posted":
      return <Building2 className="w-5 h-5 text-primary-foreground" />;
    case "verification":
      return <UserCircle className="w-5 h-5 text-primary-foreground" />;
    case "application":
      return <Info className="w-5 h-5 text-primary-foreground" />;
    case "report":
      return <FileText className="w-5 h-5 text-primary-foreground" />;
  }
};

const getIconBg = (type: Notification["type"]) => {
  switch (type) {
    case "job_posted":
      return "bg-primary";
    case "verification":
      return "bg-accent-foreground/70";
    case "application":
      return "bg-destructive/80";
    case "report":
      return "bg-muted-foreground";
  }
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "unread") return matchesSearch && !n.read;
    if (activeFilter === "job") return matchesSearch && n.category === "job";
    if (activeFilter === "account") return matchesSearch && n.category === "account";
    return matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <main className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Welcome Back!, Admin</h2>
        <p className="text-sm text-muted-foreground">
          Here's what happening with your reports today
        </p>
      </div>

      {/* Search + Filters + Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="w-4 h-4" />
          </Button>

          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="ml-2">
            <TabsList className="bg-transparent gap-1 p-0 h-auto">
              {[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
                { value: "job", label: "Job Updates" },
                { value: "account", label: "Account Updates" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-primary hover:text-primary"
              onClick={markAllAsRead}
            >
              Mark as Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-primary hover:text-primary"
              onClick={() => {
                if (filtered.length > 0) setSelectedNotification(filtered[0]);
              }}
            >
              View Details
            </Button>
          </div>
        </div>

        {unreadCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Notification List */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No notifications found</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  n.read
                    ? "bg-card border-border"
                    : "bg-muted/40 border-border"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconBg(
                    n.type
                  )}`}
                >
                  {getNotificationIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold text-foreground ${!n.read ? "font-bold" : ""}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {n.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">{n.time}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:text-primary"
                      onClick={() => markAsRead(n.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary"
                    onClick={() => setSelectedNotification(n)}
                  >
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!n.read && (
                        <DropdownMenuItem onClick={() => markAsRead(n.id)}>
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => setSelectedNotification(n)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteNotification(n.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Notification Settings floating button */}
      <div className="fixed bottom-6 right-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shadow-lg">
              Notification Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => toast.info("Manage Preferences coming soon")}>
              Manage Preferences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedNotification?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {selectedNotification?.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{selectedNotification?.time}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedNotification?.details}
            </p>
            {selectedNotification && !selectedNotification.read && (
              <Button
                size="sm"
                onClick={() => {
                  markAsRead(selectedNotification.id);
                  setSelectedNotification(null);
                }}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminNotifications;
