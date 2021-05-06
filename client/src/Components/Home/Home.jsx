import React from "react";
import { Link } from "react-router-dom";
import manvideo from "../../Images/promo.mp4";
import womenvideo from "../../Images/promowomen.mp4";
import styles from "./Home.Module.scss";

export const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.videowrapper}>
        <video autostart autoPlay loop muted src={manvideo} type="video/mp4" />
      </div>
      <div className={styles.newman}>
        <p>MEN FASHION</p>
        <div className={styles.products}>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/515/400/05/4830515400_6_1_8.jpg?t=1616765088412&imwidth=563"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/524/800/02/4830524800_6_1_8.jpg?t=1617101911277&imwidth=563"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4834/502/015/4834502015_2_2_8.jpg?t=1608129358283&imwidth=563"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/515/400/05/4830515400_6_1_8.jpg?t=1616765088412&imwidth=563"
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.videowrapper}>
        <video
          autostart
          autoPlay
          loop
          muted
          src={womenvideo}
          type="video/mp4"
        />
      </div>
      <div className={styles.newwomen}>
        <p>WOMEN FASHION</p>
        <div className={styles.products}>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/515/400/05/4830515400_6_1_8.jpg?t=1616765088412&imwidth=563"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/515/400/05/4830515400_6_1_8.jpg?t=1616765088412&imwidth=563"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/515/400/05/4830515400_6_1_8.jpg?t=1616765088412&imwidth=563"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.product}>
            <Link className={styles.imagewrapper}>
              <img
                src="https://static.pullandbear.net/2/photos//2021/V/0/2/p/4830/515/400/05/4830515400_6_1_8.jpg?t=1616765088412&imwidth=563"
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
