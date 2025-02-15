import React from "react";

const CustomizeShirt = () => {
  const colors = ["black", "green", "red", "blue", "purple", "yellow"];
  const sizes = ["Small", "Medium", "Large", "XL", "XXL"];

  return (
    <div className="container mx-auto p-6">
      {/* Main Shirt Customization Section */}
      <div className="flex gap-10">
        {/* Shirt Image */}
        <div className="w-1/2">
          <img
            src="/path-to-shirt-image.jpg"
            alt="Long Sleeve Jersey"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Customization Options */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold">Long Sleeve Jersey</h2>
          <p className="text-gray-500 mt-2">
            High-quality long sleeve jersey. The perfect fit for your needs.
          </p>
          <p className="text-xl font-semibold mt-2">PHP 450.00</p>

          {/* Size Selection */}
          <div className="mt-4">
            <label className="block text-lg font-medium">Size:</label>
            <select className="border rounded-lg p-2 w-1/2">
              {sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div className="mt-4">
            <label className="block text-lg font-medium">Color:</label>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-400 cursor-pointer"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mt-4">
            <label className="block text-lg font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="border rounded-lg p-2 w-1/4"
            />
          </div>

          {/* Printing Option */}
          <div className="mt-4">
            <label className="block text-lg font-medium">Printing Option:</label>
            <select className="border rounded-lg p-2 w-3/4">
              <option>Standard Print</option>
              <option>Backside Print</option>
            </select>
          </div>

          {/* Add to Cart Button */}
          <button className="mt-6 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-10" />

      {/* Recommended Products */}
      <h2 className="text-2xl font-bold text-center">You Might Also Like</h2>
      <div className="grid grid-cols-4 gap-6 mt-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="border p-4 shadow-lg rounded-lg">
            <img
              src="/path-to-shirt-image.jpg"
              alt="Similar Shirt"
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-sm font-semibold mt-2">Long Sleeve Shirt</h3>
            <p className="text-gray-700">PHP 450.00</p>
            <div className="flex gap-1 mt-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-400"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizeShirt;
