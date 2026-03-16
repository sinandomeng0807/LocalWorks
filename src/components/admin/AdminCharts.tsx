import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Job } from "@/lib/jobsStore";

const PIE_COLORS = [
  "hsl(24, 85%, 50%)",
  "hsl(174, 42%, 45%)",
  "hsl(40, 70%, 55%)",
  "hsl(0, 84%, 60%)",
  "hsl(260, 50%, 55%)",
  "hsl(200, 60%, 50%)",
];

interface AdminChartsProps {
  jobs: Job[];
}

const AdminCharts = ({ jobs }: AdminChartsProps) => {
  const totalJobs = jobs.length;
  const accepted = jobs.filter((j) => j.status === "accepted").length;
  const pending = jobs.filter((j) => j.status === "pending").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;

  const workerStatsData = [
    { name: "Total\nWorkers", value: totalJobs },
    { name: "Verified\nWorkers", value: accepted },
    { name: "Pending\nVerification", value: pending },
    { name: "Report\nAccounts", value: rejected },
  ];

  // Skills/category distribution from job tags
  const tagCounts: Record<string, number> = {};
  jobs.forEach((j) => {
    const category = j.tags?.[0] || j.type;
    tagCounts[category] = (tagCounts[category] || 0) + 1;
  });
  const categoryData = Object.entries(tagCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const totalCategories = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={workerStatsData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 90%)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "hsl(20, 10%, 45%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {workerStatsData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm pt-4 min-w-[140px]">
              <p className="text-muted-foreground">Total Workers: <span className="font-semibold text-foreground">{totalJobs}</span></p>
              <p className="text-muted-foreground">Verified Workers: <span className="font-semibold text-foreground">{accepted}</span></p>
              <p className="text-muted-foreground">Pending Verification: <span className="font-semibold text-foreground">{pending}</span></p>
              <p className="text-muted-foreground">Report Accounts: <span className="font-semibold text-foreground">{rejected}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0 pt-5 px-5">
          <CardTitle className="text-base font-semibold">Skills Categories</CardTitle>
          <CardDescription>Distribution of job categories</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${Math.round((value / totalCategories) * 100)}%`}
                labelLine={false}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCharts;
