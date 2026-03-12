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
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "Metro City, State",
    title: "Construction Worker",
    experience: "5 years",
    bio: "Experienced construction worker with expertise in commercial and residential projects. Skilled in operating heavy machinery, reading blueprints, and working with various materials.",
    availability: "full-time",
    expectedSalary: "$20-30/hr",
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

  const ViewProfDetails = async () => {
    const result = await axios.get("http://localhost:8920/api/pro/worker/profile", { withCredentials: true })
    const { data } = result
    setSkills(data.WorkerProf.skills)
    setFormData({
      name: data.WorkerProf.name,
      email: data.WorkerProf.email,
      phone: data.WorkerProf.phoneNumber,
      location: data.WorkerProf.location,
      title: data.WorkerProf.skillCategory,
      experience: data.WorkerProf.yearsOfExperience,
      bio: data.WorkerProf.about_me,
      availability: data.WorkerProf.availability,
      expectedSalary: data.WorkerProf.expected_salary,
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
    await axios.put("http://localhost:8920/api/pro/worker/updateProfile", formData, { withCredentials: true })
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={data.WorkerProf.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
                  <Select
                    defaultValue={data.WorkerProf.skillCategory}
                    onValueChange={(value) => setFormData({ ...formData, title: value })}
                  >
                    <SelectTrigger id="company-name">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent defaultValue={"Choose a Skill Category"}>
                      {!data.Skills.length ? "N/A" : data.Skills.map((skill: any) => <SelectItem value={skill._id}>{skill.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={data.WorkerProf.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={data.WorkerProf.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
                  <Select
                    defaultValue={data.WorkerProf.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger id="company-name">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent defaultValue={"Choose a Skill Category"}>
                      {!data.Locations.length ? "N/A" : data.Locations.map((skill: any) => <SelectItem value={skill._id}>{skill.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                defaultValue={data.WorkerProf.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
              />
            </div>
          </div>

          {/* Availability & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                defaultValue={data.WorkerProf.availability}
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
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                defaultValue={data.WorkerProf.salary}
                onChange={handleChange}
                placeholder="e.g., $20-30/hr"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={data.WorkerProf.about_me}
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