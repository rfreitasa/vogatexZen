import styled, { css } from 'styled-components';
import { shade } from 'polished';


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 9999;

  svg {
    margin-left: 16px;

    ${(props) =>
      props.isExpansed &&
      css`
        margin-left: 0;
      `}
  }

  button {
    display: flex;
    background: transparent;
    border: 0;
    color: white;
    align-items: center;
    cursor: pointer;

    ${(props) =>
      props.isExpansed &&
      css`
        @media screen and (max-width: 500px) {
          display: none;
        }
      `}

    ${(props) =>
      props.isExpansed &&
      css`
        justify-content: center;
        padding: 15px;
      `}

    &:hover {
      background: ${shade(0.1, 'rgb(70, 130, 180)')};
    }

    span {
      padding: 15px;
      padding-left: 16px;
      flex: 1;
      
      display: flex;
      align-items: center;
      justify-content: space-between;

      svg {
        transition: all 0.2s;
      }

      p {
        font-size: 13px;
      }

      ${(props) =>
        props.isExpansed &&
        css`
          display: none;
        `}

      ${(props) =>
        props.open &&
        css`
          svg {
            transform: rotate(-90deg);
          }
        `}
    }
  }

  ul {
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    transition: all 0.6s;
    height: auto;

    @media screen and (max-width: 500px) {
      position: static;
      opacity: 0.9;
      visibility: visible;
      overflow: auto;
    }

    ${(props) =>
      !props.open &&
      css`
        max-height: 0;
        @media screen and (max-width: 500px) {
          max-height: 100%;
        }
      `}

    ${(props) =>
      props.open &&
      css`
        display: block;
        opacity: 1;
        visibility: visible;
      `}

      ${(props) =>
        props.open &&
        props.isExpansed &&
        css`
          top: 0%;
          left: 63px;
          position: absolute;
        `}
  }

  li {
    display: flex;
    align-items: center;
    background: transparent;
    color: white;
    
    &:hover {
      background: ${shade(0.3, 'rgb(70, 130, 180)')};
    }

    @media screen and (max-width: 500px) {
      background: ${shade(0.3, 'rgb(70, 130, 180)')};

      position: static;
      opacity: 0.9;
      visibility: visible;
      overflow: auto;
      max-height: auto;
    }

    svg {
      margin: 0 16px;
      ${(props) =>
        props.isExpansed &&
        css`
          margin: 0;
          margin-right: 10px;
          @media screen and (max-width: 500px) {
            margin-left: 9px;
          }
        `}
    }

    a {
      display: flex;
      align-items: center;
      color: var(--grey);
      text-decoration: none;
      font-size: 13px;
      flex: 1;
      height: 50px;
      transition: background 0.4s;
      width: 180px;
      ${(props) =>
        props.isExpansed &&
        css`
          justify-content: center;
          padding: 15px 5px;
          @media screen and (max-width: 500px) {
            justify-content: flex-start;
            margin: 0;
          }
        `}
    }
  }
`;
