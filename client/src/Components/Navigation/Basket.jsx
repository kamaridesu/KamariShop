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
        <div>
          <p className={styles.quantity}>
            Wishlist <span>(10) </span>
          </p>
          <div>
            <Product />
          </div>
          <div>
            <div>
              <p>TOTAL</p>
              <p>1.200,89€</p>
            </div>
            <button>PROCESS ORDER</button>
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
        <img src="" alt="" className={styles.image} />
      </div>
      <div className={styles.productinfo}>
        <p className={styles.name}>This is a name</p>
        <div className={styles.bottom}>
          <div className={styles.colorwrapper}>
            <span style={{ backgroundColor: `black` }} className={styles.color}>
              {"\u00A0"}
            </span>
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
