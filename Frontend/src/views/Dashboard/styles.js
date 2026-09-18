import styled, { keyframes } from "styled-components";
import RotateRightIcon from "@material-ui/icons/RotateRight";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Load = styled(RotateRightIcon).attrs(props => ({
  color: props.cor
}))`
  color: ${props => props.color};
  animation: ${rotate} 2s linear infinite;
`;
