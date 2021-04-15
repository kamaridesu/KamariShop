import React from "react";
import { Link } from "react-router-dom";
import styles from "../Navigation/Nav.Module.scss";
import logo from "../../Images/KamariLogo120.png";
import { AiFillShopping, AiFillHeart } from "react-icons/ai";
import { BsPersonFill } from "react-icons/bs";
import { Icon } from "./Icon";
import { Basket } from "./Basket";
import { Wishlist } from "./Wishlist";
import { User } from "./User";

export const Nav = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className={styles.middleSection}>
        <Link to="/man">Men</Link>
        <span></span>
        <Link to="/women">Women</Link>
      </div>
      <div className={styles.rightSection}>
        <Icon Component={BsPersonFill}>
          <User />
        </Icon>
        <Icon Component={AiFillHeart}>
          <Wishlist />
        </Icon>
        <Icon Component={AiFillShopping}>
          <Basket />
        </Icon>
      </div>
    </nav>
  );
};
