import axios from 'axios'
import { ArrowRight, Mail } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export const Forgotpassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()

    const submitHandler = async (data) => {
        console.log(data)
        const res = await axios.post("/user/forgotpassword", data)
        console.log(res.data)
        if (res.status == 200) {
            navigate("/")
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
                        E-Advertisement Platform
                    </h1>

                    <p className="text-lg max-w-md">
                        Manage and optimize your digital advertising campaigns and reach the right audience.
                    </p>

                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                <div className="w-full max-w-md backdrop-blur-lg bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-10">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Forgot Password
                        </h1>
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

                        {/* BUTTON */}
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-200">

                            Submit
                            <ArrowRight size={18} />

                        </button>

                    </form>
                </div>
            </div>

        </div>
    )
}