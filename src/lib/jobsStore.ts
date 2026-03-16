import { create } from 'zustand';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  tags: string[];
  requirements?: string[];
  benefits?: string[];
  schedule?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: "pending" | "accepted" | "rejected";
}

const defaultJobs: Job[] = [
  {
    id: 1, title: "Construction Worker", company: "BuildRight Construction",
    location: "Downtown, Metro City", salary: "$18-25/hr", type: "Full-time",
    posted: "2 days ago", description: "Looking for experienced construction workers for a commercial building project.",
    tags: ["Construction", "Physical Labor", "Experience Required"], status: "accepted",
  },
  {
    id: 2, title: "Delivery Driver", company: "FastTrack Logistics",
    location: "Eastside District", salary: "$15-20/hr", type: "Part-time",
    posted: "1 day ago", description: "Deliver packages within the city. Must have valid driver's license.",
    tags: ["Driving", "Flexible Hours", "License Required"], status: "pending",
  },
  {
    id: 3, title: "Restaurant Server", company: "The Golden Spoon",
    location: "Central Business District", salary: "$12/hr + tips", type: "Full-time",
    posted: "3 hours ago", description: "Friendly and energetic server needed for busy restaurant.",
    tags: ["Hospitality", "Customer Service", "Tips"], status: "accepted",
  },
  {
    id: 4, title: "Warehouse Associate", company: "MegaStore Distribution",
    location: "Industrial Zone", salary: "$16-18/hr", type: "Full-time",
    posted: "5 days ago", description: "Picking, packing, and shipping orders in fast-paced warehouse.",
    tags: ["Warehouse", "Physical Labor", "Night Shift Available"], status: "pending",
  },
  {
    id: 5, title: "House Cleaner", company: "Sparkle Clean Services",
    location: "Various Locations", salary: "$20-30/hr", type: "Contract",
    posted: "1 week ago", description: "Professional house cleaning for residential clients.",
    tags: ["Cleaning", "Flexible Schedule", "Transportation Provided"], status: "rejected",
  },
  {
    id: 6, title: "Security Guard", company: "SafeWatch Security",
    location: "Multiple Sites", salary: "$14-18/hr", type: "Full-time",
    posted: "4 days ago", description: "Security personnel needed for various commercial properties.",
    tags: ["Security", "Night Shift", "Training Provided"], status: "accepted",
  },
];

interface JobsStore {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'posted'>) => void;
  removeJob: (id: number) => void;
  updateJobStatus: (id: number, status: "pending" | "accepted" | "rejected") => void;
}

export const useJobsStore = create<JobsStore>((set, get) => ({
  jobs: defaultJobs,
  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now(),
      posted: "Just now",
      status: "pending",
    };
    set({ jobs: [newJob, ...get().jobs] });
  },
  removeJob: (id) => {
    set({ jobs: get().jobs.filter(job => job.id !== id) });
  },
  updateJobStatus: (id, status) => {
    set({ jobs: get().jobs.map(job => job.id === id ? { ...job, status } : job) });
  },
}));
