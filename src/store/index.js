import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profile-slice';
import registrationReducer from './registration';
import cartReducer from './cart-slice';
import wishlistReducer from './wishlist-slice'; // ✅ Add this import

const store = configureStore({
  reducer: {
    profile: profileReducer,
    registration: registrationReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
export { profileReducer, registrationReducer, cartReducer, wishlistReducer };
