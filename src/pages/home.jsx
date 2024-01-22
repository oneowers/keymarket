import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from './components/product_grid.jsx';
import FAQSection from './components/fAQSection.jsx';
import Description from './components/description.jsx';

const App = ({ api }) => {
  return (
    <>
      <section
        aria-labelledby="sale-heading"
        className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-8  text-center sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 id="sale-heading" className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Эксклюзивная распродажа недвижимости! Получите выгоду 7% скидки прямо сейчас
          </h2>
          <p className=" text-sm lg:text-xl mx-auto mt-4 max-w-4xl text-gray-600">
            Мы не просто продаём квадратные метры — мы создаем пространства для вашей удовлетворенности, комфорта и радости.
          </p>
          <Link
            to="/signin"
            className="mt-6 inline-block rounded-md border border-transparent bg-gray-900 px-8 py-3 font-medium text-white hover:bg-gray-800 sm:w-auto"
          >
            Зарегистрироватся
          </Link>
        </div>
      </section>
      <ProductGrid productsCount={20} api={"iphone"} />

      <Description />
      <FAQSection />
    </>
  );
};

export default App;
