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

  //adds or removes product from wishlist context
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

  const addToBasket = useCallback(async (id) => {
    const res = await fetch(`/api/products/basket/${id}/add`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
  });

  useProductQuery(setProducts);
  useWishlistQuery(auth, setWishlist);
  useBasketQuery(auth, setBasket);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }, [wishlist, basket]);

  return (
    <ProductsContext.Provider
      value={{ products, wishlist, toggleFavProduct, addToBasket }}
    >
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

//get the products data in first render
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

  //every time auth changes we get the appropiate wishlisted products
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
};

const useBasketQuery = (auth, setBasket) => {
  const basketQuery = useQuery({});

  useEffect(() => {
    if (auth.isLoggedIn) {
      basketQuery.setApiOptions({
        url: `/api/products/basket`,
        method: "GET",
      });
    } else {
      const lc = localStorage.getItem("basket");
      if (lc) {
        setBasket(JSON.parse(lc));
      } else {
        setBasket([]);
      }
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (basketQuery.loading === false && auth.isLoggedIn && basketQuery.data) {
      setBasket(basketQuery.data.response);
    }
  }, [basketQuery.loading, auth.isLoggedIn, basketQuery.data]);
};
