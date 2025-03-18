import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { db } from "../Database/firebase"; // Ensure correct path
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Fetch Request Data Function
const fetchRequestData = async () => {
  const userId = "aulIj4vUZKVgqkO8HgkUfzxgNlZ2";
  const requestId = "14";
  const docRef = doc(db, "users", userId, "requests", String(requestId));

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Request Data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

fetchRequestData();

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [requests, setRequests] = useState([]); // Stores user requests
  const navigate = useNavigate();
  const auth = getAuth();

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

    const fetchRequests = async (userId) => {
      try {
        const requestsCollectionRef = collection(
          db,
          "users",
          userId,
          "requests"
        );
        const snapshot = await getDocs(requestsCollectionRef);
        const requestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched requests:", requestsData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCartItems(user.uid);
        fetchRequests(user.uid);
      } else {
        console.error("No user is currently logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Toggle Checkbox Selection
  const toggleSelectItem = (index) => {
    if (index === -1) {
      // Handle "select all" logic
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);
      setCartItems((prevCart) =>
        prevCart.map((item) => ({ ...item, selected: newSelectAll }))
      );
      setSelectedItems(newSelectAll ? [...cartItems] : []);
    } else {
      // Handle individual item selection
      setCartItems((prevCart) =>
        prevCart.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, selected: !item.selected };
            if (updatedItem.selected) {
              setSelectedItems((prevSelected) => [
                ...prevSelected,
                updatedItem,
              ]);
            } else {
              setSelectedItems((prevSelected) =>
                prevSelected.filter(
                  (selectedItem) => selectedItem.id !== updatedItem.id
                )
              );
            }
            return updatedItem;
          }
          return item;
        })
      );
    }
  };

  // Update Quantity
  const updateQuantity = (index, change) => {
    setCartItems((prevCart) =>
      prevCart.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.min(10, Math.max(1, item.quantity + change)),
            }
          : item
      )
    );
  };

  // Remove Item from Cart
  const removeItem = async (index) => {
    const itemToRemove = cartItems[index];
    try {
      const itemDocRef = doc(
        db,
        "users",
        getAuth().currentUser.uid,
        "cart",
        itemToRemove.id
      );
      await deleteDoc(itemDocRef);
      setCartItems((prevCart) => prevCart.filter((_, i) => i !== index));
      setSelectedItems((prevSelected) =>
        prevSelected.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Handle Checkout
  const handleCheckout = () => {
    navigate("/ShopPages/Checkout", { state: { selectedItems } });
  };

  const updateRequestQuantity = (requestId, change) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              quantity: Math.max(1, (request.quantity || 1) + change), // Default to 1 if quantity is not set
            }
          : request
      )
    );
  };

  // Remove Request from Firestore
  const removeRequest = async (requestId) => {
    const userId = getAuth().currentUser.uid; // Get current user's ID
    try {
      const requestIdStr = String(requestId); // Ensure requestId is a string
      console.log("Removing request with ID:", requestIdStr); // Log for debugging

      const docRef = doc(db, "users", userId, "requests", requestIdStr);
      await deleteDoc(docRef); // Remove the document from Firestore
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestIdStr)
      ); // Update local state
    } catch (error) {
      console.error("Error removing request:", error);
    }
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
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={selectAll}
              onChange={() => toggleSelectItem(-1)}
            />
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
                  <img
                    src={item.imageUrl}
                    alt="Product"
                    className="w-28 h-28 object-fit rounded-md bg-gray-100"
                  />
                  <div>
                    <h3 className="text-xl text-left">{item.productName}</h3>
                  </div>
                  <p className="text-gray-500 text-left text-xl">
                    Variations: {item.size}
                  </p>
                </div>

                {/* Price */}
                <div className="font-medium text-xl">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>

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
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Requests */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No requests found.</p> // ✅ Show a message if empty
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className={`border rounded-md p-4 mt-4 bg-gray-100 ${
                  request.selected ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {/* Product Row for Request */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={request.selected}
                    onChange={() => toggleSelectItem(request.id)}
                    className="w-5 h-5"
                  />
                  <span className="font-medium">{request.productName}</span>
                </div>

                {/* Inner Box - Wrapped Inside the Outer Box */}
                <div className="border rounded-md p-4 bg-white">
                  <div className="grid grid-cols-5 items-center text-center">
                    {/* Request Section */}
                    <div className="col-span-2 flex items-center gap-4">
                      {request.imageUrls?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="Request Design"
                          className="w-28 h-28 object-fit rounded-md bg-gray-100"
                        />
                      ))}
                      <div>
                        <h3 className="text-xl text-left">{request.productName}</h3>
                      </div>
                    </div>

                    {/* Quantity and Price for Request */}
                    <div className="font-medium text-xl">
                      ₱{(request.price * request.quantity).toFixed(2)}
                    </div>

                    {/* Quantity Selector for Request */}
                    <div className="flex justify-center">
                      <div className="flex items-center border rounded-md w-24 justify-between">
                        <button
                          onClick={() => updateRequestQuantity(request.id, -1)}
                          className="px-2 py-1 border-r hover:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{request.quantity}</span>
                        <button
                          onClick={() => updateRequestQuantity(request.id, 1)}
                          className="px-2 py-1 border-l hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Request Button */}
                    <button
                      onClick={() => removeRequest(request.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Request
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Checkout Section */}
      <div className="w-full h-20">
        <button
          onClick={handleCheckout}
          className="bg-black text-white w-full py-3 text-2xl font-medium"
        >
          Proceed to Checkout
        </button>
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
    </>
  );
};

export default Cart;
