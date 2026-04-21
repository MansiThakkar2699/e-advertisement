import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActionCard = ({ title, description, icon, path, colorClass }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(path)}
            className="w-full text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                {icon}
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-6">{description}</p>
        </button>
    );
};

export default QuickActionCard;