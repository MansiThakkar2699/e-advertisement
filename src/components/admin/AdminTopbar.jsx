import React, { useState } from "react";
import { Bell, Search, Menu, User, LogOut, Settings } from "lucide-react";
import { FaBars } from "react-icons/fa";

const AdminTopbar = ({ toggleSidebar }) => {

    const [openProfile, setOpenProfile] = useState(false);

    return (
        <div className="w-full bg-white shadow-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between">

            {/* LEFT SECTION */}

            <div className="flex items-center gap-4">

                {/* SIDEBAR TOGGLE */}

                <button
                    className="text-xl"
                    onClick={toggleSidebar}
                >
                    <FaBars />
                </button>

                {/* PAGE TITLE */}

                <h1 className="text-xl font-semibold text-slate-700">
                    Admin Dashboard
                </h1>

            </div>



            {/* RIGHT SECTION */}

            <div className="flex items-center gap-6">

                {/* SEARCH */}

                <div className="relative hidden md:block">

                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                </div>


                {/* NOTIFICATION */}

                <button className="relative p-2 hover:bg-slate-100 rounded-lg">

                    <Bell size={20} />

                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

                </button>



                {/* PROFILE */}

                <div className="relative">

                    <button
                        onClick={() => setOpenProfile(!openProfile)}
                        className="flex items-center gap-2"
                    >

                        <img
                            src="https://i.pravatar.cc/40"
                            className="w-9 h-9 rounded-full"
                        />

                        <span className="hidden md:block font-medium text-slate-700">
                            Admin
                        </span>

                    </button>


                    {/* DROPDOWN */}

                    {openProfile && (

                        <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border">

                            <button className="flex items-center gap-2 px-4 py-3 hover:bg-slate-100 w-full text-left">
                                <User size={16} /> Profile
                            </button>

                            <button className="flex items-center gap-2 px-4 py-3 hover:bg-slate-100 w-full text-left">
                                <Settings size={16} /> Settings
                            </button>

                            <button className="flex items-center gap-2 px-4 py-3 hover:bg-slate-100 w-full text-left text-red-500">
                                <LogOut size={16} /> Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default AdminTopbar;