import React, { useState } from "react";

const ManageOrders = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const orders = Array.from({ length: 30 }, (_, i) => ({
    id: `#10${i + 1}`,
    customer: `Customer ${i + 1}`,
    type: i % 2 === 0 ? "Delivery" : "Pickup",
    status: ["Paid", "Cancelled", "Balance"][i % 3],
    product: ["Jersey", "Sleeveless", "Uniform"][i % 3],
    total: `$${(i + 1) * 20}`,
    date: `Feb ${i + 1}, 2025`,
  }));

  const filteredOrders = orders.filter((order) => {
    return (
      (typeFilter ? order.product === typeFilter : true) &&
      (statusFilter ? order.status === statusFilter : true) &&
      (searchQuery ? order.customer.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="p-2 rounded-full border" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">Type</option>
          <option value="Sleeveless">Sleeveless</option>
          <option value="Jersey">Jersey</option>
        </select>

        <select className="p-2 rounded-full border" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Status</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search orders..."
          className="p-2 rounded-full border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Product</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.type}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-white text-sm ${order.status === "Paid" ? "bg-green-500" : order.status === "Cancelled" ? "bg-red-500" : "bg-yellow-500"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.product}</td>
                <td className="p-3">{order.total}</td>
                <td className="p-3">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded-full disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-full disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageOrders;
