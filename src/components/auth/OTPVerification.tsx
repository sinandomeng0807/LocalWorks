import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
}

const OTPVerification = ({ email, onVerified, onResend }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0 && !isVerified) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isVerified]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      onVerified();
    }, 1500);
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    onResend();
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <span className="text-sm text-primary">Email verified</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Enter OTP sent to {email}</Label>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-semibold"
            />
          ))}
        </div>
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
      </div>

      <Button 
        type="button" 
        onClick={handleVerify} 
        className="w-full"
        disabled={isVerifying || otp.join("").length !== 6}
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {countdown > 0 ? (
          <>Resend OTP in {countdown}s</>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:underline"
          >
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
};

export default OTPVerification;
