import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkerReportModal } from "./ReportEmployerModal";

import { toast } from "sonner";

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

const Reports = () => {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [workerModalOpen, setWorkerModalOpen] = useState(false)
  
  const [reportOpen, setReportOpen] = useState(false);
  const [reportId, setReportId] = useState("");
  const [reportType, setReportType] = useState("");

  const [description, setDescription] = useState("");
  const [submitEvidence, setEvidence] = useState(null);
  const [Evidences, SetEvidences] = useState(null);


  const fetchReports = async () => {
    const res = await axios.get("http://localhost:8920/api/pro/reports", { 
      withCredentials: true 
    });

    return res.data;
  };

  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["workerReports"],
    queryFn: fetchReports,
  });

  if (error) {
    return <p>Failed to load reports.</p>;
  }

  if (isLoading) {
    return <p>Loading reports...</p>;
  }

  const filteredReports = data.reports.filter((report) => {
    const statusMatch =
      statusFilter === "All" ||
      report.status === statusFilter;

    const typeMatch =
      typeFilter === "All" ||
      report.reportType === typeFilter;

    return statusMatch && typeMatch;
  });


  const updateReport = async (reportId: string, reportType: string, description: string, evidences: []) => {
    setReportOpen(true)
    setReportId(reportId)
    setReportType(reportType)
    setDescription(description)
    SetEvidences(evidences)
  }

  const handleSubmit = async (reportId: string, reportType: string, description: string) => {

    await axios.put("http://localhost:8920/api/pro/report", { reportId, reportType, description }, {
      withCredentials: true
    })

    alert("Success")
    setReportOpen(false)
    refetch()
  }

  const handleEvidences = async (reportId: string, submitEvidence) => {
    let ArraySubmit = []
    for (let SubmitIndex = 0; SubmitIndex < submitEvidence.length; SubmitIndex++) {
      ArraySubmit.push({
        fileName: submitEvidence[SubmitIndex].name,
        fileType: submitEvidence[SubmitIndex].type
      })
    }
    await axios.put("http://localhost:8920/api/pro/update/evidences", {
      reportId,
      submitEvidence: ArraySubmit
    }, { withCredentials: true })
      .then(function (response) {
        SetEvidences(response.data.ArraySubmit)
        toast.success(response.data.info)
      })
      .catch(function (error) {
        toast.error(error.response.data.info)
      })
  }

  
  const handleSubmitReport = async (SubmitEvidence) => {
    // Source: https://medium.com/@hassaanistic/image-handeling-using-multer-in-react-d7fea28e8dc6
    const formData = new FormData()
    const submittedExpected = SubmitEvidence.length;

    let fullStorage = false;
    let EvidenceArray = []

    for (let submitIndex = 0; submitIndex < SubmitEvidence.length; submitIndex++) {
      formData.append("submitEvidence", SubmitEvidence[submitIndex])

      EvidenceArray.push({
        fileName: SubmitEvidence[submitIndex].name,
        fileType: SubmitEvidence[submitIndex].type
      })
      
      if (submitEvidence[submitIndex].size > 1 * 1024 * 1024) {
        fullStorage = true
      }
    }

    if (fullStorage) {
      alert("Some of the files you were sending are too large.")
    } else {

      // Source: https://axios.rest/pages/advanced/error-handling:
      await axios.post("http://localhost:8920/api/pro/report/submit/evidence", formData, {
        withCredentials: true
      })
        .catch(function (error) {
          alert(`Error has occured`)
        })

      toast.success("Successfully reported employer.", {
        description: "You have successfully reported the employer"
      })

      setEvidence(null);
    }
  }



  return (
    <div className="space-y-4">

      <div className="flex gap-4 mb-4">

        <select
          className="
            border rounded-md 
            px-3 pr-10 py-2
            bg-background
            cursor-pointer
            appearance-none
            bg-no-repeat
          "
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">
            Under Review
          </option>
          <option value="Resolved">
            Resolved
          </option>
          <option value="Rejected">
            Rejected
          </option>
        </select>


        <select
          className="
            border rounded-md 
            px-3 pr-10 py-2
            bg-background
            cursor-pointer
            appearance-none
            bg-no-repeat
          "
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Fake Job">
            Fake Job
          </option>
          <option value="No Payment">
            No Payment
          </option>
          <option value="Harassment">
            Harassment
          </option>
          <option value="Fraud">
            Fraud
          </option>
          <option value="Other">
            Other
          </option>
        </select>

      </div>


      <button
        onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to delete all reports?"
          );

          if (!confirmed) return;

          // deleteReportMutation.mutate({
          //   type: "deleteAll",
          // });
        }}
        className="border rounded-md px-4 py-2"
      >
        Delete All Reports
      </button>



      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            No reports submitted.
          </CardContent>
        </Card>
      ) : (
        filteredReports.map((report: any) => (
          <Card key={report._id}>
            <CardHeader>
              <CardTitle>
                {report.reportType}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p>
                <strong>Status: </strong>
                {report.status}
              </p>


              <p className="mb-2">
                <strong>Description: </strong>
                {report.description}
              </p>

              <div>
                <Button className="border rounded-md px-3 py-1 mt-4" onClick={() => updateReport(report._id, report.reportType, report.description, report.submitEvidence)}>Update Report</Button>
                <Button className="border rounded-md px-3 py-1 mt-4 ml-1">Delete Report</Button>
              </div>

            </CardContent>
          </Card>
        ))
      )}

     <Dialog
        open={reportOpen}
        onOpenChange={setReportOpen}
          >
            <DialogContent>
      
              <DialogHeader>
                <DialogTitle>
                  Report Employer
                </DialogTitle>
              </DialogHeader>
      
      
              <div className="space-y-4">
      
                <Select
                  defaultValue={reportType !== "Fake Job" && reportType !== "No Payment" && reportType !== "Harassment" && reportType !== "Fraud" ? "Others" : reportType}
                  onValueChange={setReportType}
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
      
                {reportType !== "Fake Job" && reportType !== "No Payment" && reportType !== "Harassment" && reportType !== "Fraud" ? (
                  <Input
                    placeholder={"Enter Report"}
                    defaultValue={reportType === "Others" ? "" : reportType}
                    onChange={(Event) => setReportType(Event.target.value)}
                  />
                ) : (
                  <div></div>
                )}
      
                <Textarea
                  placeholder="Explain the issue..."
                  defaultValue={description}
                  onChange={(Event) => setDescription(Event.target.value)}
                />

                {/* https://phppot.com/react/multi-file-upload-in-react-js/ */}

                {/** // Source - https://stackoverflow.com/a/67325576
// Posted by buzatto
// Retrieved 2026-09-28, License - CC BY-SA 4.0

  const [inputVal, setInputVal] = useState("");

  const updateInput = (e) => {
    const val = e.target.value;
    setInputVal(val);
  }

  const sendData = async () => {
    //handle async backend processing with inputVal
    setInputVal("");
    //rerender
  }

  return (
    <>
      <button className="input-button" onClick={sendData}>Send Data</button>
      <input className="input-field" onChange={updateInput} placeHolder="Input name." value={inputVal}/>
    </>
  );
 */}
                <Input 
                  type="file"
                  onChange={(Event) => {
                    setEvidence(Event.target.files)
                    handleSubmitReport(Event.target.files)
                    handleEvidences(reportId, Event.target.files)
                  }}
                  multiple
                />


                {/** Sa line na ito, ang nangyayari is parang if marami kang nagsusubmit ng file, eh di, ang result is yung list ay nagtatake over ng buong screen */}
                {Evidences !== null ? Evidences.map((evidence) => {
                  return (
                    <div
                      key={evidence.name}
                      className="mt-2 flex items-center gap-2"
                    >
                      <a
                        href={`http://localhost:8920/uploads/reports/${evidence.fileName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block h-10 min-w-0 flex-1 truncate rounded-md bg-gray-100 px-3 py-2 text-sm text-blue-600 underline transition-colors hover:bg-gray-200 hover:text-blue-800"
                      >
                        {evidence.fileName}
                      </a>

                      {/** Wala pa ang delete function, ibig sabihin pag napindot mo ito, hindi siya magdedelete, kaya dapat meron siyang attribute na onClick={deleteReport(evidence.fileName)} */}
                      <button
                        type="button"
                        className="h-10 w-10 rounded-md bg-red-100 text-red-600 transition-colors hover:bg-red-200 hover:text-red-800"
                      >
                        X
                      </button>
                    </div>
                  )
                }) : <div>No evidences</div>}

      
                <Button
                  className="w-full"
                  onClick={() => handleSubmit(reportId, reportType, description)}
                >
                  Submit Changes
                </Button>
      
              </div>
      
            </DialogContent>
          </Dialog>
    </div>

    
  );
};

export default Reports;