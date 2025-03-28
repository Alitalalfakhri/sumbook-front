import React, { useState, useEffect } from "react";
import './styles/Home.css';
import {FaShoppingCart} from 'react-icons/fa'
import cart from "./scripts/cart.js";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  

  function browseBooks() {
    console.log(cart.cartArray);
    console.log("browsing");
    document.querySelector("h3").scrollIntoView({
      behavior: "smooth"
    });
  }
   function travel(){
     navigate("/checkout ")
   }
  return (
    <>
      
      <section className="hero-container">
        {/* Book Image */}
        <div className="book-container">
          <img 
            src="https://th.bing.com/th/id/OIP.zmimrFHYhcTGzEyOu50GuwAAAA?w=115&h=180&c=7&r=0&o=5&pid=1.7" 
            alt="The One Page Marketing Plan" 
            className="book-image" 
          />
        </div>

        {/* Hero Text */}
        <h1 className="hero-text"><i>Welcome to sum book</i></h1>
        <p className="hero-subtext">Discover your next great read</p>

        {/* Buttons */}
        <div className="buttons-container">
          <button className="button" onClick={browseBooks}>Browse Books</button>
         
        </div>
      </section>
    </>
  );
};

export default Hero;