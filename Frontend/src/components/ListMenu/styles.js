import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.ul`
  width: 100%;
  padding-left: 0%;

  > li {
    display: flex;
    align-items: center;

    &:hover {
      background: ${shade(0.1, 'rgb(70, 130, 180)')};
    }

    svg {
      margin: 0 16px;
    }

    a,
    button {
      display: flex;
      background: transparent;
     
      align-items: center;
      color: white;
      text-decoration: none;
      font-size: 15px;
      flex: 1;
      height: 50px;
      transition: background 0.4s;

      ${(props) =>
        props.isExpansed &&
        css`
          justify-content: center;
          @media screen and (max-width: 850px) {
            justify-content: flex-start;
          }
        `}

      p {
        ${(props) =>
          props.isExpansed &&
          css`
            display: none;

            @media screen and (max-width: 850px) {
              display: block;
            }
          `}
      }
    }
  }
`;
