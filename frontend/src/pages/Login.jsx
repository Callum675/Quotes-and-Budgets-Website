import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import MainLayout from '../layouts/MainLayout';

// This is a functional component that renders the Login page
const Login = () => {

  // This hook provides access to the current URL location
  const { state } = useLocation();

  // This line checks if there is a redirect URL in the state object and assigns it to redirectUrl variable
  const redirectUrl = state?.redirectUrl || null;

  // This hook updates the document title when the component mounts
  useEffect(() => {
    document.title = "Login";
  }, []);

  // This is the rendered JSX code that includes the LoginForm component wrapped in MainLayout
  return (
    <>
      <MainLayout>
        <LoginForm redirectUrl={redirectUrl} />
      </MainLayout>
    </>
  )
}

// This exports the Login component as the default export of the module
export default Login
