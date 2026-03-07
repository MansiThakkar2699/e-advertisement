import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import {
    FaBars,
    FaTachometerAlt,
    FaBullhorn,
    FaPlusCircle,
    FaUsers,
    FaMoneyBillWave,
    FaChartLine,
    FaBell,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

export const AdvertiserSidebar = () => {

    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const menu = [
        {
            name: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/advertiser/dashboard"
        },
        {
            name: "Create Campaign",
            icon: <FaPlusCircle />,
            path: "/advertiser/create-campaign"
        },
        {
            name: "My Campaigns",
            icon: <FaBullhorn />,
            path: "/advertiser/campaigns"
        },
        {
            name: "Target Audience",
            icon: <FaUsers />,
            path: "/advertiser/audience"
        },
        {
            name: "Budget Management",
            icon: <FaMoneyBillWave />,
            path: "/advertiser/budget"
        },
        {
            name: "Analytics",
            icon: <FaChartLine />,
            path: "/advertiser/analytics"
        },
        {
            name: "Notifications",
            icon: <FaBell />,
            path: "/advertiser/notifications"
        },
        {
            name: "Profile",
            icon: <FaUser />,
            path: "/advertiser/profile"
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <div
                className={`bg-gray-900 text-white p-4 transition-all duration-300 
        ${isOpen ? "w-64" : "w-20"}`}
            >

                {/* TOGGLE BUTTON */}
                <button
                    className="text-xl mb-8"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FaBars />
                </button>

                {/* TITLE */}
                {isOpen && (
                    <h1 className="text-2xl font-bold mb-8 text-white-300">
                        Advertiser Panel
                    </h1>
                )}

                {/* MENU */}
                <ul className="space-y-3">

                    {menu.map((item, index) => {

                        const active = location.pathname === item.path;

                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-4 p-3 rounded-lg transition
                  ${active
                                            ? "bg-blue-600"
                                            : "hover:bg-blue-800"
                                        }`}
                                >

                                    <span className="text-lg">
                                        {item.icon}
                                    </span>

                                    {isOpen && <span>{item.name}</span>}

                                </Link>
                            </li>
                        );
                    })}

                    {/* LOGOUT */}
                    <li>
                        <button
                            className="flex items-center gap-4 p-3 w-full rounded-lg hover:bg-red-600 transition"
                        >
                            <FaSignOutAlt />
                            {isOpen && <span>Logout</span>}
                        </button>
                    </li>

                </ul>

            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-6">
                <Outlet />
            </div>

        </div>
    );
};