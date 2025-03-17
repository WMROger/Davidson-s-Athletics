import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CustomizeShirt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const selectedImage = state?.selectedImage;
  const selectedColor = state?.selectedColor;
  const selectedName = state?.selectedName;
  const selectedPrice = state?.selectedPrice;
  const selectedSizes = state?.selectedSizes;
  const availableStock = state?.availableStock;

  const colors = ["black", "green", "red", "blue", "purple", "yellow"];
  const [currentColor, setCurrentColor] = useState(selectedColor || "black");
  const [selectedSize, setSelectedSize] = useState(selectedSizes ? selectedSizes[0] : "L");
  const [shirtImage, setShirtImage] = useState(selectedImage || "/images/default-shirt.jpg");
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > availableStock) {
      setQuantity(availableStock);
    } else if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const handleProceed = () => {
    navigate("/ShopPages/OrderConfirmation", {
      state: {
        selectedColor: currentColor,
        selectedSize: selectedSize,
        price: selectedPrice,
        shirtImage: shirtImage,
        quantity: quantity,
        selectedName: selectedName,
      },
    });
  };

  const moreLikeThisProducts = [
    { name: "Blue Shirt", image: "/Home Assets/TShirts/blue shirt.png", price: 500 },
    { name: "Green Shirt", image: "/Home Assets/TShirts/green shirt.png", price: 500 },
    { name: "Purple Shirt", image: "/Home Assets/TShirts/purple shirt.png", price: 500 },
    { name: "Red Shirt", image: "/Home Assets/TShirts/red shirt.png", price: 500 },
    { name: "Yellow Shirt", image: "/Home Assets/TShirts/yellow shirt.png", price: 500 },
  ];

  return (
    <div className="w-full">
      <div className="w-full mt-25 h-32 bg-black"></div>
      <div className="container mx-auto p-6 flex gap-10">
        <div className="w-1/2">
          <img
            src={shirtImage}
            alt="Long Sleeve Shirt"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-bold">{selectedName}</h2>
          <p className="text-xl font-semibold mt-2">PHP {selectedPrice}.00</p>
          <div className="mt-4">
            <label className="block text-lg font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded-lg p-2 w-1/2"
            />
            <p className="text-sm text-gray-500">Available stock: {availableStock}</p>
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
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              {selectedSizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
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
        <h2 className="text-2xl font-bold mb-4">More Like This</h2>
        <div className="grid grid-cols-4 gap-6">
          {moreLikeThisProducts.map((product, index) => (
            <div key={index} className="border p-4 shadow-lg rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-700">PHP {product.price}.00</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-20 px-10 bg-gray-800 mt-12">
        <div className="container mx-auto text-white">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">Davidson Athletics</h3>
              <p className="text-sm mt-2">© 2025 Davidson Athletics. All rights reserved.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Us</h3>
              <p className="text-sm mt-2">Email: support@davidsonathletics.com</p>
              <p className="text-sm">Phone: +1 234 567 890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeShirt;