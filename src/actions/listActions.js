import { FETCH_LIST_BY_ID, FETCH_LIST_FROM_SESSION, ADD_TO_LIST, CREATE_LIST, REMOVE_FROM_LIST, CLEAR_OLD_LIST, FETCH_USER_SHOPPING_LISTS } from './types'
import { getCurrListId, fetchList, addItemToList, removeItemFromList, createList, getCurrCustomerId, fetchCustomerShoppingLists } from '../utils/CommonUtils';

export const fetchUserShoppingListsAction = function (userId) {
    if (!userId) {
        userId = getCurrCustomerId();
    }
    return async function (dispatch) {
        let response = await fetchCustomerShoppingLists(userId)
        dispatch({
            type: FETCH_USER_SHOPPING_LISTS,
            payload: response
        })
    }
}

export const fetchListFromSession = () => dispatch => {
    dispatch({
        type: FETCH_LIST_FROM_SESSION
    })
}

export const clearOldListFromSession = () => dispatch => {
    dispatch({
        type: CLEAR_OLD_LIST
    })
}

export const fetchListById = function () {
    return async function (dispatch) {
        let respnse = {};
        let currListId = getCurrListId();
        if (currListId) {
            response = await fetchList(currListId);
        }
        dispatch({
            type: FETCH_LIST_BY_ID,
            payload: response
        })
    }
}

export const createListAction = function (listName, currSelectedSku) {
    return async function (dispatch) {
        if (listName && currSelectedSku) {
            let response = await createList(listName);
            if(response.body){
                response = await addItemToList(currSelectedSku);
            }
            dispatch({
                type: CREATE_LIST,
                payload: response
            })
        }
    }
}

export const addToListAction = function (currSelectedSku) {
    return async function (dispatch) {
        let currListId = getCurrListId();
        if (currListId) {
            let response = await addItemToList(currSelectedSku);
            dispatch({
                type: ADD_TO_LIST,
                payload: response
            })
        }
    }
}

export const removeItemFromListAction = function (itemId) {
    return async function (dispatch) {
        let response = await removeItemFromList(itemId)
        dispatch({
            type: REMOVE_FROM_LIST,
            payload: response
        })
    }
}