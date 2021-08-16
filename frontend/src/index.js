import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Provider } from "react-redux";
// import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  
  document.getElementById("root")
);

serviceWorker.unregister();
