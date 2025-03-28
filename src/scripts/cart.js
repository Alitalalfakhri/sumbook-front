const cart = {
  matchingItem: null,
  cartArray: [],

  addToCart(id) {
    // Find if the item already exists in the cart
    this.matchingItem = this.cartArray.find(item => item.bookId === id);

    if (this.matchingItem) {
      // If item exists, increase its quantity
      this.matchingItem.quantity += 1;
    } else {
      // If item doesn't exist, add a new item to the cart
      this.cartArray.push({
        bookId: id,
        quantity: 1,
      });
    }

  
  },

  removeFromCart(id) {

    const updatedCart = this.cartArray = this.cartArray.filter(item => item.bookId !== id);

  
    return updatedCart
    
  }
};

export default cart;