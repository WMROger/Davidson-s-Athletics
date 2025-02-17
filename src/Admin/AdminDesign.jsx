import { useState } from "react";
import { Table, Badge, Button, Modal } from "@/components/ui";
import { format } from "date-fns";

const initialDesigns = [
  {
    id: 1,
    name: "John Doe",
    date: new Date(),
    status: "New Request",
    file: "design1.pdf",
    notes: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: new Date(),
    status: "In Progress",
    file: "logo.png",
    notes: "",
  },
];

const statusOptions = [
  "New Request",
  "In Progress",
  "Awaiting Approval",
  "Revision Requested",
  "Approved",
  "Completed",
];

export default function AdminDesign() {
  const [designs, setDesigns] = useState(initialDesigns);
  const [selectedDesign, setSelectedDesign] = useState(null);

  const updateStatus = (id, newStatus) => {
    setDesigns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    setSelectedDesign((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Designs</h1>
      <h2 className="text-xl font-semibold mb-6">
        Pending Designs ({designs.length})
      </h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => (
            <tr key={design.id}>
              <td>{design.name}</td>
              <td>{format(design.date, "MMM dd, yyyy")}</td>
              <td>
                <Badge>{design.status}</Badge>
              </td>
              <td>
                <a
                  href={`/uploads/${design.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              </td>
              <td>
                <Button onClick={() => setSelectedDesign(design)}>Manage</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedDesign && (
        <Modal title="Manage Design" onClose={() => setSelectedDesign(null)}>
          <h3 className="text-lg font-semibold">{selectedDesign.name}</h3>
          <p className="text-sm text-gray-600">Status: {selectedDesign.status}</p>
          <select
            className="mt-4 border p-2 rounded w-full"
            value={selectedDesign.status}
            onChange={(e) => updateStatus(selectedDesign.id, e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Modal>
      )}
    </div>
  );
}
