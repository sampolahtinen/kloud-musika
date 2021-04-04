import styled from 'styled-components';
import { breakPoints } from '../../styles/breakPoints';

export const LayoutContainer = styled.div`
  display: flex;
  padding: 10rem;
  width: 100%;
  min-height: 100vh;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: ${breakPoints.phone}) {
    padding: 5rem 2.5rem;
  }
`;
