import React from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react'; // Example import statement for an icon from lucide-react

const Checkout = () => {
  const location = useLocation();
  const { state } = location;
  const selectedColor = state?.selectedColor;
  const selectedSize = state?.selectedSize;
  const price = state?.price;
  const shirtImage = state?.shirtImage;
  const quantity = state?.quantity;
  const selectedName = state?.selectedName;

  return (
    <div className="min-h-screen bg-white mt-30">
      <div className="w-full h-24 bg-black "></div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Please review your order before proceeding to payment.</p>
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
            <h2 className="text-2xl font-bold mb-2">{selectedName}</h2>
            <div className="space-y-3 mb-8">
              <div className="flex">
                <span className="w-24 text-gray-600">Quantity:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">Color:</span>
                <span className="font-medium">{selectedColor}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">Size:</span>
                <span className="font-medium">{selectedSize}</span>
              </div>
              <div className="flex pt-4 border-t">
                <span className="w-24 text-gray-600">Total:</span>
                <span className="font-bold">₱{price * quantity}.00</span>
              </div>
            </div>
            <button className="w-56 bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition">
              Proceed to Payment
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

export default Checkout;