import styled from "styled-components";
import background from "assets/img/layout.png";
export const Container = styled.div`
  background: url(${background});
  position: relative;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
`;
