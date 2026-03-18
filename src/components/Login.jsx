import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const submitHandler = async (data) => {
        try {
            const res = await axios.post("/user/login", data)
            if (res.status == 200) {
                toast.success("Login success");
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("role",res.data.role)

                switch (res.data.role) {
                    case "viewer" || "Viewer":
                        navigate("/viewer");
                        break;
                    case "advertiser" || "Advertiser":
                        navigate("/advertiser")
                        break;
                    case "admin" || "Admin":
                        navigate("/admin")
                        break;
                    default:
                        toast.error("Invalid Role");
                        navigate("/")
                        break;
                }
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200">

            {/* LEFT SIDE IMAGE */}
            <div className="hidden md:flex w-1/2 bg-cover bg-center items-center justify-center relative">
                <img
                    src="https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=900&q=80"
                    alt="office"
                    className="absolute object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end items-center text-white text-center p-16 w-full h-full">

                    <h1 className="text-4xl font-bold mb-4">
                        E-Advertisement Platform
                    </h1>

                    <p className="text-lg max-w-md">
                        Manage and optimize your digital advertising campaigns and reach the right audience.
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                <div className="w-full max-w-md backdrop-blur-lg bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-10">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Login to continue managing your campaigns
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                Email Address
                            </label>
                            <div className="relative group">

                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />

                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none 
                                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                                    {...register("email", {
                                        required: "Email is required"
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>

                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Password
                                </label>

                                <button className="text-sm text-indigo-600 hover:underline">
                                    Forgot?
                                </button>
                            </div>

                            <div className="relative group">

                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 
                                    focus:ring-indigo-500/30 focus:border-indigo-500 transition" {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Minimum 6 characters"
                                        }
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>

                            </div>
                        </div>

                        {/* BUTTON */}
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-200">

                            Login
                            <ArrowRight size={18} />

                        </button>

                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?
                        <span className="text-indigo-600 font-semibold ml-1 cursor-pointer hover:underline">
                            Sign Up
                        </span>
                    </p>

                </div>
            </div>

        </div>
    );
}