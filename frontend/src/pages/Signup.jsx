import React, { useEffect } from 'react'; // Importing React and useEffect from 'react'
import SignupForm from '../components/SignupForm'; // Importing the SignupForm component
import MainLayout from '../layouts/MainLayout'; // Importing the MainLayout component

// Defining the Signup functional component
const Signup = () => {

  // Using the useEffect hook to set the document title
  useEffect(() => {
    document.title = "Signup";
  }, []);

  // Returning the MainLayout component with the SignupForm component as a child
  return (
    <>
      <MainLayout>
        <SignupForm />
      </MainLayout>
    </>
  )
}

// Exporting the Signup component as the
export default Signup
