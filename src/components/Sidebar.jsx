import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';
import logo from '../assets/kailash_logo.png'
import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
    <div className=" text-white vh-100" style={{ width: '200px', position: 'fixed', top: 0, left: 0,backgroundColor:'#5B5AB3' }}>
      <div className="d-flex flex-column align-items-start p-3">
        <a href="/" className="text-white text-decoration-none mb-3">
          <img
            src={logo}
            width="120"
            height="50"
            className="d-inline-block align-top"
            alt=""
          />
        </a>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to={'/dashboard'} className="nav-link text-white custom-link" ><i class="bi bi-award-fill"></i> Dashboard</Link>
          </li>
          <li>
            <Link to={'/profile'} className="nav-link text-white custom-link" ><i class="bi bi-building-fill-check"></i> Profile</Link>
          </li>
          <li>
            <Link to={'/customer'} className="nav-link text-white custom-link" ><i class="bi bi-fire"></i> Customers</Link>
          </li>
          <li>
            <Link to={'/product'} className="nav-link text-white custom-link" ><i class="bi bi-boombox-fill"></i> Products</Link>
          </li>
          <li>
            <Link to={'/billing'} className="nav-link text-white custom-link" ><i class="bi bi-pc-display-horizontal"></i> Billing</Link>
          </li>
          <li>
            <Link to={'/invoice'} className="nav-link text-white custom-link" ><i class="bi bi-printer-fill"></i> Invoice</Link>
          </li>
          <li>
            <Link to={'/billdet'} className="nav-link text-white custom-link" ><i class="bi bi-printer-fill"></i> Billing Details</Link>
          </li>
        </ul>
        <hr />
      </div>
    </div>
  );
};

export default Sidebar;
