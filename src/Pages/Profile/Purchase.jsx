import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";

const Purchase = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "To Ship", "To Receive", "Completed", "Cancelled"];

  const orders = [
    {
      id: 1,
      status: "Item is on its way",
      actionStatus: "To Receive",
      product: "Long sleeve tshirt",
      variation: "XL",
      quantity: 1,
      price: 500,
      total: 550,
      image: "/tshirt-image.jpg" // Replace with your actual image path
    },
  ];

  return (
    <>
      <div className="bg-black h-20 mt-30 w-full"></div>
      <div className="flex min-h-screen">
        {/* Sidebar component - this appears to contain the user profile and navigation */}
        <ProfileSidebar />
        
        {/* Main content area with reduced width */}
        <div className="flex-1 bg-white flex justify-center mr-50">
          <div className="w-full max-w-3xl">
            {/* Tabs Navigation - Evenly spaced */}
            <div className="flex justify-between border-b px-8 py-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-xl font-medium ${
                    activeTab === tab 
                      ? "text-black border-b-2 border-black" 
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Status Bar */}
            <div className="flex justify-between items-center px-8 py-6 border-b">
              <div className="flex-1"></div>
              <div className="flex items-center">
                <span className="text- font-medium border-r pr-6 mr-6">Item is on its way</span>

                <span className="text-blue-500 text-xl">To Receive</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-b px-8 py-8">
              {orders.map((order) => (
                <div key={order.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={order.image} 
                        alt={order.product}
                        className="w-20 object-contain"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100"; // Fallback image
                        }}
                      />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-medium">{order.product}</h3>
                      <p className="text-gray-500">Variation: {order.variation}</p>
                      <p>x{order.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium">₱{order.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="flex justify-end px-8 py-8">
              <div className="flex items-center">
                <span className="text-xl font-medium mr-4">Order Total:</span>
                <span className="text-2xl font-bold">₱{orders[0].total}</span>
              </div>
            </div>

            {/* Contact Seller Button */}
            <div className="flex justify-end px-8 mb-8">
              <button className="bg-black text-white text-sm font-medium py-2 px-6 rounded hover:bg-gray-800 transition uppercase">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;