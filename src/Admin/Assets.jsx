import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Plus } from "lucide-react"; // Use horizontal meatballs icon and plus icon

const initialAssets = [
  {
    id: 1,
    name: "John Doe",
    date: new Date(),
    status: "Awaiting Approval",
    file: "design1.pdf",
  },
  {
    id: 2,
    name: "Jane Smith Jane Smith Awesomeness Gray",
    date: new Date(),
    status: "Awaiting Approval",
    file: "logo.png",
  },
];

export default function Assets() {
  const [assets, setAssets] = useState(initialAssets);
  const [openMenuId, setOpenMenuId] = useState(null);

  const updateStatus = (id, newStatus) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, status: newStatus } : asset
      )
    );
  };

  const deleteAsset = (id) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-6xl font-bold mb-8">Assets</h1>

      <div className="flex justify-between items-center mb-6">
    <h2 className="text-4xl font-semibold">
      Pending Assets{" "}
      <span className="text-gray-600 font-normal ml-6">({assets.length})</span>
    </h2>

    {/* Upload File Button moved to the right */}
    <button className="px-6 py-2 bg-[#222A2D] text-white rounded hover:bg-[#FFBF61] hover:text-black flex items-center">
      <Plus className="w-5 h-5 mr-2" /> New Upload
    </button>
  </div>

      <div className="overflow-hidden border rounded-2xl  ">
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
            {assets.map((asset) => (
              <tr key={asset.id} className="text-left border-b">
                {/* Name & Date */}
                <td className="p-2 pl-6">
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(asset.date, "MMM dd, yyyy")}
                  </p>
                </td>

                {/* Status */}
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

                {/* File */}
                <td className="p-2">
                  <a
                    href={`/uploads/${asset.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View File
                  </a>
                </td>

                {/* Actions */}
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
                    {/* Meatballs Menu */}
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

                    {/* Menu */}
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
      </div>
    </div>
  );
}
