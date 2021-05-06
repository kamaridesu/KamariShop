import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../Context/ProductsContextProvider";
import manvideo from "../../Images/promo.mp4";
import womenvideo from "../../Images/promowomen.mp4";
import styles from "./Home.Module.scss";

export const Home = () => {
  const { products } = useProducts();

  return (
    <div className={styles.home}>
      <div className={styles.videowrapper}>
        <video autoPlay loop muted src={manvideo} type="video/mp4" />
      </div>
      <div className={styles.newman}>
        <p>MEN FASHION</p>
        <div className={styles.products}>
          {products
            .sort(() => 0.5 - Math.random())
            .filter((el) => el.gender === "man")
            .slice(0, 4)
            .map((product) => {
              return (
                <div className={styles.product} key={product.id}>
                  <Link
                    to={`/hats/${product.gender}/${product.id}`}
                    className={styles.imagewrapper}
                  >
                    <img src={product.images[0]} alt="" />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.videowrapper}>
        <video autoPlay loop muted src={womenvideo} type="video/mp4" />
      </div>
      <div className={styles.newwomen}>
        <p>WOMEN FASHION</p>
        <div className={styles.products}>
          {products
            .sort(() => 0.5 - Math.random())
            .filter((el) => el.gender === "women")
            .slice(0, 4)
            .map((product) => {
              return (
                <div className={styles.product} key={product.id}>
                  <Link
                    to={`/hats/${product.gender}/${product.id}`}
                    className={styles.imagewrapper}
                  >
                    <img src={product.images[0]} alt="" />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
