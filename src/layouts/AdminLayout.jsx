import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    return (
        <div className="flex min-h-full overflow-hidden">

            {/* Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Topbar */}
                <AdminTopbar toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 p-6 bg-slate-100">
                    <Outlet />
                </main>

                <AdminFooter />

            </div>

        </div>
    );
};

export default AdminLayout;