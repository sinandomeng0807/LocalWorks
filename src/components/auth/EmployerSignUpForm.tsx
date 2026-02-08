import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "./PhoneInput";
import FileUpload from "./FileUpload";
import OTPVerification from "./OTPVerification";

interface EmployerSignUpFormProps {
  onClose: () => void;
}

const EmployerSignUpForm = ({ onClose }: EmployerSignUpFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    phone: "",
    industry: "",
  });
  
  const [files, setFiles] = useState<{
    permit: File | null;
  }>({
    permit: null,
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

    console.log("Employer signup:", { ...formData, files });
    onClose();
    navigate("/employer-dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="company-name">Company/Business Name</Label>
        <Input
          id="company-name"
          name="companyName"
          type="text"
          placeholder="ABC Construction"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email with OTP */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="employer-email">Email</Label>
          <Input
            id="employer-email"
            name="email"
            type="email"
            placeholder="contact@company.com"
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
        <Label htmlFor="employer-password">Password</Label>
        <div className="relative">
          <Input
            id="employer-password"
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

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="employer-industry">Industry</Label>
        <Input
          id="employer-industry"
          name="industry"
          type="text"
          placeholder="e.g., Construction, Manufacturing"
          value={formData.industry}
          onChange={handleChange}
          required
        />
      </div>

      {/* Business Permit Upload */}
      <FileUpload
        label="Business/Company Permit"
        accept="image/*,.pdf"
        onChange={(file) => setFiles({ ...files, permit: file })}
        helpText="Upload a photo or scan of your business permit"
        type="image"
      />

      <Button type="submit" className="w-full" size="lg" disabled={!isEmailVerified}>
        Sign Up as Employer
      </Button>
    </form>
  );
};

export default EmployerSignUpForm;
