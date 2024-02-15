import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import sha256 from "js-sha256";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

function calculateMD5(username, phoneNumber, fullCode = false) {
  const dataToHash = `${username}_${phoneNumber}`;
  const sha256Hash = sha256(dataToHash);
  if (fullCode) return sha256Hash;
  else return sha256Hash.substring(0, 8);
}

function App() {
  const [products, setProducts] = useState([]);
  const [smsInfo, setSmsInfo] = useState([]);
  const [pass, setPass] = useState('Ravshan2205@');
  const [login, setLogin] = useState('+998770707390');

  const signInUser = async (phoneNumber, password) => {
    try {
      const response = await axios.post(
        "https://api.client.rizomulk.uz/api/v1/account/sign-up",
        {
          accountFirstName: phoneNumber,
          accountLastName: "",
          accountPhoneNumber: phoneNumber,
          accountPassword: password,
        },
        { "Content-Type": "application/json" }
      );

      return response.data.data;
    } catch (error) {
        return null;
    }
    // alert("stop");
  };

  const signUpUser = async (phoneNumber, password) => {
    try {
      const response = await axios.post(
        "https://api.client.rizomulk.uz/api/v1/account/sign-in",
        {
          phoneNumber: phoneNumber,
          password: password,
        },
        { "Content-Type": "application/json" }
      );

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error during user sign-up:", error);
      return null;
    }
  };

  const getProducts = async (authToken) => {
    const productsList = [];

    for (let index = 0; index <= 10; index++) {
      const offset = index * 1000; // Используйте разные значения offset для каждого запроса
      const response = await fetch(
        `https://api.client.rizomulk.uz/api/v1/post/user/list?limit=1000&offset=${offset}&postIsActive=true&postDraft=false&postRejected=false&postIsArchive=true&postSearchTop=null&postApplication=All&postCarousel=null&filterDate=+&filterPrice=+`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data.data);
      productsList.push(data.data);
    }

    return productsList;
  };

  const uploadImages = async (product, authToken) => {
    const globalHeaders = new Headers();
    globalHeaders.append("Authorization", `Bearer ${authToken}`);

    if (product.postImage) {
      for (
        let indexImage = 0;
        indexImage < product.postImage.length;
        indexImage++
      ) {
        const product_image = product.postImage[indexImage];
        try {
          const response = await fetch(product_image);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append("files", blob, "image.jpg");

          const uploadResponse = await fetch(
            "https://api.client.rizomulk.uz/api/v1/minio/upload/files",
            {
              method: "POST",
              body: formData,
              headers: globalHeaders,
            }
          );

          const jsonData = await uploadResponse.json();
          if (uploadResponse.status === 200) {
            product.postImage[indexImage] = jsonData.data[0].Name;
          }
        } catch (error) {
          console.error("Error during image processing", error);
        }
      }
    }
  };

  const createPost = async (product, authToken) => {
    try {
      const apiUrl = "https://api.client.rizomulk.uz/api/v1/post/create";
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };

      let productEdit = product;
      productEdit.postContact.tel = productEdit.postContact.extraTel
      productEdit.postContact.extraTel = null


      await axios.post(apiUrl, product, config);

      if (true) {
        setSmsInfo((prevSmsInfo) => [
          ...prevSmsInfo,
          [productEdit.postContact.tel, product.postId],
        ]);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const sendSms = async () => {
    const authToken = await signUpUser(login, pass);
    console.log(authToken);
    if (authToken) {
      const products = await getProducts(authToken);

      for (const productList of products) {
        for (const product of productList) {
          console.log(product);
          const authTokenInter = await signInUser(
            product.postContact.extraTel,
            calculateMD5(product.postContact.extraTel + "muxa1575")
          );
          if (authTokenInter) {
            await uploadImages(product, authTokenInter);
            await createPost(product, authTokenInter);
          }
          // break;
        }
        // break;
      }
    }
  };

  const sendSmsFinish = async () => {
    for (const sms of smsInfo) {
      try {
        const body = {
          // mobile_phone: "+998905391575",
          mobile_phone: sms[0].replace(/\+/g, ""),
          message: `Теперь продать недвижимость стало проще. Ваш логин: ${
            sms[0]
          }; Пароль: ${calculateMD5(sms[0] + "muxa1575")}. Вава недвижимость доступна здесь: https://rizomulk.uz/detail/${sms[1]}/`,
          from: 4546,
        };

        const apiUrl =
          "https://corsproxy.io/?" +
          encodeURIComponent("http://notify.eskiz.uz/api/message/sms/send");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
          },
        };

        const response = await axios.post(apiUrl, body, config);

        console.log(response);
      } catch (error) {
        console.error("SMS ERROR:", error);
      }
    }
    // alert("FINISH!!!")
  };

  return (
    <div>
      <input 
          type='text' 
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className='relative focus:outline-none ml-3 mr-1 my-3 py-1 px-2 rounded-lg bg-pink-800 text-white'
        />
        <input 
          type='text' 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className='relative focus:outline-none mx-1 my-3 py-1 px-2 rounded-lg bg-pink-800 text-white'
        />
      <button
        onClick={sendSms}
        className="mx-1 my-3 py-1 px-2 rounded-lg bg-pink-800 text-white"
      >
        Start
      </button>
      <button
        onClick={sendSmsFinish}
        className="mx-1 my-3 py-1 px-2 rounded-lg bg-pink-800 text-white"
      >
        Send Sms
      </button>
      <div className="m-3 mt-0 py-1 px-2 rounded-lg bg-pink-800 text-white">
        <div>Кол.во пользователей: {smsInfo.length} </div>
        <div>Кол.во сообшении: {smsInfo.length * 3} </div>
        <div>Стоимость: {smsInfo.length * 3 * 50} </div>
      </div>
    </div>
  );
}

export default App;
