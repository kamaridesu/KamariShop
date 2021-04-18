import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import styles from "./Products.Module.scss";
import logo from "../../Images/empty.gif";
import useQuery from "../../Hooks/useQuery";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const { data, setApiOptions } = useQuery({
    url: "/api/products/all",
    method: "GET",
  });
  console.log(data);
  return (
    <>
      {!data ? (
        <div className={styles.empty}>
          <div>
            <Link to="/products/productform">
              ADD A PRODUCT <AiOutlinePlus />
            </Link>
          </div>
          <div>
            <img src={logo} alt="" />
          </div>
        </div>
      ) : (
        <div className={styles.full}>
          <div>
            <p>PRODUCTS</p>
            <Link to="/products/productform">
              <AiOutlinePlus />
            </Link>
          </div>
          <div>
            {data.map((el) => {
              return (
                <div>
                  <Link to={`/products/editproduct/${el.id}`} key={el.id}>
                    <div>
                      <img src={el.images[0]} alt="" />
                    </div>
                    <div>
                      <div>
                        <p>{el.name}</p>
                      </div>
                      <div>
                        <p>{el.price}€</p>
                        <p>{el.quantity} units</p>
                      </div>
                    </div>
                  </Link>
                  <button>
                    <AiOutlineClose />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
