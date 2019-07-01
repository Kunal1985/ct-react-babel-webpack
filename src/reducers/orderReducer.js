import { SUBMIT_ORDER, CLEAR_LAST_ORDER } from '../actions/types';

const initialState = {
	lastOrderPlaced: {}
}

export default function (state = initialState, action) {
	let response = action.payload;
	switch (action.type) {
		case SUBMIT_ORDER:
			return {
				...state,
				lastOrderPlaced: response.body ? response.body : state.lastOrderPlaced,
				error: response.err
			};
		case CLEAR_LAST_ORDER:
			return {
				...state,
				lastOrderPlaced: {},
				error: null
			};
		default:
			return {
				...state
			}
	}
}