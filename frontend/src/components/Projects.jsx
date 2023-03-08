import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Projects({ projects, changeProject}) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  
  const changeCurrentProject = (index, project) => {
    setCurrentSelected(index);
    changeProject(project);
  };
  return (
    <>
      <Container>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h3>Refer</h3>
        </div>
        <div className="projects">
          {projects.map((project, index) => {
            return (
              <div
                key={project._id}
                className={`project ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentProject(index, project)}
              >
              </div>
            );
            })}
        </div>
      </Container>
    </>
  );
}
  
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #0ecfff;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .projects {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .project {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
    }
  }
`;
