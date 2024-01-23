import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/home.jsx';
import ProductList from './pages/productList.jsx';
import AddProductsHack from './hack/addProductsHack.jsx';
import FortuneWheel from './pages/fortuneWheel.jsx';
import View from './pages/view.jsx';
import Header from './pages/header.jsx';
import Footer from './pages/footer.jsx';

export default function RouterMain() {
  return (
    <>
    
    <ToastContainer />
    <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" index element={<View />} />
        <Route path="/discounts/" element={<FortuneWheel />} />
        <Route path="/category/:id" element={<ProductList productsCount={100} api="apple" />} />
      </Routes>
    <Footer />
    </>
  );
}