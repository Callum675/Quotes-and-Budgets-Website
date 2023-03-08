import React, { useState, useEffect } from "react";
import styled from "styled-components";
export default function Welcome() {
  
  return (
    <Container>
      <h1>
        Welcome
      </h1>
      <h3>Please select a Project or create a new Project</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
