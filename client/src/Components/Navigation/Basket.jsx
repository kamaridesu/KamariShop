import React from "react";
import styles from "./Basket.Module.scss";
import logo from "../../Images/emptybasket.svg";
import { useProducts } from "../../Context/ProductsContextProvider";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFilter, BsTrash, BsTrashFill } from "react-icons/bs";

export const Basket = () => {
  const { products, basket } = useProducts();

  return (
    <div className={styles.container}>
      {basket.length === 0 ? (
        <div className={styles.empty}>
          <img src={logo} alt="" />
          <p>Your basket is empty.</p>
        </div>
      ) : (
        <div className={styles.full}>
          <p className={styles.quantity}>
            Basket <span>(10) </span>
          </p>
          <div className={styles.mid}>
            <div className={styles.productswrapper}>
              {basket.map((item) => {
                const product = products.find((el) => el.id === item.productid);
                return (
                  <Product
                    product={product}
                    quantity={item.quantity}
                    key={item.productid}
                    id={item.productid}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.totalprice}>
              <p className={styles.total}>TOTAL</p>
              <p className={styles.price}>1.200,89€</p>
            </div>
            <button className={styles.button}>PROCESS ORDER</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Product = ({ product, quantity, id }) => {
  const { toggleFavProduct, deleteBasketProduct, setBasket } = useProducts();

  return (
    <div className={styles.product}>
      <div className={styles.imagewrapper}>
        <img src={product?.images[0]} alt="" className={styles.image} />
      </div>
      <div className={styles.productinfo}>
        <p className={styles.name}>{product?.name}</p>
        <div className={styles.bottomcard}>
          <div className={styles.colorquantity}>
            <div className={styles.colorwrapper}>
              <span
                style={{ backgroundColor: `${product?.color}` }}
                className={styles.color}
              >
                {"\u00A0"}
              </span>
            </div>
            <Counter quantity={quantity} id={id} />
          </div>
          <div className={styles.bottombottom}>
            <div className={styles.iconswrapper}>
              <span onClick={() => deleteBasketProduct(id)}>
                <BsTrash />
                <BsTrashFill />
              </span>
              <span
                onClick={() => {
                  deleteBasketProduct(id);
                  setBasket((prev) => prev.filter((el) => el.productid !== id));
                  toggleFavProduct(id);
                }}
              >
                <AiOutlineHeart />
                <AiFillHeart />
              </span>
            </div>
            <div className={styles.price}>{product?.price} €</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Counter = ({ quantity, id }) => {
  const { addToBasket, removeFromBasket } = useProducts();
  return (
    <span className={styles.quantitywrapper}>
      <button
        className={styles.minus}
        onClick={() => {
          removeFromBasket(id);
        }}
      >
        -
      </button>
      <span className={styles.number}>{quantity}</span>
      <button
        className={styles.plus}
        onClick={() => {
          addToBasket(id);
        }}
      >
        +
      </button>
    </span>
  );
};

const total = () => {};
