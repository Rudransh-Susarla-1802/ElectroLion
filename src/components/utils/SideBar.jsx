import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../../App.css"
import {
    LayoutDashboard,
    Smartphone,
    Laptop,
    Monitor,
    Refrigerator,
    WashingMachine,
    AirVent,
    Headphones,
    LogOut,
  } from 'lucide-react';
  import logo from '../../assets/Free.png';

const SideBar = ({ setIsSidebarOpen, setActiveTab, activeTab }) => {
    const location = useLocation();
    const tabs = [
        { tabName: "Home", path: "/home", logo: <LayoutDashboard size={20}/> },
        { tabName: "Mobile", path: "/mobile", logo:<Smartphone size={20}/> },
        { tabName: "Laptop", path: "/laptop", logo:<Laptop size={20}/> },
        { tabName: "TV", path: "/tv", logo:<Monitor size={20}/> },
        { tabName: "Fridge", path: "/fridge", logo:<Refrigerator size={20}/> },
        { tabName: "Washing Machine", path: "/washingmachine", logo:<WashingMachine size={20}/> },
        { tabName: "Air Conditioner", path: "/airconditioner", logo:<AirVent size={20}/> },
        { tabName: "Accessories", path: "/accessories", logo:<Headphones size={20}/> },
        { tabName: "Logout", path: "/logout", logo:<LogOut size={20}/> },
    ];

    useEffect(() => {
        const foundIndex = tabs.findIndex(tab => tab.path.toLowerCase() === location.pathname.toLowerCase());
        if (foundIndex !== -1 && foundIndex !== activeTab) {
            setActiveTab(foundIndex);
        }
    }, [location.pathname]);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="sidebar w-1/6 h-screen p-4 overflow-y-auto scrollbar-hidden bg-[#0B192C] border-r border-[#1E3E62]">
            <header className="flex flex-col items-center mb-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-32 h-16 animate-pulse hover:animate-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            </header>
            <nav className="flex flex-col gap-2">
                {tabs.map((tab, index) => (
                    <Link
                        to={tab.path}
                        key={index}
                        onClick={() => handleTabClick(index)}
                        className="flex items-center gap-2"
                    >
                        <div
                            className={`tab-item py-2 px-4 w-full rounded-xl cursor-pointer flex items-center gap-3 shadow-lg transition-all duration-200
                                ${tab.tabName === 'Logout' 
                                    ? 'bg-[#FF6500] text-white hover:bg-[#1E3E62]' 
                                    : index === activeTab 
                                        ? 'bg-[#1E3E62] text-[#FF6500]' 
                                        : 'text-white hover:text-[#FF6500] hover:bg-[#1E3E62]'
                                }`}
                        >
                            {tab.logo}
                            <span className='text-sm'>{tab.tabName}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default SideBar;
