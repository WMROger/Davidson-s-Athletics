import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Plus } from "lucide-react"; // Use horizontal meatballs icon and plus icon
import { db } from "../Database/firebase"; // Adjust the import path if necessary
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

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
      const querySnapshot = await getDocs(collection(db, "requests"));
      const assetsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssets(assetsData);
    };

    fetchAssets();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const assetDoc = doc(db, "requests", id);
    await updateDoc(assetDoc, { status: newStatus });
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, status: newStatus } : asset
      )
    );
  };

  const deleteAsset = async (id) => {
    const assetDoc = doc(db, "requests", id);
    await deleteDoc(assetDoc);
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
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

  const pendingAssets = assets.filter(asset => asset.status === "Pending Approval");
  const historyAssets = assets.filter(asset => asset.status !== "Pending Approval" && (filterStatus === "All" || asset.status === filterStatus));

  const pendingPageCount = Math.ceil(pendingAssets.length / ITEMS_PER_PAGE);
  const historyPageCount = Math.ceil(historyAssets.length / ITEMS_PER_PAGE);

  const paginatedPendingAssets = pendingAssets.slice((currentPendingPage - 1) * ITEMS_PER_PAGE, currentPendingPage * ITEMS_PER_PAGE);
  const paginatedHistoryAssets = historyAssets.slice((currentHistoryPage - 1) * ITEMS_PER_PAGE, currentHistoryPage * ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-6xl font-bold mb-8">Designs</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-semibold">
          Pending Designs{" "}
          <span className="text-gray-600 font-normal ml-6">({pendingAssets.length})</span>
        </h2>

        <button className="px-6 py-2 bg-[#222A2D] text-white rounded hover:bg-[#FFBF61] hover:text-black flex items-center">
          <Plus className="w-5 h-5 mr-2" /> New Upload
        </button>
      </div>

      <div className="overflow-hidden border rounded-2xl mb-12">
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
            {paginatedPendingAssets.map((asset, index) => (
              <tr key={asset.id} className="text-left border-b">
                <td className="p-2 pl-6">
                  <div className="flex flex-col">
                    <p className="font-semibold">Order #{(currentPendingPage - 1) * ITEMS_PER_PAGE + index + 1}</p> {/* Display the readable order number */}
                    <p className="font-semibold mt-1">{asset.customerInfo.fullName}</p> {/* Add margin-top to create a small gap */}
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
                  <a
                    href="#"
                    onClick={() => setSelectedAsset(asset)} // Open modal with selected asset
                    className="text-blue-500 hover:underline"
                  >
                    View File
                  </a>
                </td>
                <td className="p-2 flex items-center justify-center relative">
                  <button
                    className="px-4 py-2 text-green-600 rounded hover:bg-green-300 mr-2"
                    onClick={() => updateStatus(asset.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 text-red-600 rounded hover:bg-red-300 mr-2"
                    onClick={() => updateStatus(asset.id, "Denied")}
                  >
                    Deny
                  </button>
                </td>
                <td>
                  <div className="relative menu-container">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === asset.id ? null : asset.id);
                      }}
                    >
                      <MoreHorizontal className="w-7 h-7 text-gray-600" />
                    </button>
                    {openMenuId === asset.id && (
                      <div className="absolute -top-12 left-0 flex bg-white border rounded-lg shadow-lg z-50">
                        <button
                          className="px-4 py-2 text-red-600 hover:bg-gray-100"
                          onClick={() => deleteAsset(asset.id)}
                        >
                          Delete
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
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentPendingPage === 1}
            onClick={() => setCurrentPendingPage(currentPendingPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPendingPage} of {pendingPageCount}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentPendingPage === pendingPageCount}
            onClick={() => setCurrentPendingPage(currentPendingPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <h2 className="text-4xl font-semibold mb-6">Design History</h2>
      <div className="flex justify-between items-center mb-6">
        <div>
          <label className="mr-2">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded"
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
              <th className="p-2 pl-6 ">Name & Date</th>
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
                    <p className="font-semibold">Order #{(currentHistoryPage - 1) * ITEMS_PER_PAGE + index + 1}</p> {/* Display the readable order number */}
                    <p className="font-semibold mt-1">{asset.customerInfo.fullName}</p> {/* Add margin-top to create a small gap */}
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
                  <a
                    href="#"
                    onClick={() => setSelectedAsset(asset)} // Open modal with selected asset
                    className="text-blue-500 hover:underline"
                  >
                    View File
                  </a>
                </td>
                <td className="p-2 flex items-center justify-center relative">
                  <div className="relative menu-container">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === asset.id ? null : asset.id);
                      }}
                    >
                      <MoreHorizontal className="w-7 h-7 text-gray-600" />
                    </button>
                    {openMenuId === asset.id && (
                      <div className="absolute -top-12 left-0 flex bg-white border rounded-lg shadow-lg z-50">
                        <button
                          className="px-4 py-2 text-red-600 hover:bg-gray-100"
                          onClick={() => deleteAsset(asset.id)}
                        >
                          Delete
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
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentHistoryPage === 1}
            onClick={() => setCurrentHistoryPage(currentHistoryPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentHistoryPage} of {historyPageCount}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentHistoryPage === historyPageCount}
            onClick={() => setCurrentHistoryPage(currentHistoryPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2"> {/* Adjusted width to 1/2 */}
            <h2 className="text-2xl font-semibold mb-4">Asset Details</h2>
            <div className="flex">
              <img src={selectedAsset.imageUrls[0]} alt="Asset" className="w-1/2 h-auto mr-4" />
              <div className="w-1/2">
                <p><strong>Order:</strong> #{(currentPendingPage - 1) * ITEMS_PER_PAGE + assets.indexOf(selectedAsset) + 1}</p>
                <p><strong>Name:</strong> {selectedAsset.customerInfo.fullName}</p>
                <p><strong>Email:</strong> {selectedAsset.customerInfo.email}</p>
                <p><strong>Phone:</strong> {selectedAsset.customerInfo.phone}</p>
                <p><strong>Team Name:</strong> {selectedAsset.customerInfo.teamName}</p>
                <p><strong>Date:</strong> {format(selectedAsset.timestamp.toDate(), "MMM dd, yyyy")}</p>
                <p><strong>Status:</strong> {selectedAsset.status}</p>
                <p><strong>Product Type:</strong> {selectedAsset.productType}</p>
                <p><strong>Cut Type:</strong> {selectedAsset.designDetails.cutType}</p>
                <p><strong>Pattern:</strong> {selectedAsset.designDetails.pattern}</p>
                <p><strong>Primary Color:</strong> {selectedAsset.designDetails.primaryColor}</p>
                <p><strong>Secondary Color:</strong> {selectedAsset.designDetails.secondaryColor}</p>
                <p><strong>Quantity:</strong> {selectedAsset.designDetails.quantity}</p>
                <p><strong>Sizes:</strong> {selectedAsset.designDetails.sizes.join(", ")}</p>
                <p><strong>Special Instructions:</strong> {selectedAsset.designDetails.specialInstructions}</p>
                <p><strong>Names:</strong> {selectedAsset.designDetails.names.join(", ")}</p>
              </div>
            </div>
            <button
              className="mt-4 ml-205 px-6 py-2 bg-red-500 cursor-pointer text-white rounded hover:bg-red-600"
              onClick={() => setSelectedAsset(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}