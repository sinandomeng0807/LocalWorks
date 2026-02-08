import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, Briefcase, Edit, Globe, Mail, Phone } from "lucide-react";

const mockCompanyProfile = {
  name: "Tech Solutions Inc.",
  industry: "Technology",
  location: "Downtown, Metro City",
  website: "www.techsolutions.com",
  email: "hr@techsolutions.com",
  phone: "+1 (555) 123-4567",
  description: "We are a leading technology company specializing in innovative software solutions for businesses of all sizes.",
  employeeCount: "50-100",
  openPositions: 5,
  totalApplications: 12,
  logo: "",
};

const CompanyProfile = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={mockCompanyProfile.logo} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {mockCompanyProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{mockCompanyProfile.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{mockCompanyProfile.industry}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                {mockCompanyProfile.location}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">{mockCompanyProfile.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{mockCompanyProfile.employeeCount} employees</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{mockCompanyProfile.openPositions} open positions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span>{mockCompanyProfile.website}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{mockCompanyProfile.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{mockCompanyProfile.openPositions}</div>
              <div className="text-sm text-muted-foreground">Open Positions</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{mockCompanyProfile.totalApplications}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyProfile;
