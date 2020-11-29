import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import RootStore from "./stores/root";
import { BrowserRouter } from "react-router-dom";

const StoreContext = createContext({});
const StoreProvider = StoreContext.Provider;

const rootStore = new RootStore({});

ReactDOM.render(
  <BrowserRouter>
    <StoreProvider value={rootStore}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </StoreProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
