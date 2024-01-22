import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import './App.css';

import HomePage from './pages/home.jsx';
import Other from './pages/other.jsx';
import ProductList from './pages/productList.jsx';
import SignIn from './pages/signIn.jsx';
import FortuneWheel from './pages/fortuneWheel.jsx';
import View from './pages/view.jsx';
import Header from './pages/header.jsx';
import Footer from './pages/footer.jsx';

export default function App() {
  return (
    <>
    
    <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" index element={<View />} />
        <Route path="/discounts/" element={<FortuneWheel />} />
        <Route path="/signin/" element={<SignIn />} />
        <Route path="/apartments/" element={<ProductList productsCount={100} api="apple" />} />
        <Route path="/xiaomi/" element={<ProductList productsCount={100} api="xiaomi" />} />
        <Route path="/houses/" element={<ProductList productsCount={100} api="smartfony-samsung" />} />
        <Route path="/desktop/" element={<ProductList productsCount={100} api="monobloki" />} />
        <Route path="/land/" element={<ProductList productsCount={100} api="noutbuki" />} />
        <Route path="/commercial/" element={<ProductList productsCount={100} api="iphone" />} />
        <Route path="/tablets/" element={<ProductList productsCount={100} api="ipad-series" />} />
        <Route path="/rentals/" element={<ProductList productsCount={100} api="watches" />} />
        <Route path="/headphones/" element={<ProductList productsCount={100} api="besprovodnye-naushniki-apple" />} />
        <Route path="/other/" element={<Other />} />
        
      </Routes>
        <Footer />
    </>
  );
}