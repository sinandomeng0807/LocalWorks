import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Job } from "@/lib/jobsStore";
import { exportToCSV } from "@/lib/csvExport";
import { toast } from "sonner";

const BAR_COLORS = [
  "hsl(24, 85%, 50%)",
  "hsl(40, 70%, 55%)",
  "hsl(174, 42%, 45%)",
  "hsl(0, 70%, 55%)",
  "hsl(45, 80%, 50%)",
];

interface AdminReportsProps {
  jobs: Job[];
}

// Mock data for charts
const workerGrowthData = [
  { month: "7 Jan", newWorkers: 3, activeWorkers: 2 },
  { month: "11 Jan", newWorkers: 10, activeWorkers: 5 },
  { month: "25 Sep", newWorkers: 7, activeWorkers: 8 },
  { month: "20 Sep", newWorkers: 8, activeWorkers: 10 },
  { month: "24 Sep", newWorkers: 12, activeWorkers: 14 },
  { month: "27 Sep", newWorkers: 15, activeWorkers: 17 },
  { month: "28 Sep", newWorkers: 14, activeWorkers: 15 },
  { month: "29 Aug", newWorkers: 18, activeWorkers: 13 },
  { month: "30 Aug", newWorkers: 16, activeWorkers: 19 },
];

const jobPerformanceData = [
  { month: "Jan", posted: 12, filled: 8, expired: 2 },
  { month: "Feb", posted: 15, filled: 10, expired: 3 },
  { month: "Mar", posted: 20, filled: 14, expired: 4 },
  { month: "Apr", posted: 18, filled: 16, expired: 1 },
  { month: "May", posted: 25, filled: 20, expired: 3 },
  { month: "Jun", posted: 22, filled: 18, expired: 2 },
  { month: "Jul", posted: 28, filled: 22, expired: 4 },
  { month: "Aug", posted: 30, filled: 25, expired: 3 },
];

const categoryTableData = [
  { name: "Hospitality", activeJobs: 15, avgApplicants: 22, acceptanceRate: 90, verifiedWorkers: 5 },
  { name: "Warehouse", activeJobs: 11, avgApplicants: 27, acceptanceRate: 90, verifiedWorkers: 11 },
  { name: "Construction", activeJobs: 10, avgApplicants: 35, acceptanceRate: 85, verifiedWorkers: 36 },
  { name: "Security", activeJobs: 9, avgApplicants: 20, acceptanceRate: 80, verifiedWorkers: 10 },
  { name: "Warehouse", activeJobs: 3, avgApplicants: 24, acceptanceRate: 70, verifiedWorkers: 12 },
  { name: "Driving", activeJobs: 4, avgApplicants: 14, acceptanceRate: 90, verifiedWorkers: 8 },
  { name: "Cleaning", activeJobs: 7, avgApplicants: 18, acceptanceRate: 85, verifiedWorkers: 15 },
];

const placementData = [
  { name: "Hospitality", value: 6 },
  { name: "Warehouse", value: 10 },
  { name: "Construction", value: 9 },
  { name: "Security", value: 4 },
  { name: "Klimt...", value: 5 },
];

const AdminReports = ({ jobs }: AdminReportsProps) => {
  const [activeTab, setActiveTab] = useState("worker");

  const handleExport = () => {
    exportToCSV(
      jobs.map(({ id, title, company, location, salary, type, posted, status }) => ({
        id, title, company, location, salary, type, posted, status: status || "pending",
      })),
      "reports"
    );
    toast.success("Report exported successfully!");
  };

  return (
    <main className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Detailed Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">Analyze application performance and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent gap-1 p-0 h-auto border-b border-border rounded-none w-full justify-start">
          {[
            { value: "worker", label: "Worker Performance" },
            { value: "job", label: "Job Performance" },
            { value: "category", label: "Category Detailed Data" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-4 pb-2 text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content based on tab */}
      {activeTab === "worker" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Worker Growth Chart */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-base font-semibold text-foreground">Worker Growth</h3>
              <p className="text-xs text-muted-foreground mb-4">Worker Registration Trends</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={workerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="newWorkers" name="New Workers" stroke="hsl(24, 85%, 50%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(24, 85%, 50%)" }} />
                  <Line type="monotone" dataKey="activeWorkers" name="Active Workers" stroke="hsl(174, 42%, 45%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(174, 42%, 45%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Payment Summary */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground">Payment Summary</h3>
                <p className="text-xs text-muted-foreground mb-4">Completed Placements by Category</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={placementData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {placementData.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Overall Application Health */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground">Overall Application Health</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Verification Rate:</span>
                    <span className="font-semibold text-foreground">95%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average Match Time:</span>
                    <span className="font-semibold text-foreground">12 Hrs</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average Response Time:</span>
                    <span className="font-semibold text-foreground">10 Mins</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Platform Uptime:</span>
                    <span className="font-semibold text-foreground">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Table - full width below */}
          <div className="lg:col-span-2">
            <CategoryTable data={categoryTableData} />
          </div>
        </div>
      )}

      {activeTab === "job" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-base font-semibold text-foreground">Job Posting Trends</h3>
              <p className="text-xs text-muted-foreground mb-4">Monthly job activity overview</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={jobPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="posted" name="Posted" stroke="hsl(24, 85%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="filled" name="Filled" stroke="hsl(174, 42%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expired" name="Expired" stroke="hsl(0, 70%, 55%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground">Job Stats Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Jobs Posted:</span>
                    <span className="font-semibold text-foreground">{jobs.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Accepted:</span>
                    <span className="font-semibold text-foreground">{jobs.filter(j => j.status === "accepted").length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-semibold text-foreground">{jobs.filter(j => j.status === "pending").length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rejected:</span>
                    <span className="font-semibold text-foreground">{jobs.filter(j => j.status === "rejected").length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fill Rate:</span>
                    <span className="font-semibold text-foreground">
                      {jobs.length > 0 ? Math.round((jobs.filter(j => j.status === "accepted").length / jobs.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <CategoryTable data={categoryTableData} />
          </div>
        </div>
      )}

      {activeTab === "category" && (
        <div className="space-y-4">
          <CategoryTable data={categoryTableData} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground">Placements by Category</h3>
                <p className="text-xs text-muted-foreground mb-4">Completed placements breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={placementData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {placementData.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground">Category Health</h3>
                <div className="space-y-2">
                  {categoryTableData.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{cat.name}:</span>
                      <span className="font-semibold text-foreground">{cat.acceptanceRate}% acceptance</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
};

// Extracted category table component
const CategoryTable = ({ data }: { data: typeof categoryTableData }) => (
  <Card className="border-none shadow-sm">
    <CardContent className="p-5">
      <h3 className="text-base font-semibold text-foreground mb-1">Category Detailed Data</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-muted">
              <TableHead className="text-xs font-semibold">Category Name</TableHead>
              <TableHead className="text-xs font-semibold text-center">Total Active Jobs</TableHead>
              <TableHead className="text-xs font-semibold text-center">Average Applicants</TableHead>
              <TableHead className="text-xs font-semibold text-center">Acceptance Rate (%)</TableHead>
              <TableHead className="text-xs font-semibold text-center">Verified Workers in Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="border-muted/50">
                <TableCell className="text-sm font-medium">{row.name}</TableCell>
                <TableCell className="text-sm text-center">{row.activeJobs}</TableCell>
                <TableCell className="text-sm text-center">{row.avgApplicants}</TableCell>
                <TableCell className="text-sm text-center">{row.acceptanceRate}%</TableCell>
                <TableCell className="text-sm text-center">{row.verifiedWorkers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

export default AdminReports;
