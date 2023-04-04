// Importing the necessary functions from the redux library and a middleware called 'thunk'
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

// Importing the rootReducer that will combine all the reducers into a single one
import rootReducer from './reducers';

// Creating an array with the middleware to be applied to the store
const middleware = [thunk];

// Defining the composeEnhancers function that allows us to use the Redux DevTools extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Creating a new store by combining the rootReducer and the middleware using the composeEnhancers function
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

// Exporting the store to be used in other parts of the application
export default store;
