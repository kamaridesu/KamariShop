import React, { useEffect, useState } from "react";
import { AiOutlineFilter, AiOutlineHeart } from "react-icons/ai";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useProducts } from "../../Context/ProductsContextProvider";
import useQuery from "../../Hooks/useQuery";
import { IconButton } from "../Navigation/IconButton";
import styles from "./ProductsScreen.Module.scss";

export const ProductsScreen = () => {
  const { gender } = useParams();
  const [price, setPrice] = useState(100);
  const [color, setColor] = useState(null);
  const [order, setOrder] = useState(null);

  return (
    <div className={styles.productScreen}>
      <div className={styles.header}>
        <span>(40 articles)</span>
        <IconButton Icon={Icon} ModalContent={Filter} />
      </div>
      <div className={styles.cardsWrapper}>
        <Product gender={gender} price={price} color={color} order={order} />
      </div>
    </div>
  );
};

const Filter = () => {
  return <div>hello</div>;
};

const Product = ({ gender, price, color, order }) => {
  const { products, wishlist, toggleFavProduct } = useProducts();

  return filter(products, price, color, order, gender).map((product) => {
    return (
      <div className={styles.card} key={product.id}>
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
            <AiOutlineHeart
              className={wishlist.includes(product.id) ? styles.active : null}
              onClick={() => toggleFavProduct(product.id)}
            />
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

const filter = (products, price, color, order, gender) => {
  const array = products.filter((product) => {
    let keep = false;

    if (product.price < price) {
      keep = true;
      if (color) {
        keep = product.color === color;
      }
    }

    if (product.gender !== gender) keep = false;

    return keep;
  });

  if (order) {
    array.sort(function (a, b) {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    });
  }

  return array;
};
