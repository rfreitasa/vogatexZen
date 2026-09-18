import styled from "styled-components";

export const Wrapper = styled.div`
  text-align: center;

  h3 {
    font-weight: bold;
    margin: 0;
    margin-bottom: 19px;
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

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;

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
      margin-top: 15px;
    }

    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }
  }
`;

export const Container = styled.div``;
