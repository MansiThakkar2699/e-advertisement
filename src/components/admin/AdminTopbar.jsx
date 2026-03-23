import React, { useEffect, useState } from "react";
import { Bell, Search, Menu, User, LogOut, Settings } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AdminTopbar = ({ toggleSidebar }) => {

    const [openProfile, setOpenProfile] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case "/admin":
                return "Dashboard";
            case "/admin/users":
                return "Users";
            case "/admin/categories":
                return "Categories";
            case "/admin/campaigns":
                return "Campaigns";
            case "/admin/advertisements":
                return "Advertisements";
            case "/admin/analytics":
                return "Analytics";
            case "/admin/feedbacks":
                return "Feedbacks";
            default:
                return "Admin Panel";
        }
    };


    // Fetch logged in user
    const fetchUser = async () => {

        try {

            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const userId = decoded._id;
            if (!userId) return;
            const res = await axios.get(`/user/user/${userId}`);
            setUser(res.data.data);
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        fetchUser();
    }, []);


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

                <h1 className="text-2xl font-bold text-slate-900">
                    {getTitle()}
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

                        {user?.profilePic ? (

                            <img
                                src={user.profilePic}
                                className="w-9 h-9 object-cover rounded-full"
                            />

                        ) : (

                            <span className="font-semibold text-indigo-600">
                                {user?.fullName?.charAt(0)?.toUpperCase()}
                            </span>

                        )}

                        <span className="hidden md:block font-medium text-slate-700">
                            {user?.fullName || "Admin"}
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