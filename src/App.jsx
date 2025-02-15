// src/App.jsx
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Shop from "./Pages/Shop";
import Orders from "./Pages/Orders";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Services from "./Pages/Services";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SideNav from "./Admin/SideNav";
import Dashboard from "./Admin/Dashboard";
import ManageOrders from "./Admin/ManageOrders";
import CustomizeShirt from "./Pages/ShopPages/CustomizeShirt";  // Import the CustomizeShirt component

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
          path="/orders"
          element={
            <>
              <Navbar />
              <Orders />
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
        </Route>

        {/* Add the Customize Shirt Route */}
        <Route
          path="/customizeshirt"
          element={
            <>
              <Navbar />
              <CustomizeShirt />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
