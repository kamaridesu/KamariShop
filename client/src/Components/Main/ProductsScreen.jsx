import React, { useEffect, useState } from "react";
import { AiOutlineFilter, AiOutlineHeart } from "react-icons/ai";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import useQuery from "../../Hooks/useQuery";
import { IconButton } from "../Navigation/IconButton";
import styles from "./ProductsScreen.Module.scss";

export const ProductsScreen = () => {
  const { gender } = useParams();
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState(100);
  const [color, setColor] = useState(null);
  const [order, setOrder] = useState(null);

  const { data, loading, status, setApiOptions } = useQuery({
    url: "/api/products/all",
    method: "GET",
  });

  useEffect(() => {
    if (loading === false) {
      setProducts(data.response);
    }
  }, [loading]);

  return (
    <div className={styles.productScreen}>
      <div className={styles.header}>
        <span>(40 articles)</span>
        <IconButton Icon={Icon} ModalContent={Filter} />
      </div>
      <div className={styles.cardsWrapper}>
        <Product products={products} gender={gender} />
      </div>
    </div>
  );
};

const Filter = () => {
  return <div>hello</div>;
};

const Product = ({ products, gender }) => {
  return products.map((product) => {
    return (
      <div className={styles.card}>
        <Link
          to={`/hats/${gender}/${product.id}`}
          className={styles.imageWrapper}
        >
          <img src={product.images[0]} alt="" className={styles.image} />
        </Link>
        <div className={styles.productInfo}>
          <p className={styles.name}>{product.name}</p>
          <div>
            <span className={styles.price}>{product.price}€</span>
            <AiOutlineHeart />
          </div>
        </div>
      </div>
    );
  });
};

const Icon = () => {
  return (
    <>
      <span>FILTER</span>
      <AiOutlineFilter />
    </>
  );
};

// const filter = (products) => {
//   const array = products.filter((product) => {
//     let keep = product.price < price;

//     if (color) {
//       keep = product.color === color;
//     }

//     return keep;
//   });

//   if (order) {
//     array.sort(function (a, b) {
//       return order === "asc" ? a.price - b.price : b.price - a.price;
//     });
//   }
// };
