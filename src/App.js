import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import Logout from "./authentication/Logout";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import Navigation from "./common/components/Navigation";
import Footer from "./common/components/Footer";
import Home from "./products/containers/Home";
import ProductDetail from "./products/containers/ProductDetail";
import GenderProducts from "./products/containers/GenderProducts";
import BrandList from "./products/containers/BrandList";
import CategoryList from "./products/containers/CategoryList";
import BrandProducts from "./products/containers/BrandProducts";
import CategoryProducts from "./products/containers/CategoryProducts";
import FeaturedProducts from "./products/containers/FeaturedProducts";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navigation />
          <div className="container base-container">
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/register" component={Register} />
            <Switch>
              <Route exact path="/products/:id" component={ProductDetail} />
            </Switch>
            <Switch>
              <Route exact path="/genders/:gender" component={GenderProducts} />
            </Switch>
            <Switch>
              <Route exact path="/featured" component={FeaturedProducts} />
            </Switch>
            <Switch>
              <Route exact path="/brands" component={BrandList} />
              <Route
                exact
                path="/brands/:brandName"
                component={BrandProducts}
              />
            </Switch>
            <Switch>
              <Route exact path="/categories" component={CategoryList} />
              <Route
                exact
                path="/categories/:categoryName"
                component={CategoryProducts}
              />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
