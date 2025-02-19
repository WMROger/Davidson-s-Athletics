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
import NewShirt from "./Admin/NewShirt"; // Import NewShirt component
import CustomizeShirt from "./Pages/ShopPages/CustomizeShirt";
import RequestForm from "./Pages/ShopPages/RequestForm"; // Import RequestForm component

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
          <Route path="NewShirt" element={<NewShirt />} />
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

        {/* Add the Request Form Route */}
        <Route
          path="/requestform"
          element={
            <>
              <Navbar />
              <RequestForm />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
