import styled from "styled-components";

export const TableContainer = styled.div`
  padding: 2px;
  background: #f8fafc;
  min-height: 100vh;
`;
export const GradientBackground = styled.div`
  background: linear-gradient(135deg, #144bc1 0%, #040918 100%);
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;                 /* espaço entre título e ações */
  margin-bottom: -1px;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);

  /* No mobile, empilha (título em cima, ações embaixo) */
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start; /* alinha à esquerda */
  }

  /* Opcional: título com fonte responsiva */
  h2 {
    font-size: clamp(18px, 3.5vw, 24px);
    margin: 0;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

/* Linha das ações (carrinho, badges, botão) */
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;          /* permite quebrar itens em 2+ linhas */
  margin-left: auto;        /* empurra para a direita no desktop */

  /* Evita que o botão “suma” pra fora */
  & > button {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;

    /* Botão ocupa a largura toda no mobile (bom para clique) */
    & > button {
      width: 100%;
    }
  }
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  
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
  background-color: ${props => props.bgColor || '#dcfce7'};
  color: ${props => props.textColor || '#166534'};
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
  flex-direction: column;
  width: 100%;
  
  label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
    text-align: left;
  }
  
  input, select {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    
    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
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
`;

export const PrimaryButton = styled.button`
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
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled.button`
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
  
  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
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
  padding: 0px;
`;

export const SearchContainer = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 2px;
`;
export const Page = styled.div`
  max-height: 100vh;        /* ou 100vh, se for página inteira */
  display: flex;
  flex-direction: column;
  min-height: 0;       /* evita “estouro” dos filhos flex */
  overflow-y: auto;  /* AQUI: impede scroll vertical nessa div */
  padding: 0;          /* substitui seu style inline */
`;

export const Content = styled.div`
  flex: 1 1 auto;
  min-height: 0;       /* crucial para permitir encolher */
  display: flex;
  flex-direction: column;
`;

export const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;      /* Se quiser rolagem só aqui; remova se não quiser scroll em lugar nenhum */
`;
export const StyledPaper = styled.div`
  background-color: #ffffff;
  padding: 0px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 2px 2px;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const LineForm = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

export const ButtonStyled = styled.button`
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0px;
  margin-bottom: 20px;
`;

export const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

export const ContainerSearch = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
`;

// Componentes específicos para o contexto de produtos
export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0px;
  margin-top: 20px;
`;

export const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const PriceTag = styled.span`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
`;

export const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.lowStock ? '#dc2626' : '#16a34a'};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.lowStock ? '#dc2626' : '#16a34a'};
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  
  button {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:first-child {
      background: #2563eb;
      color: white;
      
      &:hover {
        background: #1d4ed8;
      }
    }
    
    &:last-child {
      background: #f3f4f6;
      color: #374151;
      
      &:hover {
        background: #e5e7eb;
      }
    }
  }
`;