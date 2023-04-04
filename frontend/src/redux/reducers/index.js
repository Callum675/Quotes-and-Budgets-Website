// Importing the combineReducers function from the "redux" library
import { combineReducers } from 'redux';

// Importing the authReducer from the "./authReducer" file
import authReducer from './authReducer';

// Creating a rootReducer that combines all reducers
const rootReducer = combineReducers({
  authReducer, // Using the shorthand property name syntax for "authReducer: authReducer"
});

// Exporting the rootReducer as the default export of this module
export default rootReducer;
