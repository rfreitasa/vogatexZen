// stylesFinaliza.js
import styled from 'styled-components';

// Adicione estas definições que estão faltando
export const FormAuto = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Pesquisa = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ButtonRequest = styled.button`
  background: ${props => (props.bg ? props.bg : '#00acc1')};
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

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PaperStyle = styled.div`
  background-color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 32px;
  width: 95%;
  max-width: 1800px;
  overflow: auto;
  border-radius: 16px;
  border: none;
  max-height: 95vh;

  @media (max-width: 960px) {
    width: 98%;
    padding: 24px;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 16px;
  }
`;

// E também adicione os outros styled components que você já estava usando
export const StyledModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2px;
`;

export const StyledPaper = styled.div`
  background-color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 3px;
  width: 100%;
  max-width: 1800px;
  border-radius: 16px;
  border: none;
  overflow: auto;
  max-height: none;

  /* Ajustes para tablets */
  @media (max-width: 960px) {
    width: 100%;
    padding: 2px;
    overflow-y: auto;     /* ativa rolagem vertical */
    max-height: 100vh;    /* limita a altura ao tamanho da tela */
  }

  /* Ajustes específicos para celulares */
  @media (max-width: 600px) {
    width: 100%;
    padding: 6px;
    overflow-y: auto;     /* rolagem vertical */
    overflow-x: auto;   /* evita rolagem horizontal */
    max-height: 100vh;    /* usa a altura da viewport */
    -webkit-overflow-scrolling: touch; /* rolagem suave no iOS */
  }
`;

export const StyledCard = styled.div`
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.3);
  background-color: #fafafa;
  border-radius: 12px;
  overflow: auto;
`;

export const StyledCardHeader = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
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

export const StyledSectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #2563eb;
  font-weight: 600;
  font-size: 18px;
  width: 100%;

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #2563eb 0%, transparent 100%);
    margin-left: 12px;
  }
`;

export const StyledInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;

  label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
  }

  input,
  select,
  textarea {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: white;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }

    &:disabled {
      background-color: #f9fafb;
      color: #6b7280;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
  }
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

export const StyledButton = styled.button`
  background: ${props =>
    props.bg ? props.bg : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'};
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
  overflow: auto;
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

  input[type='checkbox'] {
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
