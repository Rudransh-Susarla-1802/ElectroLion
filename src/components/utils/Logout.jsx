import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Free.png';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      window.location.replace('/');
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen flex flex-col items-center justify-center bg-[#0B192C] text-white px-4">
      <img
        src={logo}
        alt="Logo"
        className="w-32 animate-pulse hover:animate-ping h-32 mb-6 object-contain cursor-pointer hover:opacity-80 transition-opacity"
      />
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF6500] to-[#1E3E62] bg-clip-text text-transparent">ElectroLion</h1>
      <h2 className="text-2xl font-semibold mb-2">You've been logged out</h2>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        Thank you for shopping with us!
      </p>
    </div>
  );
};

export default Logout;