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

            if (mode === "add") {
                res = await axios.post("/category/category", formData);
            } else {
                res = await axios.put(
                    `/category/category/${categoryData._id}`,
                    formData
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

            <div className="bg-white w-[520px] rounded-xl shadow-xl p-6 relative animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {mode === "add" ? "Add New Category" : "Edit Category"}
                    </h2>

                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

                    {/* Category Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Category Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter category name"
                            {...register("name", { required: "Category name is required" })}
                            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Category Image
                        </label>

                        <div className="flex items-center gap-4 mt-2">

                            <input
                                type="file"
                                {...register("image")}
                                onChange={handleImagePreview}
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                            )}

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
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