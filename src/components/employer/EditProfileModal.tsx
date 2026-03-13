import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

axios.defaults.withCredentials = true

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    phone: "",
    industry: ""
  });

  const ViewProfDetails = async () => {
    const result = await axios.get("http://localhost:8920/api/pro/employer/information", { withCredentials: true })
    const { data } = result
    setFormData({
      company: data.EmployerProf.company,
      email: data.EmployerProf.email,
      phone: data.EmployerProf.phone,
      industry: data.EmployerProf.industry
    })
    return result.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['ViewProfDetails'],
    queryFn: ViewProfDetails
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const UpdateProf = async () => {
    await axios.put("http://localhost:8920/api/pro/update/employer", formData, { withCredentials: true })
      .then(function (response) {
        if (response.data) {
          toast.success(response.data.message, {
            description: "Your Profile has been successfully updated!"
          })
          onOpenChange(false)
        }
      })
      .catch(function (error) {
        if (error.response) {
          toast.info(error.response.data.message)
        }
      })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    UpdateProf()
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information to help employers find you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company</Label>
              <Input
                id="name"
                name="name"
                defaultValue={data.EmployerProf.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={data.EmployerProf.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={data.EmployerProf.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
                  <Select
                    defaultValue={data.EmployerProf.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent defaultValue={"Choose a Skill Category"}>
                      {!data.Industries ? "N/A" : data.Industries.map((skill: any) => <SelectItem value={skill._id}>{skill.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
            </div>
          </div>

          


          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;