import { Routes, Route, useLocation } from 'react-router-dom'
import React, { useState, useRef, useEffect } from 'react'
import Home from './pages/Home'
import Cart from './components/Cart'
import Checkout from './components/utils/Checkout'
import Login from './components/utils/Login'
import Register from './components/utils/Register'
import Profile from './components/utils/Profile'
import Mobile from './pages/Mobile'
import Laptop from './pages/Laptop'
import TV from './pages/TV'
import Fridge from './pages/Fridge'
import WashingMachine from './pages/WashingMachine'
import AirConditioner from './pages/AirConditioner'
import Accessories from './pages/Accessories'
import ReducedSideBar from './components/utils/ReducedSideBar'
import SideBar from './components/utils/SideBar'
import Logout from './components/utils/Logout'
import Header from './components/Header'
import Wishlist from './components/Wishlist'
import Footer from './components/Footer'
import Forgot from './components/utils/Forgot'
import { useSelector } from 'react-redux'
import ProtectedRoute from './routes/ProtectedRoute'
import ProductPage from './pages/ProductPage'
import Searched from './pages/Searched'
import ScrollToTop from './ScrollToTop'
import InvoicePage from './components/utils/Checkout/InvoicePage'

function AppRouter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const reqName = useRef(null);
  const givenMail = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const registration = useSelector((state) => state.registration)
  const profile = useSelector((state) => state.profile)
  const location = useLocation();
  const scrollableDivRef = useRef(null);

  // Track last non-cart page
  useEffect(() => {
    if (location.pathname !== '/cart') {
      localStorage.setItem('lastNonCartPage', location.pathname);
    }
  }, [location.pathname]);

  // Helper function to create a unique identifier for the user
  const createUserIdentifier = (profileData) => {
  
    // Fallback to first and last name
    if (profileData.email) {
      return profileData.email.replace(/[^a-zA-Z0-9]/g, '_');
    }
    // Try to create identifier from profile data
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName}_${profileData.lastName}`.replace(/[^a-zA-Z0-9]/g, '_');
    }
    // Fallback to primary mobile number
    if (profileData.primaryMobileNo) {
      return profileData.primaryMobileNo.replace(/[^a-zA-Z0-9]/g, '_');
    }
    // Final fallback - generate timestamp-based ID
    return `user_${Date.now()}`;
  };

  // Function to send profile data to Firebase
  const saveProfileToFirebase = async (profileData) => {
    try {
      const userIdentifier = createUserIdentifier(profileData);
      
      // Prepare profile data for Firebase (exclude sensitive info if needed)
      const firebaseProfileData = {
        ...profileData,
        lastUpdated: new Date().toISOString(),
        // Note: You might want to exclude sensitive fields like password, cardNo
        // password: undefined,
        // cardNo: undefined,
      };

      const response = await fetch(
        `https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${userIdentifier}.json`,
        {
          method: 'PUT',
          body: JSON.stringify(firebaseProfileData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('Profile saved to Firebase successfully');
      } else {
        console.error('Failed to save profile to Firebase:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving profile to Firebase:', error);
    }
  };

  // Handle registration data to Firebase
  useEffect(() => {
    if (registration && registration.email) {
      const safeName = registration.email.replace(/[^a-zA-Z0-9]/g, '_');
      fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/registration/${safeName}.json`, {
        method: 'PUT',
        body: JSON.stringify(registration),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.error('Error saving registration to Firebase:', error);
      });
    }
  }, [registration]);

  // Handle profile data to Firebase
  useEffect(() => {
    // Check if profile has meaningful data before saving
    const hasProfileData = profile && (
      profile.firstName || 
      profile.lastName || 
      profile.email || 
      profile.primaryMobileNo ||
      profile.image
    );

    // Also check that the profile is NOT being cleared (i.e., not all fields are empty)
    const isProfileEmpty = Object.values(profile || {}).every(
      value => value === '' || value === null
    );

    // Only save if profile has more than just email/password
    const isMinimalProfile = (
      Object.keys(profile || {}).filter(
        key => !['email', 'password'].includes(key) && profile[key]
      ).length === 0
    );

    if (hasProfileData && !isProfileEmpty && !isMinimalProfile) {
      console.log('Profile data detected, saving to Firebase:', profile);
      saveProfileToFirebase(profile);
    }
  }, [profile]);

  const handleSearchChange = () => {
    if (reqName.current) {
      console.log(reqName.current.value);
    }
  };

  const handleEmail = () => {
    if(givenMail.current){
      console.log(givenMail.current.value);
    }
  }

  // Check if the current route is /logout, /, /register, or /forgot
  const isLogoutRoute = location.pathname === '/logout';
  const isLoginRoute = location.pathname === '/';
  const isRegisterRoute = location.pathname === '/register';
  const isForgotRoute = location.pathname === '/forgot';

  if (isLogoutRoute) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B192C] flex items-center justify-center">
        <Logout setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  }
  if (isLoginRoute) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B192C] flex items-center justify-center">
        <Login setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  }
  if (isRegisterRoute) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B192C] flex items-center justify-center">
        <Register setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  }
  if (isForgotRoute) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B192C] flex items-center justify-center">
        <Forgot />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      {isSidebarOpen ? (
        <SideBar setIsSidebarOpen={setIsSidebarOpen} setActiveTab={setActiveTab} activeTab={activeTab} />
      ) : (
        <ReducedSideBar setIsSidebarOpen={setIsSidebarOpen} setActiveTab={setActiveTab} activeTab={activeTab} />
      )}

      <div className="flex flex-col h-full w-full overflow-x-auto">
        <Header reqName={reqName} handleSearchChange={handleSearchChange} isLoggedIn={isLoggedIn} />
        <div ref={scrollableDivRef} className="flex-1 overflow-y-auto p-6 bg-[#08121F]">
          <ScrollToTop scrollTargetRef={scrollableDivRef} />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/productpage" element={<ProductPage />} />
            <Route path="/searched" element={<Searched />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mobile" element={<Mobile />} />
              <Route path="/laptop" element={<Laptop />} />
              <Route path="/tv" element={<TV />} />
              <Route path="/fridge" element={<Fridge />} />
              <Route path="/washingmachine" element={<WashingMachine />} />
              <Route path="/airconditioner" element={<AirConditioner />} />
              <Route path="/Accessories" element={<Accessories />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/invoice" element={<InvoicePage />} />
            </Route>
          </Routes>
          <Footer givenMail={givenMail} handleEmail={handleEmail} />
        </div>
      </div>
    </div>
  );
}

export default AppRouter;