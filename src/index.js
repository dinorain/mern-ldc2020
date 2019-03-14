import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import HttpsRedirect from "react-https-redirect";
import WebFont from "webfontloader";

import reducers from "./reducers";
import App from "./components/App";

WebFont.load({
  google: {
    families: ["Roboto:300,400,500", "Pacifico:400", "sans-serif"]
  }
});

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <HttpsRedirect>
      <App />
    </HttpsRedirect>
  </Provider>,
  document.querySelector("#root")
);
