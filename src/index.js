import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";

import App from "./App";
import authReducer from "./authentication/reducers/authReducer";
import errorReducer from "./common/reducers/errorReducer";
import productsReducer from "./products/reducers/productsReducer";
import brandReducer from "./products/reducers/brandReducer";
import categoryReducer from "./products/reducers/categoryReducer";

import {
  setUserVerified,
  setToken,
} from "./authentication/actions/authActions";

const reducers = combineReducers({
  isVerified: authReducer,
  errors: errorReducer,
  product: productsReducer,
  brand: brandReducer,
  category: categoryReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

if (localStorage.jwtToken) {
  setToken(localStorage.getItem("jwtToken"));
  store.dispatch(setUserVerified(true));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
