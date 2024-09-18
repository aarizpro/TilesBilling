import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashBoard from "./pages/Dashboard";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Customer from "./pages/Customer";
import Product from "./pages/Product";
import Billing from "./pages/Billing";
import Invoice from "./pages/Invoice";
import BillDetails from "./pages/BillDetails";


function App() {
  const user = localStorage.getItem("token");

  return (
    <div>
      <Sidebar/>
        <div style={{ marginLeft: '200px' }}>
       <Navbar/>
        <div className="container-fluid py-3">
        <Routes>

        {user ? (
				<>
					<Route path="/" exact element={<DashBoard />} />
					<Route path="/dashboard" exact element={<DashBoard />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/customer" exact element={<Customer />} />
          <Route path="/product" exact element={<Product />} />
          <Route path="/billing" exact element={<Billing />} />
          <Route path="/invoice" exact element={<Invoice />} />
          <Route path="/billdet" exact element={<BillDetails />} />
          </>
			) : (
				<>
					<Route path="/signup" exact element={<Signup />} />
					<Route path="/login" exact element={<Login />} />
					<Route path="/" element={<Navigate replace to="/login" />} />
					<Route path="/dashboard" element={<Navigate replace to="/login" />} />
          <Route path="/profile" element={<Navigate replace to="/login" />} />
          <Route path="/customer" element={<Navigate replace to="/login" />} />
          <Route path="/product" element={<Navigate replace to="/login" />} />
          <Route path="/billing" element={<Navigate replace to="/login" />} />
          <Route path="/invoice" element={<Navigate replace to="/login" />} />
          <Route path="/billdet" element={<Navigate replace to="/login" />} />
         </>
      )} 
        </Routes>
        </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default App
