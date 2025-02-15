import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = ["black", "green", "red", "blue", "purple", "yellow"];

const Shop = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState(
    [...Array(12)].map((_, index) => ({
      id: index,
      name: "Long Sleeve Shirt",
      price: 450,
      color: "black",
      image: `/Home Assets/home_img_longSleeve.svg`, // Default image for black
    }))
  );

  // Handle Image Click -> Redirect to CustomizeShirt.jsx
  const handleImageClick = (product) => {
    navigate(`/customizeshirt`, {
      state: { selectedImage: product.image, selectedColor: product.color }
    });
  };

  // Handle Color Change
  const handleColorChange = (index, color) => {
    const updatedProducts = [...products];
    updatedProducts[index].color = color;
    updatedProducts[index].image = `/Home Assets/home_img_longSleeve-${color}.svg`; // Update image dynamically
    setProducts(updatedProducts);
  };

  return (
    <div className="w-full">
      {/* Black Background Section */}
      <div className="w-full mt-30 h-30 bg-black"></div>

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
        </aside>

        {/* Product Grid */}
        <section className="w-3/4 mt-5 p-4 grid grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="border p-4 shadow-lg rounded-lg">
              {/* Clicking Image -> Navigate to CustomizeShirt */}
              <img
                src={product.image}
                alt="Long Sleeve Shirt"
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(product)}
              />
              <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-700">PHP {product.price}.00</p>

              {/* Color Palette (Updates Image) */}
              <div className="flex gap-1 mt-2">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="w-5 h-5 rounded-full border cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(index, color)}
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

export default Shop;
