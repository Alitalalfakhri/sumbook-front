import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { backendUrl } from './constant.js';
import './styles/Search.css';
import cart from './scripts/cart.js';
import { useNavigate } from 'react-router-dom';




export default function Search({ searchValue, updateCart , getId }) {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Track the selected book for the dialog
  const dialogRef = useRef(null); // Ref for the dialog

  // Fetch search results whenever searchValue changes
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${backendUrl}/search?name=${searchValue}`);
        setResults(response.data || []); // Ensure results is always an array
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]); // Clear results in case of an error
      }
    }

    fetchData();
  }, [searchValue]); // Add searchValue as a dependency

  // Function to handle "Read More" button click
  function readMore(id) {
    window.location.href = `/book/${id}`;
  }

  // Function to handle "Buy" button click
  function handleAddToCart(id, name) {
    setSelectedBook({ id, name }); // Set the selected book for the dialog
    dialogRef.current.showModal(); // Show the dialog
  }

  // Function to confirm the purchase
  function confirmPurchase() {
    if (selectedBook) {
      cart.addToCart(selectedBook.id); // Add the book to the cart
      updateCart(); // Update the cart UI
      dialogRef.current.close(); // Close the dialog
    }
  }

  // Function to cancel the purchase
  function cancelPurchase() {
    dialogRef.current.close(); // Close the dialog
  }

  function travel(id) {
    navigate("/detail");
    getId(id);
  }
  
  return (
    <div>
      <h1>Search result for: {searchValue}</h1>
      {(!results || results.length === 0) ? (
        <p>No results found.</p>
      ) : (
    <div>
      <button className='buy-button' onClick={() => {
        navigate('/')
      }}>home</button>
      
        <div className="books-container">
          
          {results.map((book) => (
            <div className="book-card-result" key={book?.id}>
              <div className="bookImage">
                <img src={book?.image} alt={`${book?.name} image`} />
              </div>
              <div className="bookName">
                <p>{book?.name}</p>
              </div>
              <div>
                <p>Price: ${(book?.priceCents / 100).toFixed(2)}</p>
              </div>
              <div className="book-card-buttons">
                <button
                  className="buy-button"
                  onClick={() => handleAddToCart(book?.id, book?.name)} // Pass book id and name
                >
                  Buy
                </button>
                <button
                  className="read-more-button"
                  onClick={() =>{travel(book.id)}} // Pass book id
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
      )}

      {/* Confirmation Dialog */}
      <dialog ref={dialogRef} className="confirmation-dialog">
        <div className="dialog-content">
          <p>Do you want to buy "{selectedBook?.name}"?</p>
          <div className="dialog-buttons">
            <button onClick={confirmPurchase} className="buy-button">
              Buy
            </button>
            <button onClick={cancelPurchase} className="read-more-button">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}