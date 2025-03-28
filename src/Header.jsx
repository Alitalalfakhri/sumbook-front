import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css'; // Ensure you have this CSS file for styling

export default function Header(props) {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  // Function to navigate to a specific path
  function travel(path) {
    navigate(`/${path}`);
  }

  // Handle window resize to update screen size state
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Close sidebar
  const closeSideBar = () => {
    setSidebarVisible(false);
  };

  const { cartLength } = props;


  function handelSearchValue(e){
    const value = e.target.value;
    props.setSearchValue(value)
  }

  function handelSearch(e){
    if(e.key === 'Enter'){
    travel('search')
    }
  }

  return (
    <>
      <header className="header">
        {/* Logo */}
        <h1 onClick={() => navigate('/')} className="header-title">
          SUM BOOK
        </h1>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." onChange={handelSearchValue} onKeyDown={handelSearch} />
        </div>

        {/* Navigation Buttons (for large screens) */}
        {isLargeScreen && (
          <nav className="header-nav">
            <button onClick={() => travel('orders')}>My Orders</button>
           
          </nav>
        )}

        {/* Menu Icon (for small screens) */}
        {!isLargeScreen && (
          <div className="menu-icon" onClick={toggleSidebar}>
            ☰
          </div>
        )}

        {/* Cart and Orders Section */}
        <div className="cart-container">
          <div className="right-part">
            {/* Shopping Cart Icon */}
            <FaShoppingCart
              onClick={() => travel('checkout')}
              className="cart-icon"
            />
            <span
              onClick={() => travel('checkout')}
              className="cart-count"
            >
              {cartLength}
            </span>
          </div>
        </div>

        {/* Sidebar (for small screens) */}
        {!isLargeScreen && (
          <>
            {/* Overlay */}
            <div
              className={`overlay ${isSidebarVisible ? 'visible' : ''}`}
              onClick={closeSideBar}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
              <button onClick={() => travel('orders')}>My Orders</button>
             
            </div>
          </>
        )}
      </header>
    </>
  );
}