import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from "./App";
import { store, persistor } from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";

const initialOptions = {
  "client-id":
    "ASOubM9TejXmh3c_iisHiPX8n2s9XNOAu7Q0Gz0vSvxXjag1ZWev0JPewseRiERet5pioQNrPZGWhkHy",
  currency: "USD",
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <PayPalScriptProvider options={initialOptions}>
          <App />
        </PayPalScriptProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
