import React, { createContext, useState } from "react";

export const ProductsContextProvider = createContext();

export const ProductsContextProvider = () => {
  const [basket, setBasket] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  return (
    <ProductsContextProvider.Provider value={{}}>
      {children}
    </ProductsContextProvider.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductsContextProvider);
};
