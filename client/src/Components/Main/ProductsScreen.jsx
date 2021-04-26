import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineClose,
  AiOutlineFilter,
  AiOutlineHeart,
} from "react-icons/ai";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useProducts } from "../../Context/ProductsContextProvider";
import { IconButton } from "../Navigation/IconButton";
import styles from "./ProductsScreen.Module.scss";
import logo from "../../Images/emptyfilter.png";

import { Slider } from "antd";
import "./antd.css";

export const ProductsScreen = () => {
  const { gender } = useParams();
  const { products } = useProducts();
  const [price, setPrice] = useState([0, 100]);
  const [color, setColor] = useState(null);
  const [order, setOrder] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(filter(products, price, color, order, gender));
  }, [products, gender, price, order, color]);
  console.log(products);
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
          price={price}
          setPrice={setPrice}
          gender={gender}
          setFilteredProducts={setFilteredProducts}
          filteredProducts={filteredProducts.length}
        />
      </div>
      {filteredProducts.length === 0 ? (
        <div className={styles.empty}>
          <img src={logo} alt="" />
          <p className={styles.top}>There are no results</p>
          <p>Try selection other filters</p>
        </div>
      ) : (
        <div className={styles.cardsWrapper}>
          <Product gender={gender} filteredProducts={filteredProducts} />
        </div>
      )}
    </div>
  );
};

const FilterModal = ({
  color,
  setColor,
  filteredProducts,
  price,
  setPrice,
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
      <div className={styles.pricewrapper}>
        <p>
          <span>Price</span>
          <span>
            {price[0]} € - {price[1]} €
          </span>
        </p>
        <div>
          <Slider
            range
            defaultValue={[0, 50]}
            allowCross={false}
            onChange={(e) => setPrice(e)}
            value={price}
          />
        </div>
      </div>
      <div className={styles.buttonswrapper}>
        <button
          onClick={() => {
            setColor(null);
            setOrder(null);
            setPrice([0, 100]);
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
    "#F03524",
    "#ED6F2D",
    "#58B24C",
    "#684020",
    "#ff56ad",
    "#D0BF93",
    "#838383",
    "#A242F4",
    "#FEFC53",
    "#3C59F6",
    "#FFFFFF",
    "#000000",
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
            <div onClick={() => toggleFavProduct(product.id)}>
              {wishlist.includes(product.id) ? (
                <AiFillHeart style={{ color: "red" }} />
              ) : (
                <AiOutlineHeart />
              )}
            </div>
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

    if (price[0] < product.price && product.price < price[1]) {
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
