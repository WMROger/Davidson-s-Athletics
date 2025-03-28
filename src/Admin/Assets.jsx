import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Plus, ChevronDown, Edit, Trash, Calendar } from "lucide-react";
import { db } from "../Database/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Select from 'react-select';

const sizeOptions = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [showEditProductPopup, setShowEditProductPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState('Jan 1 - Jan 30, 2024');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); 
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      const querySnapshot = await getDocs(collection(db, "shirts"));
      const assetsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, date: data.date ? data.date.toDate() : new Date() };
      });
      setAssets(assetsData);
    };

    fetchAssets();
  }, []);

  const updateStatus = (id, newStatus) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, status: newStatus } : asset
      )
    );
  };

  const deleteAsset = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) {
      return;
    }
  
    try {
      await deleteDoc(doc(db, "shirts", id));
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
      setSelectedProduct(null);
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
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

  const editProduct = async (updatedProduct) => {
    try {
      const productRef = doc(db, "shirts", updatedProduct.id);
      await updateDoc(productRef, {
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price),
        color: updatedProduct.color,
        description: updatedProduct.description,
        image: updatedProduct.image,
        sizes: Array.isArray(updatedProduct.sizes) ? updatedProduct.sizes : [], // Ensure sizes is an array
        stock: parseInt(updatedProduct.stock),
      });

      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === updatedProduct.id ? updatedProduct : asset
        )
      );

      setShowEditProductPopup(false);
      resetForm(); // Reset form after successful edit

      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
      return false;
    }
  };

  // Handle image selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async () => {
    if (!image) {
      // If editing and not changing the image, just return the existing URL
      if (showEditProductPopup && imageUrl) {
        return imageUrl;
      }
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
        alert("T-Shirt uploaded successfully!");
        return data.url;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("T-Shirt upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle adding a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !color || !image || sizes.length === 0 || !stock || !description) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);
    const imageUrl = await uploadImage();
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const newProduct = {
      name,
      price: parseFloat(price),
      color,
      description,
      image: imageUrl,
      sizes,
      stock: parseInt(stock),
      date: new Date(),
      status: "Uploaded",
    };

    await addProduct(newProduct);

    // Reset form
    resetForm();
  };

  // Handle editing an existing product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !color || !sizes.length || !stock || !description) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    
    // Upload a new image only if a new one was selected
    let finalImageUrl = imageUrl;
    if (image) {
      finalImageUrl = await uploadImage();
      if (!finalImageUrl) {
        setLoading(false);
        return;
      }
    }

    const updatedProduct = {
      ...selectedProduct,
      name,
      price: parseFloat(price),
      color,
      description,
      image: finalImageUrl,
      sizes: sizes || [], // Ensure sizes is an array
      stock: parseInt(stock),
    };

    const success = await editProduct(updatedProduct);
    
    if (success) {
      // Reset form after successful edit
      resetForm();
    }
    
    setLoading(false);
  };
  
  // Reset form fields
  const resetForm = () => {
    setName("");
    setPrice("");
    setColor("");
    setDescription("");
    setImage(null);
    setImageUrl("");
    setSizes([]);
    setStock("");
    setLoading(false);
  };

  // Populate form with selected product data for editing
  const initializeEditForm = (product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setColor(product.color);
    setDescription(product.description);
    setImageUrl(product.image);
    setSizes(product.sizes || []); // Ensure sizes is an array
    setStock(product.stock.toString());
    setImage(null); // Reset file input
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowEditProductPopup(false); // Ensure the edit product popup is not shown
  };

  const openEditForm = (product) => {
    initializeEditForm(product);
    setShowEditProductPopup(true); // Show the edit product popup
  };

  const closeModals = () => {
    setShowEditProductPopup(false);
    setSelectedProduct(null);
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

  const toggleProductSelection = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="relative p-6">
      <div className="max-w-full  overflow-hidden">
        <h1 className="text-6xl font-bold mb-8">Assets</h1>

        <div className="flex items-center justify-start mb-4">

          <div className="flex items-center">
            <div className="flex items-center space-x-2 bg-[#E6E6E6] rounded px-3 py-2">
            <span className="text-gray-600 text-large flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {dateRange}
            </span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>

          <button
            className="px-6 py-2 ml-5 bg-[#222A2D] text-white rounded hover:bg-[#FFBF61] hover:text-black flex items-center"
            onClick={() => setShowAddProductPopup(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Product
          </button>
        </div>

        <div className="mb-6 bg-[#E6E6E6] inline-flex rounded-md px-4 py-1">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-4 py-1 rounded ${activeTab === 'All' ? 'bg-white' : ''}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('Added')}
            className={`px-4 py-1 rounded ${activeTab === 'Added' ? 'bg-white' : ''}`}
          >
            Added
          </button>
          <button 
            onClick={() => setActiveTab('Removed')}
            className={`px-4 py-1 rounded ${activeTab === 'Removed' ? 'bg-white' : ''}`}
          >
            Removed
          </button>
        </div>

        <div className="overflow-hidden border rounded-2xl mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 border-b bg-[#E6E6E6]">
                <th className="p-4 pl-6 w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-2 pl-6">Product No</th>
                <th className="p-2">Date</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={asset.id} className="text-left border-b hover:bg-gray-50">
                  <td className="p-4 pl-6">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedProducts.includes(asset.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleProductSelection(asset.id);
                      }}
                    />
                  </td>
                  <td className="p-2 pl-6">#{index + 1}</td>
                  <td className="p-2">{format(asset.date, "MMM dd, yyyy")}</td>
                  <td className="p-2">₱{asset.price}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      asset.status === "Uploaded"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-2 flex items-center justify-end relative">
                    <button
                      className="px-4 py-2 text-blue-600 rounded hover:bg-blue-300 mr-2"
                      onClick={() => openProductDetails(asset)}
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
                        <div className="absolute -top-12 right-0 flex bg-white border rounded-lg shadow-lg z-50">
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
      </div>

      {/* Add Product Popup */}
      {showAddProductPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center">
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
                      <Plus className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-500">Upload Image</span>
                    </div>
                  )}
                </label>
              </div>

              <input
                type="text"
                placeholder="Shirt Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-2"
              />
              
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-1/2 border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-1/2 border rounded p-2"
                />
              </div>

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2"
                rows={4}
              />

              <Select
                isMulti
                options={sizeOptions}
                value={sizeOptions.filter(option => sizes.includes(option.value))}
                onChange={(selectedOptions) => setSizes(selectedOptions.map(option => option.value))}
                className="w-full"
                placeholder="Select Sizes"
              />

              <input
                type="number"
                placeholder="Stock Quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border rounded p-2"
              />

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                  onClick={() => setShowAddProductPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Popup */}
      {showEditProductPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="edit-upload-image"
                />
                <label htmlFor="edit-upload-image" className="cursor-pointer">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Product" className="w-32 h-32 object-cover border rounded" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Plus className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-500">Change Image</span>
                    </div>
                  )}
                </label>
              </div>

              <input
                type="text"
                placeholder="Shirt Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-2"
              />
              
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-1/2 border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-1/2 border rounded p-2"
                />
              </div>

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2"
                rows={4}
              />

              <Select
                isMulti
                options={sizeOptions}
                value={sizeOptions.filter(option => sizes.includes(option.value))}
                onChange={(selectedOptions) => setSizes(selectedOptions.map(option => option.value))}
                className="w-full"
                placeholder="Select Sizes"
              />

              <input
                type="number"
                placeholder="Stock Quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border rounded p-2"
              />

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                  onClick={closeModals}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Popup */}
      {selectedProduct && !showEditProductPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeModals();
            }
          }}
          tabIndex={0}
          ref={(node) => {
            // Focus the div so it can receive keyboard events
            if (node) node.focus();
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <div className="flex mb-6">
              <div className="w-1/2 pr-6">
                <img 
                  src={selectedProduct.image} 
                  alt="Product" 
                  className="w-full h-auto rounded-lg border"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="w-1/2">
                <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
                <div className="space-y-3">
                  <p className="text-lg"><span className="font-bold">Product Name:</span> {selectedProduct.name}</p>
                  <p className="text-lg"><span className="font-bold">Available Sizes:</span> {selectedProduct.sizes.join(", ")}</p>
                  <p className="text-lg"><span className="font-bold">Color:</span> {selectedProduct.color}</p>
                  <p className="text-lg"><span className="font-bold">Description:</span> {selectedProduct.description}</p>
                  <p className="text-lg"><span className="font-bold">Price:</span> ₱{selectedProduct.price}</p>
                  <p className="text-lg"><span className="font-bold">Stock:</span> {selectedProduct.stock}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded flex items-center hover:bg-gray-700 text-lg"
                onClick={() => openEditForm(selectedProduct)}
              >
                <Edit size={18} className="mr-2" />
                Edit Product
              </button>
              
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-lg"
                onClick={closeModals}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}