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
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [currentColor, setCurrentColor] = useState(selectedColor || "black");
  const [selectedSize, setSelectedSize] = useState("L");
  const [shirtImage, setShirtImage] = useState(selectedImage || "/images/default-shirt.jpg");
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  // Log the selectedImage and selectedColor values
  useEffect(() => {
    console.log("selectedImage:", selectedImage);
    console.log("selectedColor:", selectedColor);
  }, [selectedImage, selectedColor]);

  // Function to handle navigation to OrderConfirmation
  const handleProceed = () => {
    navigate("/ShopPages/OrderConfirmation", {
      state: {
        selectedColor: currentColor,
        selectedSize: selectedSize,
        price: 450.00,
        shirtImage: shirtImage,
        quantity: quantity
      }
    });
  };

  useEffect(() => {
    if (!selectedImage) {
      setShirtImage(`/Home Assets/home_img_longSleeve-${currentColor}.svg`);
    }
  }, [currentColor, selectedImage]);

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
        {/* Left Side: Shirt Preview */}
        <div className="w-1/2">
          <img
            src={shirtImage}
            alt="Long Sleeve Shirt"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Shirt Details */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold">Long Sleeve Jersey</h2>
          <p className="text-xl font-semibold mt-2">PHP 450.00 - PHP 550.00</p>
          <div className="mt-4">
            <label className="block text-lg font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border rounded-lg p-2 w-1/2"
            />
          </div>
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
          <div className="mt-4">
            <label className="block text-lg font-medium">Sizes:</label>
            <p className="text-gray-500">Sizes: S, M, L, XL, XXL</p>
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium">Upload:</label>
            <input
              type="file"
              className="border rounded-lg p-2 w-full"
              placeholder="Upload your design here."
            />
          </div>
          <button
            onClick={handleProceed}
            className="mt-6 bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition"
          >
            Proceed
          </button>
        </div>
      </div>

      {/* More Like This Section */}
      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
        <div className="grid mb-20 grid-cols-4 gap-6">
          {["green", "red", "blue", "purple", "yellow"].map((color) => (
            <div key={color} className="border p-4 shadow-lg rounded-lg cursor-pointer">
              <img
                src={`/Home Assets/TShirts/${color} shirt.png`}
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