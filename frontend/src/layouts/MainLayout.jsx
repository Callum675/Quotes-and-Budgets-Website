import React from 'react';
import Navbar from '../components/Navbar';

// Define a functional component named MainLayout that takes in a 'children' prop
const MainLayout = ({ children }) => {
  // Return a JSX element
  return (
    <>
      {/* Define a div element with relative positioning, gray background color, and full-screen height and width */}
      <div className='relative bg-gray-50 h-screen w-screen overflow-x-hidden'>
        {/* Render the Navbar component */}
        <Navbar />
        {/* Render the 'children' prop passed into the MainLayout component */}
        {children}
      </div>
    </>
  )
}

// Export the MainLayout component as the default export
export default MainLayout;
