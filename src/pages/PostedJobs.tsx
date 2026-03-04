import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/admin/Navbar";
import TopNav from "@/components/admin/TopNav";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.withCredentials = true

interface Job {
  _id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string; // could be iso string
}

const PostedJobs = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOrder, setSortOrder] = useState("Newest");

  const Jobs = async () => {
    const { data } = await axios.get("http://localhost:8920/api/admin/jobs", {
      withCredentials: true
    })
    return data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['Jobs'],
    queryFn: Jobs
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { jobs } = data


  const statusClasses = {
    PENDING: "bg-yellow-100 text-yellow-800",
    DECLINED: "bg-red-100 text-red-800",
    ACCEPTED: "bg-green-100 text-green-800",
    ONGOING: "bg-blue-100 text-blue-800",
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const updateStatus = async (job, status) => {
    await axios.put("http://localhost:8920/api/admin/updateJob/" + job, {
      newStatus: status
    })
      .then(function (response) {
        navigate("/admin/posted-jobs", { replace: true })
      })
      .catch(function (error) {
        if (error.response) {
          alert(error.response.data.message)
        }
      })
  }

  const navbar = {
    backgroundColor: "#EC6A13",
    color: "#FFFFFF",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    width: "200px",
    display: "flex",
    flexDirection: "column",
  };
  const center = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  const postedJobsStyle = {
    backgroundColor: "#157634",
  };

  return (
    <div className="admin-dashboard-container">
      <Navbar
        navbar={navbar}
        center={center}
        postedJobs={postedJobsStyle}
      />

      <div className="dashboard-data" style={{ marginLeft: "226px", padding: "30px" }}>
        <TopNav />
        <h1 className="text-2xl font-bold mb-6">Manage Employer&apos;s Post</h1>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full md:w-1/2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2 mt-2 md:mt-0 w-full md:w-1/4"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>

        {/* desktop / md+ table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                  <td className="px-6 py-4 whitespace-normal max-w-xs">{job.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[job.status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded text-xs" onClick={() => updateStatus(job._id, "ACCEPTED")}>
                      Accept
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => updateStatus(job._id, "DECLINED")}>
                      Decline
                    </button>
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded text-xs"
                      onClick={() => {
                        /* view logic maybe */
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile card view */}
        <div className="md:hidden space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="p-4 border rounded bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{job.title}</span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[job.status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"}`}
                >
                  {job.status}
                </span>
              </div>
              <p className="mt-2 text-sm">{job.description}</p>
              <div className="mt-3 flex space-x-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  accept
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                  del
                </button>
                <button
                  className="bg-gray-300 text-black px-2 py-1 rounded text-xs"
                >
                  view
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostedJobs;