import styled from 'styled-components';
import { animated } from 'react-spring';

// SB - SideBar
// NB - NiveBar
// CC - Content Container
// FT - Footer

export const Container = styled(animated.section)`
  display: grid;
  

  grid-template-rows: 55px calc(100vh - 85px); /* height limitation on second row */
  //grid-template-columns: 20vh auto;
  grid-template-areas:
    'SB NB'
    'SB CC'
    'SB FT';

  @media screen and (max-width: 850px) {
    display: flex;
    flex-direction: column;
  }
`;

export const Routes = styled.main`
  grid-area: CC;
  min-width: 100%;
  padding: 15px;
  min-height: 100%;
  overflow: auto; /* overflow condition on parent */
  @media screen and (max-width: 850px) {
    flex: 1;
  }
`;
