import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUsers,
    FaBullhorn,
    FaChartBar,
    FaFolder,
    FaAd,
    FaCommentDots
} from "react-icons/fa";

export const AdminSidebar = ({ sidebarOpen }) => {

    // const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const menu = [
        {
            name: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/admin"
        },
        {
            name: "Users",
            icon: <FaUsers />,
            path: "/admin/users"
        },
        {
            name: "Categories",
            icon: <FaFolder />,
            path: "/admin/categories"
        },
        {
            name: "Campaigns",
            icon: <FaBullhorn />,
            path: "/admin/campaigns"
        },
        {
            name: "Advertisements",
            icon: <FaAd />,
            path: "/admin/advertisements"
        },
        {
            name: "Analytics",
            icon: <FaChartBar />,
            path: "/admin/analytics"
        },
        {
            name: "Feedback",
            icon: <FaCommentDots />,
            path: "/admin/feedbacks"
        },
    ];

    return (
        <div
            className={`bg-gray-900 text-white p-4 transition-all duration-300
                ${sidebarOpen ? "w-64" : "w-20"}`
            }>

            {/* LOGO */}
            {
                sidebarOpen && (
                    <h1 className="text-2xl font-bold mb-8 text-white-400">
                        Admin Panel
                    </h1>
                )
            }

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
                                        : "hover:bg-gray-800"
                                    }`}
                            >

                                <span className="text-lg">
                                    {item.icon}
                                </span>

                                {sidebarOpen && <span>{item.name}</span>}

                            </Link>
                        </li>
                    );
                })}

            </ul>

        </div >
    );
};