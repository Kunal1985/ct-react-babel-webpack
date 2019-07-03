import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.5.0";

import App from 'views/App/App.jsx'
import Login from 'views/Login/Login.jsx'
import UserProfile from 'views/UserProfile/UserProfile.jsx'
import ShoppingCart from 'views/ShoppingCart/ShoppingCart.jsx'
import Checkout from 'views/Checkout/Checkout.jsx'
import Catalog from 'views/Catalog/Catalog.jsx'
import ProductDetails from 'views/ProductDetails/ProductDetails.jsx'
import Home from 'views/Home/Home.jsx'

const hist = createHashHistory();

ReactDOM.render(
  <Router history={hist}>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/catalog/:catalogId" component={Catalog} />
        <Route path="/product/:productId" component={ProductDetails} />
        <Route path="/login" component={Login} />
        <Route path="/user" component={UserProfile} />
        <Route path="/cart" component={ShoppingCart} />
        <Route path="/checkout" component={Checkout} />
      </Switch>
    </App>
  </Router>,
  document.getElementById("root")
);