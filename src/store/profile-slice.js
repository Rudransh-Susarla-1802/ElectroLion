import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: '',
  imageFile: null, // Store the actual File object for re-upload scenarios
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
  preferredLanguageOfCommunication: '',
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
};

// Helper function to convert File to Base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      Object.keys(initialState).forEach((key) => {
        state[key] = action.payload[key] || '';
      });
    },
    clearProfile: (state) => {
      Object.keys(initialState).forEach((key) => {
        state[key] = '';
      });
    },
    editProfile: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (key in state) {
          state[key] = action.payload[key];
        }
      });
    },
    
    // New method to handle image upload and storage
    setProfileImage: (state, action) => {
      const { imageDataUrl, imageFile } = action.payload;
      state.image = imageDataUrl; // Base64 string for rendering
      state.imageFile = imageFile; // Original file object (note: this won't persist in localStorage)
    },
    
    // Method to set image from URL (for images loaded from server)
    setProfileImageFromUrl: (state, action) => {
      state.image = action.payload.imageUrl;
      state.imageFile = null; // Clear file object when setting from URL
    },
    
    // Method to clear only the image
    clearProfileImage: (state) => {
      state.image = '';
      state.imageFile = null;
    },
  },
});

// Async action creator for handling file upload
export const uploadProfileImage = (file) => async (dispatch) => {
  try {
    // Convert file to base64 for storage and display
    const imageDataUrl = await fileToBase64(file);
    
    dispatch(setProfileImage({
      imageDataUrl,
      imageFile: file
    }));
    
    return { success: true, imageDataUrl };
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return { success: false, error: error.message };
  }
};

export const { 
  setProfile, 
  clearProfile, 
  editProfile, 
  setProfileImage, 
  setProfileImageFromUrl,
  clearProfileImage 
} = profileSlice.actions;

export default profileSlice.reducer;