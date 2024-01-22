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
        className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-8 text-center sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 id="sale-heading" className="text-3xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Эксклюзивная распродажа недвижимости от KeyMarket.uz! Получите выгоду 7% скидки прямо сейчас
          </h2>
          <p className=" text-sm lg:text-xl mx-auto mt-4 max-w-4xl text-gray-600">
            
            Приветствуем вас на KeyMarket.uz — вашем уникальном партнере в мире недвижимости! Мы не просто продаём квадратные метры — мы создаем пространства для вашей удовлетворенности, комфорта и радости.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-md border border-transparent bg-gray-900 px-8 py-3 font-medium text-white hover:bg-gray-800 sm:w-auto"
          >
            Зарегистрироватся
          </Link>
        </div>
      </section>
      <ProductGrid productsCount={4} api={"iphone"}  link="/mobile/" name="Долгосрочная аренда" />
      <ProductGrid productsCount={4} api={"noutbuki"}  link="/laptops/" name="Недвижемости" />
      <ProductGrid productsCount={4} api={"ipad-series"}  link="/tablets/" name="Отели" />
      <ProductGrid productsCount={4} api={"monobloki"}  link="/desktop/" name="Офисы" />

      <Description />
      <FAQSection />
    </>
  );
};

export default App;
