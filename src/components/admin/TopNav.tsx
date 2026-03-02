import { useState } from "react";
import { BellOutlined, MailOutlined, DownloadOutlined } from "@ant-design/icons";

const TopNav = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 border-b">
      {/* search bar */}
      <div className="flex-1 md:mr-4">
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* action buttons */}
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <BellOutlined className="text-gray-600 text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            13
          </span>
        </button>
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <MailOutlined className="text-gray-600 text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            8
          </span>
        </button>
        <button className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
          <DownloadOutlined className="text-xl" />
          <span className="text-sm">Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default TopNav;
