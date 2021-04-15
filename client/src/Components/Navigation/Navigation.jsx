import React from "react";
import { Link } from "react-router-dom";
import styles from "../Navigation/Navigation.Module.scss";
import logo from "../../Images/KamariLogo120.png";
import { AiFillShopping, AiFillHeart } from "react-icons/ai";
import { BsPersonFill } from "react-icons/bs";

export const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <div>
          <li>
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </li>
        </div>
        <div>
          <Link to="/Man">Men</Link>
          <span>|</span>
          <Link to="/Women">Women</Link>
        </div>
        <div>
          <li>
            <Link
              to="#"
              onClick={(e) => {
                //setModalVisible((e) => !e);
                //setReferrer("profile");
                //setModalTriggerElement(e.target);
              }}
            >
              <BsPersonFill />
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={(e) => {
                //setModalVisible((e) => !e);
                //setReferrer("wishlist");
                //setModalTriggerElement(e.target);
              }}
            >
              <AiFillHeart />
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={(e) => {
                //setModalVisible((e) => !e);
                //setReferrer("basket");
                //setModalTriggerElement(e.target);
              }}
            >
              <AiFillShopping />
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};
