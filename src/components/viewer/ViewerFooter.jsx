import React from "react";
import { Link } from "react-router-dom";
import {
    Megaphone,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Linkedin
} from "lucide-react";

const ViewerFooter = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white flex items-center justify-center">
                                <Megaphone size={22} />
                            </div>
                            <div>
                                <h2 className="text-white text-lg font-bold">AdVista</h2>
                                <p className="text-xs text-slate-400">
                                    Digital advertising platform
                                </p>
                            </div>
                        </div>

                        <p className="text-sm leading-6 text-slate-400 max-w-sm">
                            Discover smart promotions, trending offers, interactive surveys,
                            and personalized ad experiences in one modern platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link to="/ads" className="hover:text-white transition">Ads</Link></li>
                            <li><Link to="/categories" className="hover:text-white transition">Categories</Link></li>
                            <li><Link to="/offers" className="hover:text-white transition">Offers</Link></li>
                            <li><Link to="/surveys" className="hover:text-white transition">Surveys</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                            <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                            <li><span className="hover:text-white transition cursor-pointer">Terms & Conditions</span></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Mail size={16} className="mt-0.5 text-indigo-400" />
                                <span>support@advista.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={16} className="mt-0.5 text-indigo-400" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="mt-0.5 text-indigo-400" />
                                <span>Ahmedabad, Gujarat, India</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-5">
                            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">
                                <Facebook size={16} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">
                                <Instagram size={16} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">
                                <Linkedin size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
                    <p>© 2026 AdVista. All rights reserved.</p>
                    <p>Designed for better engagement and higher ROI.</p>
                </div>
            </div>
        </footer>
    );
};

export default ViewerFooter;