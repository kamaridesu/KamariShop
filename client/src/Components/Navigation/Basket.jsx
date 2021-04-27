import React from "react";
import styles from "./Basket.Module.scss";
import logo from "../../Images/emptybasket.svg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsTrash, BsTrashFill } from "react-icons/bs";

export const Basket = () => {
  return (
    <div className={styles.container}>
      {!true ? (
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
              <Product />
              <Product />
              <Product />
              <Product />
              <Product />
              <Product />
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

const Product = () => {
  return (
    <div className={styles.product}>
      <div className={styles.imagewrapper}>
        <img
          src="http://localhost:3000/images/133d844a-9bd3-4cfd-be6f-3eebff5140d3/b3f7db141589b900b8fbdb097a5f7488"
          alt=""
          className={styles.image}
        />
      </div>
      <div className={styles.productinfo}>
        <p className={styles.name}>This is a name</p>
        <div className={styles.bottomcard}>
          <div className={styles.colorquantity}>
            <div className={styles.colorwrapper}>
              <span
                style={{ backgroundColor: `black` }}
                className={styles.color}
              >
                {"\u00A0"}
              </span>
            </div>
            <Counter />
          </div>
          <div className={styles.bottombottom}>
            <div className={styles.iconswrapper}>
              <span>
                <BsTrash />
                <BsTrashFill />
              </span>
              <span>
                <AiOutlineHeart />
                <AiFillHeart />
              </span>
            </div>
            <div className={styles.price}>9,99 €</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Counter = () => {
  return (
    <span className={styles.quantitywrapper}>
      <button className={styles.minus}>-</button>
      <span className={styles.number}>1</span>
      <button className={styles.plus}>+</button>
    </span>
  );
};
