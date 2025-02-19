import React, { useState } from "react";
import { PlusCircle, MinusCircle, Trash2, Image as ImageIcon, Type } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      size: "M",
      color: "white",
      quantity: 1,
      customizations: {
        text: "Custom Text",
        textColor: "#000000",
        textPosition: "center",
        uploadedImage: null,
      },
      basePrice: 350,
    },
  ]);

  const updateQuantity = (index, change) => {
    const newCart = [...cartItems];
    const newQuantity = newCart[index].quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      newCart[index].quantity = newQuantity;
      setCartItems(newCart);
    }
  };

  const updateCustomization = (index, field, value) => {
    const newCart = [...cartItems];
    newCart[index].customizations[field] = value;
    setCartItems(newCart);
  };

  const removeItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  };

  return (
    <>
    <div className="bg-black w-full h-10">
    </div>
    
    <div className="max-w-4xl mx-auto my-30 p-4">
    

      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Your cart is empty</div>
      ) : (
        cartItems.map((item, index) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg">
            <div className="w-40 h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
              <div className="w-32 h-40" style={{ backgroundColor: item.color }}>
                <p className="absolute" style={{ color: item.customizations.textColor, textAlign: item.customizations.textPosition }}>
                  {item.customizations.text}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <h3 className="font-medium">Custom T-Shirt</h3>
                <button onClick={() => removeItem(index)} className="text-red-500">
                  <Trash2 className="w-5 h-5 hover:bg-red-300 rounded-6" />
                </button>
              </div>
              <div className="flex gap-4">
                <button onClick={() => updateQuantity(index, -1)}><MinusCircle className="w-5 h-5" /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(index, 1)}><PlusCircle className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <input type="text" value={item.customizations.text} onChange={(e) => updateCustomization(index, "text", e.target.value)} className="border rounded px-2 py-1 text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <input type="color" value={item.customizations.textColor} onChange={(e) => updateCustomization(index, "textColor", e.target.value)} className="w-8 h-8" />
                </div>
              </div>
            </div>
            <div className="text-right font-medium">₱{(item.basePrice * item.quantity).toFixed(2)}</div>
          </div>
        ))
      )}
      <div className="border-t pt-4 flex justify-end font-medium">
        <span className="mr-2">Total:</span>
        <span>₱{calculateTotal().toFixed(2)}</span>
      </div>
    </div>
    </>
  );
};

export default Cart;
