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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

axios.defaults.withCredentials = true

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    company: "",
    email: "",
    phone: "",
    industry: ""
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const ViewProfDetails = async () => {
    const result = await axios.get(
      "http://localhost:8920/api/pro/employer/information",
      { withCredentials: true }
    );

    const { data } = result;

    setFormData({
      company: data.EmployerProf.company,
      email: data.EmployerProf.email,
      phone: data.EmployerProf.phone,
      industry: data.EmployerProf.industry
    });

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["ViewProfDetails"],
    queryFn: ViewProfDetails
  });

  const currentProfile = data?.EmployerProf?.profile;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (isLoading) return null;
  if (error) return null;

  const UpdateProf = async () => {
    try {
      // 1. upload photo if exists
      if (profilePhoto) {
        const photoForm = new FormData();
        photoForm.append("photo", profilePhoto);

        await axios.put(
          "http://localhost:8920/api/pro/employer/upload-photo",
          photoForm,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // 2. update profile data (JSON request)
      const response = await axios.put(
        "http://localhost:8920/api/pro/update/employer",
        {
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          industry: formData.industry,
        },
        { withCredentials: true }
      );

      await queryClient.invalidateQueries({ queryKey: ["profileEmployer"] });

      toast.success(response.data.message, {
        description: "Your Profile has been successfully updated!",
      });

      onOpenChange(false);
    } catch (error: any) {
      if (error.response) {
        toast.info(error.response.data.message);
      }
    }
  };

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
          {/* Profile Photo */}
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setProfilePhoto(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* Existing photo from server */}
            {!preview && currentProfile && (
              <img
                src={`http://localhost:8920${currentProfile}`}
                className="w-24 h-24 rounded-full object-cover"
                alt="profile"
              />
            )}

            {/* New selected file preview */}
            {preview && (
              <img
                src={preview}
                className="w-24 h-24 rounded-full object-cover"
                alt="preview"
              />
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company</Label>
              <Input
                id="company"
                name="company"
                defaultValue={data.EmployerProf.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={data.EmployerProf.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
                  <Select
                    defaultValue={data.EmployerProf.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.Industries?.map((skill: any) => (
                        <SelectItem key={skill._id} value={skill._id}>
                          {skill.title}
                        </SelectItem>
                      ))}
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