import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
import userReducer from './userReducer';
import orderReducer from './orderReducer';

export default combineReducers({
    cart: cartReducer,
    user: userReducer,
    lastOrder: orderReducer
})
