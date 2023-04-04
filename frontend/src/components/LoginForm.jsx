import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { postLoginData } from '../redux/actions/authActions';
import validateManyFields from '../validations';
import { Input } from './utils/Input';
import Loader from './utils/Loader';

const LoginForm = ({ redirectUrl }) => {

  // Initialize state variables for form errors and form data
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  // Set up navigation using the useNavigate hook
  const navigate = useNavigate();

  // Get authentication state from Redux store
  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;

  // Set up dispatch to call actions on the Redux store
  const dispatch = useDispatch();

  // Use useEffect to redirect user to specified URL if they are logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  // Update form data state on input change
  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    // Validate form data using external validation function
    const errors = validateManyFields("login", formData);
    // Clear previous form errors
    setFormErrors({});
    // If there are errors, set form error state with the errors
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    // Dispatch login action with form data
    dispatch(postLoginData(formData.email, formData.password));
  }

  // Helper function to render a field error message if there is an error for the given field
  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  // Render login form
  return (
    <>
      <form className='m-auto my-16 max-w-[500px] bg-white p-8 border-2 shadow-md rounded-md'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4'>Welcome user, please login here</h2>
            <div className="mb-4">
              <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">Email</label>
              <Input type="text" name="email" id="email" value={formData.email} placeholder="youremail@domain.com" onChange={handleChange} />
              {fieldError("email")}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-red-500">Password</label>
              <Input type="password" name="password" id="password" value={formData.password} placeholder="Your password.." onChange={handleChange} />
              {fieldError("password")}
            </div>

            <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>Submit</button>

            <div className='pt-4'>
              <Link to="/signup" className='text-blue-400'>Don't have an account? Signup here</Link>
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default LoginForm
