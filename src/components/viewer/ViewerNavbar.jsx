import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProfileModal from "../ProfileModal";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
    Menu,
    X,
    Megaphone,
    Search,
    Bell,
    User
} from "lucide-react";

const navItems = [
    { name: "Home", path: "/" },
    { name: "Ads", path: "/ads" },
    { name: "Categories", path: "/categories" },
    { name: "Offers", path: "offers" },
    { name: "Surveys", path: "/surveys" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
];

const ViewerNavbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOpenProfile = async () => {
        setIsModalOpen(true);   // Open Modal
        await fetchUser();      // Refresh data
    };

    const getUserIdFromToken = () => {
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
        localStorage.removeItem("userId");
        window.location.href = "/";
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="h-18 flex items-center justify-between py-3">
                        {/* Logo */}
                        <Link to="/viewer/home" className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md">
                                <Megaphone size={22} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 leading-none">
                                    AdVista
                                </h1>
                                <p className="text-xs text-slate-500 mt-1">
                                    Smart digital promotions
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition">
                                <Search size={18} />
                            </button>

                            <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition relative">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
                            </button>

                            {!token ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : role === "viewer" ? (
                                <>
                                    <button
                                        onClick={handleOpenProfile}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                                    >
                                        <User size={16} />
                                        Profile
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : null}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="lg:hidden pb-4">
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-3 space-y-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}

                                <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                                        <Search size={16} />
                                        Search
                                    </button>

                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition">
                                        <User size={16} />
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

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

export default ViewerNavbar;