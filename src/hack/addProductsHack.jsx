import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Logo from '../pages/himarket.png';
import { Link, useNavigate } from 'react-router-dom';

const YourComponent = () => {
  const [response, setResponse] = useState(null);
  const [repeatCount, setRepeatCount] = useState(1); // Добавили state для хранения числа повторений
  const [data, SetData] = useState([])

  const handleButtonClick = async () => {
    try {

      // URL, куда вы хотите отправить POST-запрос
      const apiUrl = `https://api.client.rizomulk.uz/api/v1/post/special-list?postType=rent&limit=${repeatCount}&offset=12&filterDate=+&filterPrice=+`;

      // Опции запроса, включая Bearer Token Authorization
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

        const response = await axios.get(apiUrl, config);
    
        // Обработка успешного ответа
        SetData(response.data);
        toast.success(`Посты получены`);
      
    } catch (error) {
      // Обработка ошибок
      toast.error('Ошибка при отправке запроса!');
    }

    try {
        // Ваш Bearer Token
        const token = Cookies.get('bearer-token');
  
        // URL, куда вы хотите отправить POST-запрос
        const apiUrl = 'https://api.client.rizomulk.uz/api/v1/post/create';
  
        
  
        // Опции запроса, включая Bearer Token Authorization
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        };
  
        // Цикл for для повторения запросов в соответствии с введенным числом
        for (let index = 0; index < repeatCount; index++) {
          // Отправка POST-запроса
          // Данные, которые вы хотите отправить
            const postData = data.data[index]
            postData.postContact.tel = "+998905391575"
            postData.postPrice.total = postData.postPrice.total + ((postData.postPrice.total / 100) * 10)

          const response = await axios.post(apiUrl, postData, config);
  
          // Обработка успешного ответа
          setResponse(response.data);
          toast.success(`Добавлен новый пост ${index + 1}`);
        }
      } catch (error) {
        // Обработка ошибок
        toast.error('Ошибка при отправке запроса!');
      }
  };

  const handleInputChange = (event) => {
    // Обновление значения числа повторений при изменении в инпуте
    setRepeatCount(parseInt(event.target.value, 10));
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Link to="/" className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <p className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
          <a className="text-gray-900">Войдите</a> и начните <br /><a className="text-gray-900">покупкать</a>
        </p>
      </Link>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 sm:shadow shadow-none sm:rounded-lg sm:px-12">
        <div>

      <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
            Введите число повторений:
            </label>
            <div className="mt-2">
                <input id="username" name="username" type="text"
                    required
                    value={repeatCount}
                    onChange={handleInputChange} 
                    className=" block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
            </div>
        </div>

      <button className=' mt-5 bg-indigo-900 w-full p-4 rounded-lg text-middle text-white' onClick={handleButtonClick}>Отправить POST-запрос</button>
        
            </div>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
