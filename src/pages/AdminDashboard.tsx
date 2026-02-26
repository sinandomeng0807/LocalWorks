import Job from "@/components/admin/Job";
import Navbar from "@/components/admin/Navbar";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { RechartsDevtools } from '@recharts/devtools';
axios.defaults.withCredentials = true

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, ResponsiveContainer, Pie, LabelList, Cell } from 'recharts';

const AdminDashboard = () => {
  const [postedJobs, setPosted] = useState(0)
  const [pendingJobs, setPending] = useState(0)
  const [acceptedJobs, setAcceptedJobs] = useState(0)
  const [declinedJobs, setDeclined] = useState(0)

  const navbar = {
    backgroundColor: "#EC6A13",
    color: "#FFFFFF",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    width: "200px",
    display: "flex",
    flexDirection: "column"
  }

  const center = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }

  const dashboard = {
    backgroundColor: "#157634"
  }

  const dashboard_data = {
    marginLeft: "226px",
    padding: "30px"
  }

  const AdminDashboardFn = async () => {
    const { data } = await axios.get("http://localhost:8920/api/admin/dashboard", { withCredentials: true })
    return data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: AdminDashboardFn
  })

  if (error) return <div className="dashboard-error">Error: {error.message}</div>
  if (isLoading) return <div className="dashboard-loading">Loading...</div>

  console.log(data)

  // Sample data for the chart
  const workers_data = [
    { name: 'Total Workers', value: data?.workers || 0 },
    { name: 'Verified', value: data?.verified || 0 },
    { name: 'Pending', value: data?.pendingWorkers || 0 },
    { name: 'Declined', value: data?.declinedWorkers || 0 }
  ];

  const application_data = [
    { name: "Pending Review", application: data?.pendingApplication || 0, fill: "#FF6B6B" },
    { name: "Interview Scheduled", application: data?.interviewScheduledApplication || 0, fill: "#FFA500" },
    { name: "Accepted", application: data?.acceptedApplication || 0, fill: "#4CAF50" },
    { name: "Not Selected", application: data?.notSelectedApplication || 0, fill: "#9E9E9E" }
  ]

  const skillsCategoryData = [
    { name: "Construction", value: 20, color: "#20C997" },
    { name: "Electrical", value: 18, color: "#FFC107" },
    { name: "Plumbing", value: 5, color: "#2196F3" },
    { name: "Janitor", value: 9, color: "#9C27B0" },
    { name: "Farmer", value: 16, color: "#FF5722" },
    { name: "Others", value: 32, color: "#607D8B" }
  ]

  const postedJobsData = [
    { category: "Janitor", user: "Juan Santos", date: "02/08/26", status: "ONGOING" },
    { category: "Farmer", user: "Juan Santos", date: "02/08/26", status: "ONGOING" }
  ]

  const h1_header = {
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333"
  }

  const barChartColor = ["#8884D8", "#82CA9D", "#FFC658", "#FF7C59"]

  return (
    <div className="admin-dashboard-container">
      <Navbar
        navbar={navbar}
        center={center}
        dashboard={dashboard}
      />

      <div className="dashboard-data" style={dashboard_data}>
        <h1 style={h1_header}>Welcome Back, Admin!</h1>
        <p style={{ marginBottom: "20px", color: "#666" }}>Here's what happening with your reports today</p>
        
        {/* Top Cards Section */}
        <div className="card-dashboard-admin">
          <Job title={"Total Job Posted"} number={data?.jobs || 0} />
          <Job title={"Pending Jobs"} number={data?.pending || 0} />
          <Job title={"Posted Job Accepted"} number={data?.accepted || 0} />
          <Job title={"Accepted Job Declined"} number={data?.declined || 0} />
        </div>

        {/* Charts Section */}
        <div className="dashboard-charts-section">
          {/* Workers Bar Chart */}
          <div className="chart-container bar-chart-container">
            <h2 className="chart-title">Workers Overview</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={workers_data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }}
                />
                <Bar dataKey="value" fill="#FF9500" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <p><strong>Total Workers:</strong> {data?.workers || 0}</p>
              <p><strong>Verified Workers:</strong> {data?.verified || 0}</p>
              <p><strong>Pending Workers:</strong> {data?.pendingWorkers || 0}</p>
              <p><strong>Declined Workers:</strong> {data?.declinedWorkers || 0}</p>
            </div>
          </div>

          {/* Skills Categories Pie Chart */}
          <div className="chart-container pie-chart-container">
            <h2 className="chart-title">Skills Categories</h2>
            <p className="chart-subtitle">Distribution of complaint types</p>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={skillsCategoryData} cx="50%" cy="50%" labelLine={false} label={{ position: "right", fontSize: 12 }} dataKey="value" fill="#8884d8">
                  {skillsCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Applications Pie Chart */}
          <div className="chart-container pie-chart-container">
            <h2 className="chart-title">Applications Status</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={application_data} cx="50%" cy="50%" labelLine={false} label={{ position: "right", fontSize: 12 }} dataKey="application" fill="#8884d8">
                  {application_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <p><strong>Pending Review:</strong> {data?.pendingApplication || 0}</p>
              <p><strong>Interview Scheduled:</strong> {data?.interviewScheduledApplication || 0}</p>
              <p><strong>Accepted:</strong> {data?.acceptedApplication || 0}</p>
              <p><strong>Not Selected:</strong> {data?.notSelectedApplication || 0}</p>
            </div>
          </div>
        </div>

        {/* Posted Jobs Table Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Posted Jobs</h2>
            <a href="#" className="view-all-link">View all</a>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>User</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {postedJobsData.map((job, index) => (
                <tr key={index}>
                  <td className="category-column">{job.category}</td>
                  <td>{job.user}</td>
                  <td>{job.date}</td>
                  <td><span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category Details Section */}
        <div className="dashboard-section category-details-section">
          <h2 className="section-title">Category Details</h2>
          <p className="section-subtitle">Detailed breakdown of complaint categories</p>
          <div className="category-grid">
            {skillsCategoryData.map((cat, index) => (
              <div key={index} className="category-item">
                <div className="category-color-indicator" style={{ backgroundColor: cat.color }}></div>
                <span className="category-name">{cat.name}</span>
                <span className="category-count">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard