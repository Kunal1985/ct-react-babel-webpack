import { FETCH_LIST_BY_ID, ADD_TO_LIST, CREATE_LIST, REMOVE_FROM_LIST, CLEAR_OLD_LIST, FETCH_USER_SHOPPING_LISTS } from '../actions/types';
import { fetchCustomerShoppingLists } from '../utils/CommonUtils';
import { fetchUserShoppingListsAction } from '../actions/listActions';

const initialState = {
	currList: {},
	currUserLists: {},
	updateUserList: false
}

export default function (state = initialState, action) {
	let response = action.payload;
	switch (action.type) {
		case FETCH_LIST_BY_ID:
			return {
				...state,
				currList: response.body ? response.body : state.currList,
				error: response.err
			};
		case ADD_TO_LIST:
			return {
				...state,
				currList: response.body ? response.body : state.currList,
				error: response.err,
				updateUserList: true
			};
		case CREATE_LIST:
			return {
				...state,
				currList: response.body ? response.body : state.currList,
				error: response.err,
				updateUserList: true
			};
		case REMOVE_FROM_LIST:
			return {
				...state,
				currList: response.body ? response.body : state.currList,
				error: response.err,
				updateUserList: true
			};
		case CLEAR_OLD_LIST:
			return {
				...state,
				currList: {},
				error: null
			};
		case FETCH_USER_SHOPPING_LISTS:
			return {
				...state,
				currUserLists: response.body ? response.body : state.currUserLists,
				currUserListsError: null,
				updateUserList: false
			};
		default:
			return {
				...state
			}
	}
}