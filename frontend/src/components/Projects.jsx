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


  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">

        {projects.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your projects ({projects.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {projects.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No projects found</span>
                <Link to="/projects/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new project </Link>
              </div>

            ) : (
              projects.map((project, index) => (
                <div key={project._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>

                    <span className='font-medium'>Project #{index + 1}</span>

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
                  <div className='whitespace-pre'>{project.description}</div>
                  <div className='whitespace-pre'>{project.workers}</div>
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