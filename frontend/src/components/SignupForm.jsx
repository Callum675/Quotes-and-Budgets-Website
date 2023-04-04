import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import { Input } from './utils/Input';
import Loader from './utils/Loader';

const SignupForm = () => {

  // Declare state variables using the useState hook
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Use the useFetch hook to handle API requests
  const [fetchData, { loading }] = useFetch();

  // Use the useNavigate hook to handle navigation between pages
  const navigate = useNavigate();

  // Handle changes in the form inputs
  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    // Validate form data using external validation function
    const errors = validateManyFields("signup", formData);
    // Clear previous form errors
    setFormErrors({});
    // If there are errors, set form error state with the errors
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    // If there are no errors, make an API request to sign up the user
    const config = { url: "/auth/signup", method: "post", data: formData };
    fetchData(config).then(() => {
      // After signing up, navigate to the login page
      navigate("/login");
    });

  }

  // Helper function to render a field error message if there is an error for the given field
  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  // Render the SignupForm component
  return (
    <>
      <form className='m-auto my-16 max-w-[500px] p-8 bg-white border-2 shadow-md rounded-md'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4'>Welcome user, please signup here</h2>
            <div className="mb-4">
              <label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">Name</label>
              <Input type="text" name="name" id="name" value={formData.name} placeholder="Your name" onChange={handleChange} />
              {fieldError("name")}
            </div>

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
              <Link to="/login" className='text-blue-400'>Already have an account? Login here</Link>
            </div>
          </>
        )}

      </form>
    </>
  )
}

export default SignupForm
