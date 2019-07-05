import { FETCH_RECENTLY_VIEWED_FROM_SESSION, FETCH_RECENTLY_VIEWED_BY_IDS, UPDATE_RECENTLY_VIEWED } from '../actions/types'

const initialState = {
    recentlyViewedIds: [],
    recentlyViewedItems: [],
}

export default function (state = initialState, action) {
    let response = action.payload;
    switch (action.type) {
        case FETCH_RECENTLY_VIEWED_BY_IDS:
            return {
                ...state,
                recentlyViewedIds: response && response.recentlyViewedIds ? response.recentlyViewedIds : state.recentlyViewedIds,
                recentlyViewedItems: response && response.recentlyViewedItems ? response.recentlyViewedItems : state.recentlyViewedItems
            }
        case UPDATE_RECENTLY_VIEWED:
            return {
                ...state,
                recentlyViewedIds: response && response.recentlyViewedIds ? response.recentlyViewedIds : state.recentlyViewedIds,
                recentlyViewedItems: response && response.recentlyViewedItems ? response.recentlyViewedItems : state.recentlyViewedItems
            }
        default:
            return {
                ...state
            }
    }
}