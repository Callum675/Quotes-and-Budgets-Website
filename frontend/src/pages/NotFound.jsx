// Import the React library to use React components
import React from 'react'

// Import the MainLayout component from the specified file path
import MainLayout from '../layouts/MainLayout'

// Define a functional component named NotFound
const NotFound = () => {
  // Return JSX that will be rendered to the DOM
  return (
    // Render the MainLayout component
    <MainLayout>
      {/* Render a div with specific styles */}
      <div className='w-full py-16 text-center'>
        {/* Render a large heading with a margin */}
        <h1 className='text-7xl my-8'>404</h1>
        {/* Render a smaller subheading */}
        <h2 className='text-xl'>The page you are looking for doesn't exist</h2>
      </div>
    </MainLayout>
  )
}

// Export the NotFound component to be used in other parts of the application
export default NotFound
