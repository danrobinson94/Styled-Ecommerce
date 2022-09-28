import { useQuery } from "urql";
import { useEffect } from "react";
import { GET_PRODUCT_QUERY } from "../../lib/query";
import { useRouter } from "next/router";
import {
  DetailsStyle,
  ProductInfo,
  Quantity,
  Buy,
} from "../../styles/ProductDetails";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useStateContext } from "../../lib/context";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { qty, increaseQty, decreaseQty, onAdd, setQty } = useStateContext();

  // Reset qty
  useEffect(() => {
    setQty(1);
  }, []);

  // fetch slug
  const { query } = useRouter();

  // fetch GraphQL data
  const [results] = useQuery({
    query: GET_PRODUCT_QUERY,
    variables: { slug: query.slug },
  });
  const { data, fetching, error } = results;

  // Check for the data coming in
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  // extract our data
  const { title, description, image } = data.products.data[0].attributes;

  const notify = () => {
    toast.success(`${title} added to your cart`, {
      duration: 1500,
      icon: "👏",
    });
  };

  return (
    <DetailsStyle>
      <img src={image.data.attributes.formats.medium.url} alt={title} />
      <ProductInfo>
        <h3>{title}</h3>
        <p>{description}</p>

        <Quantity>
          <span
          // animate={{ y: 200, transition: { duration: 2, delay: 1 } }}
          // initial={{ x: 200 }}
          >
            Quantity
          </span>
          <button>
            <AiFillMinusCircle onClick={decreaseQty} />
          </button>
          <p>{qty}</p>
          <button>
            <AiFillPlusCircle onClick={increaseQty} />
          </button>
        </Quantity>
        <Buy
          onClick={() => {
            notify();
            onAdd(data.products.data[0].attributes, qty);
          }}
        >
          Add To Cart
        </Buy>
      </ProductInfo>
    </DetailsStyle>
  );
}
