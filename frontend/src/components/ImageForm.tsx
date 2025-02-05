"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ImageForm() {
  // Initialize router
  const router = useRouter();

  // State for form fields and loading/message state
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields
    if (!title || !file) {
      setMessage("Both title and image file are required.");
      return;
    }

    setLoading(true);
    setMessage(null);

    // Create FormData for the multipart/form-data request
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }

      const data = await response.json();
      setMessage("Image uploaded successfully!");

      // Reset form fields
      setTitle("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh the image gallery
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md p-4 border rounded">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          placeholder="Enter image title"
          required
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Image File
        </label>
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mt-1 block w-full"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </form>
  );
}