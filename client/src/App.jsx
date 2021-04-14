import React from "react";
import { Router } from "./Routes/Router";
import "./App.css";
import { AuthContextProvider } from "./Context/AuthContextProvider";

function App() {
  return (
    <AuthContextProvider>
      <div className="App">
        <Router />
      </div>
    </AuthContextProvider>
  );
}

export default App;
