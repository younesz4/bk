"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("categoryId", categoryId);

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("/api/admin/products/add", {
        method: "POST",
        credentials: 'include', // Include cookies for auth
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product added successfully");
        router.push("/admin/products");
      } else {
        alert(data.error || "Error adding product");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error adding product: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 bg-frost p-6 shadow rounded"
      >
        {/* NAME */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            className="w-full p-2 border rounded"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block font-medium mb-1">Price (€)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.length > 0 &&
              categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* IMAGES */}
        <div>
          <label className="block font-medium mb-1">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e: any) => setImages([...e.target.files])}
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-800 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}


