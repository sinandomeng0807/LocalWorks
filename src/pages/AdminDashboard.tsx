import Job from "@/components/admin/Job";
import Navbar from "@/components/admin/Navbar";
import { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true

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

  const data = {
    marginLeft: "200px"
  }

  const jobStatus = async () => {
    const totalJobs = await axios.get("http://localhost:8920/api/admin/totalJobs", { withCredentials: true })
    const pendingJobs = await axios.get("http://localhost:8920/api/admin/pendingJobs", { withCredentials: true })
    const acceptedJobs = await axios.get("http://localhost:8920/api/admin/accepted/jobs", { withCredentials: true })
    const declinedJobs = await axios.get("http://localhost:8920/api/admin/declined/jobs", { withCredentials: true })

    setPosted(totalJobs.data.jobs)
    setPending(pendingJobs.data.pending)
    setAcceptedJobs(acceptedJobs.data.accepted)
    setDeclined(declinedJobs.data.declined)
  }

  jobStatus()


  return (
    <div className="admin-dashboard-container">
      <Navbar
        navbar={navbar}
        center={center}
        dashboard={dashboard}
      />

      <div className="dashboard-data" style={data}>
        <h1>Welcome Back, Admin!</h1>
        <div className="card-dashboard-admin">
          <Job title={"Total Job Posted"} number={postedJobs} />
          <Job title={"Pending Jobs"} number={pendingJobs} />
          <Job title={"Posted Job Accepted"} number={acceptedJobs} />
          <Job title={"Accepted Job Declined"} number={declinedJobs} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard