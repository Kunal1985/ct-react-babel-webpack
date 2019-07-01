import { FETCH_CART_BY_ID, FETCH_CART_FROM_SESSION, ADD_TO_CART, REMOVE_FROM_CART, ADD_SHIPPING_TO_CART, CLEAR_OLD_CART } from './types'
import { fetchCart, getCurrCartId, createCart, addItemToCart, removeItemFromCart, addShippingToCart } from '../utils/CommonUtils';

export const fetchCartFromSession = () => dispatch => {
	dispatch({
		type: FETCH_CART_FROM_SESSION
	})
}

export const clearOldCartFromSession = () => dispatch => {
	dispatch({
		type: CLEAR_OLD_CART
	})
}

export const fetchCartById = function () {
	return async function (dispatch) {
		let cartResponse = {};
		let currCartId = getCurrCartId();
		if(currCartId){
			cartResponse = await fetchCart(currCartId);
		}
		dispatch({
			type: FETCH_CART_BY_ID,
			payload: cartResponse
		})
	}
}

export const addToCartAction = function (currSelectedSku, quantity) {
	return async function (dispatch) {
		let currCartId = getCurrCartId();
		if (!currCartId) {
			let response = await createCart();
		}
		currCartId = getCurrCartId();
		if (currCartId) {
			let response = await addItemToCart(currSelectedSku, quantity);
			dispatch({
				type: ADD_TO_CART,
				payload: response
			})
		}
	}
}

export const removeItemFromCartAction = function (itemId) {
	return async function (dispatch) {
		let response = await removeItemFromCart(itemId);
		dispatch({
			type: REMOVE_FROM_CART,
			payload: response
		})
	}
}

export const addShippingToCartAction = function (address) {
	return async function (dispatch) {
		let response = await addShippingToCart(address);
		dispatch({
			type: ADD_SHIPPING_TO_CART,
			payload: response
		})
	}
}