import styled from 'styled-components';
import background from "assets/img/layout.png";

export const Container = styled.nav`
  grid-area: NB;

  background: url(${background});
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  button {
    background: transparent;
    border: 0;
    color:white;
  }
  @media screen and (max-width: 850px) {
    flex: none;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-left: 16px;
  }

`;

export const Img = styled.img`
  width: 70px;
  border-radius: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    text-align: left;
  }

  input {
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    margin-top: 3px;
  }

  button {
    padding: 10px 15px;
    background: rgb(102, 77, 255);
    color: #fff;
    cursor: pointer;
    border: 0 none;
    border-radius: 14px;
    width: 50%;
    margin: auto;
    font-size: 15px;
    margin-top: 10px;
  }
`;

