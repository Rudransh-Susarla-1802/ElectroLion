import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile, uploadProfileImage } from '../../store/profile-slice';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {CreditCard, FileUser, MapPinHouse} from 'lucide-react'


const Profile = () => {
  const registration = useSelector((state) => state.registration);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    maritalStatus: '',
    email: '',
    password: '',
    primaryMobileNo: '',
    alternateMobileNo: '',
    dob: '',
    flatNo: '',
    streetName: '',
    localityName: '',
    landmark: '',
    district: '',
    state: '',
    country: '',
    pinCode: '',
    cardNo: '',
    expDate: '',
    preferredLanguageOfCommunication: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data from registration and existing profile
  useEffect(() => {
    const initialData = {
      ...formData,
      // Populate from registration if available
      ...(registration && {
        email: registration.email || '',
        password: registration.password || '',
      }),
      // Populate from existing profile if available
      ...profile
    };
    
    setFormData(initialData);
  }, [registration, profile]);

  // Fetch profile data from Firebase on mount
  useEffect(() => {
    // Get email from profile or registration or user
    let email = profile.email || registration.email;
    if (!email && user) {
      try {
        const parsed = typeof user === 'string' ? JSON.parse(user) : user;
        email = parsed.email;
      } catch {}
    }
    if (!email) return;
    const userIdentifier = email.replace(/[^a-zA-Z0-9]/g, '_');
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${userIdentifier}.json`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          // Only update fields that are not empty or null, and skip email/password
          const updatedProfile = { ...profile };
          Object.keys(data).forEach(key => {
            if (
              key !== 'email' &&
              key !== 'password' &&
              key !== 'lastUpdated' &&
              data[key] !== '' &&
              data[key] !== null &&
              typeof data[key] !== 'undefined'
            ) {
              updatedProfile[key] = data[key];
            }
          });
          dispatch(setProfile(updatedProfile));
        }
      });
  // Only run on mount
  // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }

        // Upload image using the enhanced Redux action
        const result = await dispatch(uploadProfileImage(file));
        
        if (!result.success) {
          alert('Failed to upload image: ' + result.error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data to be stored in Redux
      const profileData = {
        ...formData,
        // The image is already stored in Redux state via uploadProfileImage
        // We don't need to include it here as it's handled separately
      };

      // Dispatch the profile data to Redux
      dispatch(setProfile(profileData));
      
      console.log('Profile Data Saved:', profileData);
      console.log('Profile Image:', profile.image ? 'Image uploaded' : 'No image');
      
      // Optional: Show success message
      alert('Profile saved successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center rounded-md justify-center bg-gray-900 px-4 py-8">
      <div className="w-full max-w-4xl p-8  text-white rounded-xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">Profile Information</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-10">

            {/* Personal Info Section */}
            <div>
              <h2 className="text-xl font-semibold flex text-blue-300 mb-4 border-b border-blue-500 pb-2"><FileUser size={25} className='mx-2'/>Personal Information</h2>
              
              <div className="relative">
                {/* Image Upload Box - Top Right */}
                <div className="absolute top-0 right-0 w-32 h-40 mb-6 z-10">
                  <div className="relative w-full h-full border-2 border-dashed border-blue-500 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {profile.image ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={profile.image} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs text-center px-2">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-blue-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs text-center">Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">Required *</p>
                </div>

                {/* Form content with proper spacing */}
                <div className="pr-36">
                  {/* Name Fields - All in one row */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium">First Name <span className="text-red-400">*</span></label>
                        <input 
                          name="firstName" 
                          required 
                          value={formData.firstName || ''} 
                          onChange={handleChange} 
                          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">Middle Name</label>
                        <input 
                          name="middleName" 
                          value={formData.middleName || ''} 
                          onChange={handleChange} 
                          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">Last Name <span className="text-red-400">*</span></label>
                        <input 
                          name="lastName" 
                          required 
                          value={formData.lastName || ''} 
                          onChange={handleChange} 
                          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender and Marital Status - Clear space below image */}
                  <div className="mt-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-1 text-sm font-medium">Gender <span className="text-red-400">*</span></label>
                        <select 
                          name="gender" 
                          required 
                          value={formData.gender || ''} 
                          onChange={handleChange} 
                          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">Marital Status <span className="text-red-400">*</span></label>
                        <select 
                          name="maritalStatus" 
                          required 
                          value={formData.maritalStatus || ''} 
                          onChange={handleChange} 
                          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact and Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      readOnly
                      className="w-full px-4 py-2 rounded-md bg-gray-600 text-gray-300 focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Password</label>
                    <div className="relative">
                      <input
                        type={'password'}
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2 pr-10 rounded-md bg-gray-600 text-gray-300 focus:outline-none cursor-not-allowed"
                      />
                    </div>
                    <p className="text-sm text-gray-400 text-left mt-2">
                      Forgot Password?{' '}
                      <Link to="/forgot" state={ formData.email } className="text-blue-400 hover:underline">
                        YES
                      </Link>
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Primary Mobile No <span className="text-red-400">*</span></label>
                    <input 
                      type="tel" 
                      name="primaryMobileNo" 
                      required 
                      value={formData.primaryMobileNo || ''} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Alternate Mobile No</label>
                    <input 
                      type="tel" 
                      name="alternateMobileNo" 
                      value={formData.alternateMobileNo || ''} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob || ''}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Preferred Language of Communication <span className="text-red-400">*</span></label>
                    <input 
                      name="preferredLanguageOfCommunication" 
                      required 
                      value={formData.preferredLanguageOfCommunication || ''} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h2 className="text-xl font-semibold flex text-blue-300 mb-4 border-b border-blue-500 pb-2"><MapPinHouse size={25} className='mx-2'/>Address Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium">Flat No <span className="text-red-400">*</span></label>
                  <input 
                    name="flatNo" 
                    required 
                    value={formData.flatNo || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Street Name <span className="text-red-400">*</span></label>
                  <input 
                    name="streetName" 
                    required 
                    value={formData.streetName || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Locality/Area Name <span className="text-red-400">*</span></label>
                  <input 
                    name="localityName" 
                    required 
                    value={formData.localityName || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Landmark</label>
                  <input 
                    name="landmark" 
                    value={formData.landmark || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">District <span className="text-red-400">*</span></label>
                  <input 
                    name="district" 
                    required 
                    value={formData.district || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">State <span className="text-red-400">*</span></label>
                  <input 
                    name="state" 
                    required 
                    value={formData.state || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Country <span className="text-red-400">*</span></label>
                  <input 
                    name="country" 
                    required 
                    value={formData.country || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Pin Code <span className="text-red-400">*</span></label>
                  <input 
                    name="pinCode" 
                    required 
                    value={formData.pinCode || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h2 className="text-xl font-semibold flex text-blue-300 mb-4 border-b border-blue-500 pb-2"><CreditCard size={25} className='mx-2'/>Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium">Card No <span className="text-red-400">*</span></label>
                  <input 
                    name="cardNo" 
                    required 
                    value={formData.cardNo || ''} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Exp Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="month"
                    name="expDate"
                    required
                    value={formData.expDate || ''}
                    onChange={handleChange}
                    min={(() => {
                      const today = new Date();
                      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                      return nextMonth.toISOString().slice(0, 7);
                    })()}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-800'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;