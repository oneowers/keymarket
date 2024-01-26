import React, { useState } from 'react';
import Cookies from 'js-cookie';

const ImageUploader = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleUpload = async () => {
    try {
      // Скачиваем изображение из URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Создаем объект FormData и добавляем изображение как файл
      const formData = new FormData();
      formData.append('files', blob, 'image.jpg');

      // Добавляем заголовок 'Authorization' с токеном из куки
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${Cookies.get('bearer-token')}`);

      // Отправляем запрос на сервер с заголовками
      const uploadResponse = await fetch('https://api.client.rizomulk.uz/api/v1/minio/upload/files', {
        method: 'POST',
        body: formData,
        headers: headers,
      });

      // Обработка ответа сервера
      if (uploadResponse.ok) {
        console.log('Изображение успешно загружено на сервер');
      } else {
        console.error('Ошибка при загрузке изображения на сервер');
      }
    } catch (error) {
      console.error('Произошла ошибка', error);
    }
  };

  return (
    <div>
      <label>
        Введите URL изображения:
        <input type="text" value={imageUrl} onChange={handleUrlChange} />
      </label>
      <button onClick={handleUpload}>Загрузить изображение</button>
    </div>
  );
};

export default ImageUploader;
