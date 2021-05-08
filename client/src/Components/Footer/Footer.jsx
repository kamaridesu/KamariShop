import React from "react";
import {
  AiFillFacebook,
  AiFillRedditCircle,
  AiFillYoutube,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import styles from "./Footer.Module.scss";
import logo from "../../Images/hat.png";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ul className={styles.list}>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
          <AiFillFacebook />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
          <AiOutlineTwitter />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          <AiOutlineInstagram />
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
          <AiFillYoutube />
        </a>
        <a href="https://www.reddit.com" target="_blank" rel="noreferrer">
          <AiFillRedditCircle />
        </a>
      </ul>
      <div className={styles.middle}>
        <p className={styles.text}>
          The content of this site is copyright-protected and is the property of
          KAMARI, Our business concept is to offer fashion and quality at the
          best price. since it was founded in 2021 our objective is to grow into
          one of the world's leading fashion companies.
        </p>
      </div>
      <div className={styles.bottom}>
        <div className={styles.name}>Kamari</div>
        <div className={styles.imagewrapper}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.lastname}>desu :)</div>
      </div>
    </footer>
  );
};
