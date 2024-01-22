import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const YourComponent = () => {
  const [response, setResponse] = useState(null);

  const handleButtonClick = async () => {
    try {
      // Ваш Bearer Token
      const token = Cookies.get('bearer-token');;

      // URL, куда вы хотите отправить POST-запрос
      const apiUrl = 'ВАШ_URL';

      // Данные, которые вы хотите отправить
      const postData = {
        // Ваши данные
      };

      // Опции запроса, включая Bearer Token Authorization
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      // Отправка POST-запроса
      const response = await axios.post(apiUrl, postData, config);

      // Обработка успешного ответа
      setResponse(response.data);
    } catch (error) {
      // Обработка ошибок
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Отправить POST-запрос</button>
      {response && <p>Ответ сервера: {JSON.stringify(response)}</p>}
    </div>
  );
};

export default YourComponent;
