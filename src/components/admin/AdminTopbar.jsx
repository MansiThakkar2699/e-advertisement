import React, { useEffect, useState } from "react";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProfileModal from "../ProfileModal";
import { toast } from "react-toastify";

const AdminTopbar = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();

    // Separate states for Dropdown and Modal
    const [showDropdown, setShowDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const getTitle = () => {
        const paths = {
            "/admin/dashboard": "Dashboard",
            "/admin/users": "Users",
            "/admin/categories": "Categories",
            "/admin/campaigns": "Campaigns",
            "/admin/advertisements": "Advertisements",
            "/admin/feedbacks": "Feedbacks",
        };
        return paths[location.pathname] || "Admin Panel";
    };

    // Helper to get ID from token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.id;
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const userId = getUserIdFromToken();
            if (!userId) return;
            const token = localStorage.getItem("token")
            const res = await axios.get(`/user/user/${userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setUser(res.data.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user on component mount to show name/pic in topbar
    useEffect(() => {
        fetchUser();
    }, []);

    const handleOpenProfile = async () => {
        setShowDropdown(false); // Close dropdown
        setIsModalOpen(true);   // Open Modal
        await fetchUser();      // Refresh data
    };

    const handleSaveProfile = async (formData) => {
        try {
            const userId = getUserIdFromToken();
            const token = localStorage.getItem("token")
            const res = await axios.put(`/user/user/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.status == 200) {
                toast.success("Profile Updated Successfully!...");
            }
            await fetchUser();
        } catch (error) {
            toast.error(error.response.data.message)
            console.error("Error updating profile:", error);
        }
    };

    const handleChangePassword = async (passwordData) => {
        try {
            const userId = getUserIdFromToken();
            const token = localStorage.getItem("token")
            const res = await axios.put(`/user/change-password/${userId}`, passwordData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (res.status == 200) {
                toast.success("Password updated successfully!..")
            }
        } catch (error) {
            toast.error(error.response.data.message)
            console.error("Error changing password:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <>
            <div className="w-full bg-white shadow-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">
                    <button className="text-xl" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">{getTitle()}</h1>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <button className="relative p-2 hover:bg-slate-100 rounded-lg">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* PROFILE DROPDOWN TRIGGER */}
                    <div className="relative">
                        {/* PROFILE TRIGGER BUTTON */}
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all duration-200"
                        >
                            {user?.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="profile"
                                    className="w-9 h-9 object-cover rounded-full border border-slate-200 shadow-sm"
                                />
                            ) : (
                                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 shadow-sm">
                                    <span className="font-semibold text-indigo-600">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
                                    </span>
                                </div>
                            )}
                            <span className="hidden md:block font-semibold text-slate-700 text-sm">
                                {user?.fullName || "Admin"}
                            </span>
                        </button>

                        {/* PROFESSIONAL DROPDOWN MENU */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all">

                                {/* HEADER SECTION */}
                                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-800 truncate">
                                        {user?.fullName || "Admin User"}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {user?.email || "admin@example.com"}
                                    </p>
                                </div>

                                {/* MENU ITEMS */}
                                <div className="p-2">
                                    <button
                                        onClick={handleOpenProfile}
                                        className="group flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
                                    >
                                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                            <User size={16} className="text-slate-500 group-hover:text-indigo-600" />
                                        </div>
                                        Profile Settings
                                    </button>
                                    {/* DIVIDER */}
                                    <div className="my-2 border-t border-slate-100" />

                                    <button onClick={handleLogout}
                                        className="group flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                        <div className="p-2 rounded-lg bg-rose-50 group-hover:bg-rose-100 transition-colors">
                                            <LogOut size={16} className="text-rose-500" />
                                        </div>
                                        Logout Session
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ACTUAL MODAL */}
            {isModalOpen && (
                <ProfileModal
                    user={user}
                    loading={loading}
                    closeModal={() => setIsModalOpen(false)}
                    onSaveProfile={handleSaveProfile}
                    onChangePassword={handleChangePassword}
                />
            )}
        </>
    );
};

export default AdminTopbar;