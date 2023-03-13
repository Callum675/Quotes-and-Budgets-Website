import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Projects = () => {

  const authState = useSelector(state => state.authReducer);
  const [projects, setProjects] = useState([]);
  const [fetchData, { loading }] = useFetch();
  //combine quotes logic
  const [selectedProjects, setSelectedProjects] = useState([]);

  const fetchProjects = useCallback(() => {
    const config = { url: "/projects", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setProjects(data.projects));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchProjects();
  }, [authState.isLoggedIn, fetchProjects]);


  const handleDelete = (id) => {
    const config = { url: `/projects/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchProjects());
  }

  const handleCheckboxChange = (id) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter(selectedId => selectedId !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };
  
  const combineQuotes = () => {
    const selectedProjectsIds = projects.filter(project => selectedProjects.includes(project._id)).map(project => project._id);
    console.log(selectedProjectsIds)

    //update database
    const config = {
      url: `/projects`,
      method: "put",
      headers: { Authorization: authState.token },
      data: { projects: selectedProjectsIds }
    };
    
    fetchData(config).then(() => {
      setProjects(selectedProjectsIds);
      setSelectedProjects([]);
    });
  };

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
        {projects.length !== 0 && (
            <>
              <div className="flex justify-between items-center">
                <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your projects ({projects.length})</h2>
                {projects.length > 1 && (
                  <button className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
                  onClick={combineQuotes} disabled={selectedProjects.length < 2}
                  >Combine Quotes</button>
                )}
              </div>
            </>
          )}
        {loading ? (
          <Loader />
        ) : (
          <div>
            <div className="flex items-center justify-end mb-4">
              <span>{selectedProjects.length} projects selected</span>
            </div>
            {projects.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No projects found</span>
                <Link to="/projects/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new project </Link>
              </div>

            ) : (
              projects.map((project, index) => (
                <div key={project._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>

                    <div className='flex items-center'>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedProjects.includes(project._id)}
                        onChange={() => handleCheckboxChange(project._id)}
                      />
                    </div>
                    
                    <span className='font-medium'>{ project.name || `Project ${index + 1}` }</span>

                    <Tooltip text={"Edit this project"} position={"top"}>
                      <Link to={`/projects/${project._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this project"} position={"top"}>
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(project._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>

                  <Tooltip text={"Quote is calculated using Workers pay in hours and the cost of Non-Human Resources in one off payments"} position={"left"}>
                    <div className='whitespace-pre'>{"Quote: £" + project.totalCost}</div>
                  </Tooltip>
                  <div className='whitespace-pre'>{"Description: " + project.description}</div>
                  <div className='whitespace-pre'>{"Workers: " + project.workers.map(worker => worker.name).join(', ')}</div>
                  <div className='whitespace-pre'>{"Non-Human Resources: " + project.resources.map(worker => worker.name).join(', ')}</div>
                  
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Projects