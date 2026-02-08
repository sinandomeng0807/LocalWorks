import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "./PhoneInput";
import FileUpload from "./FileUpload";
import OTPVerification from "./OTPVerification";

interface WorkerSignUpFormProps {
  onClose: () => void;
}

const WorkerSignUpForm = ({ onClose }: WorkerSignUpFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
  });
  
  const [files, setFiles] = useState<{
    photo: File | null;
    resume: File | null;
  }>({
    photo: null,
    resume: null,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      alert("Please verify your email first");
      return;
    }

    console.log("Worker signup:", { ...formData, files });
    onClose();
    navigate("/worker-dashboard");
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
          placeholder="Juan Dela Cruz"
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
            placeholder="juan@example.com"
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
            placeholder="••••••••"
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

      {/* Phone Number */}
      <PhoneInput
        value={formData.phone}
        onChange={(value) => setFormData({ ...formData, phone: value })}
      />

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="worker-skills">Skills</Label>
        <Input
          id="worker-skills"
          name="skills"
          type="text"
          placeholder="e.g., Carpentry, Plumbing, Electrical"
          value={formData.skills}
          onChange={handleChange}
          required
        />
      </div>

      {/* CV/Resume Upload */}
      <FileUpload
        label="CV / Resume"
        accept=".pdf,.doc,.docx"
        onChange={(file) => setFiles({ ...files, resume: file })}
        helpText="Upload your CV or resume (PDF, DOC, DOCX)"
        type="document"
      />

      <Button type="submit" className="w-full" size="lg" disabled={!isEmailVerified}>
        Sign Up as Worker
      </Button>
    </form>
  );
};

export default WorkerSignUpForm;
