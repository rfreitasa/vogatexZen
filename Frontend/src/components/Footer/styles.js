import styled from 'styled-components';

export const Container = styled.div`
  grid-area: FT;

  display: flex;
  align-items: center;
  background: var(--grey);
  color: var(--text);
  padding: 15px;
  height: 10px;
  p {
    font-weight: 500;
  }

  @media screen and (max-width: 500px) {
    height: auto;
  }
`;
