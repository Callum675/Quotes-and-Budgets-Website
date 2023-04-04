// Importing necessary dependencies
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";

// Custom hook for fetching data from API
const useFetch = () => {

  // Initializing the state using useState hook
  const [state, setState] = useState({
    loading: false,
    data: null,
    successMsg: "",
    errorMsg: "",
  });

  // Defining function to fetch data from API
  const fetchData = useCallback(async (config, otherOptions) => {
    // Destructuring options with default values
    const { showSuccessToast = true, showErrorToast = true } = otherOptions || {};

    // Updating state to indicate loading
    setState(state => ({ ...state, loading: true }));

    try {
      // Sending request to API using axios
      const { data } = await api.request(config);

      // Updating state with received data and success message
      setState({
        loading: false,
        data,
        successMsg: data.msg || "success",
        errorMsg: ""
      });

      // Showing success toast notification if option is true
      if (showSuccessToast) toast.success(data.msg);

      // Resolving promise with received data
      return Promise.resolve(data);
    }
    catch (error) {
      // Getting error message from response data or error object
      const msg = error.response?.data?.msg || error.message || "error";

      // Updating state with error message
      setState({
        loading: false,
        data: null,
        errorMsg: msg,
        successMsg: ""
      });

      // Showing error toast notification if option is true
      if (showErrorToast) toast.error(msg);

      // Rejecting promise with error message
      return Promise.reject();
    }
  }, []);

  // Returning the fetchData function and current state as an array
  return [fetchData, state];
}

// Exporting the useFetch hook as the default export
export default useFetch
