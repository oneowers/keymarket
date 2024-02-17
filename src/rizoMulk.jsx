import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import sha256 from "js-sha256";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

function calculateMD5(username, phoneNumber, fullCode = false) {
  const dataToHash = `${username}_${phoneNumber}`;
  const sha256Hash = sha256(dataToHash);
  if (fullCode) return sha256Hash;
  else return sha256Hash.substring(0, 8);
}

function App() {
  const [products, setProducts] = useState([]);
  const [smsInfo, setSmsInfo] = useState([{
    "to": "998905472797",
    "text": "Ассалом алайкум Хадича Улугохунова, сизни Мирзо-Улуғбек таъмир ишлари бўйича бош бошқарув бўлими ваенкоматига зўрлик белгилаб сизни таклиф қилмоқдир. Илтимос, 18-февраль кунга келинг. чиппи, чиппи, чапа, чапа. Талаблар: паспорт, ҳарбий ҳужжат, резюме."
  }]);
  const [pass, setPass] = useState("Ravshan2205@");
  const [login, setLogin] = useState("+998770707390");

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
      return await signUpUser(phoneNumber, password);
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

    console.log(productsList)
    return productsList;
  };

  const getActiveProducts = async (authToken, product) => {
    const response = await fetch(
      `https://api.client.rizomulk.uz/api/v1/post/user/list?limit=12&offset=0&postIsActive=true&postDraft=false&postRejected=false&postIsArchive=false&postSearchTop=null&postApplication=All&postCarousel=null&filterDate=+&filterPrice=+`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    const productsActive = await response.json();
    console.log(productsActive.data);
  
    if (productsActive.data != null) {
      const matchingProduct = productsActive.data.find(
        (productActive) => productActive.postTitle === product.postTitle
      );
  
      if (matchingProduct) {
        console.log(matchingProduct.postTitle);
        console.log(product.postTitle);
        // toast.error(matchingProduct.postId);
        return matchingProduct.postId;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  

  const getFullInfoFromProductId = async (productId, authToken) => {
    try {
      const response = await axios.get(
        `https://api.client.rizomulk.uz/api/v1/post/user/get?id=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // console.log(response.data.data)
        return response.data.data;
      }
    } catch (error) {
      return null;
    }
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

  const createPost = async (productPublic, authToken) => {
    // try {
      if(productPublic.postImage == null) return;
    const product = await getFullInfoFromProductId(
      productPublic.postId,
      authToken
    );
    console.log(product);

    const apiUrl = "https://api.client.rizomulk.uz/api/v1/post/create";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    let productEdit = {
      SubcatalogID: product.postSubcatalogId,
      postArea: {
        general: product.postArea.general,
      },
      postContact: {
        tel: product.postContact.extraTel,
        extraTel: product.postContact.extraTel,
      },
      postDescription: product.postDescription,
      postPrice: {
        application: product.postPrice.application,
        total: product.postPrice.total,
        usd: product.postPrice.usd,
        uzs: product.postPrice.uzs,
      },
      postTitle: product.postTitle,
      postDraft: false,
      postDetails: {
        contactEmail: product.postDetails.contactEmail,
        username: product.postDetails.username,
        roomsize: product.postDetails.roomsize,
        bathroom: product.postDetails.bathroom,
        balcony: product.postDetails.balcony,
        window: product.postDetails.window,
        housetype: product.postDetails.catalog,
        floor1: product.postDetails.floor1,
        floor2: product.postDetails.floor2,
        status: product.postDetails.status,
        repair: product.postDetails.repair,
        dealType: product.postDetails.dealType,
        additional: product.postDetails.statusAdditional,
        region_id: product.postDetails.region_id,
        district_id: product.postDetails.district_id,
        addressKv: product.postDetails.addressKv,
        additionalRules: product.postDetails.additionalRules,
        additionalBenefits: product.postDetails.additionalBenefits,
        infrastructure: product.postDetails.nearby,
        food: product.postDetails.food,
        statusAdditional: product.postDetails.statusAdditional,
        facilities: product.postDetails.window,
        typeContact: product.postDetails.typeContact,
        catalog: product.postDetails.catalog,
      },
      postExtraData: {
        floor: product.postDetails.floor2,
        floor2: product.postDetails.floor2,
        size: product.postDetails.roomsize,
      },
      postImage: productPublic.postImage,
      postLocation: {
        coordinates: product.postLocation.coordinates,
        ids: product.postLocation.ids,
        text: product.postLocation.text,
      },
      postApplication: product.postApplication,
    };

    console.log(productEdit);

    await axios.post(apiUrl, productEdit, config);

    if (true) {
      setSmsInfo((prevSmsInfo) => [
        ...prevSmsInfo,
        {
          "to": productEdit.postContact.tel.replace(/\+/g, ""),
          "text":`Теперь продать недвижимость стало проще. Ваш логин: ${
            productEdit.postContact.tel
          }; Пароль: ${calculateMD5(
            productEdit.postContact.tel + "muxa1575"
          )}. Вава недвижимость доступна здесь: https://rizomulk.uz/detail/${
            product.postId
          }`,
        },
      ]);
    }
    // } catch (error) {
    //   console.error("Error posting data:", error);
    // }
  };

  const updatePost = async (productPublic, authToken, twinsProductId) => {
    // try {
    if(productPublic.postImage == null) return;
    const product = await getFullInfoFromProductId(
      productPublic.postId,
      authToken
    );
    console.log(product);

    const apiUrl = "https://api.client.rizomulk.uz/api/v1/post/update";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    let productEdit = {
      SubcatalogID: product.postSubcatalogId,
      postArea: {
        general: product.postArea.general,
      },
      postContact: {
        tel: product.postContact.extraTel,
        extraTel: product.postContact.extraTel,
      },
      postDescription: product.postDescription,
      postPrice: {
        application: product.postPrice.application,
        total: product.postPrice.total,
        usd: product.postPrice.usd,
        uzs: product.postPrice.uzs,
      },
      postTitle: product.postTitle,
      postDraft: false,
      postDetails: {
        contactEmail: product.postDetails.contactEmail,
        username: product.postDetails.username,
        roomsize: product.postDetails.roomsize,
        bathroom: product.postDetails.bathroom,
        balcony: product.postDetails.balcony,
        window: product.postDetails.window,
        housetype: product.postDetails.catalog,
        floor1: product.postDetails.floor1,
        floor2: product.postDetails.floor2,
        status: product.postDetails.status,
        repair: product.postDetails.repair,
        dealType: product.postDetails.dealType,
        additional: product.postDetails.statusAdditional,
        region_id: product.postDetails.region_id,
        district_id: product.postDetails.district_id,
        addressKv: product.postDetails.addressKv,
        additionalRules: product.postDetails.additionalRules,
        additionalBenefits: product.postDetails.additionalBenefits,
        infrastructure: product.postDetails.nearby,
        food: product.postDetails.food,
        statusAdditional: product.postDetails.statusAdditional,
        facilities: product.postDetails.window,
        typeContact: product.postDetails.typeContact,
        catalog: product.postDetails.catalog,
      },
      postExtraData: {
        floor: product.postDetails.floor2,
        floor2: product.postDetails.floor2,
        size: product.postDetails.roomsize,
      },
      postImage: productPublic.postImage,
      postLocation: {
        coordinates: product.postLocation.coordinates,
        ids: product.postLocation.ids,
        text: product.postLocation.text,
      },
      postApplication: product.postApplication,
      postId: twinsProductId
    };

    console.log(productEdit);

    await axios.put(apiUrl, productEdit, config);
  };

  const sendSms = async () => {
    const authToken = await signUpUser(login, pass);
    console.log(authToken);
    if (authToken) {
      const products = await getProducts(authToken);
  
      for (const productList of products) {
        for (const product of productList) {
          try { 
          const authTokenInter = await signInUser(
            product.postContact.extraTel,
            calculateMD5(product.postContact.extraTel + "muxa1575")
          );
          if (authTokenInter) {
            const twinsProductId = await getActiveProducts(authTokenInter, product);
            console.log(twinsProductId);
  
            if (twinsProductId !== null && twinsProductId !== undefined) {
              toast.success("UPDATE: " + twinsProductId);
              // Uncomment the following lines when ready to implement
              await uploadImages(product, authTokenInter);
              await updatePost(product, authTokenInter, twinsProductId);
            } else {
              toast.success("CREATE");
              // Uncomment the following lines when ready to implement
              await uploadImages(product, authTokenInter);
              await createPost(product, authTokenInter, twinsProductId);
            }
          }
        } catch (error) {
          console.error("Error during image processing", error);
        }
        }
      }
    }
  };
  

  const sendSmsFinish = async () => {
    console.log(smsInfo)
    try {
      const maxMessagesPerBatch = 200;
      const smsBatches = [];
  
      // Split smsInfo into batches
      for (let i = 0; i < smsInfo.length; i += maxMessagesPerBatch) {
        const batch = smsInfo.slice(i, i + maxMessagesPerBatch);
        smsBatches.push(batch);
      }
  
      // Send each batch
      for (const batch of smsBatches) {
        const body = {
          "messages": batch,
          "from": "4546",
          "dispatch_id": 0
        };
  
        const apiUrl = "https://corsproxy.io/?" + encodeURIComponent("http://notify.eskiz.uz/api/message/sms/send-batch");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
          },
        };
  
        const response = await axios.post(apiUrl, body, config);
  
        console.log(response);
      }
    } catch (error) {
      console.error("SMS ERROR:", error);
    }
  };
  

  return (
    <div>
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        className="relative focus:outline-none ml-3 mr-1 my-3 py-1 px-2 rounded-lg bg-pink-800 text-white"
      />
      <input
        type="text"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="relative focus:outline-none mx-1 my-3 py-1 px-2 rounded-lg bg-pink-800 text-white"
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
