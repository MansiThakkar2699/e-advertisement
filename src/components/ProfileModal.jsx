import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    X,
    User,
    Mail,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Upload,
    CircleCheck,
    Clock3,
    Ban,
    CircleX
} from "lucide-react";

const ProfileModal = ({
    user,
    loading,
    closeModal,
    onSaveProfile,
    onChangePassword
}) => {
    // --- Hook Setup ---
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        setValue: setProfileValue
    } = useForm();

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        watch: watchPassword,
        formState: { errors }
    } = useForm();

    // Still need state for image preview functionality
    const [preview, setPreview] = useState("");
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const password = watchPassword("password");

    useEffect(() => {
        if (user) {
            setProfileValue("fullName", user.fullName || "");
            setPreview(user.profilePic || "");
        }
    }, [user, setProfileValue]);

    const roleStyles = {
        admin: "bg-blue-50 text-blue-600 border border-blue-200",
        advertiser: "bg-purple-50 text-purple-600 border border-purple-200",
        viewer: "bg-gray-50 text-gray-600 border border-gray-200"
    };

    const getStatusConfig = (status) => {
        const map = {
            active: {
                label: "Active",
                icon: CircleCheck,
                className: "bg-green-50 text-green-600 border border-green-200"
            },
            pending: {
                label: "Pending",
                icon: Clock3,
                className: "bg-yellow-50 text-yellow-600 border border-yellow-200"
            },
            blocked: {
                label: "Blocked",
                icon: Ban,
                className: "bg-red-50 text-red-600 border border-red-200"
            },
            rejected: {
                label: "Rejected",
                icon: CircleX,
                className: "bg-rose-50 text-rose-600 border border-rose-200"
            }
        };

        return (
            map[status] || {
                label: status,
                icon: Clock3,
                className: "bg-gray-50 text-gray-600 border border-gray-200"
            }
        );
    };

    const statusConfig = getStatusConfig(user?.status);
    const StatusIcon = statusConfig.icon;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- Submit Handlers ---
    const onProfileSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);

        if (profilePicFile) {
            formData.append("profilePic", profilePicFile);
        }

        await onSaveProfile(formData);
    };

    const onPassSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }

        await onChangePassword({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        });

        resetPassword();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <div>
                        <h2 className="text-xl font-semibold">My Profile</h2>
                        <p className="text-sm text-slate-300 mt-1">
                            Update your profile information and security settings
                        </p>
                    </div>

                    <button
                        onClick={closeModal}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading profile...</div>
                ) : (
                    <div className="p-6 bg-slate-50 space-y-6">
                        <form
                            onSubmit={handleProfileSubmit(onProfileSubmit)}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-5">
                                Profile Information
                            </h3>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center md:w-1/3">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-200 shadow-sm bg-slate-100">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <User size={34} />
                                            </div>
                                        )}
                                    </div>

                                    <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition">
                                        <Upload size={16} />
                                        Upload Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="flex-1 space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                {...registerProfile("fullName", { required: "Name is required" })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                placeholder="Enter full name"
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input
                                                type="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Role
                                            </label>
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium capitalize ${roleStyles[user?.role] || "bg-gray-50 text-gray-600 border border-gray-200"}`}
                                            >
                                                <Shield size={14} className="mr-1.5" />
                                                {user?.role}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Status
                                            </label>
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.className}`}
                                            >
                                                <StatusIcon size={14} className="mr-1.5" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium transition shadow-sm"
                                        >
                                            Save Profile Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <form
                            onSubmit={handlePasswordSubmit(onPassSubmit)}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-5">
                                Change Password
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Old Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            {...registerPassword("oldPassword", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Minimum 6 characters"
                                                }
                                            })}
                                            placeholder="Old Password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                        {errors.oldPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            {...registerPassword("newPassword", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Minimum 6 characters"
                                                }
                                            })}
                                            placeholder="New Password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                        {errors.newPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            {...registerPassword("confirmPassword", {
                                                required: "Confirm your password",
                                                validate: (value) =>
                                                    value === password || "Passwords do not match"
                                            })}
                                            placeholder="Confirm Password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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

                                <div className="flex justify-end pt-5">
                                    <button
                                        type="submit"
                                        className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition shadow-sm"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;