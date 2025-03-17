import React from 'react';
import { Check } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6 mt-30">
        <div className="container flex justify-end items-center">

           
          
          {/* Progress indicator */}
          <div className="flex items-center mr-40">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-medium">
                <Check size={30} />
              </div>
              <span className="ml-4 text-2xl font-medium">Review</span>
            </div>
            <div className="w-16 h-px bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-medium">
                <span className="text-xl font-medium">2</span>
              </div>
              <span className="ml-4 text-2xl font-medium">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Two-column layout */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left column - Shipping Information */}
          <div className="w-full md:w-2/3 p-6 border-r border-gray-200">
            <h1 className="text-[45px] font-bold mb-6">Checkout</h1>
            
            <div className="mb-6">
              <h2 className="text-[34px] font-normal mb-4">Shipping Information</h2>
              <div className="flex gap-4 mb-4">
                <label className="border border-gray-300 rounded-md px-4 py-3 flex items-center gap-2 flex-1 cursor-pointer">
                  <input type="radio" name="shipping" className="w-4 h-4" />
                  <span className="text-[#817F7F] text-[24px] flex items-center">
                    <img src="/Delivery_ic.svg" alt="Delivery Icon" className="size-[40px] mr-3" />
                    Delivery
                  </span>
                </label>

                <label className="border border-gray-300 rounded-md px-4 py-3 flex items-center gap-2 flex-1 cursor-pointer">
                  <input type="radio" name="shipping" className="w-4 h-4" />
                  <span className="text-[#817F7F] text-[24px] flex items-center font-extralight">
                    <img src="/Delivery_ic.svg" alt="Delivery Icon" className="size-[40px] mr-3" />
                    Pick Up
                  </span>
                </label>
              </div>
            </div>
            
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Full name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Email address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-2" />
                  <span>I have read the <a href="#" className="underline">Terms and Conditions</a>.</span>
                </label>
              </div>
            </form>
          </div>
          
          {/* Right column - Review Cart */}
          <div className="w-full md:w-1/2 p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Review your cart</h2>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <img 
                src="/T-shirt.svg"
                alt="Amigos Jersey" 
                className="w-full h-auto mb-4"
              />
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱450.00</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₱50.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-300 mt-2">
                <span>Total</span>
                <span>₱500.00</span>
              </div>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-md font-medium">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;