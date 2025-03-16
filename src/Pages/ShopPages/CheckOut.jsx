import React from 'react';
import Check from LucideCheck

const CheckOut = () => {
  return (
    <div className="min-h-screen bg-white mt-30">
      {/* Top black header bar */}
      <div className="w-full h-24 bg-black "></div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress steps */}
        <div className="flex justify-end items-center gap-4 mb-16">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-medium"><Check /></div>
            <span className="ml-4 text-2xl font-medium">Review</span>

          </div>

          
          <div className="w-32 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-medium">2</div>
            <span className="ml-4 text-2xl font-medium">Checkout</span>
          </div>
        </div>
        
        {/* Order confirmation header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Order Confirmation</h1>
          <p className="text-gray-600">Always double check before confirming for less hassle.</p>
        </div>
        
        {/* Product details */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product image */}
          <div className="md:w-1/2 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <img
              src="/Home Assets/home_img_longSleeve-black.svg"
              alt="Long Sleeve Jersey"
              className="max-w-full h-auto"
            />
          </div>
          
          {/* Product information */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">Long Sleeve Jersey</h2>
            <p className="text-gray-600 mb-6">Please check if the information you have filled up is correct.</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex">
                <span className="w-24 text-gray-600">Quantity:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">Color:</span>
                <span className="font-medium">Black</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">Size:</span>
                <span className="font-medium">Large</span>
              </div>
              <div className="flex pt-4 border-t">
                <span className="w-24 text-gray-600">Total:</span>
                <span className="font-bold">₱450.00</span>
              </div>
            </div>
            
            {/* Proceed button */}
            <button className="w-56 bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition">
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;