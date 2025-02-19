import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react"; 

const initialDesigns = [
  {
    id: 1,
    name: "John Doe",
    date: new Date(),
    status: "Awaiting Approval",
    file: "design1.pdf",
  },
  {
    id: 2,
    name: "Jane Smith Awesomeness Gray",
    date: new Date(),
    status: "Awaiting Approval",
    file: "logo.png",
  },
];

export default function Admin() {
  const [designs, setDesigns] = useState(initialDesigns);
  const [openMenuId, setOpenMenuId] = useState(null);

  const updateStatus = (id, newStatus) => {
    setDesigns((prev) =>
      prev.map((design) =>
        design.id === id ? { ...design, status: newStatus } : design
      )
    );
  };

  const deleteDesign = (id) => {
    setDesigns((prev) => prev.filter((design) => design.id !== id));
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
      <h1 className="text-6xl font-bold mb-8">Designs</h1>
      <h2 className="text-4xl font-semibold mb-6">
        Pending Designs{" "}
        <span className="text-gray-600 font-normal ml-6">({designs.length})</span>
      </h2>

        <div className="overflow-hidden rounded-2xl border shadow-lg">
        <table className=" w-full border-collapse" >
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2 pl-6  ">Name & Date</th>
              <th className="p-2 ">Status</th>
              <th className="p-2 ">File</th>
              <th className="p-2 "></th>


            </tr>
          </thead>
          <tbody>
            {designs.map((design) => (
              <tr key={design.id} className="text-left border-b">
                {/* Name & Date */}
                <td className="p-2 pl-6">
                  <p className="font-semibold">{design.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(design.date, "MMM dd, yyyy")}
                  </p>
                </td>

                {/* Status */}
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      design.status === "Approved"
                        ? "bg-green-500 text-white"
                        : design.status === "Denied"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {design.status}
                  </span>
                </td>

                {/* File */}
                <td className="p-2">
                  <a
                    href={`/uploads/${design.file}`}
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
                    onClick={() => updateStatus(design.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 text-red-600 rounded hover:bg-red-300 mr-2"
                    onClick={() => updateStatus(design.id, "Denied")}
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
                        setOpenMenuId(openMenuId === design.id ? null : design.id);
                      }}
                    >
                      <MoreHorizontal className="w-7 h-7 text-gray-600" />
                    </button>

                    {/* Menu */}
                    {openMenuId === design.id && (
                      <div className="absolute -top-12 left-0 flex bg-white border rounded-lg shadow-lg z-50">
                        <button
                          className="px-4 py-2 text-red-600 hover:bg-gray-100"
                          onClick={() => deleteDesign(design.id)}
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
