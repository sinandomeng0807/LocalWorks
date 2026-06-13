import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  _id: string;
  type: string;
  title: string;
  description: string;
  details?: string;
  createdAt: string;
  read: boolean;
}

const formatUTC = (utc: string) =>
  new Date(utc).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export default function EmployerNotifications() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    const res = await axios.get(
      "http://localhost:8920/api/pro/notifications",
      { withCredentials: true }
    );
    return res.data.notifications;
  };

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ["employerNotifications"],
    queryFn: fetchNotifications,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      return axios.patch(
        `http://localhost:8920/api/employer/markAsRead/${id}`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employerNotifications"] });
      toast.success("Marked as read");
    },
  });

  const deleteNotif = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(
        `http://localhost:8920/api/employer/deleteNotif/${id}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employerNotifications"] });
      toast.success("Deleted");
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load notifications</div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Employer Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Updates about applications, workers, and system activity
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-3">
          {!notifications.length ? (
            <div>No notifications yet.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-center gap-4 p-4 border rounded-lg ${
                  n.read ? "bg-muted/40" : "bg-card"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>

                <div className="flex-1">
                  <p className={`text-sm ${n.read ? "font-medium" : "font-bold"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {n.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatUTC(n.createdAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead.mutate(n._id)}
                    >
                      Mark read
                    </Button>
                  )}

                  <Button size="sm" variant="ghost" onClick={() => setSelected(n)}>
                    View
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {!n.read && (
                        <DropdownMenuItem onClick={() => markAsRead.mutate(n._id)}>
                          Mark as read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => setSelected(n)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteNotif.mutate(n._id)}
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

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selected?.details}
            </p>

            <p className="text-xs text-muted-foreground">
              {selected?.createdAt ? formatUTC(selected.createdAt) : ""}
            </p>

            {selected && !selected.read && (
              <Button
                onClick={() => {
                  markAsRead.mutate(selected._id);
                  setSelected(null);
                }}
              >
                Mark as read
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}