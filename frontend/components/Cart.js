import { useStateContext } from "../lib/context";
import {
  CartWrapper,
  CartStyle,
  Card,
  CardInfo,
  EmptyStyle,
  Quantity,
  Checkout,
  Cards,
} from "../styles/CartStyles";
import { FaShoppingCart } from "react-icons/fa";
import {
  AiFillMinusCircle,
  AiFillPlusCircle,
  AiFillDelete,
} from "react-icons/ai";
import getStripe from "../lib/getStripe";
const { motion } = require("framer-motion");

// Animation variants
const card = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const cards = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.12,
    },
  },
};

export default function Cart() {
  const { cartItems, setShowCart, onAdd, onSubtract, onRemove, totalPrice } =
    useStateContext();
  //Payment
  const handleCheckout = async () => {
    const stripe = await getStripe();
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    });
    const data = await response.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };
  return (
    <CartWrapper
      onClick={() => setShowCart(false)}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      <CartStyle
        exit={{ x: "50%" }}
        initial={{ x: "50%" }}
        animate={{ x: "0%" }}
        transition={{ type: "tween" }}
        onClick={(e) => e.stopPropagation()}
      >
        {cartItems.length < 1 && (
          <EmptyStyle
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "tween" }}
          >
            <h1>You have more shopping to do 😉</h1>
            <FaShoppingCart />
          </EmptyStyle>
        )}
        <Cards layout variants={cards} initial="hidden" animate="show">
          {cartItems.length >= 1 &&
            cartItems.map((item) => {
              console.log(item);
              return (
                <Card layout key={item.slug} variants={card}>
                  <img
                    src={item.image.data.attributes.formats.thumbnail.url}
                    alt={item.title}
                  />
                  <CardInfo>
                    <h3>{item.title}</h3>
                    <h3>${item.price}</h3>
                    <Quantity>
                      <div>
                        <span>Quantity</span>

                        <button onClick={() => onSubtract(item)}>
                          <AiFillMinusCircle />
                        </button>
                        <p>{item.quantity}</p>
                        <button onClick={() => onAdd(item, 1)}>
                          <AiFillPlusCircle />
                        </button>
                      </div>
                      <button onClick={() => onRemove(item)}>
                        <AiFillDelete />
                      </button>
                    </Quantity>
                  </CardInfo>
                </Card>
              );
            })}
        </Cards>
        {cartItems.length >= 1 && (
          <Checkout layout>
            <h3>Subtotal: ${totalPrice}</h3>
            <button onClick={handleCheckout}>Purchase</button>
          </Checkout>
        )}
      </CartStyle>
    </CartWrapper>
  );
}
