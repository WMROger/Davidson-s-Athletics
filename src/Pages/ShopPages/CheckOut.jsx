import React from 'react';
import { Check } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-white mt-30">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="container flex justify-end items-center">
          {/* Progress indicator */}
          <div className="flex items-center mr-4 md:mr-40">
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                <Check size={30} />
              </div>
              <span className="ml-2 md:ml-4 text-base md:text-lg font-medium">Review</span>
            </div>
            <div className="w-8 md:w-16 h-px bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium">2</span>
              </div>
              <span className="ml-2 text-2xl font-medium">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Two-column layout */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left column - Shipping Information */}
          <div className="w-full md:w-2/3 p-4 md:p-6 border-r border-gray-200">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Checkout</h1>
            
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-medium mb-4">Shipping Information</h2>
              
              <div className="flex gap-4 mb-4 w-full md:w-3/4">
                <label className="border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 flex-1 cursor-pointer">
                  <input type="radio" name="shipping" className="w-4 h-4" />
                  <span className="text-gray-600 text-sm md:text-base flex items-center">
                    <img src="/Delivery_ic.svg" alt="Delivery Icon" className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Delivery
                  </span>
                </label>

                <label className="border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 flex-1 cursor-pointer">
                  <input type="radio" name="shipping" className="w-4 h-4" />
                  <span className="text-gray-600 text-sm md:text-base flex items-center">
                    <img src="/Pickup_ic.svg" alt="Pickup Icon" className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Pick Up
                  </span>
                </label>
              </div>
            </div>
            
            <form>
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Full name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Email address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-2" />
                  <span className="text-sm md:text-base">I have read the <a href="#" className="underline">Terms and Conditions</a>.</span>
                </label>
              </div>
            </form>
          </div>
          
          {/* Right column - Review Cart */}
          <div className="w-full md:w-1/2 p-4 md:p-6 mt-2">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Review your cart</h2>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <img 
                src="/T-shirt.svg"
                alt="Amigos Jersey" 
                className="w-full h-auto mb-4"
              />
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm md:text-base">
                <span>Subtotal</span>
                <span>₱450.00</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span>Delivery Fee</span>
                <span>₱50.00</span>
              </div>
              <div className="flex justify-between font-semibold text-base md:text-lg pt-2 border-t border-gray-300 mt-2">
                <span>Total</span>
                <span>₱500.00</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button className="w-full md:w-3/4 lg:w-4/5 bg-black text-white py-2 md:py-3 rounded-xl font-medium text-base md:text-lg">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;