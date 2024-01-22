import { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';

import {
  Bars3Icon,
  XMarkIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  MusicalNoteIcon,
  ClockIcon, HomeIcon, GlobeAmericasIcon, BuildingOffice2Icon, KeyIcon, HomeModernIcon
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Logo from './himarket.png'



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [data, setData] = useState(null);

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
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <header className="bg-indigo-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to={"/"} className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-10 w-auto" src={Logo} alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <Popover.Group className="hidden lg:flex lg:gap-x-3">
        {data && data.data.map((item) => (
          <Popover className="relative">

            <>
              <Popover.Button className="focus:outline-none focus:bg-black/20 px-2 py-1 rounded-md flex items-center gap-x-1 text-sm font-middle leading-6 text-white">
                  {item.name} 
                <ChevronDownIcon className="h-5 w-5 flex-none text-white" aria-hidden="true" />
              </Popover.Button>


              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-20 mt-3 w-screen max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="">
                    {item.sub_catalog_list.map((child_item) => (
                      <div
                        key={child_item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-50"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <HomeIcon className="h-6 w-6 text-gray-900 group-hover:text-gray-800" aria-hidden="true" />
                        </div>
                        <div className="flex-auto">
                          <Link to={"/category/" + child_item.id} className="block font-semibold text-gray-900">
                            {child_item.name}
                            <span className="absolute inset-0" />
                          </Link>
                          {/* <p className="mt-1 text-gray-800">{ichild_itemtem.description}</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={child_item.name}
                        to={child_item.id}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-white hover:bg-gray-100"
                      >
                        <item.icon className="h-5 w-5 flex-none text-white" aria-hidden="true" />
                        {child_item.name}
                      </Link>
                    ))}
                  </div> */}
                </Popover.Panel>
              </Transition>
            </>






          </Popover>
          ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to={"/signin/"} className="text-lg px-3 py-2 rounded-lg font-semibold leading-6 text-white">
            Войти <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to={"/"} className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-10 w-auto"
                src={Logo}
                alt=""
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root ">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">


              {data && data.data.map((item) => (
                <Disclosure as="div" className="-mx-3">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-whitehover:bg-gray-50">
                      {item.name}
                      <ChevronDownIcon
                        className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                        aria-hidden="true"
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="mt-2 space-y-2">
                    {item.sub_catalog_list.map((child_item) => (
                        <Disclosure.Button
                          key={child_item.name}
                          as="a"
                          href={"/category/" + child_item.id}
                          className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-whitehover:bg-gray-50"
                        >
                          {child_item.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>


          ))}
                

                
              </div>
              <div className="py-6">
                <Link to={"/"}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-whitehover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
