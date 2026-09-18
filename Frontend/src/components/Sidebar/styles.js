import styled, { css } from 'styled-components';
import { shade } from 'polished';
import background from 'assets/img/layout.png';

export const Container = styled.aside`
  grid-area: SB;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url(${background});
  background-size: cover;
  background-position: -150%;
  padding: 16px 0px;
  transition: 0.6s;
  z-index: 12;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  position: relative;
  overflow: auto;
  font-weight: 300;
  line-height: 1.2em;
  border-radius: 3px;

  .buttonNavMob {
    display: none;
  }

  @media screen and (max-width: 850px) {
    position: fixed;
    left: -150%;
    top: 0%;
    height: 100%;
    z-index: 22;
    ${props =>
      props.isExpansed &&
      css`
        left: 0px;
        /* &::after {
          content: '';
          position: fixed;
          background: rgba(0, 0, 0, 0.2);
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
        } */
      `}

    .buttonNavMob {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      position: absolute;
      top: 10px;
      right: 10px;
      background: #fff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }

  h4 {
    background: ${shade(0.2, '#004970')};
    padding: 8px;
    color: #a09f9f;
    text-align: center;
    width: 100%;
    font-size: 14px;
  }

  img {
    max-width: 200px;
    width: 80%;
    margin-bottom: 30px;

    ${props =>
      props.isExpansed &&
      css`
        margin-bottom: 10px;
      `}
  }

  h3 {
    margin: 20px 0;
    font-size: 17px;
    opacity: 1;
    transition: opacity 0.4s;
    ${props =>
      props.isExpansed &&
      css`
        display: none;
        opacity: 0;
      `}
  }
`;

export const Overlay = styled.div`
  ${props =>
    props.isExpansed &&
    css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 100;
    `}
`;
