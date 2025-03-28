import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { backendUrl } from "./constant.js";

export default function OrdersPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // State to store fetched orders
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [books , setBooks] = useState([]);

  useEffect(() => {
    if (!user.loggedIn) {
      // If the user is not logged in, show a message and return early
      return;
    }

    

    // Fetch orders from the backend
    const fetchData = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/orders`, {
          uid: user.uid,
        });

        // Update the orderList state with the fetched data
        setOrderList(response.data.orders);
        setBooks(response.data.books)
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [user.loggedIn, user.uid]); // Re-run effect if user.loggedIn or user.uid changes

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#ff7f11",
    border: "none",
    borderRadius: "5px",
    boxShadow: "0 6px 12px rgba(255, 127, 17, 0.4)",
    cursor: "pointer",
    transition: "transform 0.3s",
    outline: "none",
  };

  // If the user is not logged in, show a message
  if (!user.loggedIn) {
    return (
      <div style={{ marginTop: "60px" }}>
        <p style={{ fontSize: "1.4rem",margin:"60px", color: "green" }}>
          Please sign up or log in to view orders.
        </p>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    );
  }

  // If loading, show a loading message
  if (loading) {
    return <div style={{ marginTop: "60px" }}>Loading orders...</div>;
  }

  
  return (
    <div className="no-orders">
      {orderList.length === 0 ? (
        <h1 style={{ marginTop: "100px" }}>No orders yet!</h1>
      ) : (
        orderList.map((order) => (
          <div key={order.id} className="order-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.itemsArray.map((item) => (
                  <tr key={item.bookId}>
                    <td>{books.map(book => {
                      if(book.id === item.bookId){
                        return book.name
                      }
                    })}</td>
                    <td>{item.quantity}</td>
                    <td>${books.map(book => {
                     if(book.id === item.bookId){
                       return ((book.priceCents) / 100).toFixed(2)
                     }
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total Price (after taxes and delivery fees): ${order.price.toFixed(2)}</h3>
            <h3>Delivery Date: {order.date}</h3>
            <h3>Order ID: {order.id}</h3>
            <hr />
          </div>
        ))
      )}
      <button style={buttonStyle} onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
}