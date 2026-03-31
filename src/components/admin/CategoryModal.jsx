import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function CategoryModal({ mode, categoryData, closeModal, refreshCategories }) {

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    const [preview, setPreview] = useState(null);

    const imageFile = watch("image");

    const nameValue = watch("name");

    // Prefill form in edit mode
    useEffect(() => {
        if (mode === "edit" && categoryData) {
            setValue("name", categoryData.name);
            setValue("slug", categoryData.slug);
            setValue("description", categoryData.description);
            setPreview(categoryData.image);
        }
        if (nameValue) {
            setValue(
                "slug",
                nameValue.toLowerCase().replaceAll(" ", "-")
            );
        }
    }, [mode, categoryData, nameValue, setValue]);

    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description);
        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }

        try {
            let res;
            const token = localStorage.getItem("token")
            if (mode === "add") {
                res = await axios.post("/category/category", formData,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
            } else {
                res = await axios.put(
                    `/category/category/${categoryData._id}`,
                    formData,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
            }
            if (res.status == 200 || res.status === 201) {
                toast.success(
                    mode === "add"
                        ? "Category Created Successfully!"
                        : "Category Updated Successfully!"
                );
                refreshCategories();
                closeModal();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white w-[520px] rounded-2xl shadow-2xl p-6 relative animate-fadeIn">

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">
                        {mode === "add" ? "Add New Category" : "Edit Category"}
                    </h2>

                    <button
                        onClick={closeModal}
                        className="text-white hover:opacity-80"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

                    {/* Category Name */}
                    <div className="mt-4">
                        <label className="text-sm font-medium text-gray-600">
                            Category Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter category name"
                            {...register("name", { required: "Category name is required" })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Slug
                        </label>

                        <input
                            type="text"
                            placeholder="example: electronics"
                            {...register("slug")}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Description
                        </label>

                        <textarea
                            rows="3"
                            placeholder="Enter description"
                            {...register("description")}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* Image */}
                    <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <span className="text-gray-500">Click to upload image</span>
                            <input type="file" {...register("image")} className="hidden" />
                        </label>

                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-12 h-12 rounded-full object-cover border"
                            />
                        )}

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-indigo-700"
                        >
                            {mode === "add" ? "Save Category" : "Update Category"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default CategoryModal;