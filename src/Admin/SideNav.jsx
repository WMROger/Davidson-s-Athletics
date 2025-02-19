import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, Search, LayoutDashboard, ShoppingCart } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Database/firebase"; // Adjust paths accordingly

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle the loading state
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logging out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid); // Adjust path based on where you store roles
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userRole = docSnap.data().role; // Assuming role is stored in Firestore
          if (userRole === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            navigate("/home"); // Redirect non-admin users to home page
          }
        }
      } else {
        setIsAdmin(false); // If not logged in, set to false
        navigate("/login"); // Redirect to login page if not logged in
      }
      setIsLoading(false); // Set loading to false after the check
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // You can display a loading indicator while checking the authentication status
  }

  if (!isAdmin) {
    return null; // This is to prevent rendering the layout if the user is not an admin
  }

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
                <span
                  className={`ml-3 transition-all duration-300 ease-out ${
                    isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
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
                <span
                  className={`ml-3 transition-all duration-300 ease-out ${
                    isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Orders
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/design"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <img 
                 src="/IcSideNav/pendingDesign.svg"
                 className="size-5"/>
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                 Pending Design
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/assets"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <img 
                 src="/IcSideNav/pendingAssets.svg"
                 className="size-6"/>
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  Assets
                </span>
              </NavLink>
            </li>
            {/* New Shirt Uploads */}
            <li>
              <NavLink
                to="/admin/NewShirt"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <img 
                 src="/IcSideNav/pendingAssets.svg"
                 className="size-6"/>
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  New Shirt
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/notification"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800 mt-16"
                  }`
                }
              >
                <img 
                 src="/IcSideNav/Notification.svg"
                 className="size-6"/>
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  Notification
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <img 
                 src="/IcSideNav/settings.svg"
                 className="size-6"/>
                <span className={`ml-3 transition-all duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  Settings
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center p-3 rounded-lg mt-20 transition-all duration-300 ease-out hover:bg-gray-800`}
        >
          <span
            className={`ml-8 transition-all duration-300 ease-out ${
              isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 transition-all duration-300 ease-out">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
