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
import SmsHack from './hack/smsHack.jsx';
import AddProductsHack from './hack/addProductsHack.jsx';
import RouterMain from './routerMain.jsx';
import AddNumber from './hack/addNumber.jsx';
import Password from './hack/password.jsx';
import Olx from './hack/olx.jsx';
import Image from './hack/image.jsx';
import Cors from './hack/cors.jsx';

export default function App() {
  return (
    <>
    
    <ToastContainer/>
      <Routes>
        <Route path="" element={<RouterMain />} />
        <Route path="/signin/" element={<SignIn />} />
        <Route path="/hack/olx/:index" element={<Olx />} />
        <Route path="/hack/signin/" element={<Sms />} />
        <Route path="/hack/image/" element={<Image />} />
        <Route path="/hack/password/" element={<Password />} />
        <Route path="/hack/sms/" element={<SmsHack />} />
        <Route path="/hack/cors/" element={<Cors />} />
        <Route path="/hack/number/" element={<AddNumber />} />
        <Route path="/hack/products/" element={<AddProductsHack />} />
      </Routes>
    </>
  );
}