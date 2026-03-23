import React from "react";
import { Github, HelpCircle, Shield } from "lucide-react";

const AdminFooter = () => {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-600">

                {/* LEFT */}
                <div className="flex items-center gap-2">
                    <span>© {new Date().getFullYear()}</span>
                    <span className="font-semibold text-slate-700">E-Advertisement Admin</span>
                    <span className="text-slate-400">| v1.0</span>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6 mt-3 md:mt-0">

                    <a
                        href="#"
                        className="flex items-center gap-1 hover:text-indigo-600 transition"
                    >
                        <HelpCircle size={16} />
                        Support
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-1 hover:text-indigo-600 transition"
                    >
                        <Shield size={16} />
                        Privacy
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-1 hover:text-indigo-600 transition"
                    >
                        <Github size={16} />
                        Github
                    </a>

                </div>

            </div>
        </footer>
    );
};

export default AdminFooter;