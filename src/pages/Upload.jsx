import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useClothingItems } from "../hooks/useClothingItems";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  CLOTHING_CATEGORIES,
  CLOTHING_TYPES,
  CLOTHING_SIZES,
  CLOTHING_CONDITIONS,
  COLORS,
  POPULAR_BRANDS,
} from "../utils/constants";
import toast from "react-hot-toast";
import { PhotoIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

const schema = yup.object({
  title: yup.string().required("Title is required").max(100),
  description: yup
    .string()
    .required("Description is required")
    .min(10)
    .max(1000),
  category: yup.string().required("Category is required"),
  type: yup.string().required("Type is required"),
  size: yup.string().required("Size is required"),
  condition: yup.string().required("Condition is required"),
  color: yup.string().required("Color is required"),
  brand: yup.string().max(50),
  location: yup.string().max(100),
});

const Upload = () => {
  const navigate = useNavigate();
  const { addItem } = useClothingItems();
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedCategory = watch("category");
  const selectedCondition = watch("condition");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const itemData = {
        ...data,
        images,
        tags,
      };

      const result = await addItem(itemData);

      if (result.success) {
        toast.success(
          "Item listed successfully! It will be reviewed by our team."
        );
        navigate("/dashboard");
      } else {
        toast.error(result.error || "Failed to list item");
      }
    } catch (error) {
      toast.error("Failed to list item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            List New Item
          </h1>
          <p className="text-gray-600">
            Share your unused clothing with the community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
            <p className="text-gray-600 mb-4">
              Add up to 5 photos. The first photo will be the main image.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
                  <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="e.g., Vintage Denim Jacket"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe the item's condition, style, and any other relevant details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select category</option>
                  {CLOTHING_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={!selectedCategory}
                >
                  <option value="">Select type</option>
                  {selectedCategory &&
                    CLOTHING_TYPES[selectedCategory]?.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("-", " ")}
                      </option>
                    ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  {...register("size")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select size</option>
                  {CLOTHING_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.size.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  {...register("condition")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select condition</option>
                  {CLOTHING_CONDITIONS.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label} - {condition.description}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <select
                  {...register("color")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select color</option>
                  {COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.color.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  {...register("brand")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select brand (optional)</option>
                  {POPULAR_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  {...register("location")}
                  type="text"
                  placeholder="e.g., New York, NY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Help others find items near them
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!newTag.trim() || tags.length >= 10}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Add tags to help others discover your item (max 10)
                </p>
              </div>
            </div>
          </div>

          {/* Point Value Preview */}
          {selectedCondition && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                Estimated Point Value
              </h3>
              <p className="text-emerald-700">
                Based on the condition you selected, this item will be worth
                approximately{" "}
                <span className="font-bold">
                  {selectedCondition === "excellent" && "100"}
                  {selectedCondition === "good" && "75"}
                  {selectedCondition === "fair" && "50"}
                  {selectedCondition === "worn" && "25"}
                </span>{" "}
                points once approved.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Listing...</span>
                </>
              ) : (
                <span>List Item</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
