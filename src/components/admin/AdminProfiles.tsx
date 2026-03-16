import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Phone, MapPin, FileText, Mail, Eye, Trash2, User } from "lucide-react";
import { useUsersStore, UserProfile } from "@/lib/usersStore";
import { toast } from "sonner";
import UserProfileModal from "./UserProfileModal";

const AdminProfiles = () => {
  const users = useUsersStore((s) => s.users);
  const updateStatus = useUsersStore((s) => s.updateStatus);
  const removeUser = useUsersStore((s) => s.removeUser);

  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState<"all" | "active" | "not_active" | "pending">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "worker" | "employer">("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = sortStatus === "all" || u.status === sortStatus;
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
      });
  }, [users, search, sortStatus, roleFilter]);

  const statusLabel = (status: UserProfile["status"]) => {
    if (status === "active") return { text: "ACTIVE", className: "text-green-600" };
    if (status === "not_active") return { text: "NOT ACTIVE", className: "text-destructive" };
    return { text: "PENDING", className: "text-yellow-600" };
  };

  return (
    <>
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-foreground">User</h2>
          <p className="text-sm text-muted-foreground">Manage users here</p>
        </div>

        {/* Search & Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <div className="flex gap-3 items-center ml-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort:</span>
                  <Select value={sortStatus} onValueChange={(v) => setSortStatus(v as typeof sortStatus)}>
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="not_active">Not Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-sm">No users match your search</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((user) => {
              const status = statusLabel(user.status);
              return (
                <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    {/* Header: Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border shrink-0">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> <span>Reports submitted: {user.reportsSubmitted}</span>
                      </div>
                    </div>

                    {/* Footer: Status + Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className={`text-xs font-bold ${status.className}`}>{status.text}</span>
                      <div className="flex items-center gap-1">
                        <a
                          href={`mailto:${user.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => { setSelectedUser(user); setModalOpen(true); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => { removeUser(user.id); toast.success("User removed"); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onUpdateStatus={(id, status) => { updateStatus(id, status); toast.success(`User ${status === "active" ? "activated" : "deactivated"}`); }}
          onDelete={(id) => { removeUser(id); toast.success("User deleted"); }}
        />
      )}
    </>
  );
};

export default AdminProfiles;
