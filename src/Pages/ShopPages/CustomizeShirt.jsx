import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CustomizeShirt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const selectedImage = state?.selectedImage;
  const selectedColor = state?.selectedColor;

  const colors = ["black", "green", "red", "blue", "purple", "yellow"];
  const sizes = ["Small", "Medium", "Large", "XL", "XXL"];
  const [currentColor, setCurrentColor] = useState(selectedColor || "black");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [shirtImage, setShirtImage] = useState(selectedImage || "/images/default-shirt.jpg");
  const [user, setUser] = useState(null);

  // Function to handle navigation to OrderConfirmation
  const handleProceed = () => {
    navigate("/ShopPages/OrderConfirmation", {
      state: {
        selectedColor: currentColor,
        selectedSize: selectedSize,
        price: 450.00,
        shirtImage: shirtImage
      }
    });
  };

  useEffect(() => {
    setShirtImage(`/Home Assets/home_img_longSleeve-${currentColor}.svg`);
  }, [currentColor]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full">
      {/* Black Background Section */}
      <div className="w-full mt-25 h-32 bg-black"></div>

      {/* Shirt Customization Section */}
      <div className="container mx-auto p-6 flex gap-10">
        {/* Left Side: Static Shirt Preview */}
        <div className="w-1/2">
          <img
            src="/Home Assets/home_img_longSleeve.svg"
            alt="Long Sleeve Shirt"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Dynamic Shirt Image from Shop */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold">Long Sleeve Shirt</h2>
          <p className="text-xl font-semibold mt-2">PHP 450.00</p>
          <img
            src={shirtImage}
            alt="Selected Shirt"
            className="w-full h-80 rounded-lg shadow-lg mt-4"
          />

          {/* Size Selection */}
          <div className="mt-4">
            <label className="block text-lg font-medium">Size:</label>
            <select 
              className="border rounded-lg p-2 w-1/2"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
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
                  className={`w-8 h-8 rounded-full border cursor-pointer ${
                    currentColor === color ? "border-4 border-gray-700" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                ></span>
              ))}
            </div>
          </div>

          {/* Add to Cart Button (Hidden if not logged in) */}
          {user && (
            <button className="mt-6 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition">
              Add to Cart
            </button>
          )}
          {user && (
            <button 
              className="mt-6 ml-10 bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition"
              onClick={handleProceed}
            >
              Proceed
            </button>
          )}
        </div>
      </div>

      {/* More Like This Section */}
      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">More Like This</h2>
        <div className="grid grid-cols-4 gap-6">
          {colors.map((color) => (
            <div key={color} className="border p-4 shadow-lg rounded-lg cursor-pointer">
              <img
                src={`/Home Assets/home_img_longSleeve-${color}.svg`}
                alt={`${color} Shirt`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-center text-lg font-semibold mt-2 capitalize">{color} Shirt</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizeShirt;