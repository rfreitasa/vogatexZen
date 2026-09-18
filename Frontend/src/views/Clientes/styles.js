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
    background: linear-gradient(90deg, #2563eb 0%, transparent 100%);
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
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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