import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Shop from "./Pages/Shop";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Services from "./Pages/Services";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SideNav from "./Admin/SideNav";
import Dashboard from "./Admin/Dashboard";
import ManageOrders from "./Admin/ManageOrders";
import Design from "./Admin/AdminDesign";
import Assets from "./Admin/Assets";
import CustomizeShirt from "./Pages/ShopPages/CustomizeShirt";
import RequestForm from "./Pages/ShopPages/RequestForm";
import OrderConfirmation from "./Pages/ShopPages/OrderConfirmation";
import CustomProduct from "./Pages/ShopPages/CustomProduct";
import ProfilePage from "./Pages/Profile/ProfilePage";
import ProfileSidebar from "./Pages/Profile/ProfileSidebar";
import Purchase from "./Pages/Profile/Purchase";
import Checkout from "./Pages/ShopPages/Checkout"; // Import the Checkout component

function App() {
  return (
    <div className="overflow-x-hidden">
      <Routes>
        {/* Public Routes (With Navbar) */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <Shop />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
            </>
          }
        />
        <Route
          path="/ShopPages/CustomProduct"
          element={
            <>
              <Navbar />
              <CustomProduct />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        {/* Admin Routes (With SideNav, No Navbar) */}
        <Route path="/admin" element={<SideNav />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="design" element={<Design />} />
          <Route path="assets" element={<Assets />} />
        </Route>

        {/* Shop Pages */}
        <Route
          path="/ShopPages/CustomizeShirt"
          element={
            <>
              <Navbar />
              <CustomizeShirt />
            </>
          }
        />
        <Route
          path="/ShopPages/OrderConfirmation"
          element={
            <>
              <Navbar />
              <OrderConfirmation />
            </>
          }
        />
        <Route
          path="/ShopPages/RequestForm"
          element={
            <>
              <Navbar />
              <RequestForm />
            </>
          }
        />
        <Route
          path="/ShopPages/Checkout"
          element={
            <>
              <Navbar />
              <Checkout />
            </>
          }
        />

        {/* Profile Routes with Sidebar */}
        <Route
          path="/profile/ProfilePage"
          element={
            <>
              <Navbar />
              <ProfilePage />
            </>
          }
        />
        <Route
          path="/profile/Purchase"
          element={
            <>
              <Navbar />
              <Purchase />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;