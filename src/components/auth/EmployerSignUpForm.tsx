import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "./PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "./FileUpload";
import OTPVerification from "./OTPVerification";
import axios from "axios";

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
    confirmPassword: "",
    phone: "",
    industry: "",
  });
  
  const [files, setFiles] = useState<{
    permit: File | null;
  }>({
    permit: null,
  });

  const Register = async () => {
    await axios.post("http://localhost:8920/api/auth/employer/register", {
      company: formData.companyName,
      email: formData.email,
      password: formData.password,
      phone: `+63${formData.phone}`,
      industry: formData.industry
    })
      .then(function (response: any) {
        alert(response.data.message)
        navigate("/employer-dashboard");
      })
      .catch(function (error: any) {
        if (error.response) {
          alert(error.response.data.message)
        }
      })
  }

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "agriculture", label: "Agriculture" },
  ];

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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Employer signup:", { ...formData, files });
    Register();
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
          placeholder="Enter your company or business name"
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
            placeholder="Enter your business email address"
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
        <Label htmlFor="employer-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="employer-confirm-password"
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
        value={formData.phone}
        onChange={(value) => setFormData({ ...formData, phone: value })}
      />

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="employer-industry">Industry</Label>
        <Select
          value={formData.industry}
          onValueChange={(value) => setFormData({ ...formData, industry: value })}
        >
          <SelectTrigger id="employer-industry">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent defaultValue={"Choose an industry"}>
            {industryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
