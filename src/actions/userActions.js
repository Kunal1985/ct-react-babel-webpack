import { FETCH_USER_BY_ID, FETCH_USER_FROM_SESSION, LOG_IN_USER, LOG_OUT_USER, REGISTER_USER, UPDATE_USER } from '../actions/types'
import { fetchCustomer, updateCustomer, getCurrCustomerId } from '../utils/CommonUtils';

export const fetchUserFromSession = () => dispatch => {
	dispatch({
		type: FETCH_USER_FROM_SESSION
	})
}

export const fetchUserById = function (userId) {
	if(!userId){
		userId = getCurrCustomerId();
	}
	return async function (dispatch) {
		let response = await fetchCustomer(userId);
		dispatch({
			type: FETCH_USER_BY_ID,
			payload: response
		})
	}
}

export const updateUserAction = function (requestBody) {
	return async function (dispatch) {
		let response = await updateCustomer(requestBody);
		dispatch({
			type: UPDATE_USER,
			payload: response
		})
	}
}