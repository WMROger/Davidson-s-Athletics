import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, Search, LayoutDashboard, ShoppingCart } from "lucide-react";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white min-h-screen transition-all duration-300 ease-out flex flex-col ${
          isOpen ? "w-64 p-5" : "w-22 p-5 "
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-white mb-4 flex items-center justify-center w-10 h-10 rounded hover:bg-gray-800 transition-all ease-out"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Search Bar */}
        <div
          className={`flex items-center bg-gray-800 rounded-full transition-all duration-300 ease-out ${
            isOpen ? "p-2" : "justify-center w-10 h-10"
          }`}
        >
          <button onClick={toggleSidebar} className="text-gray-400 flex-shrink-0">
            <Search size={20} className="cursor-pointer" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className={`bg-transparent text-white focus:outline-none transition-all duration-300 ease-out ml-2 ${
              isOpen ? "opacity-100 w-full" : "opacity-0 w-0 overflow-hidden"
            }`}
          />
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-5">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <LayoutDashboard size={20} className="flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  Dashboard
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/manage-orders"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <ShoppingCart size={20} className="flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  Orders
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 transition-all duration-300 ease-out">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
