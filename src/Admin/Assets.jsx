import React, { useState } from 'react';
import { ChevronDown, Upload, Edit, Trash } from 'lucide-react';

const ProductManagementUI = () => {
  const [dateRange, setDateRange] = useState('Jan 1 - Jan 30, 2024');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'Product #1', date: 'Jan 1, 2024', price: '₱550', status: 'Uploaded' },
    { id: 2, name: 'Product #2', date: 'Jan 1, 2024', price: '₱550', status: 'Uploaded' },
    { id: 3, name: 'Product #3', date: 'Jan 1, 2024', price: '₱550', status: 'Uploaded' },
    { id: 4, name: 'Product #4', date: 'Jan 1, 2024', price: '₱550', status: 'Uploaded' },
    { id: 5, name: 'Product #5', date: 'Jan 1, 2024', price: '₱550', status: 'Uploaded' },
    { id: 6, name: 'Product #6', date: 'Jan 1, 2024', price: '₱550', status: 'Uploaded' },
  ]);

  const toggleProductSelection = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleAddProduct = () => {
    setShowAddPopup(true);
  };

  const handleProductClick = () => {
    setShowProductDetails(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-full bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-6xl font-bold mb-6">Assets</h1>
          
          <div className="flex items-center justify-start mb-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded px-3 py-2">
              <span className="text-gray-600 text-large">{dateRange}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
            
            <button 
              onClick={handleAddProduct}
              className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2 ml-8"
            >
              <span>+</span>
              <span>Add New Product</span>
            </button>
          </div>
          
          <div className="mb-4 bg-gray-100 inline-flex rounded-md p-1">
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
          
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4 text-left w-10">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="p-4 text-left text-gray-600 font-medium">Product No</th>
                  <th className="p-4 text-left text-gray-600 font-medium">Date</th>
                  <th className="p-4 text-left text-gray-600 font-medium">Price</th>
                  <th className="p-4 text-left text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr 
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={handleProductClick}
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleProductSelection(product.id);
                        }}
                      />
                    </td>
                    <td className="p-4">#{product.id}</td>
                    <td className="p-4">{product.date}</td>
                    <td className="p-4">{product.price}</td>
                    <td className="p-4">
                      <span className="text-green-500">{product.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add New Product Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-6">Add New Product Popup</h2>
            
            <div className="border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 mb-2 text-gray-400">
                <Upload className="w-full h-full" />
              </div>
              <span className="text-gray-500">Upload Image</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Shirt Name"
                className="w-full border rounded p-2"
              />
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Price"
                  className="w-1/2 border rounded p-2"
                />
                <div className="w-1/2 border rounded p-2 flex justify-between items-center">
                  <span className="text-gray-500">Color</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setShowAddPopup(false)}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Details Popup */}
      {showProductDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-6">Product when clicked</h2>
            
            <div className="mb-6 flex justify-center">
              <div className="border rounded-lg p-2 w-48 h-48">
                <img 
                  src="/api/placeholder/200/200" 
                  alt="Yellow and red t-shirt" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Product Description</h3>
              
              <div className="space-y-2">
                <p><span className="font-medium">Product Name:</span></p>
                <p><span className="font-medium">Available Sizes:</span></p>
                <p><span className="font-medium">Color:</span></p>
                <p><span className="font-medium">Price:</span></p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit Product
              </button>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementUI;