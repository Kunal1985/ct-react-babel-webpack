import { FETCH_CART_BY_ID, ADD_TO_CART, REMOVE_FROM_CART, ADD_SHIPPING_TO_CART, CLEAR_OLD_CART } from '../actions/types';

const initialState = {
	currCart: {}
}

export default function (state = initialState, action) {
	let response = action.payload;
	switch (action.type) {
		case FETCH_CART_BY_ID:
			return {
				...state,
				currCart: response.body ? response.body : state.currCart,
				error: response.err
			};
		case ADD_TO_CART:
			return {
				...state,
				currCart: response.body ? response.body : state.currCart,
				error: response.err
			};
		case REMOVE_FROM_CART:
			return {
				...state,
				currCart: response.body ? response.body : state.currCart,
				error: response.err
			};
		case ADD_SHIPPING_TO_CART:
			return {
				...state,
				currCart: response.body ? response.body : state.currCart,
				error: response.err
			};
		case CLEAR_OLD_CART:
			return {
				...state,
				currCart: {},
				error: null
			};
		default:
			return {
				...state
			}
	}
}