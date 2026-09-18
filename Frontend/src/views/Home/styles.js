import styled from "styled-components";
import background from "assets/img/layout.png";

export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 15px;
  flex-direction: column;
  text-align: center;
`;

export const ContainerExt = styled.div`
  background: url(${background});
  position: relative;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
`;
export const ContainerBox = styled.div`
  background: #fff;
  border-radius: 4px;
  margin: auto;
//  padding: 40px 30px;
  width: 370px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;
export const Input = styled.input``;
