import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdvertiserSidebar } from "../components/advertiser/AdvertiserSidebar";
import AdvertiserTopbar from "../components/advertiser/AdvertiserTopbar";
import AdvertiserFooter from "../components/advertiser/AdvertiserFooter";

const AdvertiserLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    return (
        <div className="flex min-h-full overflow-hidden">

            {/* Sidebar */}
            <AdvertiserSidebar sidebarOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Topbar */}
                <AdvertiserTopbar toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 p-6 bg-slate-100">
                    <Outlet />
                </main>

                <AdvertiserFooter />

            </div>

        </div>
    );
};

export default AdvertiserLayout;