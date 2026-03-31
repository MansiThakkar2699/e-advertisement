import axios from 'axios'
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export const ResetPassword = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("newPassword");

    const token = useParams().token
    const submitHandler = async (data) => {
        try {
            data.token = token
            const res = await axios.put("/user/resetpassword", data)
            if (res.status == 200) {
                toast.success("Password Reset Successfully!...")
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
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
                        Join E-Advertisement Platform
                    </h1>

                    <p className="text-lg max-w-md">
                        Create your account and start managing digital advertising campaigns efficiently.
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                <div className="w-full max-w-md backdrop-blur-lg bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-10">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Reset Password
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                New Password
                            </label>
                            <div className="relative group">

                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create password"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 
                                    focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                                    {...register("newPassword", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Minimum 6 characters"
                                        }
                                    })}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
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

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                Confirm Password
                            </label>
                            <div className="relative group">

                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter password again"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 
                                    focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                                    {...register("confirmPassword", {
                                        required: "Confirm your password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match"
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>

                            </div>
                        </div>

                        {/* BUTTON */}
                        <button type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-200">

                            Reset Password
                            <ArrowRight size={18} />

                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}