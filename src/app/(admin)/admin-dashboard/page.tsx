import { FC } from "react";
import UserTable from "./components/UserTable";

const AdminDashboard: FC = () => {
  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <UserTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
