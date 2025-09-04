import React from "react";

const UserCard = ({ userInfo }) => {
  // Extract initials from full name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Generate a consistent color from string (name or email)
  const stringToColor = (str) => {
    if (!str) return "#6B7280"; // fallback gray
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(
      Math.abs(Math.sin(hash) * 16777215) % 16777215
    ).toString(16);
    return `#${"000000".substring(0, 6 - color.length) + color}`;
  };

  const initials = getInitials(userInfo?.name);
  const bgColor = stringToColor(userInfo?.name || userInfo?.email);

  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {userInfo?.profileImageUrl &&
          userInfo.profileImageUrl.trim() !== "" ? (
            <img
              src={userInfo.profileImageUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: bgColor }}
            >
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-800">
              {userInfo?.name}
            </p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTask || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-indigo-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-2 py-0.5 rounded`}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br /> {label}
    </div>
  );
};
