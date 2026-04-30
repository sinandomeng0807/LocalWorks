import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

axios.defaults.withCredentials = true;

interface PostJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Location {
  _id: string;
  name: string;
}

const PostJobModal = ({ open, onOpenChange }: PostJobModalProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                Form State                                  */
  /* -------------------------------------------------------------------------- */
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    type: "Full-Time",
    description: "",
    requirements: "",
    benefits: "",
    schedule: "",
    positions: 1,
    applyBefore: "",
    startDate: "",
    category: "", // required
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                             Fetch Locations                                */
  /* -------------------------------------------------------------------------- */
  const fetchLocations = async () => {
    const { data } = await axios.get("http://localhost:8920/api/pro/Locations", { withCredentials: true });
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetchLocations"],
    queryFn: fetchLocations,
  });

  const locations = data?.Locations || [];

  const fetchIndustries = async () => {
    const { data } = await axios.get("http://localhost:8920/api/pro/Industries");
    return data;
  };

  const { data: industryData, isLoading: industryLoading } = useQuery({
    queryKey: ["Industries"],
    queryFn: fetchIndustries,
  });

  const industries = industryData?.Industries || [];

  /* -------------------------------------------------------------------------- */
  /*                             Tag Management                                 */
  /* -------------------------------------------------------------------------- */
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             Submit Job                                     */
  /* -------------------------------------------------------------------------- */
  const postJob = async () => {
    try {
      const payload = {
        title: formData.title,
        company: "Your Company",
        posted: "EMPLOYER_ID",
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        description: formData.description,
        requirements: formData.requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        benefits: formData.benefits
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean),
        tags: tags.length > 0 ? tags : ["New Posting"],
        schedule: formData.schedule,
        startDate: formData.startDate || undefined,
        positions: Number(formData.positions),
        applyBefore: formData.applyBefore,
        category: formData.category, // required
      };

      const { data } = await axios.post(
        "http://localhost:8920/api/pro/createJob",
        payload
      );

      toast.success(data.message, {
        description:
          "Workers can now view and apply to your job posting.",
      });

      // Reset form
      setFormData({
        title: "",
        location: "",
        salary: "",
        type: "Full-Time",
        description: "",
        requirements: "",
        benefits: "",
        schedule: "",
        positions: 1,
        applyBefore: "",
        startDate: "",
        category: "", // reset
      });
      setTags([]);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create job."
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             Form Validation                                */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.location ||
      !formData.salary ||
      !formData.description ||
      !formData.schedule ||
      !formData.applyBefore ||
      !formData.positions ||
      !formData.category
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    postJob();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Post a New Job
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a job posting that workers can apply to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Title *</Label>
                <Input
                  placeholder="e.g., Construction Worker"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Job Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) =>
                    setFormData({ ...formData, location: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoading
                          ? "Loading locations..."
                          : error ? "Failed to load locations" : "Select location"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location: any) => (
                      <SelectItem key={location._id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        industryLoading ? "Loading categories..." : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry: any) => (
                      <SelectItem key={industry._id} value={industry.title}>
                        {industry.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Salary/Rate *</Label>
                <Input
                  placeholder="e.g., ₱15,000/month"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Job Description *</Label>
              <Textarea
                rows={4}
                placeholder="Describe the job responsibilities and requirements..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Additional Details
            </h3>

            <div className="space-y-2">
              <Label>Requirements (one per line)</Label>
              <Textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requirements: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Benefits (one per line)</Label>
              <Textarea
                rows={3}
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Positions *</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.positions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      positions: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Apply Before *</Label>
                <Input
                  type="date"
                  value={formData.applyBefore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applyBefore: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Work Schedule *</Label>
              <Input
                placeholder="e.g., Monday to Friday, 8 AM - 5 PM"
                value={formData.schedule}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Post Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobModal;