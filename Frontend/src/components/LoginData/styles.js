import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;

  width: 370px;
  min-height: 315px;
  padding: 15px 20px;
  box-sizing: border-box;

  background: #ffffff;
  border-radius: 4px;

  .img {
    width: 200px;
    height: auto;
    margin-bottom: 15px;
  }

  h3 {
    margin: 5px 0 15px 0;
    padding: 0;
    font-size: 30px;
    font-weight: 600;
    color: #3f3f3f;
  }

  form {
    width: 90% !important;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .MuiGrid-container {
    justify-content: center;
  }

  .MuiSvgIcon-root {
    color: #455a64;
  }

  .MuiFormControl-root {
    width: 183px;
  }

  .MuiInputBase-root {
    background: transparent !important;
  }

  .MuiInput-root {
    background: transparent !important;
  }

  .MuiInputBase-input {
    background: transparent !important;
    color: #424242 !important;
    font-size: 16px;
    padding: 6px 0 7px !important;
  }

  .MuiInputLabel-root {
    color: #757575 !important;
    font-size: 16px;
  }

  .MuiInputLabel-root.Mui-focused {
    color: #3f51b5 !important;
  }

  .MuiInput-underline:before {
    border-bottom: 1px solid #9e9e9e !important;
  }

  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 1px solid #616161 !important;
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid #3f51b5 !important;
  }

  .MuiButton-root {
    min-width: 87px !important;
    width: auto !important;
    height: 36px !important;
    min-height: 36px !important;

    margin: 10px auto 0 auto !important;
    padding: 6px 16px !important;

    border-radius: 4px !important;

    background: #3f51b5 !important;
    background-color: #3f51b5 !important;

    color: #ffffff !important;

    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 1.75 !important;
    text-transform: uppercase !important;

    box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
  }

  .MuiButton-root:hover {
    background: #303f9f !important;
    background-color: #303f9f !important;
  }

  .MuiButton-root .MuiButton-label {
    color: #ffffff !important;
  }

  .MuiButton-root span {
    color: #ffffff !important;
  }

  .MuiButton-containedPrimary {
    background-color: #3f51b5 !important;
    color: #ffffff !important;
  }
`;

export const Input = styled.input``;