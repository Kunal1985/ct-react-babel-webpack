import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
import userReducer from './userReducer';
import orderReducer from './orderReducer';
import listReducer from './listReducer';
import recentlyViewedReducer from './recentlyViewedReducer';

export default combineReducers({
    cart: cartReducer,
    user: userReducer,
    list: listReducer,
    lastOrder: orderReducer,
    recentlyViewed: recentlyViewedReducer
})
