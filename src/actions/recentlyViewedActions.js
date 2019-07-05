import { FETCH_RECENTLY_VIEWED_FROM_SESSION, FETCH_RECENTLY_VIEWED_BY_IDS, UPDATE_RECENTLY_VIEWED } from '../actions/types'
import { getRecentlyViewedIds, updateRecentlyViewed, fetchProductListById, fetchProductById } from '../utils/CommonUtils';

export const fetchRecentlyViewedFromSessionAction = () => dispatch => {
    dispatch({
        type: FETCH_RECENTLY_VIEWED_FROM_SESSION
    })
}

export const fetchRecentlyViewedByIdsAction = function () {
    return async function (dispatch) {
        let recentlyViewedIds = getRecentlyViewedIds();
        let productList = await fetchProductListById(recentlyViewedIds);
        let recentlyViewedItems = [];
        recentlyViewedIds.map(function (currRecord) {
            productList.body.results.map(function (currProduct) {
                if (currRecord === currProduct.id) {
                    recentlyViewedItems.push(currProduct)
                }
            })
        })
        let response = { recentlyViewedIds, recentlyViewedItems };
        dispatch({
            type: FETCH_RECENTLY_VIEWED_BY_IDS,
            payload: response
        })
    }
}

export const updateRecentlyViewedAction = function (productId, recentlyViewedItems) {
    let recentlyViewedIds = [];
    return async function (dispatch) {
        let indexToUpdate = updateRecentlyViewed(productId);
        let productItem = null;
        if (indexToUpdate != -1) {
            productItem = recentlyViewedItems[indexToUpdate];
            recentlyViewedItems.splice(indexToUpdate, 1);
        }
        if (recentlyViewedItems.length >= 5) {
            recentlyViewedItems.shift();
        }
        if (!productItem) {
            productItem = await fetchProductById(productId).body;
        }
        recentlyViewedItems.push(productItem)
        let recentlyViewedIds = getRecentlyViewedIds();
        let response = { recentlyViewedIds, recentlyViewedItems };
        dispatch({
            type: UPDATE_RECENTLY_VIEWED,
            payload: response
        })
    }
}