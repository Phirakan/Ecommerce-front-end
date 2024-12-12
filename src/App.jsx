import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';

// Components

import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/product';
import Cart from './components/cart';
import ManageProducts from './components/admin/manageproduct';
import Checkout from './components/checkout';
import OrderSummary from './components/orderSummary';

function App() {
 

  return (
    
    <Router>
      <Navbar />

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/manage_products" element={<ManageProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>

      

    </Router>
  );
}

export default App;
