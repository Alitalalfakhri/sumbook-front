import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Hero.jsx";
import Row from "./Row.jsx";
import DetailBook from "./detail-book.jsx";
import Checkout from "./checkout.jsx";
import Order from "./order.jsx";
import Header from "./Header.jsx";
import cart from "./scripts/cart.js";
import orders from "./scripts/orders.js";
import OrdersPage from "./OrdersPage.jsx";
import SignUpPage from "./Sign-up.jsx";
import User from "./features/user/User.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/user/userSlice";
import Login from "./Login.jsx";
import Search from "./Search.jsx";
import {backendUrl} from "./constant.js";
export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const booksState = useSelector((state) => state.books);

  const [bookId, setBookId] = useState();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [searchValue , setSearchValue] = useState("");

  // Function to update cart quantity
  function updateCart() {
  
    const totalQuantity = cart.cartArray.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    // Set the total quantity in the state
    setCartQuantity(totalQuantity);
  }

  useEffect(() => {
    const checkAuth = async () =>{

      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user)
      const res = await axios.post(
        `${backendUrl}/auth/status`,
        {
          uid: user.uid,
          type: user.type
        },
        {
          withCredentials: true
        }
      );

      console.log(res)
      if(res.data.loggedIn){
        dispatch(login({uid:res.data.userId , type:res.data.type}))

       
      }
    }
    checkAuth()
  }, [backendUrl, dispatch]); // Add dependencies
  // Optionally use useEffect to update cart quantity when cart changes
  useEffect(() => {
    updateCart();
  }, [cart.cartArray]); // This effect will run whenever cart.cartArray changes

  function zeroCart() {
    setCartQuantity(0);
  }

  const Headercomponent = <Header searchValue={searchValue} setSearchValue={setSearchValue} cartLength={cartQuantity} />;

  return (
    <>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {Headercomponent}
                <Hero />

                <Row updateCart={updateCart} getId={(id) => setBookId(id)} />
              </>
            }
          />
          <Route
            path="/detail"
            element={
              <>
                {Headercomponent}
                <DetailBook updateCart={updateCart} bookId={bookId} />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                {Headercomponent}
                <Checkout />
              </>
            }
          />
          <Route
            path="/order"
            element={
              <>
                {Headercomponent}
                <Order
                  saveOrder={(array, price, date, phone, street, city) => {
                    orders.addOrder(
                      array,
                      price,
                      date,
                      phone,
                      street,
                      city,
                      user.uid,
                      user.type,
                    );
                  }}
                  zeroCart={zeroCart}
                />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <>
                {Headercomponent}
                <OrdersPage />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                {Headercomponent}
                <SignUpPage />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {Headercomponent}
                <Login />
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                {Headercomponent}
                <Search  getId={(id) => setBookId(id)}  updateCart={updateCart} searchValue={searchValue} />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
