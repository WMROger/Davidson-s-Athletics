import React, { useState } from "react";
import { db, storage } from "../Database/firebase"; // Ensure you have Firebase configured
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const NewShirt = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !color || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `shirts/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Add shirt details to Firestore
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
    } catch (error) {
      console.error("Error adding shirt:", error);
      alert("Failed to add shirt.");
    } finally {
      setLoading(false);
    }
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
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
