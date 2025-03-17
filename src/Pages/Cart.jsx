import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { db } from "../Database/firebase"; // Ensure correct path
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async (userId) => {
      try {
        const cartCollectionRef = collection(db, "users", userId, "cart");
        const snapshot = await getDocs(cartCollectionRef);
        const cartData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCartItems(user.uid);
      } else {
        console.error("No user is currently logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Toggle Checkbox Selection
  const toggleSelectItem = (index) => {
    setCartItems((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  // Update Quantity
  const updateQuantity = (index, change) => {
    setCartItems((prevCart) =>
      prevCart.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.min(10, Math.max(1, item.quantity + change)) }
          : item
      )
    );
  };

  // Remove Item from Cart
  const removeItem = (index) => {
    setCartItems((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Top Bar Placeholder */}
      <div className="w-full h-24 bg-black mt-30"></div>

      {/* Cart Container */}
      <div className="w-7xl mx-auto my-5 p-8">
        {/* Header */}
        <div className="bg-gray-800 text-white grid grid-cols-5 py-5 px-5 rounded-md text-center text-xl">
          <div className="flex items-center gap-2 justify-start col-span-2 text-xl">
            <input type="checkbox" className="w-5 h-5" />
            <span>Product</span>
          </div>
          <span>Price</span>
          <span>Amount</span>
          <span>Action</span>
        </div>

        {/* Cart Items */}
        {cartItems.map((item, index) => (
          <div
            key={item.id}
            className={`border rounded-md p-4 mt-4 bg-gray-100 ${
              item.selected ? "border-blue-500" : "border-gray-300"
            }`}
          >
            {/* Product Row (Outer Box - Restored) */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelectItem(index)}
                className="w-5 h-5"
              />
              <span className="font-medium">{item.productName}</span>
            </div>

            {/* Inner Box - Wrapped Inside the Outer Box */}
            <div className="border rounded-md p-4 bg-white">
              <div className="grid grid-cols-5 items-center text-center">
                {/* Product Section */}
                <div className="col-span-2 flex items-center gap-4">
                  <img src={item.imageUrl} alt="Product" className="w-28 h-28 object-fit rounded-md bg-gray-100" />
                  <div>
                    <h3 className="text-xl text-left">{item.productName}</h3>
                  </div>
                  <p className="text-gray-500 text-left text-xl">Variations: {item.size}</p>
                </div>

                {/* Price */}
                <div className="font-medium text-xl">₱{(item.price * item.quantity).toFixed(2)}</div>

                {/* Quantity Selector - Properly Aligned */}
                <div className="flex justify-center">
                  <div className="flex items-center border rounded-md w-24 justify-between">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="px-2 py-1 border-r hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="px-2 py-1 border-l hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                  Cancel
                </button>

                <button onClick={() => navigate('/ShopPages/Checkout')} className="text-black hover:text-red-700">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Cart;