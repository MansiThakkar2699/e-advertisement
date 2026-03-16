import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-6">

            <div className="text-center">

                {/* Animated 404 */}

                <h1 className="text-[120px] md:text-[150px] font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    404
                </h1>

                {/* Title */}

                <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    Oops! Page Not Found
                </h2>

                {/* Description */}

                <p className="text-slate-500 mt-3 max-w-md mx-auto">
                    The page you are looking for might have been removed,
                    had its name changed, or is temporarily unavailable.
                </p>


                {/* Buttons */}

                <div className="flex justify-center gap-4 mt-8 flex-wrap">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default NotFound;