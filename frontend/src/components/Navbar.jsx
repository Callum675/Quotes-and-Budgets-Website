import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';

const Navbar = () => {

  // Select the authentication state from the Redux store
  const authState = useSelector(state => state.authReducer);

  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();

  // Get the dispatch function from the Redux store
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Function to toggle the navbar open/closed
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }

  // Function to handle the logout button click
  const handleLogoutClick = () => {
    dispatch(logout());
  }

  // Render the navbar
  return (
    <>
      <header className='flex justify-between sticky top-0 p-4 bg-white shadow-sm items-center'>
        {/* Logo */}
        <h2 className='cursor-pointer uppercase font-medium'>
          <Link to="/"> Quotes and Budgets </Link>
        </h2>

        {/* Desktop menu */}
        <ul className='hidden md:flex gap-4 uppercase font-medium'>
          {authState.isLoggedIn ? (
            <>
              {/* Add project button */}
              <li className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md">
                <Link to='/projects/add' className='block w-full h-full px-4 py-2'> <i className="fa-solid fa-plus"></i> Add project </Link>
              </li>

              {/* Logout button */}
              <li className='py-2 px-3 cursor-pointer text-primary hover:bg-gray-200 transition rounded-sm' onClick={handleLogoutClick}>Logout</li>
            </>
          ) : (
            // Login button
            <li className='py-2 px-3 cursor-pointer text-primary hover:bg-gray-100 transition rounded-sm'><Link to="/login">Login</Link></li>
          )}
        </ul>

        {/* Mobile menu toggle */}
        <span className='md:hidden cursor-pointer' onClick={toggleNavbar}><i className="fa-solid fa-bars"></i></span>

        {/* Mobile menu */}
        <div className={`absolute md:hidden right-0 top-0 bottom-0 transition ${(isNavbarOpen === true) ? 'translate-x-0' : 'translate-x-full'} bg-gray-100 shadow-md w-screen sm:w-9/12 h-screen`}>
          {/* Close button */}
          <div className='flex'>
            <span className='m-4 ml-auto cursor-pointer' onClick={toggleNavbar}><i className="fa-solid fa-xmark"></i></span>
          </div>

          {/* Mobile menu items */}
          <ul className='flex flex-col gap-4 uppercase font-medium text-center'>
            {authState.isLoggedIn ? (
              <>
              {/* Add project button */}
                <li className="bg-blue-500 text-white hover:bg-blue-600 font-medium transition py-2 px-3">
                  <Link to='/projects/add' className='block w-full h-full'> <i className="fa-solid fa-plus"></i> Add project </Link>
                </li>
                {/* Logout button */}
                <li className='py-2 px-3 cursor-pointer text-primary hover:bg-gray-200 transition rounded-sm' onClick={handleLogoutClick}>Logout</li>
              </>
            ) : (
              // Login button
              <li className='py-2 px-3 cursor-pointer text-primary hover:bg-gray-200 transition rounded-sm'><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </header>
    </>
  )
}

export default Navbar
