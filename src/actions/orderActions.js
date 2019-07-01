import { FETCH_ORDER_BY_ID, FETCH_ORDER_FROM_SESSION, SUBMIT_ORDER, CLEAR_LAST_ORDER } from './types'
import { submitOrder } from '../utils/CommonUtils';

export const fetchOrderFromSession = () => dispatch => {
	dispatch({
		type: FETCH_ORDER_FROM_SESSION
	})
}

export const fetchOrderById = () => dispatch => {
	dispatch({
		type: FETCH_ORDER_BY_ID
	})
}

export const submitOrderAction = function () {
	return async function (dispatch) {
		let response = await submitOrder();
		dispatch({
			type: SUBMIT_ORDER,
			payload: response
		})
	}
}

export const clearOrderAction = function () {
	return async function (dispatch) {
		dispatch({
			type: CLEAR_LAST_ORDER
		})
	}
}