import React, { useState } from "react";
import { db, storage } from "../Database/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const NewShirt = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Store uploaded image URL
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl(""); // Reset previous URL
    }
  };

  // Upload image to Firebase Storage
  const handleUploadImage = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }
  
    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      const response = await fetch("https://davidsonathletics.scarlet2.io/api/upload_image.php", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.url);
        alert("Image uploaded successfully!");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
    }
  
    setUploading(false);
  };
  

  // Upload form data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !color || !imageUrl) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "shirts"), {
        name,
        price: parseFloat(price),
        color,
        image: imageUrl,
      });

      alert("Shirt added successfully!");
      setName("");
      setPrice("");
      setColor("");
      setImage(null);
      setImageUrl("");
    } catch (error) {
      console.error("Error adding shirt:", error);
      alert("Failed to add shirt.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Shirt</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Shirt Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="p-2 border rounded w-full"
        />

        {/* File Input */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Upload Image Button */}
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleUploadImage}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {/* Image Preview */}
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Uploaded Image Preview:</p>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-32 h-32 object-cover border rounded mt-2"
            />
          </div>
        )}

        {/* Submit Form Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Shirt"}
        </button>
      </form>
    </div>
  );
};

export default NewShirt;
