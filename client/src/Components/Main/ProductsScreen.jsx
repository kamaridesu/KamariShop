import React, { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineFilter,
  AiOutlineHeart,
} from "react-icons/ai";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useProducts } from "../../Context/ProductsContextProvider";
import { IconButton } from "../Navigation/IconButton";
import styles from "./ProductsScreen.Module.scss";

export const ProductsScreen = () => {
  const { gender } = useParams();
  const { products } = useProducts();
  const [price, setPrice] = useState(100);
  const [color, setColor] = useState(null);
  const [order, setOrder] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(filter(products, price, color, order, gender));
  }, [products, gender, price, order, color]);

  return (
    <div className={styles.productScreen}>
      <div className={styles.header}>
        <span>({filteredProducts.length} articles)</span>
        <IconButton
          Icon={Icon}
          ModalContent={FilterModal}
          color={color}
          setColor={setColor}
          setOrder={setOrder}
          order={order}
          filteredProducts={filteredProducts.length}
        />
      </div>
      <div className={styles.cardsWrapper}>
        <Product gender={gender} filteredProducts={filteredProducts} />
      </div>
    </div>
  );
};

const FilterModal = ({
  color,
  setColor,
  filteredProducts,
  close,
  setOrder,
  order,
}) => {
  return (
    <div className={styles.filtermodal}>
      <div className={styles.iconwrapper}>
        <AiOutlineClose onClick={close} />
      </div>
      <div className={styles.orderwrapper}>
        <p>Order By</p>
        <div className={styles.orderbuttons}>
          <button
            onClick={() => (order === "asc" ? setOrder(null) : setOrder("asc"))}
            className={order === "asc" ? styles.orderactive : null}
          >
            Low To High
          </button>
          <button
            onClick={() => (order === "des" ? setOrder(null) : setOrder("des"))}
            className={order === "des" ? styles.orderactive : null}
          >
            High To Low
          </button>
        </div>
      </div>
      <div className={styles.colorswrapper}>
        <p>Colors</p>
        <div className={styles.colors}>
          <Colors color={color} setColor={setColor} />
        </div>
      </div>
      <div className={styles.buttonswrapper}>
        <button
          onClick={() => {
            setColor(null);
            setOrder(null);
          }}
        >
          Reset Filters
        </button>
        <button onClick={close}>See {filteredProducts} Items</button>
      </div>
    </div>
  );
};

const Colors = ({ color, setColor }) => {
  const colors = [
    "white",
    "silver",
    "gray",
    "black",
    "red",
    "maroon",
    "yellow",
    "olive",
    "lime",
    "green",
    "aqua",
    "teal",
    "blue",
    "navy",
    "fuchsia",
    "purple",
  ];

  return colors.map((el, index) => {
    return (
      <button
        key={index}
        className={color === el ? styles.coloractive : null}
        onClick={() => (color === el ? setColor(null) : setColor(el))}
      >
        <div style={{ backgroundColor: el }}></div>
      </button>
    );
  });
};

const Product = ({ gender, filteredProducts }) => {
  const { wishlist, toggleFavProduct } = useProducts();

  return filteredProducts.map((product) => {
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
  console.log(products);
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
