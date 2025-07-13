"use client"
import '../app/globals.css';
import React, { useContext, useState } from "react";
import Recursivemenu from "./common/recursivemenu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import RootContext from './config/rootcontext';
import { contextObject } from './config/contextobject';
import { useRouter } from 'next/navigation';

export default function MenuHeader() {
    const [menuShow, setMenuShow] = useState(false);
    const { rootContext, setRootContext } = useContext(RootContext);
    const router = useRouter();
    const menu = [
        {
            "name": "TL",
            "text": "TL",
            "url": "/tl",
        },
        {
            "name": "vendor",
            "text": "vendor",
            "url": "/vendor",
        },
        {
            "name": "sub vendor",
            "text": "sub vendor",
            "url": "/subvendor",
        }
    ]

    const profileMenu = [
         {
            "name": "Home",
            "text": "home",
            "items": []
        },
         {
            "name": "About Us",
            "text": "aboutus",
            "items": []
        },
        {
            "name": "Jobs",
            "text": "jobs",
            "items": []
        },
        {
            "name": rootContext.user.name,
            "text": rootContext.user.name,
            "items": [{
                "text": "Log Out",
                "url": "/logout",
                "items": []
            }]
        }
    ];

    const showMenu = () => {
        setMenuShow(!menuShow);
    }

    const logOut = () => {
        let resp = contextObject;
        localStorage.clear();
        resp.authenticated = false;
        setRootContext({ ...resp });
        router.push(`/`);
    }

    return (
        <div className="items-center relative flex-col">
            <div className='md:hidden flex justify-between items-center'>
                <div onClick={showMenu}>
                    {!menuShow && <Bars3Icon width={25} height={25} className="md:hidden m-2 z-50" />}
                    {menuShow && <XMarkIcon width={25} height={25} className="md:hidden m-2 border-2 border-gray-900 rounded-md z-50" />}
                </div>
                <div className="md:hidden hover:cursor-pointer flex">
                    <p title={rootContext.user.name}
                        className="md:hidden mr-1 h-6 w-6 border hover:cursor-pointer border-gray-900 pt-[3px] p-[1.2px] flex rounded-full text-xs text-blue-600"
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {rootContext.user.name.split(' ').map(word => word[0]).join(' ')}
                    </p>
                    <ArrowPathIcon width={25} height={25} className="mr-3 fill-slate-500 hover:cursor-pointer" />
                    <p>{"onetoone".split(' ').map(word => word[0]).join(' ')}</p>
                    <ChevronDownIcon width={25} height={25} color='fill-slate-500' />
                </div>
            </div>
            <div
                className={`${menuShow ? "h-auto absolute bg-white dark:bg-white shadow-md left-0 right-0 top-10 z-10 flex items-center justify-between text-sm flex-1 md:h-16 max-w-lg:h-[auto]" : "hidden h-auto bg-white dark:bg-white shadow-md sticky left-0 right-0 top-0 z-10 md:flex items-center justify-between text-sm flex-1 md:h-16 w-full max-w-lg:h-[auto]"}`}>
               <a href='/'>
                   <div>
                     <img height={10} width={120} src='	https://realestatejobs.co.in/images/logo.png'>
                    </img>
                   </div>
                </a>
                <div className='flex'>
                    {!menuShow && <Recursivemenu
                        data={profileMenu}
                        textField={"text"}
                        subMenuList={"items"}
                        url={"url"}
                        refreshMenu={() => { }}
                        logOut={logOut}
                        profile={true}
                    />}
                </div>
            </div>
        </div>
    );
}