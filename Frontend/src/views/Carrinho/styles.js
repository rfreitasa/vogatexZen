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

export const StyledSectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #2563eb;
  font-weight: 600;
  font-size: 18px;
  
  &::after {
    content: "";
    flex: 1;
    height: 2px;
  background: linear-gradient(135deg, #144bc1 0%, #040918 100%);
    margin-left: 12px;
  }
`;

export const StyledInputGroup = styled.div`
  display: flex;
  flex-direction: column;  // Corrigido: flex-direction em vez de flexDirection
  margin-bottom: 2px;    // Corrigido: margin-bottom em vez de marginBottom
  width: 100%;
  
  label {
    margin-bottom: 8px;   // Corrigido: margin-bottom em vez de marginBottom
    font-weight: 500;     // Corrigido: font-weight em vez de fontWeight
    color: #374151;
    font-size: 14px;      // Corrigido: font-size em vez de fontSize
    text-align: left;     // Adicionado para alinhar à esquerda
  }
  
  input {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;      // Corrigido: font-size em vez de fontSize
    transition: all 0.3s ease;
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: #2563eb;  // Corrigido: border-color em vez de borderColor
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
  }
`;
export const StyledFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  
  .primary-button {
  background: linear-gradient(135deg, #144bc1 0%, #040918 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
    }
  }
  
  .secondary-button {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

export const ButtonRequest = styled.button`
  background: ${props => props.bg ? props.bg : '#00acc1'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 172, 193, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
export const SearchPanel = styled.div`
  margin-bottom: 24px;
  
  .MuiExpansionPanel-root {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .MuiExpansionPanelSummary-root {
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }
`;

export const SearchForm = styled.form`
  width: 100%;
  padding: 16px;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

export const StyledButton = styled.button`
  background: ${props => props.bg ? props.bg : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

export const StyledTableContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const StyledTableCell = styled.div`
  &.MuiTableCell-head {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    color: white;
    font-weight: 600;
  }
  
  &.MuiTableCell-body {
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
  }
`;

export const StyledTableRow = styled.div`
  &:nth-of-type(even) {
    background-color: #f9fafb;
  }
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

export const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  input[type="checkbox"] {
    width: 28px;
    height: 28px;
    accent-color: #2563eb;
  }
  
  label {
    font-weight: 500;
    color: #374151;
    margin: 0;
  }
`;

export const StyledSelectContainer = styled.div`
  .css-1s2u09g-control {
    padding: 2px 0;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    min-height: 44px;
    
    &:hover {
      border-color: #d1d5db;
    }
  }
  
  .css-1pahdxg-control {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

export const StyledEmailContainer = styled.div`
  .react-multi-email {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 8px;
    min-height: 44px;
    
    &.focused {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    
    input {
      border: none;
      outline: none;
      padding: 8px;
      font-size: 16px;
    }
    
    [data-tag] {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      border-radius: 16px;
      padding: 4px 8px;
      margin: 2px;
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      
      [data-tag-handle] {
        margin-left: 4px;
        cursor: pointer;
        padding: 2px;
        border-radius: 50%;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
`;
export const StyledCard = styled.div`
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.3);
  background-color: #fafafa;
  border-radius: 12px;
  overflow: hidden;
`;

export const StyledCardHeader = styled.div`
  background: linear-gradient(135deg, #144bc1 0%, #040918 100%);
  color: white;
  padding: 16px 20px;
  
  .MuiCardHeader-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
  }
`;

export const StyledCardContent = styled.div`
  padding: 20px;
  background: white;
`;
