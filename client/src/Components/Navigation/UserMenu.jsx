import React, { useEffect } from "react";
import { AiOutlineUnorderedList, AiFillLock } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContextProvider";
import useQuery from "../../Hooks/useQuery";
import styles from "./UserMenu.Module.scss";

export const UserMenu = ({ close }) => {
  const { auth, setAuth } = useAuth();
  const [data, loading, setApiOptions] = useQuery({});

  console.log(loading);

  const logOut = () => {
    setApiOptions({
      url: "/api/users/logout",
      method: "GET",
    });
  };

  useEffect(() => {
    if (loading === false) {
      setAuth({
        user: null,
        isLoggedIn: false,
        loading: true,
      });
    }
  }, [loading]);

  return (
    <div className={styles.container}>
      <div>
        <p>Welcome {auth.user.role}!</p>
        <p>{auth.user.email}</p>
      </div>
      <div>
        <div>
          <Link to="/profile" onClick={close}>
            <AiOutlineUnorderedList /> <span>My Profile</span>
          </Link>
        </div>
        <div>
          {auth.user.role === "admin" && (
            <Link to="/products" onClick={close}>
              <AiFillLock /> <span>Products Panel</span>
            </Link>
          )}
        </div>
        <div>
          <button onClick={() => logOut()}>LOG OUT</button>
        </div>
      </div>
    </div>
  );
};
