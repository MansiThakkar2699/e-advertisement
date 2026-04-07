import React from "react";
import { Outlet } from "react-router-dom";
import ViewerNavbar from "../components/viewer/ViewerNavbar";
import ViewerFooter from "../components/viewer/ViewerFooter";

const ViewerLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col">
            <ViewerNavbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <ViewerFooter />
        </div>
    );
};

export default ViewerLayout;