import React from "react";
import { Router } from "./Routes/Router";
import "./App.css";
import { AuthContextProvider } from "./Context/AuthContextProvider";
import { ProductsContextProvider } from "./Context/ProductsContextProvider";

function App() {
  return (
    <AuthContextProvider>
      <ProductsContextProvider>
        <div className="App">
          <Router />
        </div>
      </ProductsContextProvider>
    </AuthContextProvider>
  );
}

export default App;
