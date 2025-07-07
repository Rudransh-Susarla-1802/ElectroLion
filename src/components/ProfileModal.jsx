import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Heart, ShoppingCart, LogOut } from 'lucide-react';

const ProfileModal = ({  onClose }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const onProfile = () => {
        onClose()
        navigate('/profile')
    }
    const onWishlist = () => {
        onClose()
        navigate('/wishlist')
    }
    const onCart = () => {
        onClose()
        if (location.pathname === '/cart') {
            const lastPage = localStorage.getItem('lastNonCartPage') || '/';
            navigate(lastPage);
        } else {
            navigate('/cart');
        }
    }
    const onLogout = () => {
        onClose()
        navigate('/logout')
    }
    return (
        <div className="profile-modal absolute right-4 top-16 bg-blue-900 w-48 rounded-md shadow-lg z-50">
            <div className="flex flex-col divide-y divide-[#71C0BB]">
            <button onClick={onProfile} className="flex cursor-pointer items-center gap-2 text-white text-left hover:bg-[#0B192C] px-4 py-2">
                <User size={18} />
                <span>Profile</span>
                </button>
                <button onClick={onWishlist} className="flex cursor-pointer items-center gap-2 text-white text-left hover:bg-[#0B192C] px-4 py-2">
                <Heart size={18} />
                <span>Wishlist</span>
                </button>
                <button onClick={onCart} className="flex cursor-pointer items-center gap-2 text-white text-left hover:bg-[#0B192C] px-4 py-2">
                <ShoppingCart size={18} />
                <span>Cart</span>
                </button>
                <button onClick={onLogout} className="flex cursor-pointer items-center gap-2 text-red-500 text-left hover:bg-[#0B192C] hover:rounded-md px-4 py-2">
                <LogOut size={18} />
                <span>Logout</span>
                </button>

            </div>
        </div>

    )
}

export default ProfileModal