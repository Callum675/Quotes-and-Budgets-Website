import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Projects from '../components/Projects';
import MainLayout from '../layouts/MainLayout';

// Define the Home component
const Home = () => {

  // Access the state of the authReducer using useSelector
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState; // Extract isLoggedIn from authState

  // Update the document title based on the authState
  useEffect(() => {
    document.title = authState.isLoggedIn ? `${authState.user.name}'s projects` : "Quotes and Budgets";
  }, [authState]);

  // Return the Home component's UI
  return (
    <>
      <MainLayout>
        {/* If user is not logged in, display this section */}
        {!isLoggedIn ? (
          <div className='bg-primary text-white h-[40vh] py-8 text-center'>
            <h1 className='text-2xl'> Welcome to Quotes and Budgets App</h1>
            <Link to="/signup" className='mt-10 text-xl block space-x-2 hover:space-x-4'>
              <span className='transition-[margin]'>Join now to manage the Cost of your Projects</span>
              <span className='relative ml-4 text-base transition-[margin]'><i className="fa-solid fa-arrow-right"></i></span>
            </Link>
          </div>
        ) : ( // Otherwise, display this section
          <>
            <h1 className='text-lg mt-8 mx-8 border-b border-b-gray-300'>Welcome {authState.user.name}</h1>
            <Projects />
          </>
        )}
      </MainLayout>
    </>
  )
}

export default Home
