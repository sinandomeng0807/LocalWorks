import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
}

const LoginModal = ({ open, onOpenChange, onSwitchToSignUp, onSuccess }: LoginModalProps) => {
  const navigate = useNavigate();
  const [workerCredentials, setWorkerCredentials] = useState({ email: "", password: "" });
  const [employerCredentials, setEmployerCredentials] = useState({ email: "", password: "" });
  const [showWorkerPassword, setShowWorkerPassword] = useState(false);
  const [showEmployerPassword, setShowEmployerPassword] = useState(false);

  const handleWorkerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Worker login:", workerCredentials);
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/worker-dashboard");
    }
  };

  const handleEmployerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Employer login:", employerCredentials);
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/employer-dashboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Welcome Back</DialogTitle>
          <DialogDescription className="text-base">
            Log in to your LocalWorks account
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="worker" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="worker" className="gap-2">
              <User className="w-4 h-4" />
              Worker
            </TabsTrigger>
            <TabsTrigger value="employer" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Employer
            </TabsTrigger>
          </TabsList>

          {/* Worker Login */}
          <TabsContent value="worker">
            <form onSubmit={handleWorkerLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="worker-email">Email</Label>
                <Input
                  id="worker-email"
                  type="email"
                  placeholder="john@example.com"
                  value={workerCredentials.email}
                  onChange={(e) => setWorkerCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="worker-password">Password</Label>
                <div className="relative">
                  <Input
                    id="worker-password"
                    type={showWorkerPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={workerCredentials.password}
                    onChange={(e) => setWorkerCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWorkerPassword(!showWorkerPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showWorkerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Login as Worker
              </Button>
            </form>
          </TabsContent>

          {/* Employer Login */}
          <TabsContent value="employer">
            <form onSubmit={handleEmployerLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employer-email">Email</Label>
                <Input
                  id="employer-email"
                  type="email"
                  placeholder="jane@company.com"
                  value={employerCredentials.email}
                  onChange={(e) => setEmployerCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer-password">Password</Label>
                <div className="relative">
                  <Input
                    id="employer-password"
                    type={showEmployerPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={employerCredentials.password}
                    onChange={(e) => setEmployerCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmployerPassword(!showEmployerPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showEmployerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Login as Employer
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-2">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
