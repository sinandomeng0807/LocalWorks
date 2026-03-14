import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, Briefcase, Edit, Globe, Mail, Phone } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import EditProfileModal from "./EditProfileModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true


const CompanyProfile = () => {
  const navigate = useNavigate()
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    
  const FetchingCompanyInfo = async () => {
    const { data } = await axios.get("http://localhost:8920/api/pro/company", {
      withCredentials: true
    })
    return data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['CompanyInfo'],
    queryFn: FetchingCompanyInfo
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const CompanyProfile = data

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={CompanyProfile.logo} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {CompanyProfile.company.title.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{CompanyProfile.company.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{CompanyProfile.company.industry.title}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                {CompanyProfile.company.location.name}
              </div>
            </div>
          </div>
          <Button onClick={() => setEditProfileOpen(true)} variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">{CompanyProfile.company.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{CompanyProfile.company.noOfEmployees} employees</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{CompanyProfile.Jobs} open positions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span>{CompanyProfile.company.website}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{CompanyProfile.company.companyOwner.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent onClick={() => navigate("/open-positions")} className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{CompanyProfile.Jobs}</div>
              <div className="text-sm text-muted-foreground">Open Positions</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent onClick={() => navigate("/total-applications")} className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{CompanyProfile.TotalApplications}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      
      {/* Edit Profile Modal */}
      <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </Card>
  );
};

export default CompanyProfile;
