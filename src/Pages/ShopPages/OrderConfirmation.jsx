import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../Database/firebase'; // Ensure correct path
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const selectedColor = state?.selectedColor;
  const selectedSize = state?.selectedSize;
  const price = state?.price;
  const shirtImage = state?.shirtImage;
  const quantity = state?.quantity;
  const selectedName = state?.selectedName;

  const handleAddToCart = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently logged in.");
      navigate("/login");
      return;
    }

    const userId = user.uid; // Get the current user's ID
    try {
      const cartCollectionRef = collection(db, "users", userId, "cart");
      await addDoc(cartCollectionRef, {
        productId: "productId", // Replace with actual product ID
        productName: selectedName,
        quantity: quantity,
        price: price,
        size: selectedSize,
        color: selectedColor,
        imageUrl: shirtImage,
      });
      console.log("Item added to cart");
      navigate("/cart"); // Redirect to cart page
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/ShopPages/Checkout", {
      state: {
        selectedColor,
        selectedSize,
        price,
        shirtImage,
        quantity,
        selectedName,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white mt-30">
      <div className="w-full h-24 bg-black "></div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-end items-center gap-4 mb-16">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-medium">1</div>
            <span className="ml-2 text-2xl font-medium">Review</span>
          </div>
          <div className="w-32 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-medium">2</div>
            <span className="ml-2 text-base font-medium">Checkout</span>
          </div>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Order Confirmation</h1>
          <p className="text-gray-600">Always double check before confirming for less hassle.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <img
              src={shirtImage}
              alt="Long Sleeve Jersey"
              className="max-w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            {/* Modified section with bigger text */}
            <h2 className="text-3xl font-bold mb-4">{selectedName}</h2>
            <p className="text-gray-600 mb-6 text-xl">Please check if the information you have filled up is correct.</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="w-32 text-gray-700 text-xl">Quantity:</span>
                <span className="font-medium text-xl">{quantity}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-700 text-xl">Color:</span>
                <span className="font-medium text-xl">{selectedColor}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-700 text-xl">Size:</span>
                <span className="font-medium text-xl">{selectedSize}</span>
              </div>
              <div className="flex items-center pt-6 border-t border-gray-300">
                <span className="w-32 text-gray-700 text-xl">Total:</span>
                <span className="font-bold text-2xl">₱{price * quantity}.00</span>
              </div>
            </div>
            {/* Bigger button with enhanced styling */}
            <button
              className="w-full bg-black text-white py-3 px-5 rounded-md text-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
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

export default OrderConfirmation;