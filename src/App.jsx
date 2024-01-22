import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/home.jsx';
import Other from './pages/other.jsx';
import ProductList from './pages/productList.jsx';
import SignIn from './pages/signIn.jsx';
import Sms from './hack/sms.jsx';
import AddProductsHack from './hack/addProductsHack.jsx';
import FortuneWheel from './pages/fortuneWheel.jsx';
import View from './pages/view.jsx';
import Header from './pages/header.jsx';
import Footer from './pages/footer.jsx';

export default function App() {
  return (
    <>
    
    <ToastContainer />
    <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hack/products/" element={<AddProductsHack />} />
        <Route path="/product/:id" index element={<View />} />
        <Route path="/discounts/" element={<FortuneWheel />} />
        <Route path="/signin/" element={<SignIn />} />
        <Route path="/hack/sms/" element={<Sms />} />
        <Route path="/category/:id" element={<ProductList productsCount={100} api="apple" />} />
      </Routes>
        <Footer />
    </>
  );
}