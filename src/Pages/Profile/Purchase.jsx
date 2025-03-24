import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Database/firebase";
import ProfileSidebar from "./ProfileSidebar";

const Purchase = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);

  const tabs = ["All", "To Ship", "To Deliver", "To Receive", "Completed"];

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orders);
    };

    fetchOrders();
  }, []);

  const filteredOrders = activeTab === "All" ? orders : orders.filter(order => order.status === activeTab);

  return (
    <>
      <div className="bg-black h-30 mt-30 w-full"></div>
      <div className="flex min-h-svh">
        <ProfileSidebar />
        <div className="flex-1 bg-white flex justify-center mr-50">
          <div className="w-full max-w-3xl">
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

            {filteredOrders.map((order) => (
              <div key={order.id} className="border-b px-8 py-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={order.selectedItems[0].imageUrl} 
                        alt={order.selectedItems[0].productName}
                        className="w-20 object-contain"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100"; // Fallback image
                        }}
                      />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-medium">{order.selectedItems[0].productName}</h3>
                      <p className="text-gray-500">Variation: {order.selectedItems[0].size}</p>
                      <p>x{order.selectedItems[0].quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium">₱{order.total}</p>
                    <p className="text-gray-500">{order.status}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end px-8 py-8">
              <div className="flex items-center">
                <span className="text-xl font-medium mr-4">Order Total:</span>
                <span className="text-2xl font-bold">₱{filteredOrders.reduce((acc, order) => acc + order.total, 0)}</span>
              </div>
            </div>

            <div className="flex justify-end px-8 mb-8">
              <button className="bg-black text-white text-sm font-medium py-2 px-6 rounded hover:bg-gray-800 transition uppercase">
                Contact Seller
              </button>
            </div>
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
              <p className="text-sm mt-2">Email: </p>
              <p className="text-sm">Phone: </p>
            </div>
          </div>
        </div>
      </div>


    
    </>
  );
};

export default Purchase;