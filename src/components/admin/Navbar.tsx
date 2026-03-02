import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  FileTextOutlined,
  EditOutlined,
  BarChartOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Navbar = (value: any) => {
  const navigate = useNavigate();

  return (
    <div style={value.navbar} className="text-white">
      <div style={value.center}>
          
        <div className="size-20 bg-primary rounded-full flex items-center justify-center p-1 overflow-hidden div-margin">
                    <img src="/src/assets/logo.avif" alt="LocalWorks" className="rounded-full" />
                  </div>
        <h1 className="text-2xl font-bold m-1">LocalWorks</h1>
      </div>
      <div className="options" style={value.btns}>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={value.dashboard}
          className="flex items-center"
        >
          <HomeOutlined className="text-xl mr-2" />
          Dashboard
        </button>
        <button
          onClick={() => navigate('/admin/posted-jobs')}
          style={value.postedJobs}
          className="flex items-center"
        >
          <FileTextOutlined className="text-xl mr-2" />
          Posted Jobs
        </button>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={value.managePost}
          className="flex items-center"
        >
          <EditOutlined className="text-xl mr-2" />
          Manage Post
        </button>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={value.reports}
          className="flex items-center"
        >
          <BarChartOutlined className="text-xl mr-2" />
          Reports
        </button>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={value.notifications}
          className="flex items-center"
        >
          <BellOutlined className="text-xl mr-2" />
          Notifications
        </button>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={value.profiles}
          className="flex items-center"
        >
          <UserOutlined className="text-xl mr-2" />
          Profiles
        </button>
      </div>
    </div>
  );
};

export default Navbar