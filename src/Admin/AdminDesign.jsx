import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Plus, X, Check, X as XIcon } from "lucide-react"; // Added Check and X icons
import { db } from "../Database/firebase"; // Adjust the import path if necessary
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const ITEMS_PER_PAGE = 5;

export default function AdminDesign() {
  const [assets, setAssets] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState(null); // State to manage selected asset for modal

  useEffect(() => {
    const fetchAssets = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const allRequests = [];

      for (const userDoc of usersSnapshot.docs) {
        const requestsSnapshot = await getDocs(
          collection(db, "users", userDoc.id, "requests")
        );
        requestsSnapshot.forEach((requestDoc) => {
          allRequests.push({
            id: requestDoc.id,
            userId: userDoc.id,
            ...requestDoc.data(),
          });
        });
      }

      setAssets(allRequests);
    };

    fetchAssets();
  }, []);

  const updateStatus = async (userId, docId, newStatus) => {
    try {
      console.log("Updating status for:", { userId, docId, newStatus });
      const assetDoc = doc(
        db,
        "users",
        String(userId),
        "requests",
        String(docId)
      );

      // Check if the document exists
      const assetDocSnapshot = await getDoc(assetDoc);
      if (!assetDocSnapshot.exists()) {
        console.error("No document to update:", assetDoc.path);
        return;
      }

      await updateDoc(assetDoc, { status: newStatus });
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === String(docId) ? { ...asset, status: newStatus } : asset
        )
      );
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const deleteAsset = async (userId, requestId) => {
    try {
      const assetDoc = doc(
        db,
        "users",
        String(userId),
        "requests",
        String(requestId)
      );
      await deleteDoc(assetDoc);
      setAssets((prev) =>
        prev.filter((asset) => asset.id !== String(requestId))
      );
      console.log("Asset deleted successfully");
    } catch (error) {
      console.error("Error deleting asset: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const pendingAssets = assets.filter(
    (asset) => asset.status === "Pending Approval"
  );
  const historyAssets = assets.filter(
    (asset) =>
      asset.status !== "Pending Approval" &&
      (filterStatus === "All" || asset.status === filterStatus)
  );

  const pendingPageCount = Math.ceil(pendingAssets.length / ITEMS_PER_PAGE);
  const historyPageCount = Math.ceil(historyAssets.length / ITEMS_PER_PAGE);

  const paginatedPendingAssets = pendingAssets.slice(
    (currentPendingPage - 1) * ITEMS_PER_PAGE,
    currentPendingPage * ITEMS_PER_PAGE
  );
  const paginatedHistoryAssets = historyAssets.slice(
    (currentHistoryPage - 1) * ITEMS_PER_PAGE,
    currentHistoryPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative p-6">
      <h1 className="text-6xl font-bold mb-8">Designs</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-semibold">
          Pending Designs{" "}
          <span className="text-gray-600 font-normal ml-6">
            ({pendingAssets.length})
          </span>
        </h2>
      </div>

      <div className="overflow-hidden border rounded-2xl mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b ">
              <th className="p-2 pl-6">Name & Date</th>
              <th className="p-2 ">Status</th>
              <th className="p-2 ">File</th>
              <th className="p-2 "></th>
            </tr>
          </thead>
          <tbody>
            {paginatedPendingAssets.map((asset, index) => (
              <tr key={asset.id} className="text-left border-b">
                <td className="p-2 pl-6">
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Order #
                      {(currentPendingPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </p>
                    <p className="font-semibold mt-1">
                      {asset.customerInfo?.fullName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(asset.timestamp.toDate(), "MMM dd, yyyy")}
                    </p>
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      asset.status === "Approved"
                        ? "bg-green-500 text-white"
                        : asset.status === "Denied"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm font-medium flex items-center"
                  >
                    View Details
                  </button>
                </td>
                <td className="py-6 px-5 items-center relative flex justify-end">
                  <button
                    className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 mr-3 transition-colors flex items-center shadow-sm text-sm font-medium"
                    onClick={() => updateStatus(asset.userId, asset.id, "Approved")}
                  >
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 mr-3 transition-colors flex items-center shadow-sm text-sm font-medium"
                    onClick={() => updateStatus(asset.userId, asset.id, "Denied")}
                  >
                    <XIcon className="w-4 h-4 mr-2" /> Deny
                  </button>
                </td>
                <td>
                  <div className="relative flex justify-start menu-container">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === asset.id ? null : asset.id
                        );
                      }}
                    >
                      <MoreHorizontal className="w-7 h-7 text-gray-600" />
                    </button>
                    {openMenuId === asset.id && (
                      <div className="absolute -top-12 left-0 flex bg-white border rounded-lg shadow-lg z-50">
                        <button
                          className="px-4 py-2 text-red-600 hover:bg-gray-100 font-medium flex items-center"
                          onClick={() => deleteAsset(asset.userId, asset.id)}
                        >
                          <XIcon className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4">
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={currentPendingPage === 1}
            onClick={() => setCurrentPendingPage(currentPendingPage - 1)}
          >
            Previous
          </button>
          <span className="font-medium">
            Page {currentPendingPage} of {Math.max(1, pendingPageCount)}
          </span>
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={currentPendingPage === pendingPageCount || pendingPageCount === 0}
            onClick={() => setCurrentPendingPage(currentPendingPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <h2 className="text-4xl font-semibold mb-6">Design History</h2>
      <div className="flex justify-between items-center mb-6">
        <div>
          <label className="mr-2 font-medium">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden border rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2 pl-6">Name & Date</th>
              <th className="p-2 ">Status</th>
              <th className="p-2 ">File</th>
              <th className="p-2 "></th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistoryAssets.map((asset, index) => (
              <tr key={asset.id} className="text-left border-b">
                <td className="p-2 pl-6">
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Order #
                      {(currentHistoryPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </p>
                    <p className="font-semibold mt-1">
                      {asset.customerInfo.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(asset.timestamp.toDate(), "MMM dd, yyyy")}
                    </p>
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      asset.status === "Approved"
                        ? "bg-green-500 text-white"
                        : asset.status === "Denied"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm font-medium flex items-center"
                  >
                    View Details
                  </button>
                </td>
                <td>
                  <div className="relative menu-container">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === asset.id ? null : asset.id
                        );
                      }}
                    >
                      <MoreHorizontal className="w-7 h-7 text-gray-600" />
                    </button>
                    {openMenuId === asset.id && (
                      <div className="absolute -top-12 left-0 flex bg-white border rounded-lg shadow-lg z-50">
                        <button
                          className="px-4 py-2 text-red-600 hover:bg-gray-100 font-medium flex items-center"
                          onClick={() => deleteAsset(asset.userId, asset.id)}
                        >
                          <XIcon className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4">
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={currentHistoryPage === 1}
            onClick={() => setCurrentHistoryPage(currentHistoryPage - 1)}
          >
            Previous
          </button>
          <span className="font-medium">
            Page {currentHistoryPage} of {Math.max(1, historyPageCount)}
          </span>
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={currentHistoryPage === historyPageCount || historyPageCount === 0}
            onClick={() => setCurrentHistoryPage(currentHistoryPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {selectedAsset && (
  <div 
    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30"
    onKeyDown={(e) => {
      if (e.key === "Escape") {
        setSelectedAsset(null);
      }
    }}
    tabIndex={0}
    ref={(node) => {
      // Focus the div so it can receive keyboard events
      if (node) node.focus();
    }}
  >
    <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Asset Details</h2>
        {/* <button
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          onClick={() => setSelectedAsset(null)}
        >
          <X className="h-6 w-6" />
        </button> */}
      </div>
      
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-[400px]">
            <img
              src={selectedAsset.imageUrls[0]}
              alt="Asset"
              className="max-h-full object-contain"
              style={{ maxWidth: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        
        <div className="md:w-1/2 space-y-4">
          <div className="mb-2">
            <span className={`inline-block px-4 py-2 rounded-lg text-lg font-medium ${
              selectedAsset.status === "Approved"
                ? "bg-green-500 text-white"
                : selectedAsset.status === "Denied"
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-white"
            }`}>
              {selectedAsset.status}
            </span>
          </div>
          
          <div className="border-b pb-2 mb-2">
            <h3 className="font-bold text-2xl mb-3">Order Information</h3>
            <p className="text-lg">
              <span className="font-semibold">Order:</span> #
              {(currentPendingPage - 1) * ITEMS_PER_PAGE +
                assets.indexOf(selectedAsset) +
                1}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Date:</span>{" "}
              {format(selectedAsset.timestamp.toDate(), "MMM dd, yyyy")}
            </p>
          </div>
          
          <div className="border-b pb-2 mb-2">
            <h3 className="font-bold text-2xl mb-3">Customer Information</h3>
            <p className="text-lg">
              <span className="font-semibold">Name:</span> {selectedAsset.customerInfo.fullName}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span> {selectedAsset.customerInfo.email}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Phone:</span> {selectedAsset.customerInfo.phone}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Team Name:</span>{" "}
              {selectedAsset.customerInfo.teamName}
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-2xl mb-3">Product Details</h3>
            <p className="text-lg">
              <span className="font-semibold">Product Type:</span> {selectedAsset.productType}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Cut Type:</span>{" "}
              {selectedAsset.designDetails.cutType}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Pattern:</span>{" "}
              {selectedAsset.designDetails.pattern}
            </p>
            <div className="flex items-center py-1">
              <span className="font-semibold mr-2 text-lg">Primary Color:</span>
              <div 
                className="w-5 h-5 rounded-full mr-2" 
                style={{ backgroundColor: selectedAsset.designDetails.primaryColor }}
              ></div>
              <span className="text-lg">{selectedAsset.designDetails.primaryColor}</span>
            </div>
            <div className="flex items-center py-1">
              <span className="font-semibold mr-2 text-lg">Secondary Color:</span>
              <div 
                className="w-5 h-5 rounded-full mr-2" 
                style={{ backgroundColor: selectedAsset.designDetails.secondaryColor }}
              ></div>
              <span className="text-lg">{selectedAsset.designDetails.secondaryColor}</span>
            </div>
            <p className="text-lg">
              <span className="font-semibold">Quantity:</span>{" "}
              {selectedAsset.designDetails.quantity}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Sizes:</span>{" "}
              {selectedAsset.designDetails.sizes.join(", ")}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Names:</span>{" "}
              {selectedAsset.designDetails.names.join(", ")}
            </p>
            <p className="mt-2">
              <span className="font-semibold block mb-1 text-lg">Special Instructions:</span>
              <span className="block p-3 bg-gray-50 rounded-lg text-lg border">
                {selectedAsset.designDetails.specialInstructions || "None provided"}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t flex justify-end space-x-4">
        {selectedAsset.status === "Pending Approval" && (
          <>
            <button
              className="px-6 py-3 bg-green-500 cursor-pointer text-white rounded-lg hover:bg-green-600 text-lg font-medium flex items-center transition-colors shadow-sm"
              onClick={() => {
                updateStatus(selectedAsset.userId, selectedAsset.id, "Approved");
                setSelectedAsset(null);
              }}
            >
              <Check className="w-5 h-5 mr-2" /> Approve
            </button>
            <button
              className="px-6 py-3 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 text-lg font-medium flex items-center transition-colors shadow-sm"
              onClick={() => {
                updateStatus(selectedAsset.userId, selectedAsset.id, "Denied");
                setSelectedAsset(null);
              }}
            >
              <XIcon className="w-5 h-5 mr-2" /> Deny
            </button>
          </>
        )}
        <button
          className="px-6 py-3 bg-gray-200 cursor-pointer text-gray-800 rounded-lg hover:bg-gray-300 text-lg font-medium transition-colors"
          onClick={() => setSelectedAsset(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}