import styled, { keyframes } from 'styled-components';
import RotateRightIcon from '@material-ui/icons/RotateRight';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Load = styled(RotateRightIcon).attrs(props => ({
  color: props.cor,
}))`
  color: ${props => props.color};
  animation: ${rotate} 2s linear infinite;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  .divCheck {
    display: flex;
    align-items: center;
    h6 {
      margin: 0;
      font-size: 14px;
      font-weight: bold;
      color: rgb(170, 170, 170);
      margin-right: 6px;
    }
  }

  .input {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    label {
      font-weight: bold;
    }
    input,
    select {
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
      position: relative;
      width: 100%;
    }
  }
`;

export const ButtonStyled = styled.button`
  margin-top: 40px;
  margin-left: 5px;
  width: auto;
  padding: 10px;
  border: 0 none;
  background-color: #00acc1;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  transition: 0.4s;
  cursor: pointer;

  &:hover {
    border-radius: 20px;
    opacity: 0.7;
  }
`;
