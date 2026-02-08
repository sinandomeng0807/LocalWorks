import { LogOut, User, FileText, UserCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.avif";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onViewProfile?: () => void;
  onEditProfile?: () => void;
  onWriteReview?: () => void;
}

const DashboardHeader = ({ onViewProfile, onEditProfile, onWriteReview }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center p-1 overflow-hidden">
            <img src={logo} alt="LocalWorks" className="h-full w-full object-cover rounded-full" />
          </div>
          <span className="text-xl font-bold text-foreground">LocalWorks</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Employer" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <UserCircle className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">Employer</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onViewProfile} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEditProfile} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onWriteReview} className="cursor-pointer">
              <Star className="mr-2 h-4 w-4" />
              Write a Review
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
