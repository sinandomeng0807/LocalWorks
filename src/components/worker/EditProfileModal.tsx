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
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

axios.defaults.withCredentials = true

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phoneNumber: "+1 (555) 123-4567",
    location: "Metro City, State",
    jobTitle: "Construction Worker",
    yearsOfExperience: "5 years",
    about_me: "Experienced construction worker with expertise in commercial and residential projects. Skilled in operating heavy machinery, reading blueprints, and working with various materials.",
    availability: "full-time",
    expected_salary: "$20-30/hr",
  });

  const [skills, setSkills] = useState([
    "Construction",
    "Heavy Machinery",
    "Blueprint Reading",
    "Concrete Work",
    "Carpentry",
    "Safety Compliance",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const ViewProfDetails = async () => {
    const result = await axios.get("http://localhost:8920/api/pro/worker/profile", { withCredentials: true })

    return result.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: ViewProfDetails
  })

  const styleDisplay = {
    display: "none"
  }

  useEffect(() => {
    if (data?.WorkerProf) {
      setSkills(data.WorkerProf.skills || []);
      setFormData({
        name: data.WorkerProf.name || "",
        email: data.WorkerProf.email || "",
        phoneNumber: data.WorkerProf.phoneNumber || "",
        location: data.WorkerProf.location || "",
        jobTitle: data.WorkerProf.jobTitle || "",
        yearsOfExperience: data.WorkerProf.yearsOfExperience || "",
        about_me: data.WorkerProf.about_me || "",
        availability: data.WorkerProf.availability || "",
        expected_salary: data.WorkerProf.expected_salary || "",
      });
    }
  }, [data]);

  if (isLoading) return <div style={styleDisplay}>Loading...</div>
  if (error) return <div style={styleDisplay}>Error: {error.message}</div>

  const UpdatePhoto = async () => {
    if (!photo) return;

    const formData = new FormData();
    formData.append("photo", photo);

    await axios.put(
      "http://localhost:8920/api/pro/worker/upload-photo",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
  };

  const UpdateProf = async () => {
    try {
      if (photo) {
        await UpdatePhoto();
      }

      const payload = {
        ...formData,
        skills,
        ...(formData.yearsOfExperience.trim() !== "" && {
          yearsOfExperience: formData.yearsOfExperience.trim()
        })
      };

      if (formData.yearsOfExperience.trim() === "") {
        delete payload.yearsOfExperience;
      }

      const response = await axios.put(
        "http://localhost:8920/api/pro/worker/updateProfile",
        payload,
        { withCredentials: true }
      );

      toast.success(response.data.message);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
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
            <Label>Profile Photo</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPhoto(file);

                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* Existing photo from server */}
            {!preview && data?.WorkerProf?.photo && (
              <img
                src={`http://localhost:8920${data.WorkerProf.photo}`}
                className="w-20 h-20 rounded-full object-cover"
                alt="profile"
              />
            )}

            {/* New selected file preview */}
            {preview && (
              <img
                src={preview}
                className="w-20 h-20 rounded-full object-cover"
                alt="preview"
              />
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Construction Worker"
                />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger id="company-name">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent defaultValue={"Choose a Skill Category"}>
                      {!data?.Locations?.length ? (
                        <SelectItem value="N/A">N/A</SelectItem>
                      ) : (
                        data.Locations.map((skill: any) => (
                          <SelectItem key={skill.name} value={skill.name}>
                            {skill.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience === "N/A" ? "" : formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
              />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-time</SelectItem>
                  <SelectItem value="Part-Time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_salary">Expected Salary</Label>
              <Input
                id="expected_salary"
                name="expected_salary"
                value={formData.expected_salary === "N/A" ? "" : formData.expected_salary}
                onChange={handleChange}
                placeholder="e.g., $20-30/hr"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="about_me">About Me</Label>
            <Textarea
              id="about_me"
              name="about_me"
              value={formData.about_me}
              onChange={handleChange}
              rows={4}
              placeholder="Tell employers about yourself, your experience, and what you're looking for..."
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button type="button" onClick={handleAddSkill} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
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