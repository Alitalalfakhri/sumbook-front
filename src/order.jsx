import React, { useState, useEffect } from "react";
import cart from "./scripts/cart.js";
import { books } from "./data/books.js";
import "./styles/order.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
export default function Order(props) {

  
  const [deliveryOption, setDeliveryOption] = useState(7); // Default to 7 days
  const [displayDeliveryOption, setDisplayDeliveryOption] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // Validate form inputs
  useEffect(() => {
    const isValid = phoneNumber.trim() !== "" && city.trim() !== "" && street.trim() !== "";
    setIsFormValid(isValid);
  }, [phoneNumber, city, street]);

  // Handle delivery option change
  const handleDeliveryOption = (e) => {
    const value = e.target.value;
    setDeliveryOption(value);

    // Calculate delivery date
    const displayOption = dayjs()
      .add(Number(value), "days")
      .format("dddd MMM DD YYYY");
    setDisplayDeliveryOption(displayOption);

    // Set delivery fee
    let fee = 0;
    if (value === "1") fee = 10; // 1 day delivery
    else if (value === "3") fee = 5; // 3 day delivery
    setDeliveryFee(fee);
  };

  // Initialize default delivery option
  useEffect(() => {
    const displayOption = dayjs().add(7, "days").format("dddd MMM DD YYYY");
    setDisplayDeliveryOption(displayOption);
    setDeliveryFee(0); // Free delivery for 7 days
  }, []);

  // Calculate total bill
  const totalBeforeTax = cart.cartArray.reduce((total, item) => {
    const matchingItem = books.find((book) => book.id === item.bookId);
    if (matchingItem) {
      total += (matchingItem.priceCents / 100) * item.quantity;
    }
    return total;
  }, 0);

  const tax = totalBeforeTax * 0.1;
  const totalBill = totalBeforeTax + tax + deliveryFee;

  // Send order
  const sendOrder = () => {
    if (!isFormValid) {
      alert('please enter your phone number, street, and city')
    }else{

    props.saveOrder(cart.cartArray, totalBill, displayDeliveryOption, phoneNumber, city, street  );
    cart.cartArray = [];
    props.zeroCart();
    navigate("/orders");
    }
  };

  // Redirect if cart is empty
  if (cart.cartArray.length === 0) {
    return (
      <div>
        <h1>You cannot order an empty cart</h1>
        <button onClick={() => navigate("/")}>Home</button>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h2>Your Order</h2>

      <table className="order-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.cartArray.map((item, index) => {
            const matchingItem = books.find((book) => book.id === item.bookId);
            if (!matchingItem) return null;

            const itemTotal = (matchingItem.priceCents / 100) * item.quantity;

            return (
              <tr key={index}>
                <td>{matchingItem.name}</td>
                <td>{item.quantity}</td>
                <td>${(matchingItem.priceCents / 100).toFixed(2)}</td>
                <td>${itemTotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="delivery-options">
        <p style={{fontSize:'1.50rem'}}><b>chose a delivery option ⬇️</b></p>
        <select style={{padding:"10px" , backgroundColor:"#ece1df " , borderRadius:"15px"}} onChange={handleDeliveryOption} value={deliveryOption}>
          <option value={7}>7 days (Free)</option>
          <option value={3}>3 days ($5)</option>
          <option value={1}>1 day ($10)</option>
        </select>
      </div>

      <div className="address-form">
        <h3>Shipping Details</h3>
        <input
          type="number"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />
      </div>

      <div className="total-bill">
        <h3>Total Before Tax: ${totalBeforeTax.toFixed(2)}</h3>
        <h3>Tax (10%): ${tax.toFixed(2)}</h3>
        <h3>Delivery Fee: ${deliveryFee.toFixed(2)}</h3>
        <h3>Total Bill: ${totalBill.toFixed(2)}</h3>
        <h3>Delivery Date: {displayDeliveryOption}</h3>
        <button
          onClick={sendOrder}
          className="send-button"
         
        >
          Send Order
        </button>
      </div>

      <button className="back-home" onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
}