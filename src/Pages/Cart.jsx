import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Long Sleeve Jersey",
      variation: "XL",
      quantity: 1,
      basePrice: 550,
      imageUrl: "SampleShirt.svg",
      selected: false,
    },
    {
      id: 2,
      name: "Long Sleeve Jersey",
      variation: "XL",
      quantity: 1,
      basePrice: 550,
      imageUrl: "SampleShirt.svg",
      selected: false,
    },
  ]);

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
      <div className="w-full h-20 bg-black mt-30"></div>

      {/* Cart Container */}
      <div className="max-w-4xl mx-auto my-10 p-4">
        {/* Header */}
        <div className="bg-gray-800 text-white grid grid-cols-5 py-4 px-5 rounded-md text-center font-medium">
          <div className="flex items-center gap-2 justify-start col-span-2">
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
              <span className="font-medium">{item.name}</span>
            </div>

            {/* Inner Box - Wrapped Inside the Outer Box */}
            <div className="border rounded-md p-4 bg-white">
              <div className="grid grid-cols-5 items-center text-center">
                {/* Product Section */}
                <div className="col-span-2 flex items-center gap-4">
                  <img src={item.imageUrl} alt="Product" className="w-20 h-20 object-fit rounded-md" />
                  <div>
                    <h3 className="font-medium">Custom Long Sleeve Jersey</h3>
                    <p className="text-gray-500 text-sm">Variation: {item.variation}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="font-medium text-lg">₱{(item.basePrice * item.quantity).toFixed(2)}</div>

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
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Cart;
