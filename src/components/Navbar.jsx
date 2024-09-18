import React from 'react';
import './Sidebar.css';
const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="ml-auto " style={{ position: 'relative' }}>
      <nav className="navbar p-1" style={{backgroundColor:'#7F7ED4'}}>
        <a className="navbar-brand marquee" href="#">
        KAILASH TILES
        </a>
        <button type="button" className="btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
