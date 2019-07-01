import { LOG_IN_USER, LOG_OUT_USER, REGISTER_USER, FETCH_USER_BY_ID, UPDATE_USER } from '../actions/types'

const initialState = {
	currUser: {}
}

export default function (state = initialState, action) {
	let response = action.payload;
	switch (action.type) {
		case FETCH_USER_BY_ID:
			return {
				...state,
				currUser: response.body ? response.body : state.currUser,
				error: response.err
			};
		case LOG_IN_USER:
			return {
				...state,
				currUser: response.body ? response.body : state.currUser,
				error: response.err
			};
		case LOG_OUT_USER:
			return {
				...state,
				currUser: response.body ? response.body : state.currUser,
				error: response.err
			};
		case REGISTER_USER:
			return {
				...state,
				currUser: response.body ? response.body : state.currUser,
				error: response.err
			};
		case UPDATE_USER:
			return {
				...state,
				currUser: response.body ? response.body : state.currUser,
				error: response.err
			};
		default:
			return state;
	}
}