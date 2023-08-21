// store.js
import { createStore } from 'redux';

// Action Types
const SET_DYNAMIC_URL = 'SET_DYNAMIC_URL';

// Action Creator
export const setDynamicUrl = url => ({
  type: SET_DYNAMIC_URL,
  payload: url,
});

// Initial State
const initialState = {
  dynamicUrl: null,
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DYNAMIC_URL:
      return { ...state, dynamicUrl: action.payload };
    default:
      return state;
  }
};

// Store
const store = createStore(reducer);

export default store;
