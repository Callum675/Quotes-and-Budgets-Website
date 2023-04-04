// Importing necessary modules and components from their respective files
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Project from "./pages/Project";
import Signup from "./pages/Signup";
import { saveProfile } from "./redux/actions/authActions";

// Exporting the main function
export default function App() {

  // Using the useSelector hook to access state values from the store, and storing them in a variable
  const authState = useSelector(state => state.authReducer);

  // Using the useDispatch hook to get access to the dispatch method, which is used to dispatch actions to the store
  const dispatch = useDispatch();

  // Using the useEffect hook to dispatch an action to the store when the component mounts or when the authState.isLoggedIn value changes
  useEffect(() => {
    // Getting the token from local storage
    const token = localStorage.getItem("token");

    // If there is no token, return from this function
    if (!token) return;

    // Dispatch the saveProfile action with the token as an argument
    dispatch(saveProfile(token));
  }, [authState.isLoggedIn, dispatch]);

  // Returning the JSX for the App component
  return (
    <>
      {/* Wrapping the Routes inside a BrowserRouter */}
      <BrowserRouter>
        {/* Rendering the Routes */}
        <Routes>
          {/* Defining the routes */}

          {/* Route for the home page */}
          <Route path="/" element={<Home />} />

          {/* Route for the signup page */}
          <Route path="/signup" element={authState.isLoggedIn ? <Navigate to="/" /> : <Signup />} />

          {/* Route for the login page */}
          <Route path="/login" element={<Login />} />

          {/* Route for adding a new project */}
          <Route path="/projects/add" element={authState.isLoggedIn ? <Project /> : <Navigate to="/login" state={{ redirectUrl: "/projects/add" }} />} />

          {/* Route for viewing a specific project */}
          <Route path="/projects/:projectId" element={authState.isLoggedIn ? <Project /> : <Navigate to="/login" state={{ redirectUrl: window.location.pathname }} />} />

          {/* Route for handling invalid URLs */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
