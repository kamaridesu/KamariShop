import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import styles from "./Products.Module.scss";
import logo from "../../Images/empty.gif";
import useQuery from "../../Hooks/useQuery";
import { IconButton } from "../Navigation/IconButton";
import { FormMsg } from "../../Errors/FormMsg";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ msg: "", status: null });
  const { data, loading, status, setApiOptions } = useQuery({
    url: "/api/products/all",
    method: "GET",
  });

  const deleteProduct = (id) => {
    setApiOptions({
      url: `/api/products/delete/${id}`,
      method: "GET",
    });
  };

  useEffect(() => {
    if (loading === false) {
      setProducts(data.response);
    }
    if (loading === false && data?.msg) {
      setMessage({ msg: data.msg, status: status });
    }
  }, [loading]);

  return (
    <>
      {products.length === 0 ? (
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
          {message.msg && (
            <FormMsg msg={message} clear={() => setMessage({ msg: null })} />
          )}
          <div className={styles.header}>
            <p>PRODUCTS</p>
            <Link to="/products/productform">
              <AiOutlinePlus />
            </Link>
          </div>
          <div className={styles.products}>
            <Product products={products} deleteProduct={deleteProduct} />
          </div>
        </div>
      )}
    </>
  );
};

const Confirmation = ({ close, callback }) => {
  return (
    <div className={styles.confirmation}>
      <AiOutlineCloseCircle className={styles.icon} />
      <p className={styles.body}>Do you really want to delete these records?</p>
      <div className={styles.buttons}>
        <button onClick={close}>Cancel</button>
        <button onClick={callback}>Delete</button>
      </div>
    </div>
  );
};

const Product = ({ products, deleteProduct }) => {
  return products.map((el) => {
    return (
      <div key={el.id}>
        <Link to={`/products/editproduct/${el.id}`}>
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
        <IconButton
          Icon={AiOutlineClose}
          ModalContent={Confirmation}
          classname={"center"}
          callback={() => deleteProduct(el.id)}
        />
      </div>
    );
  });
};
