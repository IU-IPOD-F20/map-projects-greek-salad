import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import RootStore from "./stores/root";

const StoreContext = createContext({});
const StoreProvider = StoreContext.Provider;

const rootStore = new RootStore({});

ReactDOM.render(
  <StoreProvider value={rootStore}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StoreProvider>,
  document.getElementById("root")
);
