import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import sha256 from 'js-sha256';
import {PaperAirplaneIcon, RectangleStackIcon} from '@heroicons/react/24/solid'

function getRoomNumber(property, productDetailsDoc, trim = ':') {
    let roomNumber = 0;

    try {
        for (const productDetailsDocItem of productDetailsDoc.querySelectorAll('.css-sfcl1s li')) {
            try {
                const borderElem = productDetailsDocItem.querySelector('p').textContent;
                if (borderElem.split(trim)[0].trim() === property) {
                    roomNumber = parseInt(borderElem.split(trim)[1].trim(), 10);
                    // toast.success(property + " найдено: " + roomNumber);
                    return roomNumber; // Return the roomNumber when found
                }
            } catch (error) {}
        }
    } catch (error) {}

    return roomNumber; // Return 0 if property is not found
}

const findPhoneNumbers = (inputString) => {
    try {
        const phoneRegex = /(\+?\d{2}[-\s]?\d{3,9}[-\s]?\d{2}[-\s]?\d{2}|\d{2}[-\s]?\d{7})/g;
        const matches = inputString.match(phoneRegex);

        if (!matches) {
            return [];
        }

        // Format the matched phone numbers
        const formattedNumbers = matches.map((phoneNumber) => {
            // Remove non-digit characters and add the desired format
            return '+998' + phoneNumber.replace(/\D/g, '').slice(-9);
        });

        return formattedNumbers;
    } catch (error) {
        console.error('Error while trying to find and format phone numbers:', error);
        return [];
    }
};


function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}

function calculateMD5(username, phoneNumber, fullCode = false) {
    const dataToHash = `${username}_${phoneNumber}`;
    const sha256Hash = sha256(dataToHash);
    if(fullCode)return sha256Hash
    else return sha256Hash.substring(0, 8);
}


function App() {
  const [products, setProducts] = useState([]);
  const [console_main, setConsole] = useState("");
  const [loading, setLoading] = useState(0);
  const [token, setToken] = useState('');
  const [prodGet, setProdGet] = useState(false);
  const [smsAccess, setSmsAccess] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [urlSet, setUrlSet] = useState('https://www.olx.uz/nedvizhimost/kvartiry/tashkent/q-85-amir/?currency=UZS');
  const [withTokkenCors, SetWithTokkenCors] = useState(false);
  const [tokkenCors, SetTokkenCors] = useState('f40126826dab5b32acd7284d7294f975aabbd2df');
  

  useEffect(() => {
    // Change body background color when the component mounts
    document.body.style.backgroundColor = 'black';

    // Clean up the style when the component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
  

  const fetchDataAndDisplayResults = async () => {
        setConsole(token) 
        setLoading(0) 
        const productData = [];
      try {
        const response = await axios.get(urlSet);
        const htmlString = response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');


        const fetchProductDetails = async (link) => {
            const productDetailsResponse = await axios.get(`https://www.olx.uz${link}`);
            const productDetailsHtmlString = productDetailsResponse.data;
            const productDetailsDoc = parser.parseFromString(productDetailsHtmlString, 'text/html');
            
            const description = productDetailsDoc.querySelector('[data-cy=ad_description] div').textContent;
            const username = productDetailsDoc.querySelector('[data-testid=user-profile-link] div div h4').textContent;

            const phoneNumbers = findPhoneNumbers(description);
            console.log(phoneNumbers)
            if(phoneNumbers.length == 0) setConsole((prevConsole) => prevConsole + `<br/><span class="text-orange-200 bg-orange-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${phoneNumbers[0]}</span>`);
            else setConsole((prevConsole) => prevConsole + `<br/><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${phoneNumbers[0]}</span>`);
            const phoneNumber = phoneNumbers[0];


            if(withTokkenCors){
                const idElement = productDetailsDoc.querySelector('span.css-12hdxwj');
                const id = parseInt(idElement.textContent.split(':')[1].trim()); 

                let urlOlx = `https://www.olx.uz/api/v1/offers/${id}/limited-phones/`;

                try {
                    if (tokkenCors !== "") {
                        urlOlx = 'https://corsproxy.io/?' + encodeURIComponent(urlOlx);
                    }
                
                    const response = await fetch(urlOlx, {
                        method: 'GET',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${tokkenCors}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setConsole((prevConsole) => prevConsole + `<span class="text-green-200 bg-green-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${findPhoneNumbers(data.data.phones[0])}</span>`);
                    // Handle the response data as needed
                } catch (error) {
                    console.error('Error:', error.message);
                }
            }
            
            const roomNumber = getRoomNumber("Количество комнат", productDetailsDoc);
            const apartmentSize = getRoomNumber("Общая площадь", productDetailsDoc);
            const floor1 = getRoomNumber("Этаж", productDetailsDoc);
            const floor2 = getRoomNumber("Этажность дома", productDetailsDoc);
        

          const images = Array.from(productDetailsDoc.querySelectorAll('.swiper-slide[data-cy=adPhotos-swiperSlide] img')).map(
            (img) => img.getAttribute('src')
          );

          return { description, username, images , roomNumber, apartmentSize, floor1, floor2, phoneNumber};
        };

        for (const productElement of doc.querySelectorAll('.css-1sw7q4x')) {
            const title = productElement.querySelector('h6').textContent;
            const price = productElement.querySelector('.css-10b0gli').textContent.split(' сум')[0].replace(/\s/g, '');;
            const locationDate = productElement.querySelector('.css-veheph').textContent;
            const location = locationDate.split(' - ')[0];
            const imageURL = productElement.querySelector('img').getAttribute('src');
            const isTop = productElement.querySelector('.css-1jh69qu') !== null;
            const link = productElement.querySelector('a.css-rc5s2u').getAttribute('href');
            const locationParts = location.split(', ');
            const region = locationParts[0];
            const district = locationParts[1];

            // https://www.olx.uz/api/v1/offers/48388767/limited-phones/
            
            const { description, username, images , roomNumber, apartmentSize, floor1, floor2, phoneNumber} = await fetchProductDetails(link);

            const product = {
                title,
                price,
                location,
                imageURL,
                isTop,
                link: `https://www.olx.uz${link}`,
                username,
                description,
                images,
                roomNumber,
                apartmentSize,
                floor1, 
                floor2,
                region,
                district,
                phoneNumber,
            };

            setConsole((prevConsole) => prevConsole + `<a  target="_blank" rel="noopener noreferrer" class="text-blue-400" href="${`https://www.olx.uz${link}`}">${title}</a><br/>`);
            setLoading((prevLoading) => prevLoading + (33 / 52));
            productData.push(product);
        }

      } catch (error) {
        setProdGet(true)
        setLoading((33));
        setProducts(productData);
      }
  };

  const consoleRef = useRef();
  useEffect(() => {
    // Scroll to the bottom when the content updates
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [console_main]);  

  const fetchDataTwins = async (isActive, token_tw) => {
        const response = await fetch(`https://api.client.rizomulk.uz/api/v1/post/user/list?limit=12&offset=0&postIsActive=${isActive}&postDraft=false&postRejected=false&postIsArchive=false&postSearchTop=null&postApplication=All&postCarousel=null&filterDate=+&filterPrice=+`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token_tw}`,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data.data;
    
};

  
  const sendSms = async () => {
    // Images upload
    

    for (let index = 0; index < products.length; index++) {
        const loadCou = ((100 - loading) / products.length)
        const product = products[index];
        if(product.phoneNumber){
                try {
                    const response = await axios.post(
                        'https://api.client.rizomulk.uz/api/v1/account/sign-up', 
                        {
                            accountFirstName: product.username,
                            accountLastName: 'Olx',
                            accountPhoneNumber: product.phoneNumber,
                            accountPassword: calculateMD5(product.username, product.phoneNumber),
                        }, 
                        {'Content-Type': 'application/json',},
                    );

                    setConsole((prevConsole) => prevConsole + (`<br/><p class="text-indigo-400" option="${response.data.data}" ><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumbers}</span> Пользователь зарегистрирован!</p>`));

                    try {
                        if (response.statusText == "Created") {
                            try {
                                const globalHeaders = new Headers();
                                globalHeaders.append('Authorization', `Bearer ${Cookies.get('bearer-token')}`);
                                    for (let indexImage = 0; indexImage < product.images.length; indexImage++) {
                                        const product_image = product.images[indexImage];
                                        try {
                                            if(!testMode){
                                                const response = await fetch(product_image);
                                                const blob = await response.blob();
                                                const formData = new FormData();
                                                formData.append('files', blob, 'image.jpg');
                                                const uploadResponse = await fetch('https://api.client.rizomulk.uz/api/v1/minio/upload/files', {
                                                    method: 'POST',
                                                    body: formData,
                                                    headers: globalHeaders,
                                                });
                            
                                                const jsonData = await uploadResponse.json();
                                                if (uploadResponse.status === 200) {
                                                    products[index].images[indexImage] = jsonData.data[0].Name; // Make sure this structure is correct
                                                    console.log(products[index].images[indexImage]);
                                                    setConsole((prevConsole) => prevConsole + `<br/><a class="text-yellow-500"  target="_blank" rel="noopener noreferrer" href="${jsonData.data[0].Link}">${jsonData.data[0].Name}</a>`);
                                                    // setLoading((prevLoading) => prevLoading + (33 / ((products.length *  products[0].images.length))));
                                                } else {
                                                console.error('Error uploading the image to the server');
                                            }}else{
                                                setConsole((prevConsole) => prevConsole + `<br/><a class="text-yellow-500"  target="_blank" rel="noopener noreferrer" href="${product_image}">${product_image}</a>`);
                                                // setLoading((prevLoading) => prevLoading + (33 / ((products.length *  products[0].images.length))));
                                            }
                                        } catch (error) {
                                            console.error('Error during image processing', error);
                                        }
                                }
                                } catch (error) {
                                    console.error('An error occurred', error);
                                }
    
                            try {
                                const apiUrl = 'https://api.client.rizomulk.uz/api/v1/post/create';
                                const config = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${response.data.data}`,
                                },
                                };
                        
                                const postData = {
                                    SubcatalogID: "a931bab8-219b-4d2d-88d5-77fcb24a10f5",
                                    postArea: {
                                    general: products[index].apartmentSize,
                                    kitchen: "0",
                                    rasidential: "0"
                                    },
                                    postContact: {
                                    tel: products[index].phoneNumber
                                    },
                                    postDescription: products[index].description,
                                    postPrice: {
                                    application: {},
                                    total: parseInt(products[index].price.replace(/\D/g, '')), // Remove non-numeric characters
                                    usd: false,
                                    uzs: true
                                    },
                                    postTitle: products[index].title,
                                    postDraft: false,
                                    postDetails: {
                                    contactEmail: "",
                                    username: products[index].username,
                                    roomsize: products[index].roomNumber,
                                    bathroom: ["combined", "separated", "moreThanOne"],
                                    balcony: "balcony",
                                    window: ["yard", "outside"],
                                    housetype: "panel",
                                    floor1: products[index].floor1,
                                    floor2: products[index].floor2,
                                    status: "housingStock",
                                    repair: "requiredRepeir",
                                    dealType: "freeSale",
                                    additional: ["bargainingPossible"],
                                    region_id: 1706,
                                    district_id: 1706200,
                                    addressKv: "dosijsadflaf saf s",
                                    maket: ["neighboring"],
                                    nearby: ["parkGreen"],
                                    facilities: ["telephone", "conditioner"],
                                    typeContact: "owner",
                                    catalog: "apartments"
                                    },
                                    postExtraData: {
                                    floor: products[index].floor1,
                                    floor2: products[index].floor2,
                                    size: products[index].apartmentSize
                                    },
                                    postImage: products[index].images,
                                    postLocation: {
                                    coordinates: {
                                        lat: 39.768193,
                                        lng: 64.4556146
                                    },
                                    ids: {
                                        region_id: 1706,
                                        district_id: 1706200
                                    },
                                    text: {
                                        location: products[index].location,
                                        home: products[index].location,
                                        region: products[index].location,
                                        district: products[index].location
                                    }
                                    },
                                    postApplication: false
                                };
                        
                                console.log(postData)
                        
                                if(!testMode){
                                try {
                                    await axios.post(apiUrl, postData, config);
                                    setConsole((prevConsole) => prevConsole + (`<br/><p class="text-indigo-400">Added new post ${index + 1}</p>`));
                                    // setLoading((prevLoading) => prevLoading + loadCou);
    
                                    if(smsAccess){
                                    try {
                                        // SMS
                                        if (products && product.phoneNumber) {
                                            const body = {
                                                // mobile_phone: "998905391575",
                                                mobile_phone: product.phoneNumber.replace(/\+/g, ''),
                                                message: `Assalomu alaykum, ${product.username}, sizning elonlaringiz rizomulk.uz saytiga joylandi, login: ${product.phoneNumber}, parol: ${calculateMD5(product.username, product.phoneNumber)}`,
                                                from: 4546,
                                            };
                                            
                                            setConsole((prevConsole) => prevConsole + (`<br/><p class="bg-indigo-900 rounded-lg px-5 max-w-sm py-1 mb-2 text-indigo-200 border-dashed border-2 border-indigo-500">${body.message}</p>`));

    
                                            const apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://notify.eskiz.uz/api/message/sms/send');
                                            const config = {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
                                                },
                                            };
                                            const response1 = await axios.post(apiUrl, body, config);
                                            console.log(response1)
                                            setConsole((prevConsole) => prevConsole + (`<p class="text-yellow-300 bg-yellow-900 rounded-lg y-1">${product.phoneNumber} Сообшения успешно отправленно!</p>`));                        
                                            // SMS
                                        }
                                    } catch (error) {
                                        console.error('SMS ERRROR:', error);
                                    }
                                }
    
    
                                } catch (error) {
                                    console.error('POST RESPONSE:', error);
                                }}else{
                                    setConsole((prevConsole) => prevConsole + (`<br/><p class="text-indigo-400">Added new post ${index + 1}</p>`));
                                    // setLoading((prevLoading) => prevLoading + loadCou);
                                }
                                
                            } catch (error) {
                                console.error('Error posting data:', error);
                            }
    
                        }
                    } catch (error) {
                        console.error('Ошибка при отправке запроса: '+ error)
                        setConsole((prevConsole) => prevConsole + (`<p class="text-red-400">Проблема в создания поста</p>`));
                    }
                } catch (error) {
                    try {
                        const response = await axios.post(
                            'https://api.client.rizomulk.uz/api/v1/account/sign-in', 
                            {
                                phoneNumber: product.phoneNumber,
                                password: calculateMD5(product.username, product.phoneNumber),
                            }, 
                            {'Content-Type': 'application/json',},
                        );

    
                        setConsole((prevConsole) => prevConsole + (`</br><p class="text-green-400"><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span>  Успешно зaшли в аккаунт пользователя!</p>`));
                    
                        try {
                            if (response.statusText == "OK") {
                                // console.log(response.data.data)
                                const draft_posts_data_data = await fetchDataTwins(false, response.data.data);
                                const posted_posts_data_data = await fetchDataTwins(true, response.data.data);

                                let twinsAccess = true;

                                if(draft_posts_data_data != null)
                                    for (let index_d = 0; index_d < draft_posts_data_data.length; index_d++) {
                                        if (product.title == draft_posts_data_data[index_d].postTitle) {
                                            twinsAccess = false;
                                            setConsole((prevConsole) => prevConsole + (`</br><p class="text-yellow-400"><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span>  Twins detected</p>`));
                                            break;
                                            
                                        }
                                    }

                                if(posted_posts_data_data != null)
                                    for (let index_p = 0; index_p < posted_posts_data_data.length; index_p++) {
                                        if (product.postTitle == posted_posts_data_data[index_p].postTitle) {
                                            twinsAccess = false;
                                            setConsole((prevConsole) => prevConsole + (`</br><p class="text-yellow-400"><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span>  Twins detected</p>`));
                        
                                            break;
                                        }
                                    }
                                
                                
                                if(twinsAccess){
                                    const globalHeaders = new Headers();
                                    globalHeaders.append('Authorization', `Bearer ${response.data.data}`);
                                    for (let indexImage = 0; indexImage < product.images.length; indexImage++) {
                                        const product_image = product.images[indexImage];
                                        try {
                                            if(!testMode){
                                                const response = await fetch(product_image);
                                                const blob = await response.blob();
                                                const formData = new FormData();
                                                formData.append('files', blob, 'image.jpg');
                                                const uploadResponse = await fetch('https://api.client.rizomulk.uz/api/v1/minio/upload/files', {
                                                    method: 'POST',
                                                    body: formData,
                                                    headers: globalHeaders,
                                                });
                            
                                                const jsonData = await uploadResponse.json();
                                                if (uploadResponse.status === 200) {
                                                    products[index].images[indexImage] = jsonData.data[0].Name; // Make sure this structure is correct
                                                    console.log(products[index].images[indexImage]);
                                                    setConsole((prevConsole) => prevConsole + `<br/><a class="text-yellow-500"  target="_blank" rel="noopener noreferrer" href="${jsonData.data[0].Link}">${jsonData.data[0].Name}</a>`);
                                                    // setLoading((prevLoading) => prevLoading + (33 / ((products.length *  products[0].images.length))));
                                                } else {
                                                console.error('Error uploading the image to the server');
                                            }}else{
                                                setConsole((prevConsole) => prevConsole + `<br/><a class="text-yellow-500"  target="_blank" rel="noopener noreferrer" href="${product_image}">${product_image}</a>`);
                                                // setLoading((prevLoading) => prevLoading + (33 / ((products.length *  products[0].images.length))));
                                            }
                                        } catch (error) {
                                            console.error('Error during image processing', error);
                                        }
                                    }
            
                                    if(!testMode){
                                        const apiUrl = 'https://api.client.rizomulk.uz/api/v1/post/create';
                                        const config = {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${response.data.data}`,
                                        },
                                        };
                                        const postData = {
                                            SubcatalogID: "a931bab8-219b-4d2d-88d5-77fcb24a10f5",
                                            postArea: {
                                            general: products[index].apartmentSize,
                                            kitchen: "0",
                                            rasidential: "0"
                                            },
                                            postContact: {
                                            tel: products[index].phoneNumber
                                            },
                                            postDescription: products[index].description,
                                            postPrice: {
                                            application: {},
                                            total: parseInt(products[index].price.replace(/\D/g, '')), // Remove non-numeric characters
                                            usd: false,
                                            uzs: true
                                            },
                                            postTitle: products[index].title,
                                            postDraft: false,
                                            postDetails: {
                                            contactEmail: "mail@finch.uz",
                                            username: products[index].username,
                                            roomsize: products[index].roomNumber,
                                            bathroom: ["combined", "separated", "moreThanOne"],
                                            balcony: "balcony",
                                            window: ["yard", "outside"],
                                            housetype: "panel",
                                            floor1: products[index].floor1,
                                            floor2: products[index].floor2,
                                            status: "housingStock",
                                            repair: "requiredRepeir",
                                            dealType: "freeSale",
                                            additional: ["bargainingPossible"],
                                            region_id: 1706,
                                            district_id: 1706200,
                                            addressKv: "dosijsadflaf saf s",
                                            maket: ["neighboring"],
                                            nearby: ["parkGreen"],
                                            facilities: ["telephone", "conditioner"],
                                            typeContact: "owner",
                                            catalog: "apartments"
                                            },
                                            postExtraData: {
                                            floor: products[index].floor1,
                                            floor2: products[index].floor2,
                                            size: products[index].apartmentSize
                                            },
                                            postImage: products[index].images,
                                            postLocation: {
                                            coordinates: {
                                                lat: 39.768193,
                                                lng: 64.4556146
                                            },
                                            ids: {
                                                region_id: 1706,
                                                district_id: 1706200
                                            },
                                            text: {
                                                location: products[index].location,
                                                home: products[index].location,
                                                region: products[index].location,
                                                district: products[index].location
                                            }
                                            },
                                            postApplication: false
                                        };
                                
                                        try {
                                            await axios.post(apiUrl, postData, config);
                                            setConsole((prevConsole) => prevConsole + (`<br/><p class="text-indigo-400">Added new post ${index + 1}</p>`));
                                            // setLoading((prevLoading) => prevLoading + loadCou);

                                            if(smsAccess){
                                            try {
                                                // SMS
                                                if (products && product.phoneNumber) {
                                                    const body = {
                                                        // mobile_phone: "998905391575",
                                                        mobile_phone: product.phoneNumber.replace(/\+/g, ''),
                                                        message: `Assalomu alaykum, ${product.username}, sizning elonlaringiz rizomulk.uz saytiga joylandi, login: ${product.phoneNumber}, parol: ${calculateMD5(product.username, product.phoneNumber)}`,
                                                        from: 4546,
                                                    };
                                                    
                                                    setConsole((prevConsole) => prevConsole + (`<br/><p class="bg-indigo-900 rounded-lg px-5 max-w-sm py-1 mb-2 text-indigo-200 border-dashed border-2 border-indigo-500">${body.message}</p>`));

            
                                                        const apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://notify.eskiz.uz/api/message/sms/send');
                                                    const config = {
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
                                                        },
                                                    };
                                                    const response1 = await axios.post(apiUrl, body, config);
                                                    console.log(response1)
                                                    setConsole((prevConsole) => prevConsole + (`<p class="text-yellow-300 rounded-lg y-1"><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${body.mobile_phone}</span> Сообшения успешно отправленно!</p>`));                        
                                                    // SMS
                                                }
                                            } catch (error) {
                                                console.error('SMS ERRROR:', error);
                                            }}
            
            
                                        } catch (error) {
                                            setConsole((prevConsole) => prevConsole + (`<p class="text-red-400">Ошыбка при добавления продукта!</p>`));
                                        }
                                    }else{
                                        setConsole((prevConsole) => prevConsole + (`<br/><p class="text-indigo-400">Added new post ${index + 1}</p>`));
                                        // setLoading((prevLoading) => prevLoading + loadCou);
                                    }
                                }
        
                            }
                        } catch (error) {
                            console.error('Ошибка при отправке запроса: '+ error)
                            setConsole((prevConsole) => prevConsole + (`<p class="text-red-400">Проблема в создания поста</p>`));
                        }
                    } catch (error) {
                        try {
                            const response = await axios.post(
                                'https://api.client.rizomulk.uz/api/v1/account/sign-in', 
                                {
                                    phoneNumber: product.phoneNumber,
                                    password: calculateMD5(product.username, product.phoneNumber, true),
                                }, 
                                {'Content-Type': 'application/json',},
                            );
        
                            setConsole((prevConsole) => prevConsole + (`</br><p class="text-orange-400">${product.phoneNumber} Старый тип пороля!</p>`));

                            if(smsAccess){
                                try {
                                    // SMS
                                    if (products && product.phoneNumber) {
                                        const body = {
                                            // mobile_phone: "998905391575",
                                            mobile_phone: product.phoneNumber.replace(/\+/g, ''),
                                            message: `Assalomu alaykum, ${product.username}, sizning elonlaringiz rizomulk.uz saytiga joylandi, login: ${product.phoneNumber}, parol: ${calculateMD5(product.username, product.phoneNumber, true)}`,
                                            from: 4546,
                                        };
                                        
                                        setConsole((prevConsole) => prevConsole + (`<br/><p class="bg-indigo-900 rounded-lg px-5 max-w-sm py-1 mb-2 text-indigo-200 border-dashed border-2 border-indigo-500">${body.message}</p>`));


                                        const apiUrl = 'https://cors-anywhere.herokuapp.com/http://notify.eskiz.uz/api/message/sms/send';
                                        const config = {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
                                            },
                                        };
                                        const response1 = await axios.post(apiUrl, body, config);
                                        console.log(response1)
                                        setConsole((prevConsole) => prevConsole + (`<p class="text-yellow-300 bg-yellow-900 rounded-lg y-1"><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span>  Сообшения успешно отправленно!</p>`));                        
                                        // SMS
                                    }
                                } catch (error) {
                                    console.error('SMS ERRROR:', error);
                            }}
                        } catch (error) {
                            setConsole((prevConsole) => prevConsole + (`</br><p class="text-red-500 "><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span>  Не можем зайти в аккаунт пользователя!</p>`));
                            // setLoading((prevLoading) => prevLoading + loadCou);
                        }
                        
                    }
                }


                
        }
        setLoading((prevLoading) => prevLoading + loadCou);
    }



    
  };


    return (
        <>
        <div className="max-w-7xl mx-auto mt-8">
        <div className="relative max-w-7xl mx-auto pt-1 rounded-lg ">
            <div className="flex h-4 mb-4 overflow-hidden rounded-lg text-xs bg-gray-800/50">
            <div style={{ width: `${loading}%` }} className="ease-in duration-300 rounded-lg flex flex-col justify-center text-center bg-green-400 shadow-none whitespace-nowrap"></div>
            </div>
        </div>

        <input className='relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none p-4 text-gray-200'
            value={urlSet}
            onChange={(e)=> setUrlSet(e.target.value)}
            placeholder='Parse Url≈'/>

        <div className='snap-center flex p-4 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input 
                type='checkbox' 
                checked={withTokkenCors}
                onChange={(e) => SetWithTokkenCors(e.target.checked)}
                className='h-6 w-6 mr-2 form-checkbox text-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50'
            />
            <input className='relative focus:outline-none bg-transparent w-full text-gray-200'
            value={tokkenCors}
            onChange={(e)=> SetTokkenCors(e.target.value)}
            placeholder='Parse Url'/>
        </div>

        <div className='snap-center flex p-4 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input 
                type='checkbox' 
                checked={smsAccess}
                onChange={(e) => setSmsAccess(e.target.checked)}
                className='h-6 w-6 mr-2 form-checkbox text-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50'
            />
            Высылать уведомления через СМС
        </div>


        <div className='snap-center flex p-4 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input
                type='checkbox'
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className='h-6 w-6 mr-2 form-checkbox text-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50'
            />
            Тестовый режим
        </div>

        </div>
        
        
        <div className=" relative max-w-7xl mx-auto">
            <div className="coding inverse-toggle my-5 px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800/50 pb-6  rounded-lg leading-normal">
                <div className="top mb-2 flex">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div className="ml-2 h-3 w-3 bg-orange-500 rounded-full"></div>
                <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div style={{ maxHeight: '28rem' }} className="mt-4 flex overflow-y-auto ease-in duration-300" ref={consoleRef}>
                <span className="text-green-400">Libert:~$</span>
                <p className="flex-1 typing items-center pl-2">
                    <div dangerouslySetInnerHTML={{ __html: console_main }} />
                    <br />
                </p>
                </div>
                {prodGet ? (
                <div  onClick={sendSms} className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                hover:bg-green-500/90 bg-green-500 text-gray-900 flex'>
                    <PaperAirplaneIcon width={20} height={20} className='mr-1'/>
                    Push</div>
                ): 
                urlSet != '' && (
                <div onClick={fetchDataAndDisplayResults}
                className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                hover:bg-orange-500/90 bg-orange-500 text-gray-900 flex'>
                    <RectangleStackIcon width={20} height={20} className='mr-1'/>
                    Parsing
                    </div>
                )
            }
            </div>
        </div>


        </>
    );
}

export default App;
