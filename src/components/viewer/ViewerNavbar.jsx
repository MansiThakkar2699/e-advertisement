import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export const ViewerNavbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="bg-gray-900 shadow-lg fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="flex justify-between items-center h-16">

                        {/* LOGO */}
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl">📢</span>
                            <h1 className="text-xl font-bold text-white">
                                E-Advertisement
                            </h1>
                        </Link>

                        {/* DESKTOP MENU */}
                        <ul className="hidden md:flex items-center space-x-8 font-medium text-white">

                            <Link to="/" className="hover:text-blue-300 transition">
                                Home
                            </Link>

                            <Link to="/ads" className="hover:text-blue-300 transition">
                                Ads
                            </Link>

                            <Link to="/categories" className="hover:text-blue-300 transition">
                                Categories
                            </Link>

                            <Link to="/surveys" className="hover:text-blue-300 transition">
                                Surveys
                            </Link>

                            <Link to="/offers" className="hover:text-blue-300 transition">
                                Offers
                            </Link>

                            <Link to="/about" className="hover:text-blue-300 transition">
                                About
                            </Link>

                            <Link to="/contact" className="hover:text-blue-300 transition">
                                Contact
                            </Link>

                        </ul>

                        {/* DESKTOP BUTTONS */}
                        <div className="hidden md:flex gap-4">

                            <Link
                                to="/login"
                                className="px-4 py-2 border border-white text-white rounded-lg hover:bg-blue-800 transition"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-gray-200 transition"
                            >
                                Sign Up
                            </Link>

                        </div>

                        {/* MOBILE ICON */}
                        <button
                            className="md:hidden text-2xl text-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>

                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`md:hidden bg-blue-900 transition-all duration-300 ${isOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"
                        }`}
                >
                    <div className="flex flex-col px-6 space-y-4 font-medium text-white">

                        <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-300">Home</Link>
                        <Link to="/ads" onClick={() => setIsOpen(false)} className="hover:text-blue-300">Ads</Link>
                        <Link to="/categories" onClick={() => setIsOpen(false)} className="hover:text-blue-300">Categories</Link>
                        <Link to="/surveys" onClick={() => setIsOpen(false)} className="hover:text-blue-300">Surveys</Link>
                        <Link to="/offers" onClick={() => setIsOpen(false)} className="hover:text-blue-300">Offers</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-300">About</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-blue-300">Contact</Link>

                        <hr className="border-blue-700" />

                        <Link
                            to="/login"
                            className="border border-white text-white text-center py-2 rounded-lg hover:bg-blue-800"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="bg-white text-blue-900 text-center py-2 rounded-lg hover:bg-gray-200"
                        >
                            Sign Up
                        </Link>

                    </div>
                </div>

            </nav>

            {/* PAGE CONTENT */}
            <div className="pt-20 p-6 bg-gray-100 min-h-screen">
                <Outlet />
            </div>
        </>
    );
};