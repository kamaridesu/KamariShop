import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../Navigation/Nav.Module.scss";
import logo from "../../Images/KamariLogo120.png";
import { AiFillShopping, AiFillHeart } from "react-icons/ai";
import { BsPersonFill } from "react-icons/bs";
import { IconButton } from "./IconButton";
import { Basket } from "./Basket";
import { Wishlist } from "./Wishlist";
import { useAuth } from "../../Context/AuthContextProvider";
import { UserMenu } from "./UserMenu";
import { Form } from "./Form";

export const Nav = (props) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className={styles.middleSection}>
        <Link
          to="/hats/man"
          className={
            window.location.pathname.includes("man") ? styles.active : null
          }
        >
          Men
        </Link>
        <span></span>
        <Link
          to="/hats/women"
          className={
            window.location.pathname.includes("women") ? styles.active : null
          }
        >
          Women
        </Link>
      </div>
      <div className={styles.rightSection}>
        <IconButton Icon={BsPersonFill} ModalContent={UserNavMenu} />
        <IconButton Icon={AiFillHeart} ModalContent={Wishlist} />
        <IconButton Icon={AiFillShopping} ModalContent={Basket} />
      </div>
    </nav>
  );
};

const UserNavMenu = ({ close }) => {
  const { auth } = useAuth();

  return <>{auth.isLoggedIn ? <UserMenu close={close} /> : <Form />}</>;
};
