import { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";


interface ReportWorkerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
}





export const EmployerReportModal = (val: { open: boolean, onOpenChange: (open: boolean) => void, reportId: string, reportType: string, description: string }) => {
  const [ReportType, SetReportType] = useState(null)
  const [Description, SetDescription] = useState(null)
  const [OnOpen, OnOpenChange] = useState(true)
  const [Reason, SetReason] = useState(null)

  const handleSubmit = async () => {
    await axios.put("http://localhost:8920/api/pro/report", {
      reportId: val.reportId,
      reportType: Reason === null ? ReportType === null ? val.reportType : ReportType : Reason,
      description: Description === null ? val.description : Description
    })
  }

  return (
    <Dialog
      open={OnOpen ? val.open : false}
      onOpenChange={val.onOpenChange}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Report Employer
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4">

          <Select
            defaultValue={val.reportType !== "Fake Job" && val.reportType !== "No Payment" && val.reportType !== "Harassment" && val.reportType !== "Fraud" ? "Others" : val.reportType}
            onValueChange={SetReportType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Fake Job">Fake Job</SelectItem>
              <SelectItem value="No Payment">No Payment</SelectItem>
              <SelectItem value="Harassment">Harassment</SelectItem>
              <SelectItem value="Fraud">Fraud</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>

          {val.reportType !== "Fake Job" && val.reportType !== "No Payment" && val.reportType !== "Harassment" && val.reportType !== "Fraud" ? (
            <Input
              placeholder={"Enter Report"}
              defaultValue={val.reportType}
              onChange={(Event) => {
                SetReason(Event.target.value)
                SetReportType("Others")
              }}
              className={ReportType === null || ReportType === "Others" ? "display" : "hidden"}
            />
          ) : (
            <Input
              placeholder={"Enter Report"}
              defaultValue={val.reportType}
              onChange={(Event) => {
                SetReason(Event.target.value)
                SetReportType("Others")
              }}
              className={ReportType === null || ReportType !== "Others" ? "hidden" : "display"}
            />
          )}

          <Textarea
            placeholder="Explain the issue..."
            defaultValue={val.description}
            onChange={(Event) => SetDescription(Event.target.value)}
          />


          <Button
            className="w-full"
            onClick={() => {
              handleSubmit()
              OnOpenChange(false)
            }}
          >
            Submit Changes
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
};


const ReportWorkerModal = ({
  open,
  onOpenChange,
  workerId
}: ReportWorkerModalProps) => {

  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [otherReason, setOtherReason] = useState("");


  const submitReport = async () => {
    if (!reportType || !description) {
      toast.error("Complete all fields");
      return;
    }

    if (reportType === "Other" && !otherReason.trim()) {
      toast.error("Please specify the reason");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8920/api/pro/report/employer", // or your employer endpoint
        {
          workerId,
          reportType:
            reportType === "Other"
              ? otherReason
              : reportType,
          description,
          reportCategory: "Default Category"
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Report submitted");

      setReportType("");
      setOtherReason("");
      setDescription("");

      onOpenChange(false);
    } catch (error) {
      alert(error)
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Report Worker
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4">

          <Select
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Fake Job">
                Fake Job
              </SelectItem>

              <SelectItem value="No Payment">
                No Payment
              </SelectItem>

              <SelectItem value="Harassment">
                Harassment
              </SelectItem>

              <SelectItem value="Fraud">
                Fraud
              </SelectItem>

              <SelectItem value="Other">
                Other
              </SelectItem>
            </SelectContent>
          </Select>

          {reportType === "Other" && (
            <Input
              placeholder="Enter the reason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}


          <Textarea
            placeholder="Explain the issue..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />


          <Button
            className="w-full"
            onClick={submitReport}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Report"}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
};


export default ReportWorkerModal;