import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "./PhoneInput";
import FileUpload from "./FileUpload";
import OTPVerification from "./OTPVerification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import axios from "axios"
axios.defaults.withCredentials = true;

interface WorkerSignUpFormProps {
  onClose: () => void;
}

interface WorkerFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  skills: string[];
  skillCategory: string;
}

interface SkillCategory {
  _id: string;
  title: string;
}

const WorkerSignUpForm = ({ onClose }: WorkerSignUpFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const [formData, setFormData] = useState<WorkerFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    skills: [],
    skillCategory: ""
  });
  
  const [files, setFiles] = useState<{
    photo: File | "";
    resume: File | "";
  }>({
    photo: "",
    resume: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset verification if email changes
    if (e.target.name === "email" && isEmailVerified) {
      setIsEmailVerified(false);
    }
  };

  const handleSendOTP = () => {
    if (formData.email && formData.email.includes("@")) {
      setStep("otp");
      // Simulate sending OTP to email
      console.log("OTP sent to " + formData.email);
    }
  };

  const submit = async () => {
    await axios.post("http://localhost:8920/api/auth/worker/register", {
      ...formData, skills, phoneNumber: `+63${formData.phoneNumber}`, files: {
        photo: files.photo,
        resume: files.resume
      }
    }, { withCredentials: true })
      .then((response) => {
        alert(response.data.message)
        navigate("/worker-dashboard");
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message)
        } else if (error.request) {
          alert(error.request)
        } else {
          alert("Error: " + error.message)
        }
      })
  }

  const skillCategoryOptions = [
    { value: "communication", label: "Communication" },
    { value: "leadership", label: "Leadership" },
    { value: "critical-thinking", label: "Critical Thinking" },
    { value: "data-analysis", label: "Data Analysis" },
    { value: "technical-proficiency", label: "Technical Proficiency" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      alert("Please verify your email first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    submit();
    console.log("Worker signup:", { ...formData, files });
    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Photo Upload */}
      <FileUpload
        label="Profile Photo"
        accept="image/*"
        onChange={(file) => setFiles({ ...files, photo: file })}
        helpText="Upload a clear photo of yourself"
        type="image"
      />

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="worker-name">Full Name</Label>
        <Input
          id="worker-name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email with OTP */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="worker-email">Email</Label>
          <Input
            id="worker-email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEmailVerified}
          />
        </div>
        
        {step === "form" && formData.email.includes("@") && !isEmailVerified && (
          <Button type="button" variant="secondary" onClick={handleSendOTP} className="w-full">
            Send OTP to Email
          </Button>
        )}
        
        {step === "otp" && !isEmailVerified && (
          <OTPVerification
            email={formData.email}
            onVerified={() => {
              setIsEmailVerified(true);
              setStep("form");
            }}
            onResend={() => console.log("OTP resent to " + formData.email)}
          />
        )}
        
        {isEmailVerified && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-sm text-primary">✓ Email verified</span>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="worker-password">Password</Label>
        <div className="relative">
          <Input
            id="worker-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="worker-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="worker-confirm-password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Phone Number */}
      <PhoneInput
        value={formData.phoneNumber}
        onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
      />

      <div className="space-y-2">
                <Label htmlFor="skillCategory">Skill Category</Label>
                <Select
                  value={formData.skillCategory}
                  onValueChange={(value) => setFormData({ ...formData, skillCategory: value })}
                >
                  <SelectTrigger id="skillCategory">
                    <SelectValue placeholder="Select a skill category" />
                  </SelectTrigger>
                  <SelectContent defaultValue={"Choose a Skill Category"}>
                    {skillCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>



      <div className="space-y-2">
          <Label htmlFor="skills">Add Skills</Label>
          <div className="flex gap-2">
            <Input
              id="skills"
              placeholder="e.g., Physical Labor, No Experience Needed"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddSkill}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={!isEmailVerified}>
          Sign Up as Worker
        </Button>
    </form>
  );
};

export default WorkerSignUpForm;
