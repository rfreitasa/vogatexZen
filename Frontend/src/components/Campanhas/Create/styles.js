import styled from "styled-components";

export const StyledModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const StyledPaper = styled.div`
  background-color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 32px;
  width: 70%;
  overflow: auto;
  border-radius: 16px;
  border: none;
  max-height: 90vh;
  
  @media (max-width: 960px) {
    width: 90%;
    padding: 24px;
  }
  
  @media (max-width: 600px) {
    width: 95%;
    padding: 16px;
  }
`;

export const StyledButton = styled.button`
  border: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #fff;
  padding: 12px;
  cursor: pointer;
  display: flex;
  margin-left: auto;
  margin-right: 15px;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(90deg);
    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.4);
  }
`;

export const StyledInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  
  label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
  }
  
  input, select, textarea {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

export const StyledCampaignHeader = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
  
  h2 {
    font-weight: 600;
    font-size: 22px;
    margin: 0;
  }
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

export const StyledFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  
  .primary-button {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
    }
  }
`;

export const StyledSelectContainer = styled.div`
  .css-1s2u09g-control {
    padding: 6px 0;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    
    &:hover {
      border-color: #d1d5db;
    }
  }
  
  .css-1pahdxg-control {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;