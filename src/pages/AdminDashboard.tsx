import Job from "@/components/admin/Job";
import Navbar from "@/components/admin/Navbar";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { RechartsDevtools } from '@recharts/devtools';
axios.defaults.withCredentials = true

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, ResponsiveContainer, Pie, LabelList } from 'recharts';

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
    marginLeft: "226px"
  }

  const AdminDashboard = async () => {
    const { data } = await axios.get("http://localhost:8920/api/admin/dashboard", { withCredentials: true })
    return data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: AdminDashboard
  })

  if (error) return <div>Error: {error.message}</div>
  if (isLoading) return <div>Loading...</div>

  console.log(data)

  // Sample data for the chart
  const workers_data = [
    { name: 'Workers', value: data.workers },
    { name: 'Pending', value: data.pendingWorkers },
    { name: 'Verified', value: data.verified },
    { name: 'Declined', value: data.declinedWorkers }
  ];

  const application_data = [
    { name: "Pending Review", application: data.pendingApplication, fill: "#8a1f1f" },
    { name: "Interview Scheduled", application: data.interviewScheduledApplication, fill: "#8e7a20" },
    { name: "Accepted", application: data.acceptedApplication, fill: "#6c8422" },
    { name: "Not Selected", application: data.notSelectedApplication, fill: "#663737" }
  ]

  const barStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  }

  const h1_header = {
    marginBottom: "25px"
  }


  return (
    <div className="admin-dashboard-container">
      <Navbar
        navbar={navbar}
        center={center}
        dashboard={dashboard}
      />

      <div className="dashboard-data" style={dashboard_data}>
        <h1 style={h1_header}>Welcome Back, Admin!</h1>
        <div className="card-dashboard-admin">
          <Job title={"Total Jobs"} number={data.jobs} />
          <Job title={"Total Jobs Pending"} number={data.pending} />
          <Job title={"Jobs Accepted"} number={data.accepted} />
          <Job title={"Accepted Jobs Declined"} number={data.declined} />
        </div>
        <div className="visuals" style={grid}>
          <div className="bar" style={barStyle}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={workers_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <div className="labels">
              <p>Total Workers: <b>{data.workers}</b></p>
              <p>Pending Workers: <b>{data.pendingWorkers}</b></p>
              <p>Verified Workers: <b>{data.verified}</b></p>
              <p>Declined Workers: <b>{data.declinedWorkers}</b></p>
            </div>
          </div>
          <div className="chart_second" style={dashboard_data}>
            <div className="visual">
              <PieChart width="100%" height={400}>
                <Pie data={application_data} nameKey="name" dataKey="application" fill="#626262" label />
                <LabelList dataKey={"name"} position={"right"} fontSize={"25px"} />
                <Tooltip />
                <RechartsDevtools />
              </PieChart>
            </div>
              <div className="labels">
                <p>Pending Review: <b>{data.pendingApplication}</b></p>
                <p>Interview Scheduled: <b>{data.interviewScheduledApplication}</b></p>
                <p>Accepted: <b>{data.acceptedApplications}</b></p>
                <p>Not Selected: <b>{data.notSelectedApplication}</b></p>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard