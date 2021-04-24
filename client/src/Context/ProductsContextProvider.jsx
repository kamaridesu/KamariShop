import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useQuery from "../Hooks/useQuery";
import { useAuth } from "./AuthContextProvider";

export const ProductsContext = createContext();

export const ProductsContextProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const { auth } = useAuth();
  const updateWishlist = useQuery({});

  const toggleFavProduct = useCallback(
    (id) => {
      if (wishlist.includes(id)) {
        setWishlist((prev) => prev.filter((productId) => productId !== id));
        if (auth.isLoggedIn) {
          updateWishlist.setApiOptions({
            url: `/api/products/wishlist/${id}/remove`,
            method: "POST",
          });
        }
      } else {
        setWishlist((prev) => [...prev, id]);
        if (auth.isLoggedIn) {
          updateWishlist.setApiOptions({
            url: `/api/products/wishlist/${id}/add`,
            method: "POST",
          });
        }
      }
    },
    [wishlist]
  );

  useProductQuery(setProducts);
  useWishlistQuery(auth, setWishlist);
  //useBasketQuery(auth, setBasket);

  useEffect(() => {
    if (auth.isLoggedIn) {
    } else {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  return (
    <ProductsContext.Provider value={{ products, wishlist, toggleFavProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const value = useContext(ProductsContext);
  if (!value)
    throw new Error("useProducts must be used in a descendent of the provider");
  return value;
};

const useProductQuery = (setProducts) => {
  const productsQuery = useQuery({
    url: "/api/products/all",
    method: "GET",
  });

  useEffect(() => {
    if (productsQuery.loading === false && productsQuery.data) {
      setProducts(productsQuery.data.response);
    }
  }, [productsQuery.loading]);
};

const useWishlistQuery = (auth, setWishlist) => {
  const wishlistQuery = useQuery({});

  useEffect(() => {
    if (auth.isLoggedIn) {
      wishlistQuery.setApiOptions({
        url: `/api/products/wishlisted`,
        method: "GET",
      });
    } else {
      const lc = localStorage.getItem("wishlist");
      if (lc) {
        setWishlist(JSON.parse(lc));
      } else {
        setWishlist([]);
      }
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (
      wishlistQuery.loading === false &&
      auth.isLoggedIn &&
      wishlistQuery.data
    ) {
      setWishlist(wishlistQuery.data.response);
    }
  }, [wishlistQuery.loading, auth.isLoggedIn, wishlistQuery.data]);

  // useEffect(() => {
  //   if (wishlistQuery.loading === false && wishlistQuery.data)
  //     if (auth.isLoggedIn) {
  //     } else {
  //       localStorage.setItem("wishlist", JSON.stringify(wishlist));
  //     }
  // }, [wishlist]);
};

const useBasketQuery = (auth, setBasket) => {
  const basket = useQuery({});

  useEffect(() => {
    if (auth.isLoggedIn) {
      basket.setApiOptions({
        url: `/api/products/basket`,
        method: "GET",
      });
    } else {
      setBasket(JSON.parse(localStorage.getItem("basket")));
    }
    if (basket.loading === false && auth.isLoggedIn) {
      setBasket(basket.data);
    }
  }, [basket.loading, auth.isLoggedIn]);
};
