import React, { useState, useEffect } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Database/firebase";
import Card from "../DashboardCards/Card";
import CardContent from "../DashboardCards/CardContent";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const statusColors = {
  Pending: "bg-yellow-500",
  Processing: "bg-blue-500",
  Shipped: "bg-purple-500",
  Completed: "bg-green-500",
  Cancelled: "bg-red-500",
};

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Orders");

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrdersData(orders);
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "All Orders"
      ? ordersData
      : ordersData.filter((order) => order.status === statusFilter);

  // Filter paid orders
  const paidOrders = ordersData.filter(order => order.receiptFile);

  // Calculate monthly sales
  const monthlySales = Array(12).fill(0);
  paidOrders.forEach(order => {
    const month = new Date(order.createdAt.toDate()).getMonth();
    monthlySales[month] += order.total;
  });

  // Calculate annual sales
  const annualSales = monthlySales.reduce((acc, curr) => acc + curr, 0);

  // Data for Bar Chart (Monthly Sales)
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Sales (₱)",
        data: monthlySales,
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
    <div className="py-6 px-3 space-y-6">
      <h2 className="text-6xl font-bold">Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[url('/background.svg ')] bg-cover bg-center text-white ">
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Annual Sales</h2>
                <p className="text-5xl font-bold">₱{annualSales.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Monthly Sales</h2>
                <p className="text-5xl font-bold">₱{monthlySales[new Date().getMonth()].toLocaleString()}</p>
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
        <div className="space-y-6  w-full">
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
                className="mt-4 p-2 border rounded w-40"
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

              <div className="mt-4 overflow-x-auto ">
                <table className="w-full border-collapse  text-left">
                  <thead>
                    <tr>
                      <th className="p-3 border-t border-b">Product</th>
                      <th className="p-3 border-t border-b">Type</th>
                      <th className="p-3 border-t border-b">Price</th>
                      <th className="p-3 border-t border-b">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <tr key={order.id} className={`${index % 2 === 0 ? "bg-white" : ""}`}>
                          {/* Product Column - Image, Name & Quantity */}
                          <td className="p-3">
                            {order.selectedItems.map((item, i) => (
                              <div key={i} className="flex items-center space-x-4 mb-2">
                                <img src={item.imageUrl} alt={item.productName} className="w-14 h-14 object-fill rounded-md" />
                                <div>
                                  <p className="font-semibold">{item.productName}</p>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </td>

                          <td className="p-3">{order.shippingMethod}</td>
                          <td className="p-3">₱{order.total}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 text-white text-sm rounded-full ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-4 text-center" colSpan="4">
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