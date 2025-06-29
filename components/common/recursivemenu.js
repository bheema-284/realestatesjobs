import { Menu, MenuButton, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation";

const Recursivemenu = (props) => {
  const { data, textField, subMenuList, url, logOut, profile, selectedBusiness } = props;
  const Router = useRouter();
  const [Url, setUrl] = useState("");

  useEffect(() => {
    setUrl(url)
  }, [url]);

  const renderSubMenuItems = (items) =>
    items?.map((menu, i) => {
      return (
        <div className={`w-32 md:w-full p-2 hover:bg-red-100 [&:first-child]:rounded-t-lg [&:last-child]:rounded-b-lg flex text-black cursor-pointer`}
          onClick={() => {
            if (menu[Url] == '/logout') {
              logOut();
            }
            else if (menu[Url]) {
              (menu[subMenuList] ? menu[subMenuList]?.length === 0 : true) && Router.push(menu[Url]);
            }
          }}
          key={i}
        >
          <Menu as="div" className="inline-block text-left">
            <MenuButton className="inline-flex w-max gap-1 capitalize justify-center rounded-md text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              {menu[textField]}
              {menu[textField] == selectedBusiness && <CheckCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />}
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 capitalize origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none left-0 border border-gray-100 -top-[30px]">
                {renderSubMenuItems(menu[subMenuList] || [])}
              </div>
            </Transition>
          </Menu>
        </div>

      );
    });

  const renderMenuItems = (items) =>
    items.map((menu, i) => {
      return (
        <div
          key={i}
          onClick={() => {
            if (menu[Url] == '/logout') {
              logOut();
            }
            else if (menu[Url]) {
              (menu[subMenuList] ? menu[subMenuList]?.length === 0 : true) && Router.push(menu[Url]);
            }
          }}
        >
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full capitalize md:justify-center items-center rounded-md  px-3 py-2 text-sm  font-medium text-black hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              {menu[textField]}
              {menu[subMenuList]?.length > 0 && (
                <ChevronDownIcon width={25} height={25}
                  className="ml-1 -mr-1 text-red-500 hover:text-red-700"
                  aria-hidden="true"
                />
              )}
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              className="relative z-10"
            >
              <div className={`${profile ? "right-2" : "left-0"} z-10 grid grid-cols-3 md:block md:absolute bg-white border border-gray-100 rounded-lg`}>
                {renderSubMenuItems(menu[subMenuList] || [])}
              </div>
            </Transition>
          </Menu>
        </div>

      );
    });


  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center">{renderMenuItems(data)}</div>
  );
};

export default Recursivemenu;