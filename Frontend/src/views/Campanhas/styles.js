import styled from 'styled-components';

export const TableContainer = styled.div`
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`;
export const GradientBackground = styled.div`
  background: linear-gradient(135deg, #144bc1 0%, #040918 100%);
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -1px;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    color: #1e293b;
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  button {
    background: transparent;
    border: none;
    color: #2563eb;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background: #e0f2fe;
      transform: scale(1.1);
    }
  }
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  display: inline-block;
`;