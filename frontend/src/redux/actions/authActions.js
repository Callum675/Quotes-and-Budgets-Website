import { toast } from 'react-toastify'; // Importing the toast module
import api from '../../api'; // Importing the api module
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from './actionTypes'; // Importing the action types

// An async function to login the user with given email and password
export const postLoginData = (email, password) => async (dispatch) => {
  try {
    // Dispatching the action to initiate login request
    dispatch({ type: LOGIN_REQUEST });

    // Posting user credentials to the login endpoint
    const { data } = await api.post('/auth/login', { email, password });
    dispatch({
      type: LOGIN_SUCCESS, // Dispatching the action when login is successful
      payload: data, // Sending the data received from server with this action
    });

    // Saving the auth token in local storage
    localStorage.setItem('token', data.token);

    // Showing success message in toast
    toast.success(data.msg);
  } catch (error) {
    // Handling login failure
    // Extracting error message from response or error object
    const msg = error.response?.data?.msg || error.message;
    dispatch({
      type: LOGIN_FAILURE, // Dispatching the action when login fails
      payload: { msg }, // Sending the error message with this action
    });
    // Showing error message in toast
    toast.error(msg);
  }
};

// An async function to save the user profile
export const saveProfile = (token) => async (dispatch) => {
  try {
    const { data } = await api.get('/profile', {
      headers: { Authorization: token }, // Sending the auth token in request header
    });
    dispatch({
      type: SAVE_PROFILE, // Dispatching the action to save user profile
      payload: { user: data.user, token }, // Sending the user data and auth token with this action
    });
  } catch (error) {
    // Handling profile save failure
    // console.log(error);
  }
};

// A function to logout the user
export const logout = () => (dispatch) => {
  // Removing the auth token from local storage
  localStorage.removeItem('token');

  // Dispatching the action to logout the user
  dispatch({ type: LOGOUT });

  // Redirecting the user to home page after logout
  document.location.href = '/';
};
