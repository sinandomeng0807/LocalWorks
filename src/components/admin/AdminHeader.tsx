import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  { id: 1, title: "New job posted", desc: "A new Full-Stack Developer position was posted", time: "2 min ago", unread: true },
  { id: 2, title: "Job accepted", desc: "Plumber position has been accepted", time: "15 min ago", unread: true },
  { id: 3, title: "New application", desc: "John Doe applied for Electrician role", time: "1 hour ago", unread: true },
  { id: 4, title: "Review submitted", desc: "A new 5-star review was submitted", time: "3 hours ago", unread: false },
  { id: 5, title: "Job expired", desc: "Carpenter position has expired", time: "5 hours ago", unread: false },
  { id: 6, title: "User registered", desc: "New employer account created", time: "1 day ago", unread: false },
];

const AdminHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9 h-9 bg-muted/50 border-none" />
      </div>

      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                {notifications.filter(n => n.unread).length}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="px-4 py-3 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
              <p className="text-xs text-muted-foreground">{notifications.filter(n => n.unread).length} unread</p>
            </div>
            <ScrollArea className="h-72">
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${n.unread ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      <div className={n.unread ? '' : 'ml-4'}>
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default AdminHeader;
