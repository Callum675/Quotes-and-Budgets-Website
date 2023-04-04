// Import required modules
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

// Define the Project component
const Project = () => {

  // Get the authentication state from the Redux store
  const authState = useSelector(state => state.authReducer);

  // Define a navigation function for redirecting to other pages
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();

  // Get the project ID parameter from the URL
  const { projectId } = useParams();

  // Set the form mode to "add" or "update"
  const mode = projectId === undefined ? "add" : "update";

  // Set the initial state of the project form data
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workers: [],
    resources: [],
  });
  const [formErrors, setFormErrors] = useState({});

  // Set the document title based on the form mode
  useEffect(() => {
    document.title = mode === "add" ? "Add project" : "Update Project";
  }, [mode]);

  // Load the project data from the server if in "update" mode
  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/projects/${projectId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setProject(data.project);
        setFormData({
          name: data.project.name,
          description: data.project.description,
          workers: data.project.workers,
          resources: data.project.resources,
        });
      });
    }
  }, [ mode, authState, projectId, fetchData]);

  // Add a new worker to the form
  const handleAddWorker = (event) => {
    event.preventDefault();

    setFormData({
      ...formData,
      workers: [
        ...formData.workers,
        {
          name: "",
          payGrade: "",
          manHours: 0,
        },
      ],
    });
  };

  // Add a new resource to the form
  const handleAddResource = (event) => {
    event.preventDefault();

    setFormData({
      ...formData,
      resources: [
        ...formData.resources,
        {
          name: "",
          cost: 0,
        },
      ],
    });
  };

  // Remove a worker from the form
  const handleRemoveWorker = (index) => {
    const updatedWorkers = [...formData.workers];
    updatedWorkers.splice(index, 1);
    setFormData({
      ...formData,
      workers: updatedWorkers,
    });
  };

  // Remove a resource from the form
  const handleRemoveResource = (index) => {
    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);
    setFormData({
      ...formData,
      resources: updatedResources,
    });
  };

  // Update the form data when any field is changed
  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  // Update a worker field when it is changed
  const handleChangeWorker = (e, workerIndex) => {
    const { name, value } = e.target;
    const updatedWorker = {
      ...formData.workers[workerIndex],
      [name]: value,
    };
    const updatedWorkers = [...formData.workers];
    updatedWorkers[workerIndex] = updatedWorker;
    setFormData({
      ...formData,
      workers: updatedWorkers,
    });
  };

  // Update a resource field when it is changed
  const handleChangeResource = (e, resourceIndex) => {
    const { name, value } = e.target;
    const updatedResource = {
      ...formData.resources[resourceIndex],
      [name]: value,
    };
    const updatedResources = [...formData.resources];
    updatedResources[resourceIndex] = updatedResource;
    setFormData({
      ...formData,
      resources: updatedResources,
    });
  };

  // This function resets the form data to its initial state.
  const handleReset = e => {
    e.preventDefault();
    if (mode === "update" && project) {
      // If in update mode and a project object is present, fill the form with the project data.
      setFormData({
        name: project.name,
        description: project.description,
        workers: project.workers,
        resources: project.resources,
      });
    } else {
      // Otherwise, set the form data to empty.
      setFormData({
        name: "",
        description: "",
        workers: [],
        resources: [],
      });
    }
  }

  // This function is called when the form is submitted.
  const handleSubmit = e => {
    e.preventDefault();
    // Validate the form data.
    const errors = validateManyFields("project", formData);
    // Clear any previous form errors.
    setFormErrors({});

    // If there are validation errors, set the form errors.
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (mode === "add") {
      // If in add mode, send a POST request to add a new project.
      const config = { url: "/projects", method: "post", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
    else {
      // Otherwise, send a PUT request to update the existing project.
      const config = { url: `/projects/${projectId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  }

  // This function returns an error message for a given form field.
  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

// This is the main component that renders the form.
// It uses the above functions and some additional logic to render the form fields and buttons.
  return (
    <>
      <MainLayout>
        <form className='m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md'>
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Title of form*/}
              <h2 className='text-center mb-4'>{mode === "add" ? "Add New Project" : "Edit Project"}</h2>

              {/* Project name input*/}
              <div className="mb-4">
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" id="name" value={formData.name} placeholder="Project Name" onChange={handleChange} />
                {fieldError("name")}
              </div>

              {/* Project description input*/}
              <div className="mb-4">
                <label htmlFor="description">Description: </label>
                <Textarea type="description" name="description" id="description" value={formData.description} placeholder="Write here.." onChange={handleChange} />
                {fieldError("description")}
              </div>

              {/* Project workers input*/}
              <div className="mb-4">
                <label htmlFor="workers">Workers: </label>
                {formData.workers.map((worker, index) => (
                  <div key={index}>
                    <input type="text" name={`name`} value={worker.name} placeholder="Worker Name" onChange={(e) => handleChangeWorker(e, index)} />
                    <select name={`payGrade`} value={worker.payGrade} onChange={(e) => handleChangeWorker(e, index)}>
                      <option value="">Select Pay Grade</option>
                      <option value="junior">Junior</option>
                      <option value="standard">Standard</option>
                      <option value="senior">Senior</option>
                    </select>
                    <input type="number" name={`manHours`} value={worker.manHours} placeholder="Man Hours" onChange={(e) => handleChangeWorker(e, index)} />
                    <button className="ml-4 bg-red-500 text-white px-4 py-2 font-medium" onClick={() => handleRemoveWorker(index)}>Remove</button>
                  </div>
                ))}
                {/* Add worker button */}
                <button className="bg-green-500 text-white px-4 py-2 font-medium" onClick={handleAddWorker}>Add Worker</button>
                {fieldError("workers")}
              </div>

              {/* Project resources input*/}
              <div className="mb-4">
                <label htmlFor="resources">Non-Human Resources: </label>
                {formData.resources.map((resource, index) => (
                  <div key={index}>
                    <input type="text" name={`name`} value={resource.name} placeholder="Resource Name" onChange={(e) => handleChangeResource(e, index)} />
                    <input type="number" name={`cost`} value={resource.cost} placeholder="Resource Cost" onChange={(e) => handleChangeResource(e, index)} />
                    <button className="ml-4 bg-red-500 text-white px-4 py-2 font-medium" onClick={() => handleRemoveResource(index)}>Remove</button>
                  </div>
                ))}
                {/* Add resources button */}
                <button className="bg-green-500 text-white px-4 py-2 font-medium" onClick={handleAddResource}>Add Resource</button>
                {fieldError("resources")}
              </div>

              {/* Submit button*/}
              <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>{mode === "add" ? "Add project" : "Update Project"}</button>

              {/* Cancel button*/}
              <button className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate("/")}>Cancel</button>

              {/* Reset button*/}
              {mode === "update" && <button className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>Reset</button>}
            </>
          )}
        </form>
      </MainLayout>
    </>
  )
}

export default Project
