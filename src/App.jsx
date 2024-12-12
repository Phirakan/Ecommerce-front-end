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
import OrderHistory from './components/orderHistory';
import ManageOrders from './components/admin/manageorder';

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
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/admin/manage_orders" element={<ManageOrders />} />
      </Routes>

      

    </Router>
  );
}

export default App;
