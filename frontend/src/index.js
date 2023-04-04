// Import React and ReactDOM libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import CSS styles
import './index.css';

// Import the main App component and Redux store
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';

// Import the ToastContainer component and its CSS styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a root element to render the app in
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <React.StrictMode>
    {/* Render a ToastContainer component to show toast notifications */}
    <ToastContainer bodyStyle={{ fontFamily: 'Roboto' }} />

    {/* Wrap the App component inside a Provider component to give it access to the Redux store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
