import React, { useEffect, useState, useRef} from 'react';

import {PaperAirplaneIcon, RectangleStackIcon, ChevronDownIcon, ChevronDoubleRightIcon} from '@heroicons/react/24/solid'
import { toast } from 'react-toastify';



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const YourComponent = () => {
  // Existing state variables
  const [console_main, setConsole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [withTokkenCors, setWithTokkenCors] = useState(false);
  const [tokkenCors, setTokkenCors] = useState('');
  const [smsAccess, setSmsAccess] = useState(false);
  const [fetchAllPages, setFetchAllPages] = useState(false);
  const [categoryFetch, setCategoryFetch] = useState('zemlja');
  const [testMode, setTestMode] = useState(false);
  const [mem, setMem] = useState([]);
  const [mem1, setMem1] = useState([]);
  const [windowsCount, setWindowsCount] = useState(10);
  
  const consoleRef = useRef();
    useEffect(() => {
        // Scroll to the bottom when the content updates
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }, [console_main]);  

  // Existing functions
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
    setDropdownOpen(false);
    // Additional logic you may want to perform when an option is selected
  };

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
    // Change body background color when the component mounts
    document.body.style.backgroundColor = 'black';

    // Clean up the style when the component unmounts
    return () => {
        document.body.style.backgroundColor = '';
    };
    }, []);


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

                

                for (let indexFloor = 1; indexFloor <= 16; indexFloor++) {
                    districts_data.data.map(district_data => {
                        const url = `${categoryFetch}/${getDistrict.normalized_name}/?search%5Bdistrict_id%5D=${district_data.id}&search%5Bfilter_float_floor:from%5D=${indexFloor}`;
                        setConsole((prevConsole) => prevConsole + (`<p class="text-green-500 bg-green-900 rounded-lg y-1">${url}</p>`));

                
                        return {
                            category_id: 1,
                            region_data: parentCategory,
                            city_data: getDistrict,
                            district_data: district_data,
                            url: url
                        };
                    });
                }
                
                
                }

            } catch (error) {}
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

const handleOpenUrlsInNewTabs = () => {
    const smsAccessQueryParam = `smsAccess=${smsAccess}`;
    const fetchAllPagesQueryParam = `fetchAllPages=${fetchAllPages}`;
    const categoryFetchQueryParam = `categoryFetch=${encodeURIComponent(categoryFetch)}`;
    const testModeQueryParam = `testMode=${testMode}`;
    const selectedOptionQueryParam = `selectedOption=${selectedOption || ''}`; // Make sure it's not undefined


    const urls = [];
    for (let i = 1; i <= windowsCount; i++) {
        const olxUrlRegions =  Math.floor(mem1.length / windowsCount);
        const arrayUrlRegions = []
        for (let index = (i * olxUrlRegions) - olxUrlRegions; index < i * olxUrlRegions; index++) {
            arrayUrlRegions.push(encodeURIComponent(mem1[index].url));
        }


        const mem1__Mem = `mem1=${arrayUrlRegions.join(',')}`;
        const queryParams = [smsAccessQueryParam, fetchAllPagesQueryParam, categoryFetchQueryParam, selectedOptionQueryParam, testModeQueryParam, mem1__Mem].filter(Boolean).join('&');
        // const url = `http://localhost:3000/hack/olx/${i}?${queryParams}`;
        const url = `http://keymarket.uz/hack/olx/${i}?${queryParams}`;
        urls.push(url);
    }

    // Now you can use the 'urls' array as needed

    urls.forEach((url) => {
      window.open(url, '_blank');
    });
  };
  
  

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* ... (existing code) */}
      {/* Additional parameters */}
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


      <div className='snap-center flex p-3 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
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
          className='relative focus:outline-none bg-transparent w-full text-gray-200'
        />
      </div>

      <div className='snap-center flex p-3 mt-2 relative max-w-7xl mx-auto rounded-lg w-full bg-gray-800/50 border-gray-800 focus:outline-none text-gray-200'>
        <input 
          type='text' 
          value={windowsCount}
          onChange={(e) => setWindowsCount(e.target.value)}
          className='relative focus:outline-none bg-transparent w-full text-gray-200'
        />
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

      <div className=" relative max-w-7xl mx-auto">
            <div className="coding inverse-toggle my-5 px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800/50 pb-6  rounded-lg leading-normal">
                <div className="top mb-2 flex">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="ml-2 h-3 w-3 bg-orange-500 rounded-full"></div>
                    <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div style={{ maxHeight: '38rem' }} className="font-mono mt-4 flex overflow-y-auto ease-in duration-300" ref={consoleRef}>
                <span className="text-green-400">Libert:~$</span>
                <p className="flex-1 typing items-center pl-2">
                    <div dangerouslySetInnerHTML={{ __html: console_main }} />
                    <br />
                </p>
                </div>
                {mem1.length == 0 ? (
                <div onClick={GetCat} className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                hover:bg-green-500/90 bg-green-500 text-gray-900 flex'>
                    <PaperAirplaneIcon width={20} height={20} className='mr-1'/>
                    Get Urls</div>
                ): 
                (
                <div onClick={handleOpenUrlsInNewTabs}
                className='absolute right-4 top-4 py-1 px-3 rounded-lg 
                hover:bg-orange-500/90 bg-orange-500 text-gray-900 flex'>
                    <RectangleStackIcon width={20} height={20} className='mr-1'/>
                    Open in new tabs
                    </div>
                )
            }
        
            </div>
        </div>

    </div>
  );
};

export default YourComponent;
