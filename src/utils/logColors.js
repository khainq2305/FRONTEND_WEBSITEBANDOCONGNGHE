export const getActionBgColor = (action) => {
  switch (action) {
    case "create":
      return "bg-green-500";
    case "update":
      return "bg-cyan-500";
    case "delete":
      return "bg-red-500";
    case "login":
      return "bg-blue-500";
    case "logout":
      return "bg-gray-200";
    case "export":
      return "bg-gray-500";
    case "restore":
      return "bg-yellow-500";
    case "permanently_delete":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

export const getActionTextColor = (action) => {
  return action === "logout" ? "text-black" : "text-white";
};
