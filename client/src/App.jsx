import React from "react";
import { Router } from "./Routes/Router";
import "./App.css";
import { AuthContext } from "./Context/AuthContext";

function App() {
  return (
    <AuthContext>
      <div className="App">
        <Router />
      </div>
    </AuthContext>
  );
}

export default App;
