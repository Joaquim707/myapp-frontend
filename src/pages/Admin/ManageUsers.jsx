// import React, { useEffect, useState } from "react";
// import DashboardLayout from "../../components/layouts/DashboardLayout";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import { LuFileSpreadsheet } from "react-icons/lu";
// import UserCard from "../../components/Cards/UserCard";
// import toast from "react-hot-toast";

// const ManageUsers = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const getAllUsers = async () => {
//     try {
//       const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
//       if (response.data?.length > 0) {
//         setAllUsers(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users", error);
//     }
//   };

//   // download task report
//   const handleDownloadReport = async () => {
//     try {
//       const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
//         responseType: "blob",
//       });

//       // Create a url for the blob
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "user_details.xlsx");
//       document.body.appendChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading expense details", error);
//       toast.error("Failed to download expense details. Please try again.");
//     }
//   };

//   useEffect(() => {
//     getAllUsers();
//     return () => {};
//   }, []);

//   return (
//     <DashboardLayout activeMenu="Team Members">
//       <div className="my-5 mb-10">
//         <div className="flex md:flex-row md:flex-row md:items-center justify-between">
//           <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

//           <button
//             className="flex md:flex download-btn"
//             onClick={handleDownloadReport}
//           >
//             <LuFileSpreadsheet className="text-lg" />
//             Download Report
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//           {allUsers?.map((user) => (
//             <UserCard key={user._id} userInfo={user} />
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ManageUsers;

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(response.data)) {
        setAllUsers(response.data);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error("Failed to fetch users.");
    }
  };

  // download user report
  const handleDownloadReport = async () => {
    try {
      const { data, headers } = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_USERS,
        { responseType: "blob" }
      );

      // Try to derive filename from Content-Disposition
      let filename = "user_details.xlsx";
      const disposition = headers?.["content-disposition"];
      if (disposition) {
        const match =
          disposition.match(/filename\*?=([^;]+)/i) ||
          disposition.match(/filename="?([^"]+)"?/i);
        if (match && match[1]) {
          filename = decodeURIComponent(
            match[1]
              .replace(/UTF-8''/i, "")
              .replace(/["']/g, "")
              .trim()
          );
        }
      }

      const blob = new Blob([data], {
        type:
          headers?.["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Append, click, cleanup
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoke after a tick (Safari)
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error downloading user report", error);
      toast.error("Failed to download user report. Please try again.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="my-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button className="flex download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
