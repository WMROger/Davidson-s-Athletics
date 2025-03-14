import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search, LayoutDashboard, ShoppingCart, Bell, Settings, LogOut } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Database/firebase"; // Adjust paths accordingly

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Navigation links configuration
  const navLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={24} className="flex-shrink-0" />
    },
    {
      to: "/admin/manage-orders",
      label: "Orders",
      icon: <ShoppingCart size={24} className="flex-shrink-0" />
    },
    {
      to: "/admin/design",
      label: "Pending Design",
      icon: <img src="/IcSideNav/pendingDesign.svg" className="size-6" alt="Pending Design" />
    },
    {
      to: "/admin/assets",
      label: "Assets",
      icon: <img src="/IcSideNav/pendingAssets.svg" className="size-6" alt="Assets" />
    }
    
  ];

  // Bottom navigation links
  const bottomNavLinks = [
    {
      to: "/admin/notification",
      label: "Notification",
      icon: <Bell size={24} className="flex-shrink-0" />
    },
    {
      to: "/admin/settings",
      label: "Settings",
      icon: <Settings size={24} className="flex-shrink-0" />
    }
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.role === "admin") {
            setIsAdmin(true);
            setUserName(userData.name || user.displayName || user.email);
          } else {
            setIsAdmin(false);
            navigate("/home"); // Redirect non-admin users
          }
        }
      } else {
        setIsAdmin(false);
        navigate("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Auto-collapse sidebar on mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize based on current width
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white min-h-screen transition-all duration-300 ease-out flex flex-col z-20 fixed md:relative ${
          isOpen ? "w-64" : "w-20"
        } shadow-lg`}
      >
        {/* Logo and Toggle Area */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {isOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={toggleSidebar}
            className="text-white flex items-center justify-center w-10 h-10 rounded hover:bg-gray-800 transition-all ease-out ml-auto"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className={`flex items-center bg-gray-800 rounded-full ${isOpen ? "p-3" : "p-3 justify-center"}`}>
            <Search size={24} className="text-gray-400 flex-shrink-0" />
            {isOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-white focus:outline-none w-full ml-3 text-sm"
              />
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <div className="px-4">
            {isOpen && <h2 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2">Main</h2>}
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-full transition-all ${
                        isActive 
                          ? "bg-gray-700 text-white" 
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    <div className="flex items-center justify-center w-8">{link.icon}</div>
                    {isOpen && <span className="ml-3 transition-all">{link.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Navigation */}
          <div className="px-4 mt-auto">
            {isOpen && <h2 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2 mt-4">Settings</h2>}
            <ul className="space-y-2">
              {bottomNavLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-full transition-all ${
                        isActive 
                          ? "bg-gray-700 text-white" 
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    <div className="flex items-center justify-center w-8">{link.icon}</div>
                    {isOpen && <span className="ml-3 transition-all">{link.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Profile and Logout Section */}
        <div className="border-t border-gray-800 mt-2">
          {isOpen ? (
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Arl Necesario</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut size={24} className="flex-shrink-0" />
              </button>
            </div>
          ) : (
            <div className="p-4 flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut size={24} className="flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-out overflow-auto p-4`}>
        <div className="max-w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;