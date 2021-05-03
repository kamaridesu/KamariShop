import React from "react";
import { BsBag, BsBagFill, BsTrash, BsTrashFill } from "react-icons/bs";
import { useProducts } from "../../Context/ProductsContextProvider";
import styles from "./Wishlist.Module.scss";
import logo from "../../Images/wishlist.png";

export const Wishlist = () => {
  const { products, wishlist, toggleFavProduct, addToBasket } = useProducts();
  return (
    <div className={styles.container}>
      {wishlist.length === 0 ? (
        <div className={styles.empty}>
          <img src={logo} alt="" />
          <p>Your wishlist is empty.</p>
        </div>
      ) : (
        <>
          <p className={styles.quantity}>
            Wishlist <span>({wishlist.length}) </span>
          </p>
          {products.map((product) => {
            if (wishlist.includes(product.id)) {
              return <Product product={product} key={product.id} />;
            }
          })}
        </>
      )}
    </div>
  );
};

const Product = ({ product }) => {
  const { toggleFavProduct, addToBasket } = useProducts();

  return (
    <div className={styles.product}>
      <div className={styles.imagewrapper}>
        <img src={product.images[0]} alt="" className={styles.image} />
      </div>
      <div className={styles.productinfo}>
        <p className={styles.name}>{product.name}</p>
        <div className={styles.bottom}>
          <div className={styles.colorwrapper}>
            <span
              style={{ backgroundColor: `${product.color}` }}
              className={styles.color}
            >
              {"\u00A0"}
            </span>
          </div>
          <div className={styles.bottombottom}>
            <div className={styles.iconswrapper}>
              <span onClick={() => toggleFavProduct(product.id)}>
                <BsTrash />
                <BsTrashFill />
              </span>
              <span
                onClick={() => {
                  toggleFavProduct(product.id);
                  addToBasket(product.id);
                }}
              >
                <BsBag />
                <BsBagFill />
              </span>
            </div>
            <div className={styles.price}>{product.price} €</div>
          </div>
        </div>
      </div>
    </div>
  );
};
