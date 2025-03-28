import React, { useState, useRef, useEffect } from "react";
import { books } from "./data/books.js"; 
import "./styles/Home.css";
import cart from "./scripts/cart.js";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa';
import { getBooks } from './data/books.js';
import {useSelector , useDispatch} from 'react-redux';
import {loadBooks} from './features/generals/booksSlice.js'

const BookStore = (props) => {
  const navigate = useNavigate();
  const categories = ["Marketing", "Business", "Self-Development", "Stories"];

  const dispatch = useDispatch();

  const booksState = useSelector((state) => state.books);

  // State to manage books and loading status
  const [booksArray, setBooksArray] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    getBooks()
      .then(data => {
        setBooksArray(data);  
        localStorage.setItem('booksStorage', JSON.stringify(data));
        setLoading(false);     // Set loading to false after data is fetched
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        setLoading(false);     // Set loading to false if there is an error
      });
  }, []);

  // Ref for dialog
  const dialogRef = useRef(null);

  // State for storing the book name and id that was added
  const [bookName, setBookName] = useState("");
  const [bookId, setBookId] = useState(null);

  // Separate function to show the dialog with the book name
  const showDialog = (bookName, bookId) => {
    setBookName(bookName);
    setBookId(bookId);
    dialogRef.current.showModal(); // Show the dialog
  };

  const BookCard = ({ book }) => {
    const { image, name, rating, priceCents, id } = book;
    const price = (priceCents / 100).toFixed(2); // Convert cents to dollars

    // Function to handle navigation to the book details page
    function travel(id) {
      navigate("/detail");
      props.getId(id);
    }

    // Function to add the book to the cart (reverted to previous state)
    function handleAddToCart(id) {
      cart.addToCart(id); // Add the book to the cart
      props.updateCart(); // Update the cart icon/length or related UI if needed
      dialogRef.current.close(); // Close the dialog after adding to cart
    }

    return (
      <div className="book-card">
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>Price: ${price}</p>
        <p>
          Rating: {rating.stars}/10 ({rating.count} reviews)
        </p>
        <div className="card-buttons">
          <button
            onClick={() => {
              showDialog(name, id); 
            }}
            className="buy-button"
          >
            buy
          </button>
          <button
            className="read-more-button"
            onClick={() => {
              travel(id);
            }}
          >
            read more
          </button>
        </div>
      </div>
    );
  };

  const Row = ({ title, books }) => {
   
    return (
      <div className="book-row">
        <h2>{title}</h2>
        <div className="book-list">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    );
  };

  function handleAddToCart(id) {
    cart.addToCart(id); // Add the book to the cart
    props.updateCart(); // Update the cart icon/length or related UI if needed
    dialogRef.current.close(); // Close the dialog after adding to cart
  }
  return (
    <div>
      {/* Display loading message or spinner */}
      {loading ? (
        <div className="loading">Loading...</div> // Display loading message or spinner
      ) : (
        // If not loading, display the categories and books
        categories.map((category) => {
          const booksInCategory = booksArray.filter(
            (book) => book.category === category
          );
          return <Row key={category} title={category} books={booksInCategory} />;
        })
      )}

      {/* Dialog to show the "added" message */}
      <dialog ref={dialogRef} className="confirmation-dialog">
        <div className="dialog-content">
          <p>Do you want to buy {bookName}?</p>
          <div className="dialog-buttons">
            <button onClick={() => {
                handleAddToCart(bookId); 
              }} className="buy-button">
              Buy
            </button>
            <button onClick={() => {
              dialogRef.current.close(); 
            }} className="read-more-button">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BookStore;