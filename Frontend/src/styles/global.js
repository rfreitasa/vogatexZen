import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { shade } from 'polished';

export default createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: 0;
  }

  :root {
    --primary: #edf0f4;
    --blue: #008f85;
    --blue-b: #004970;
    --red: #c53030;
    --grey: #e9e9e9;
    --white: #fff;
    --yellow: #FFD400;
    --text: #333;
  }

  body {
    background: var(--primary);
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
     min-height: 100%;
     height: 100%;
     max-height: 100%;

  }

  input, button, pre {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
  }

  pre {
    word-break: break-word;
  }

  input:read-only {
    background: var(--grey);
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 700;
    text-transform: none;
  }

  button {
    cursor: pointer;
  }

  button[type='submit'] {
    transition: background-color 0.2s;
  }

  button[type='submit']:hover {
    background-color: ${shade(0.2, '#FFD400')}!important;
  }

  .Toastify__toast-container {
    z-index: 100000;
  }

  .ReactModalPortal .ReactModal__Overlay {
    z-index: 99999!important;
  }

  .active {
    border-left: 2px solid #FFD400;
  }

  .select {
    margin: 10px 0;
  }

  .react-select__control,
  .select .css-yk16xz-control {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #232129;
  }

  .react-select__placeholder, .css-1wa3eu0-placeholder, .react-select__option,  .react-select__option--is-focused, .css-1n7v3ny-option{
    color: #232129!important;
  }
  .ReactModalPortal .ReactModal__Overlay {
    background-color: rgba(0,0,0, 0.8)!important;
    z-index: 20;

    .closeButton {
      border: 0;
      padding: 5px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      position: absolute;
      top: 6px;
      right: 2px;
      transition: background 0.4s;
    }
  }

  .activeBread {
    background-color: var(--yellow)!important;
    border-color: var(--yellow)!important;

    &:before {
      content: '';
      border-left-color: #fff;
    }

    &::after {
      content: '';
      border-top: 1rem solid transparent;
      border-bottom: 1rem solid transparent;
      border-left: 1rem solid var(--yellow)!important;
      position: absolute;
      right: -1rem;
      top: 0;
      z-index: 2;
   }
  }

  .formLogin {
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    padding: 0 25px;
    background: transparent;

    article, input {
      height: 30px;
    }

    h1 {
      color: #fff;
    }

    button, .input, article {
      max-width: 280px;
      width: 100%;
    }

    .btnFooter {
      border: 0;
      background: transparent;
      height: 28px;
      color: #fff;
    }
  }
`;
