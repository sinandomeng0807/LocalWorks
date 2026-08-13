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

const Reports = () => {
  const queryClient = useQueryClient();

  const updateStatus = async ({
    report,
    status,
    recipientId,
  }: {
    report: string;
    status: string;
    recipientId: string;
  }) => {
    const res = await axios.patch(
      "http://localhost:8920/api/pro/employer/report",
      {
        report,
        status,
        recipientId,
      },
      {
        withCredentials: true,
      }
    );

    return res.data;
  };

  const deleteReport = async ({
    _id,
    type,
  }: {
    _id?: string;
    type: "deleteAll" | "deleteById";
  }) => {
    const res = await axios.delete(
      "http://localhost:8920/api/pro/delete/report",
      {
        data: {
          _id,
          type,
        },
        withCredentials: true,
      }
    );

    return res.data;
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employerReports"],
      });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: deleteReport,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employerReports"],
      });
    },
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchReports = async () => {
    const res = await axios.get(
      "http://localhost:8920/api/pro/employer/reports",
      { withCredentials: true }
    );

    return res.data;
  };

  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["employerReports"],
    queryFn: fetchReports,
  });

  if (error) {
    return <p>Failed to load reports.</p>;
  }

  if (isLoading) {
    return <p>Loading reports...</p>;
  }

  const filteredReports = reports.filter((report) => {
    const statusMatch =
      statusFilter === "All" ||
      report.status === statusFilter;

    const typeMatch =
      typeFilter === "All" ||
      report.reportType === typeFilter;

    return statusMatch && typeMatch;
  });

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

          deleteReportMutation.mutate({
            type: "deleteAll",
          });
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
                <strong>Worker:</strong>{" "}
                {report.workerId?.name}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {report.status}
              </p>


              <p className="mt-9">
                {report.description}
              </p>

              <select
                value={report.status}
                onChange={(e) =>
                  updateStatusMutation.mutate({
                    report: report._id,
                    status: e.target.value,
                    recipientId: report.workerId._id,
                  })
                }
                className="border rounded-md px-2 py-1 mt-6"
              >

                <option value="Pending">
                  Pending
                </option>

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

              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this report?"
                  );

                  if (!confirmed) return;

                  deleteReportMutation.mutate({
                    _id: report._id,
                    type: "deleteById",
                  })
                }}
                className="border rounded-md px-3 py-1 mt-4"
              >
                Delete Report
              </button>

            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Reports;