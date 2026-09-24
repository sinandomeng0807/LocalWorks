import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Eye,
} from "lucide-react";
import { Job } from "@/lib/jobsStore";
import { useState } from "react";
import JobDetailModal from "./JobDetailModal";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CompanyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  Worker;
  Employer;
  Description;
  Type;
  SubmitEvidence;
  Sender;
  Status;
  SetStatus;
  ID;
}

const ReportDetailsModal = ({
  open,
  onOpenChange,
  Worker,
  Employer,
  Description,
  Type,
  SubmitEvidence,
  Sender,
  Status,
  SetStatus,
  ID
}: CompanyDetailModalProps) => {
    const queryClient = useQueryClient();
  
  const updateReportStatus = async (_id: string, status: string) => {
    try {
      await axios.patch(
        "http://localhost:8920/api/admin/update/report",
        {
          _id,
          status,
        },
        {
          withCredentials: true,
        }
      );

      await queryClient.invalidateQueries({
        queryKey: ["Reports"],
      });

      toast.success("Report status updated");
    } catch (error) {
      toast.error("Failed to update report status");
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{Type}</DialogTitle>
          </DialogHeader>
          {Description}
          <div>
            {Sender === "worker" ? (
              <div>
                <strong>From:</strong> {Worker} <br></br>
                <strong>To:</strong> {Employer}
              </div>
            ) : (
              <div>
                <strong>From:</strong> {Employer} <br></br>
                <strong>To:</strong> {Worker}
              </div>
            )}
          </div>

          <Select
            defaultValue={Status}
            onValueChange={(value) => updateReportStatus(ID, value)}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportDetailsModal;