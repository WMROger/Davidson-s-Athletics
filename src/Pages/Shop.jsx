import React from "react";

const colors = ["black", "green", "red", "blue", "purple", "yellow"];

const ProductListing = () => {
  return (
    <div className="w-full">
      {/* Black Background Section */}
      <div className="w-full mt-30 h-30 bg-black"></div> {/* Adjust height as needed */}

      {/* Main Container */}
      <div className="container mx-auto p-4 flex bg-white">
        {/* Sidebar */}
        <aside className="w-1/4 mt-5 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Long Sleeve Shirts</h2>
          <input
            type="text"
            placeholder="Search within this category"
            className="w-full p-2 border rounded-lg"
          />
          <div className="mt-4">
            <label className="block mb-2 font-medium">Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-400 cursor-pointer"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-medium">Size</label>
            {["Small", "Medium", "Large", "Extra Large", "XX-Large", "XXX-Large"].map((size) => (
              <div key={size} className="flex items-center gap-2">
                <input type="checkbox" id={size} />
                <label htmlFor={size}>{size}</label>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <section className="w-3/4 mt-5 p-4 grid grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="border p-4 shadow-lg rounded-lg">
              <img
                src="./Home Assets/home_img_shortSleeve.svg"
                alt="Long Sleeve Shirt"
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
        </section>
      </div>
    </div>
  );
};

export default ProductListing;
