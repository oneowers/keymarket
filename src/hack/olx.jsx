import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import sha256 from 'js-sha256';
import {PaperAirplaneIcon, RectangleStackIcon, ChevronDownIcon, ChevronDoubleRightIcon} from '@heroicons/react/24/solid'
import { RadioGroup } from '@headlessui/react'
import { useParams } from "react-router-dom";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
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
    const [console_main, setConsole] = useState("");
    const [loading, setLoading] = useState(0);
    const [token, setToken] = useState('');
    const [prodGet, setProdGet] = useState(false);
    const [smsAccess, setSmsAccess] = useState(true);
    const [testMode, setTestMode] = useState(false);
    const [fetchAllPages, setFetchAllPages] = useState(true);
    const [urlSet, setUrlSet] = useState('');
    const [withTokkenCors, setWithTokkenCors] = useState(true);
    const [tokkenCors, setTokkenCors] = useState('');
    const [mem, setMem] = useState([]);
    const [mem1, setMem1] = useState([]);
    const [selectedOption, setSelectedOption] = useState('abb4e19f-575d-43c0-a53e-04e68ea8dcc2');
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [categoryFetch, setCategoryFetch] = useState("kommercheskie-pomeshcheniya");
    const { index: index_Param } = useParams();
    
    

    


    useEffect(() => {
        // Load the saved values from cookies when the component mounts
        const savedWithTokkenCors = localStorage.getItem('withTokkenCors');
        const savedTokkenCors = localStorage.getItem('tokkenCors');
    
        if (savedWithTokkenCors !== null) {
          setWithTokkenCors(JSON.parse(savedWithTokkenCors));
        }
    
        if (savedTokkenCors !== null) {
          setTokkenCors(savedTokkenCors);
        }
      }, []);
    
      const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setWithTokkenCors(isChecked);
    
        // Save the checkbox state in a cookie
        localStorage.setItem('withTokkenCors', JSON.stringify(isChecked));
      };
    
      const handleInputTextChange = (e) => {
        const inputValue = e.target.value;
        setTokkenCors(inputValue);
    
        // Save the input text in a cookie
        localStorage.setItem('tokkenCors', inputValue);
      }

    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await fetch("https://api.admin.rizomulk.uz/api/v1/admin/subcatalog/all-category-list", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });

        const jsonData = await response.json();

        const categories = jsonData.data.flatMap(ParentCategory =>
            ParentCategory.sub_catalog_list.map(ChildCategory => ({
            parent: ParentCategory.name,
            name: ChildCategory.name,
            id: ChildCategory.id, // Change 'url' to 'id' for consistency
            }))
        );
        setMem(categories);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };



    fetchData();
    }, []); // Ensure that this useEffect runs only once on component mount



    const GetCat = async () => {
        const fetchData = async () => {
        try {
            const response = await fetch("https://corsproxy.io/?https://www.olx.uz/api/v1/offers/metadata/search/?offset=0&limit=40&category_id=1&filter_refiners=&facets=%5B%7B%22field%22%3A%22region%22%2C%22fetchLabel%22%3Atrue%2C%22fetchUrl%22%3Atrue%2C%22limit%22%3A30%7D%5D", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('tokkenCors')}`
            },
            });
    
            const jsonData = await response.json();
    
            const categories1 = await Promise.all(jsonData.data.facets.region.map(async (parentCategory) => {
            try {
                const response1 = await fetch(`https://corsproxy.io/?https://www.olx.uz/api/v1/geo-encoder/regions/${parentCategory.id}/cities/?limit=300`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('tokkenCors')}`
                },
                });
    
                const childData = await response1.json();
    
                const childCategories = await Promise.all(childData.data.map(async (getDistrict) => {
                try {
                    if (getDistrict.has_districts) {
                    const response2 = await fetch(`https://corsproxy.io/?https://www.olx.uz/api/v1/geo-encoder/cities/${getDistrict.id}/districts/`, {
                        method: "GET",
                        headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem('tokkenCors')}`
                        },
                    });
    
                    const districts_data = await response2.json();
    

                    return districts_data.data.map(district_data => ({
                        category_id: 1,
                        region_data: parentCategory,
                        city_data: getDistrict,
                        district_data: district_data,
                        url: `https://www.olx.uz/nedvizhimost/${categoryFetch}/${getDistrict.normalized_name}/?search%5Bdistrict_id%5D=${district_data.id}&currency=UZS`
                    }));
                    } else {
                    setConsole((prevConsole) => prevConsole + (`</br><p class="text-teal-400">https://www.olx.uz/nedvizhimost/${categoryFetch}/${getDistrict.normalized_name}/?currency=UZS</p>`));

                    return {
                        category_id: 1,
                        region_data: parentCategory,
                        city_data: getDistrict,
                        district_data: [],
                        url: `https://www.olx.uz/nedvizhimost/${categoryFetch}/${getDistrict.normalized_name}/?currency=UZS`
                    };
                    }
    
                } catch (error) {
                    setConsole((prevConsole) => prevConsole + (`</br><p class="text-teal-400">hhttps://www.olx.uz/nedvizhimost/${categoryFetch}/${getDistrict.normalized_name}/?currency=UZS</p>`));
                    toast.error('getDistrict categories olx error');
                    return {
                        category_id: 1,
                        region_data: parentCategory,
                        city_data: getDistrict,
                        district_data: [],
                        url: `https://www.olx.uz/nedvizhimost/${categoryFetch}/${getDistrict.normalized_name}/?currency=UZS`
                    };
                }
                }));
    
                return childCategories.flat(); // Flatten the array of arrays
    
            } catch (error) {
                toast.error('Child categories olx error');
                return null;
            }
            }));
    
            const flattenedCategories = categories1.flat(); // Flatten the array of arrays
            setMem1(flattenedCategories);
    
        } catch (error) {
            toast.error('Parent categories olx error');
        }
        };
    
        fetchData();
    }


    useEffect(() => {
    // Change body background color when the component mounts
    document.body.style.backgroundColor = 'black';

    // Clean up the style when the component unmounts
    return () => {
        document.body.style.backgroundColor = '';
    };
    }, []);
  
    const consoleRef = useRef();
    useEffect(() => {
        // Scroll to the bottom when the content updates
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }, [console_main]);  


    const fetchDataAndDisplayResults = async () => {
        setConsole((prevConsole) => prevConsole + '<p class="text-green-400">Start parsing...</p><br/>');
        setLoading(0);

        toast.success(`let i = ${(index_Param * 50) - 50}; i < ${(mem1.length > (parseInt(index_Param, 10))*50 ? parseInt(index_Param, 10)*50 : mem1.length)}`)
          
        for (let i = (index_Param * 50) - 50; i < (mem1.length > (parseInt(index_Param, 10))*50 ? parseInt(index_Param, 10)*50 : mem1.length); i++) {
            const mem1Child = mem1[i];
            for (let index_pages = 1; index_pages < (fetchAllPages ? 25 : 2); index_pages++) {
              try {
                const response = await axios.get("" + mem1Child.url + (fetchAllPages ? `&page=${index_pages}` : ''));
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
                    if(phoneNumbers.length == 0) setConsole((prevConsole) => prevConsole + `<br/><span class="text-orange-200 bg-orange-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${phoneNumbers[0]}</span>`);
                    else setConsole((prevConsole) => prevConsole + `<br/><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${phoneNumbers[0]}</span>`);
                    const phoneNumber = phoneNumbers[0];


                    // if(withTokkenCors){
                    //     const idElement = productDetailsDoc.querySelector('span.css-12hdxwj');
                    //     const id = parseInt(idElement.textContent.split(':')[1].trim()); 

                    //     let urlOlx = `https://www.olx.uz/api/v1/offers/${id}/limited-phones/`;

                    //     try {
                    //         if (tokkenCors !== "") {
                    //             urlOlx = 'https://corsproxy.io/?' + encodeURIComponent(urlOlx);
                    //         }
                        
                    //         const response = await fetch(urlOlx, {
                    //             method: 'GET',
                    //             headers: {
                    //                 'Access-Control-Allow-Origin': '*',
                    //                 'Authorization': `Bearer ${tokkenCors}`,
                    //                 'Content-Type': 'application/json',
                    //             }
                    //         });

                    //         if (!response.ok) {
                    //             throw new Error(`HTTP error! Status: ${response.status}`);
                    //         }

                    //         const data = await response.json();
                    //         setConsole((prevConsole) => prevConsole + `<span class="text-green-200 bg-green-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${findPhoneNumbers(data.data.phones[0])}</span>`);
                    //         // Handle the response data as needed
                    //     } catch (error) {
                    //         console.error('Error:', error.message);
                    //     }
                    // }
                    
                    const roomNumber = getRoomNumber("Количество комнат", productDetailsDoc);
                    const apartmentSize = getRoomNumber("Общая площадь", productDetailsDoc);
                    const floor1 = getRoomNumber("Этаж", productDetailsDoc);
                    const floor2 = getRoomNumber("Этажность дома", productDetailsDoc);
                

                const images = Array.from(productDetailsDoc.querySelectorAll('.swiper-slide[data-cy=adPhotos-swiperSlide] img')).map(
                    (img) => img.getAttribute('src')
                );

                return { description, username, images , roomNumber, apartmentSize, floor1, floor2, phoneNumber};
                };
        // 
                const listProducts =  doc.firstElementChild.querySelector('.css-oukcj3').querySelectorAll('.css-1sw7q4x')
                
                for (const productElement of listProducts) {

                    const title = productElement.querySelector('h6').textContent;
                    const price = productElement.querySelector('.css-10b0gli').textContent.split(' сум')[0].replace(/\s/g, '');;
                    // const locationDate = productElement.querySelector('.css-veheph').textContent;
                    const locationDate = productElement.querySelector('[data-testid=location-date]').textContent;

                    // 
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
                    setLoading((prevLoading) => prevLoading + ((33 / ((fetchAllPages ? 25 : 1) * mem1.length)) / listProducts.length));
                    setProducts((prevProducts) => [...prevProducts, product]);

                }
                // console.log(products)
            } catch (error) {
                // SetProducts([productData]);
                }
            }
        };
        setProdGet(true) 
    };

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

    for (let index = 0; index < products.length; index++) {
        const loadCou = ((100 - loading) / products.length)
        const product = products[index];
        if(product.phoneNumber){
                try {
                    const response = await axios.post(
                        'https://api.client.rizomulk.uz/api/v1/account/sign-up', 
                        {
                            accountFirstName: product.username,
                            accountLastName: '',
                            accountPhoneNumber: product.phoneNumber,
                            accountPassword: calculateMD5(product.username, product.phoneNumber),
                        }, 
                        {'Content-Type': 'application/json',},
                    );

                    setConsole((prevConsole) => prevConsole + (`<br/><p class="text-indigo-400" option="${response.data.data}" ><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span> Пользователь впервые зарегистрирован!</p>`));

                    // console.log(response.data.data)
                    try {
                        if (response.statusText == "Created") {
                            try {
                                const globalHeaders = new Headers();
                                globalHeaders.append('Authorization', `Bearer ${response.data.data}`);
                                // toast.success(`Bearer ${Cookies.get('bearer-token')}`);
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
                                            toast.error('Error during image processing');
                                        }
                                }
                                } catch (error) {
                                    toast.error('An error occurred');
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
                                    SubcatalogID: selectedOption,
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
                                    region_id: null,
                                    district_id: null,
                                    addressKv: "",
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
                                        region_id: null,
                                        district_id: null
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
                                                // mobile_phone: "998770707380",
                                                mobile_phone: product.phoneNumber.replace(/\+/g, ''),
                                                message: `Здравствуйте, ${product.username}! Теперь продать недвижимость стало проще.Ваш логин: ${product.phoneNumber}; Пароль: ${calculateMD5(product.username, product.phoneNumber)}. Мы сделаем всё за вас, вся недвижимость доступна здесь: https://rizomulk.uz`,
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
                                            SubcatalogID: selectedOption,
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
                                            region_id: null,
                                            district_id: null,
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
                                                region_id: null,
                                                district_id: null
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

                            // if(smsAccess){
                            //     try {
                            //         // SMS
                            //         if (products && product.phoneNumber) {
                            //             const body = {
                            //                 // mobile_phone: "998905391575",
                            //                 mobile_phone: product.phoneNumber.replace(/\+/g, ''),
                            //                 message: `Assalomu alaykum, ${product.username}, sizning elonlaringiz rizomulk.uz saytiga joylandi, login: ${product.phoneNumber}, parol: ${calculateMD5(product.username, product.phoneNumber, true)}`,
                            //                 from: 4546,
                            //             };
                                        
                            //             setConsole((prevConsole) => prevConsole + (`<br/><p class="bg-indigo-900 rounded-lg px-5 max-w-sm py-1 mb-2 text-indigo-200 border-dashed border-2 border-indigo-500">${body.message}</p>`));


                            //             const apiUrl = 'https://cors-anywhere.herokuapp.com/http://notify.eskiz.uz/api/message/sms/send';
                            //             const config = {
                            //                 headers: {
                            //                     'Content-Type': 'application/json',
                            //                     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
                            //                 },
                            //             };
                            //             const response1 = await axios.post(apiUrl, body, config);
                            //             console.log(response1)
                            //             setConsole((prevConsole) => prevConsole + (`<p class="text-yellow-300 bg-yellow-900 rounded-lg y-1"><span class="text-blue-200 bg-blue-900/70 px-2 py-1 mr-3 text-xs rounded-lg">${product.phoneNumber}</span>  Сообшения успешно отправленно!</p>`));                        
                            //             // SMS
                            //         }
                            //     } catch (error) {
                            //         console.error('SMS ERRROR:', error);
                            // }}
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



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
    setDropdownOpen(false);
  };

  const toggleDropdown1 = () => {
    setDropdownOpen1(!dropdownOpen1);
  };

  const handleOptionClick1 = (option) => {
    setSelectedOption(option.id);
    setDropdownOpen1(false);
  };



    return (
        <>


        <div className="max-w-7xl mx-auto mt-8">
        <div className="relative max-w-7xl mx-auto rounded-lg ">
            <div className="flex h-4 mb-4 overflow-hidden rounded-lg text-xs bg-gray-800/50">
            <div style={{ width: `${loading}%` }} className="ease-in duration-300 rounded-lg flex flex-col justify-center text-center bg-green-400 shadow-none whitespace-nowrap"></div>
            </div>
        </div>

        <div className='max-w-7xl mx-auto'>

        <div className=' items-center'>
        

        <div className="mb-2 relative col-span-5">
        <div
          className="flex  items-center bg-gray-800/50 text-gray-100 p-3 rounded-md cursor-pointer"
          onClick={toggleDropdown}
        >
          {selectedOption ? (
            mem.find((option) => option.id === selectedOption)?.name || 'Куда отправить'
          ) : (
            'Куда отправить'
          )}
          <ChevronDownIcon className="w-3 h-3 ml-3" />
        </div>
        {dropdownOpen && (
          <div className="z-30 w-96 absolute mt-2 p-3 bg-gray-900 rounded-md shadow-lg">
            {mem.map((option) => (
              <div
                key={option.id}
                className={classNames(
                  'flex items-center justify-between p-1 text-white cursor-pointer',
                  option.id === selectedOption
                    ? 'bg-orange-500/10 font-semibold '
                    : 'hover:bg-gray-700 '
                )}
                onClick={() => handleOptionClick(option)}
              >
                <span>
                  <span className='text-xs bg-orange-500/10 p-1 rounded-lg mr-1 text-orange-400'>
                    {option.parent}
                  </span>{' '}
                  {option.name}
                </span>
              </div>
            ))}
          </div>
        )}
        </div>
        </div>
        </div>

        <div className='snap-center flex p-3 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input 
                type='checkbox' 
                checked={withTokkenCors}
                onChange={handleCheckboxChange}
                className='h-6 w-6 mr-2 form-checkbox text-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50'
            />
            <input 
                className='relative focus:outline-none bg-transparent w-full text-gray-200'
                value={tokkenCors}
                onChange={handleInputTextChange}
                placeholder='Parse Url'
            />
            </div>

        <div className='snap-center flex p-3 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input 
                type='checkbox' 
                checked={smsAccess}
                onChange={(e) => setSmsAccess(e.target.checked)}
                className='h-6 w-6 mr-2 form-checkbox text-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50'
            />
            Высылать уведомления через СМС
        </div>

        

        <div className='snap-center flex p-3 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input 
                type='checkbox' 
                checked={fetchAllPages}
                onChange={(e) => setFetchAllPages(e.target.checked)}
                className='h-6 w-6 mr-2 form-checkbox text-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50'
            />
            Найти по всем страницам (25)
        </div>

        <div className='snap-center flex p-3 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
            <input 
                type='text' 
                value={categoryFetch}
                onChange={(e) => setCategoryFetch(e.target.value)}
                className='relative focus:outline-none bg-transparent w-full text-gray-200'/>
        </div>

        <div className='snap-center flex p-3 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
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
                <div style={{ maxHeight: '28rem' }} className="font-mono mt-4 flex overflow-y-auto ease-in duration-300" ref={consoleRef}>
                <span className="text-green-400">Libert:~$</span>
                <p className="flex-1 typing items-center pl-2">
                    <div dangerouslySetInnerHTML={{ __html: console_main }} />
                    <br />
                </p>
                </div>
                {prodGet ? (
                <div onClick={sendSms} className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                hover:bg-green-500/90 bg-green-500 text-gray-900 flex'>
                    <PaperAirplaneIcon width={20} height={20} className='mr-1'/>
                    Push</div>
                ): 
                mem1.length != 0 ? (
                <div onClick={fetchDataAndDisplayResults}
                className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                hover:bg-orange-500/90 bg-orange-500 text-gray-900 flex'>
                    <RectangleStackIcon width={20} height={20} className='mr-1'/>
                    Parsing
                    </div>
                ):(
                    <div onClick={GetCat}
                    className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                    hover:bg-orange-500/90 bg-orange-500 text-gray-900 flex'>
                        <RectangleStackIcon width={20} height={20} className='mr-1'/>
                        Get Categories
                        </div>
                )
            }
            </div>
        </div>


        </>
    );
}

export default App;
