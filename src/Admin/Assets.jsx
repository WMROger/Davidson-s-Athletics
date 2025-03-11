import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Plus } from "lucide-react"; // Use horizontal meatballs icon and plus icon
import { db } from "../Database/firebase";
import { collection, addDoc } from "firebase/firestore";
import Select from 'react-select';

const initialAssets = [
  {
    id: 1,
    name: "John Doe",
    date: new Date(),
    status: "Uploaded",
    file: "design1.pdf",
    price: 550,
  },
  {
    id: 2,
    name: "Jane Smith",
    date: new Date(),
    status: "Uploaded",
    file: "logo.png",
    price: 550,
  },
];

const sizeOptions = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export default function Assets() {
  const [assets, setAssets] = useState(initialAssets);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Store uploaded image URL
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateStatus = (id, newStatus) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, status: newStatus } : asset
      )
    );
  };

  const deleteAsset = (id) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, "shirts"), product);
      setAssets((prev) => [...prev, { ...product, id: prev.length + 1 }]);
      setShowAddProductPopup(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

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
    if (!name || !price || !color || !imageUrl || sizes.length === 0 || !stock) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);
    const newProduct = {
      name,
      price: parseFloat(price),
      color,
      image: imageUrl,
      sizes,
      stock: parseInt(stock),
      date: new Date(),
      status: "Uploaded",
    };

    await addProduct(newProduct);

    setName("");
    setPrice("");
    setColor("");
    setImage(null);
    setImageUrl("");
    setSizes([]);
    setStock("");
    setLoading(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative p-6">
      <h1 className="text-6xl font-bold mb-8">Assets</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-semibold">
          Pending Assets{" "}
          <span className="text-gray-600 font-normal ml-6">({assets.length})</span>
        </h2>

        <button
          className="px-6 py-2 bg-[#222A2D] text-white rounded hover:bg-[#FFBF61] hover:text-black flex items-center"
          onClick={() => setShowAddProductPopup(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Product
        </button>
      </div>

      <div className="overflow-hidden border rounded-2xl mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2 pl-6">Product No</th>
              <th className="p-2">Date</th>
              <th className="p-2">Price</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.id} className="text-left border-b">
                <td className="p-2 pl-6">#{index + 1}</td>
                <td className="p-2">{format(asset.date, "MMM dd, yyyy")}</td>
                <td className="p-2">P{asset.price}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      asset.status === "Uploaded"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="p-2 flex items-center justify-center relative">
                  <button
                    className="px-4 py-2 text-blue-600 rounded hover:bg-blue-300 mr-2"
                    onClick={() => setSelectedProduct(asset)}
                  >
                    View
                  </button>
                  <div className="relative menu-container">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === asset.id ? null : asset.id);
                      }}
                    >
                      <MoreHorizontal className="w-7 h-7 text-gray-600" />
                    </button>
                    {openMenuId === asset.id && (
                      <div className="absolute -top-12 left-0 flex bg-white border rounded-lg shadow-lg z-50">
                        <button
                          className="px-4 py-2 text-red-600 hover:bg-gray-100"
                          onClick={() => deleteAsset(asset.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddProductPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 mb-4 w-full flex justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="upload-image"
                  />
                  <label htmlFor="upload-image" className="cursor-pointer">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Uploaded" className="w-32 h-32 object-cover border rounded" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 10l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                        <span className="text-gray-400">Upload Image</span>
                      </div>
                    )}
                  </label>
                </div>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
                  onClick={handleUploadImage}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
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
              <Select
                isMulti
                options={sizeOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Sizes"
                onChange={(selectedOptions) => setSizes(selectedOptions.map(option => option.value))}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded w-full hover:bg-red-600"
                onClick={() => setShowAddProductPopup(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <img src={selectedProduct.image} alt="Product" className="w-full h-auto mb-4" />
            <p><strong>Product Name:</strong> {selectedProduct.name}</p>
            <p><strong>Available Sizes:</strong> {selectedProduct.sizes.join(", ")}</p>
            <p><strong>Color:</strong> {selectedProduct.color}</p>
            <p><strong>Price:</strong> P{selectedProduct.price}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}