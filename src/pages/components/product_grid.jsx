import React, { useState, useEffect } from 'react';
import ProductCart from './product_cart.jsx';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
  }

const ProductItem = ({ productsCount, api , link, name}) => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.client.rizomulk.uz/api/v1/post/special-list?postType=rent&limit=" + productsCount + "&offset=12&filterDate=+&filterPrice=+", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  

return (
  <>
<div className="bg-gray-100">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
          {name && (
            <div className="pt-7 pb-5 sm:pt-7">
            <div className="flex justify-between space-x-4 items-center">
              <h2 className={classNames("text-3xl font-medium text-gray-900")}>{name}</h2>
              {link && (<Link to={link}
              className={classNames("cursor-pointer whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900")}>
                View all
                <span aria-hidden="true"> &rarr;</span>
              </Link>
              )}
            </div>
          </div>
          )}
            <h2 className="sr-only">Products</h2>

            <div id="content-container" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {data ? data.data.map((item, index) => index < productsCount && (
                <>
                  <ProductCart item={item}/>
                  {console.log(item)}
                </>
              )):
                [0 ,1, 2, 3, 4, 5, 6, 7].map(() => (
                  <div className="group h-96 animate-pulse bg-gray-100 rounded-lg">
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>

);
};

export default ProductItem;
// Используйте ProductItem в вашем компоненте, где вы рендерите список продуктов
