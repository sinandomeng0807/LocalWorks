import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, MapPin, DollarSign, Clock, Building2, Filter, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import JobDetailsModal from "./JobDetailsModal";
import { useJobsStore, Job } from "@/lib/jobsStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
axios.defaults.withCredentials = true;

const JobListings = () => {
  const jobs = useJobsStore((state) => state.jobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  const Jobs = async () => {
    const { data } = await axios.get("http://localhost:8920/api/pro/viewJobs", { withCredentials: true })
    return data
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['job'],
    queryFn: Jobs
  })

  if (error) return <div>Error: {error.message}</div>
  if (isLoading) return <div>Loading...</div>

  const AllJobs = data.jobs

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setDetailsModalOpen(true);
  };

  const handleApplyClick = (job: Job) => {
    setJobToApply(job);
    setConfirmApplyOpen(true);
  };

  const handleApplyFromModal = () => {
    if (selectedJob) {
      setDetailsModalOpen(false);
      setJobToApply(selectedJob);
      setConfirmApplyOpen(true);
    }
  };

  const handleConfirmApply = () => {
    if (jobToApply) {
      setAppliedJobs([...appliedJobs, jobToApply.id]);
      toast.success(`Application submitted for ${jobToApply.title}!`, {
        description: `Your application to ${jobToApply.company.title} has been sent.`,
      });
    }
    setConfirmApplyOpen(false);
    setJobToApply(null);
  };

  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Find Your Next Job</h2>
        <p className="text-muted-foreground mb-6">Browse available job openings in your area</p>
        
        <form className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </form>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {AllJobs.length} job{AllJobs.length !== 1 ? "s" : ""}
      </p>

      {/* Job Listings */}
      <div className="grid gap-4">
        {AllJobs.map((job: any) => {
          const isApplied = appliedJobs.includes(job._id);
          return (
            <Card key={job._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <Building2 className="w-4 h-4" />
                      {job.company.title}
                    </CardDescription>
                  </div>
                  <Badge variant={job.type === "Full-time" ? "default" : "secondary"}>
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location.name}
                  </span>
                  <span className="flex items-center gap-1">
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.posted}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag: any) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    className="gap-2"
                    onClick={() => handleViewDetails(job)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  {isApplied ? (
                    <Button disabled className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button onClick={() => handleApplyClick(job)}>Apply Now</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {AllJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No jobs found matching your search.</p>
          <Button variant="link" onClick={() => { setSearchTerm(""); }}>
            Clear search
          </Button>
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        job={selectedJob}
        isApplied={selectedJob ? appliedJobs.includes(selectedJob.id) : false}
        onApply={handleApplyFromModal}
      />

      {/* Confirm Apply Dialog */}
      <AlertDialog open={confirmApplyOpen} onOpenChange={setConfirmApplyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to apply for <strong>{jobToApply?.title}</strong> at <strong>{jobToApply?.company.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApply}>Submit Application</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobListings;
