import React, { createContext, useContext, useState } from "react";

const ShopContext = createContext();

// Add our data for the state
export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Increase product quantity
  const increaseQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  const onAdd = (product, quantity) => {
    setTotalQuantities((prevState) => prevState + quantity);
    setTotalPrice((prevState) => prevState + product.price * quantity);
    // Check if it's already in cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
    }
  };

  const onSubtract = (product) => {
    setTotalQuantities((prevState) => prevState - 1);
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist.quantity > 1) {
      setTotalPrice((prevState) => prevState - product.price);
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity - 1 }
            : item
        )
      );
    }
  };

  const onRemove = (product) => {
    const exist = cartItems.find((item) => item.slug === product.slug);
    setTotalQuantities((prevState) => prevState - exist.quantity);
    setTotalPrice((prevState) => prevState - exist.price * exist.quantity);
    setCartItems(cartItems.filter((item) => item.slug !== product.slug));
  };

  return (
    <ShopContext.Provider
      value={{
        qty,
        setQty,
        increaseQty,
        decreaseQty,
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        onAdd,
        onSubtract,
        onRemove,
        totalQuantities,
        totalPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useStateContext = () => useContext(ShopContext);
