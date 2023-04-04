import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from '../actions/actionTypes';

// Define initial state for the reducer
const initialState = {
  loading: false,
  user: {},
  isLoggedIn: false,
  token: '',
  successMsg: '',
  errorMsg: '',
};

// Define the reducer function
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      // Return new state when login request is dispatched
      return { loading: true, user: {}, isLoggedIn: false, token: '', successMsg: '', errorMsg: '' };
    case LOGIN_SUCCESS:
      // Return new state when login success is dispatched
      return {
        loading: false,
        user: action.payload.user,
        isLoggedIn: true,
        token: action.payload.token,
        successMsg: action.payload.msg,
        errorMsg: '',
      };
    case LOGIN_FAILURE:
      // Return new state when login failure is dispatched
      return { loading: false, user: {}, isLoggedIn: false, token: '', successMsg: '', errorMsg: action.payload.msg };
    case LOGOUT:
      // Return new state when logout is dispatched
      return { loading: false, user: {}, isLoggedIn: false, token: '', successMsg: '', errorMsg: '' };
    case SAVE_PROFILE:
      // Return new state when save profile is dispatched
      return {
        loading: false,
        user: action.payload.user,
        isLoggedIn: true,
        token: action.payload.token,
        successMsg: '',
        errorMsg: '',
      };
    default:
      // Return current state for any other action
      return state;
  }
};

// Export the reducer as the default export
export default authReducer;
