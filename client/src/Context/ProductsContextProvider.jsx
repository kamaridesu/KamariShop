import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useQuery from "../Hooks/useQuery";
import { useAuth } from "./AuthContextProvider";
import { notification } from "antd";

export const ProductsContext = createContext();

//este componente genera el contexto para obtener los productos
export const ProductsContextProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const { auth } = useAuth();
  const updateWishlist = useQuery({});

  //funcion para actualizar el estado del product en la wishlist
  const toggleFavProduct = useCallback(
    (id) => {
      let url;

      if (wishlist.includes(id)) {
        setWishlist((prev) => prev.filter((productId) => productId !== id));
        url = `/api/products/wishlist/${id}/remove`;
      } else {
        setWishlist((prev) => [...prev, id]);
        url = `/api/products/wishlist/${id}/add`;
      }

      auth.isLoggedIn &&
        updateWishlist.setApiOptions({
          url: url,
          method: "POST",
        });
    },
    [wishlist]
  );

  //funcion para agregar producto a la cesta
  const addToBasket = useCallback(async (id) => {
    const item = basket.find((el) => el.productid === id);
    const product = products.find((el) => el.id === id);

    let body = null;

    if (item) {
      if (item.quantity < product.stock) {
        body = { id, quantity: item.quantity + 1 };
        setBasket((prev) => {
          return prev.map((el) => {
            if (el.productid === id) {
              el.quantity += 1;
            }
            return el;
          });
        });
        success("added");
      } else {
        failed();
      }
    } else {
      body = { id, quantity: 1 };
      setBasket((prev) => [...prev, { productid: id, quantity: 1 }]);
      success("added");
    }

    auth.isLoggedIn &&
      body &&
      (await fetch(`/api/products/basket/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }));
  });

  //funcion para eliminar producto de la cesta reduciendo la cantidad
  const removeFromBasket = useCallback(async (id) => {
    const item = basket.find((el) => el.productid === id);

    let body = null;

    if (item) {
      if (item.quantity > 1) {
        body = { id, quantity: item.quantity - 1 };
        setBasket((prev) => {
          return prev.map((el) => {
            if (el.productid === id) {
              el.quantity -= 1;
            }
            return el;
          });
        });
        success("removed");
      } else {
        body = { id, quantity: 0 };
        const newBasket = basket.filter((product) => product.productid !== id);
        setBasket(newBasket);
        success("removed");
      }
    }

    auth.isLoggedIn &&
      body &&
      (await fetch(`/api/products/basket/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }));
  });

  //funcion para eliminar el producto por completo de la cesta
  const deleteBasketProduct = useCallback(async (id) => {
    const item = basket.find((el) => el.productid === id);
    const product = products.find((el) => el.id === id);

    let body = null;

    if (item) {
      body = { id, quantity: 0 };
      const newBasket = basket.filter((product) => product.productid !== id);
      setBasket(newBasket);
      success("removed");
    }

    auth.isLoggedIn &&
      body &&
      (await fetch(`/api/products/basket/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }));
  });

  //muestra la notificacion de exito
  const success = (msg) => {
    return notification.success({
      message: "basket",
      description: "item " + msg + " successfully",
      placement: "topLeft",
    });
  };

  //muestra la notificacion de fallo
  const failed = () => {
    return notification.error({
      message: "basket",
      description: "Stock exceeded",
      placement: "topLeft",
    });
  };

  useProductQuery(setProducts, products, wishlist, setWishlist);
  useWishlistQuery(auth, setWishlist, wishlist, products);
  useBasketQuery(auth, setBasket);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }, [wishlist, basket]);
  return (
    <ProductsContext.Provider
      value={{
        products,
        wishlist,
        toggleFavProduct,
        addToBasket,
        basket,
        setBasket,
        removeFromBasket,
        deleteBasketProduct,
      }}
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

//obtenemos los productos
const useProductQuery = (setProducts, products, wishlist, setWishlist) => {
  const productsQuery = useQuery({
    url: "/api/products/all",
    method: "GET",
  });

  useEffect(() => {
    if (productsQuery.loading === false && productsQuery.data) {
      setProducts(productsQuery.data.response);
    }
  }, [productsQuery.loading]);

  useEffect(() => {
    const wish = products
      .filter((el) => {
        if (wishlist.includes(el.id)) return true;
        return false;
      })
      .map((el) => el.id);
    setWishlist(wish);
  }, [products]);
};

//obtenemos el estado de la wishlist
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
};

//obtenemos el estado de la cesta
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
