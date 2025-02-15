import React from "react";
// import { Bar } from "recharts";
import Card from "../DashboardCards/Card";
import CardContent from "../DashboardCards/CardContent";


const Dashboard = () => {
  return (
    <>
      <div className="p-10">
          <h2 className="text-3xl"> Overview </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                  {/* First Row: Sales Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                          <CardContent>
                              <h2 className="text-xl font-semibold">Annual Sales</h2>
                              <p className="text-2xl font-bold">$500,000</p>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardContent>
                              <h2 className="text-xl font-semibold">Monthly Sales</h2>
                              <p className="text-2xl font-bold">$40,000</p>
                          </CardContent>
                      </Card>
                  </div>
                  {/* Second Row: Sales Chart */}
                  <Card>
                      <CardContent>
                          <h2 className="text-xl font-semibold">Sales This Year</h2>
                          {/* Sales Chart Placeholder */}
                          <div className="h-64 bg-gray-200 flex items-center justify-center">
                              <p>Bar Chart Placeholder</p>
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                  {/* First Row: Top Customers */}
                  <Card>
                      <CardContent>
                          <h2 className="text-xl font-semibold">Top Customers</h2>
                          <ul className="mt-4 space-y-2">
                              <li>John Doe - $15,000</li>
                              <li>Jane Smith - $12,500</li>
                              <li>Michael Brown - $10,000</li>
                          </ul>
                      </CardContent>
                  </Card>
                  {/* Second Row: Recent Orders */}
                  <Card>
                      <CardContent>
                          <h2 className="text-xl font-semibold">Recent Orders</h2>
                          <ul className="mt-4 space-y-2">
                              <li>John Doe - Feb 10, 2025 - $500</li>
                              <li>Jane Smith - Feb 9, 2025 - $320</li>
                              <li>Michael Brown - Feb 8, 2025 - $250</li>
                          </ul>
                      </CardContent>
                  </Card>
              </div>
          </div></>
  );
};

export default Dashboard;