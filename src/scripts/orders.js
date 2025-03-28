import axios from 'axios';
import {backendUrl} from '../constant.js';


function generateRandomId(length) {
  const charcters = "0123456789";

  let final = "";
  for (let i = 0; i < length; i++) {
    final += charcters[Math.floor(Math.random() * charcters.length)];
  }
  return final
}

const orders = {
  ordersArray: [],

  // Initialize ordersArray from localStorage if it exists
  loadOrders() {
    const savedOrders = localStorage.getItem("ordersArray");
    if (savedOrders) {
      this.ordersArray = JSON.parse(savedOrders); // Parse the saved data from localStorage
    }
  },

  // Add new order to the ordersArray
  async addOrder(array, price, date , phone , street,city , uid , type) {
    const newOrder = {
      itemsArray: array,
      price: price,
      date: date,
      phone: phone,
      street: street,
      city: city,
      uid: uid,
      type:type,
      id:  generateRandomId(10),
    };

    this.ordersArray.push(newOrder);

    // Save the updated ordersArray to localStorage
    localStorage.setItem("ordersArray", JSON.stringify(this.ordersArray));
    console.log("Updated orders:", newOrder);

    const response = await axios.post(`${backendUrl}/addOrder` , newOrder)

    console.log(response.data)

    
  },

  
 
};

// Initialize orders when the application starts
orders.loadOrders();

export default orders;
