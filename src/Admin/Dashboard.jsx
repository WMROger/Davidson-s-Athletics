import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Card from "../DashboardCards/Card";
import CardContent from "../DashboardCards/CardContent";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ordersData = [
  { id: 1, product: "Jersey", type: "Sleeveless", price: "₱350", status: "Pending" },
  { id: 2, product: "Hoodie", type: "Long Sleeves", price: "₱450", status: "Processing" },
  { id: 3, product: "T-Shirt", type: "Short Sleeves", price: "₱350", status: "Shipped" },
  { id: 4, product: "Tracksuit", type: "Uniform", price: "₱400", status: "Cancelled" },
];

const statusColors = {
  Pending: "bg-yellow-500",
  Processing: "bg-blue-500",
  Shipped: "bg-purple-500",
  Completed: "bg-green-500",
  Cancelled: "bg-red-500",
};

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState("All Orders");

  const filteredOrders =
    statusFilter === "All Orders"
      ? ordersData
      : ordersData.filter((order) => order.status === statusFilter);

  // Sample data for Bar Chart (Monthly Sales)
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Sales (₱)",
        data: [5000, 8000, 7500, 9000, 12000, 11000, 9500, 10000, 8500, 13000, 14000, 15000],
        backgroundColor: "#FF9800",
        borderRadius: 10,
        barThickness: 30, // Adjusted for better visibility
      },
    ],
  };

  // Chart.js Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Removes vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Light horizontal grid lines
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `₱${context.raw.toLocaleString()}`, // Format currency
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[url('/background.svg')] bg-cover bg-center text-white">
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Annual Sales</h2>
                <p className="text-5xl font-bold">₱500,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Monthly Sales</h2>
                <p className="text-5xl font-bold">₱40,000</p>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card>
            <CardContent>
              <h2 className="text-5xl font-semibold">Sales This Year</h2>
              <div className="h-72">
                <Bar data={salesData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold">Top-Selling Categories</h2>
              <ul className="mt-4 space-y-2">
                <li>Sleeveless - ₱15,000</li>
                <li>Short Sleeves - ₱12,500</li>
                <li>Uniforms - ₱10,000</li>
              </ul>
            </CardContent>
          </Card>

          {/* Recent Orders Table */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <select
                className="mt-4 p-2 border rounded w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Orders</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">Product</th>
                      <th className="p-3 border">Type</th>
                      <th className="p-3 border">Price</th>
                      <th className="p-3 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <tr key={order.id} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                          <td className="p-3 border">{order.product}</td>
                          <td className="p-3 border">{order.type}</td>
                          <td className="p-3 border">{order.price}</td>
                          <td className="p-3 border">
                            <span
                              className={`px-3 py-1 text-white text-sm rounded-full ${statusColors[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-4 border text-center" colSpan="4">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
