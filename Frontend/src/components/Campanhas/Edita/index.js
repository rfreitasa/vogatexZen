import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import { toast } from "react-toastify";
import { API } from "../../../config/api";
import {
  StyledModalContainer,
  StyledPaper,
  StyledInputGroup,
  StyledCampaignHeader,
  StyledSectionTitle,
  StyledFooter,
  EditButton,
  ButtonContainer
} from "./styles";

export default function ModalEditarCampanha({ data, onUpdate }) {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const id_user = sessionStorage.getItem('id');

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CAMPANHA_NOME: '',
    CAMPANHA_INICIO: '',
    CAMPANHA_FIM: '',
    CAMPANHA_META: 0,
    CAMPANHA_STATUS: 'Ativa',
    CAMPANHA_PEDIDOS_BLOQUEADOS: 'nao',
    CAMPANHA_LIMITE_PEDIDOS: 0,
    CAMPANHA_LINHA_CREDITO:'',
    CAMPANHA_LOCAL: ''
  });

  useEffect(() => {
    console.log("Dados recebidos no modal:", data);
    
    if (open && data) {
      setFormData({
        CAMPANHA_NOME: data.CAMPANHA_NOME || '',
        CAMPANHA_INICIO: data.CAMPANHA_INICIO ? formatDateForInput(data.CAMPANHA_INICIO) : '',
        CAMPANHA_FIM: data.CAMPANHA_FIM ? formatDateForInput(data.CAMPANHA_FIM) : '',
        CAMPANHA_META: data.CAMPANHA_META || 0,
        CAMPANHA_STATUS: data.CAMPANHA_STATUS || 'Ativa',
        CAMPANHA_PEDIDOS_BLOQUEADOS: data.CAMPANHA_PEDIDOS_BLOQUEADOS || 'nao',
        CAMPANHA_LIMITE_PEDIDOS: data.CAMPANHA_LIMITE_PEDIDOS || 0,
        CAMPANHA_LINHA_CREDITO: data.CAMPANHA_LINHA_CREDITO || '',
        CAMPANHA_LOCAL: data.CAMPANHA_LOCAL || ''
      });
    }
  }, [open, data]);

  // Função para formatar data para input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Se já estiver no formato ISO (com 'T')
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // Se estiver no formato DD/MM/YYYY
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    
    // Se já estiver no formato YYYY-MM-DD
    if (dateString.length === 10 && dateString.includes('-')) {
      return dateString;
    }
    
    return '';
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.CAMPANHA_NOME || !formData.CAMPANHA_INICIO || !formData.CAMPANHA_FIM) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.put(
        `${API.campanhas}/${data.CAMPANHA_ID}?email=${email}`,
        {
          CAMPANHA_NOME: formData.CAMPANHA_NOME,
          CAMPANHA_INICIO: formData.CAMPANHA_INICIO,
          CAMPANHA_FIM: formData.CAMPANHA_FIM,
          CAMPANHA_META: parseFloat(formData.CAMPANHA_META) || 0,
          CAMPANHA_STATUS: formData.CAMPANHA_STATUS,
          CAMPANHA_PEDIDOS_BLOQUEADOS: formData.CAMPANHA_PEDIDOS_BLOQUEADOS,
          CAMPANHA_LIMITE_PEDIDOS: parseFloat(formData.CAMPANHA_LIMITE_PEDIDOS) || 0,
          CAMPANHA_LINHA_CREDITO: formData.CAMPANHA_LINHA_CREDITO || '',
          CAMPANHA_LOCAL: formData.CAMPANHA_LOCAL,
          CAMPANHA_OBSERVACOES: formData.CAMPANHA_OBSERVACOES,

          atualizadoPor: id_user,
        },
        {
          headers: { "x-access-token": token },
        }
      );
      
      toast.success("Campanha atualizada com sucesso!");
      handleClose();
      window.location.reload();
      // Chamar callback de atualização se fornecido
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (err) {
      console.error("Erro ao atualizar campanha:", err);
      toast.error("Erro ao atualizar campanha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EditButton type="button" onClick={handleOpen}>
        ✏️
      </EditButton>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ 
          timeout: 500,
       
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1400
        }}
>
        <Fade in={open}>
            <StyledPaper>
              <StyledCampaignHeader>
                <h2>
                  Editar Campanha
                  <span style={{ fontSize: '16px', marginLeft: '10px', opacity: 0.8 }}>
                     {data?.CAMPANHA_NOME}
                  </span>
                </h2>
              </StyledCampaignHeader>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledSectionTitle>Informações Básicas</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledInputGroup>
                      <label>Nome da campanha *</label>
                      <input 
                        name="CAMPANHA_NOME"
                        value={formData.CAMPANHA_NOME}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome da campanha"
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Data inicial *</label>
                      <input 
                        type="date" 
                        name="CAMPANHA_INICIO"
                        value={formData.CAMPANHA_INICIO}
                        onChange={handleInputChange}
                        required
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Data final *</label>
                      <input 
                        type="date" 
                        name="CAMPANHA_FIM"
                        value={formData.CAMPANHA_FIM}
                        onChange={handleInputChange}
                        required
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledSectionTitle>Configurações Financeiras</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Valor esperado (R$)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="CAMPANHA_META"
                        value={formData.CAMPANHA_META}
                        onChange={handleInputChange}
                        placeholder="0,00"
                        min="0"
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Limite de pedido (R$)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="CAMPANHA_LIMITE_PEDIDOS"
                        value={formData.CAMPANHA_LIMITE_PEDIDO}
                        onChange={handleInputChange}
                        placeholder="0,00"
                        min="0"
                      />
                    </StyledInputGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Id linha de crédito</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="CAMPANHA_LINHA_CREDITO"
                        value={formData.CAMPANHA_LINHA_CREDITO}
                        onChange={handleInputChange}
                      
                      />
                    </StyledInputGroup>
                  </Grid>


                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Status *</label>
                      <select 
                        name="CAMPANHA_STATUS"
                        value={formData.CAMPANHA_STATUS}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Ativa">Ativa</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Leads entrar como bloqueados?</label>
                      <select 
                        name="CAMPANHA_PEDIDOS_BLOQUEADOS"
                        value={formData.CAMPANHA_PEDIDOS_BLOQUEADOS}
                        onChange={handleInputChange}
                      >
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                      </select>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledSectionTitle>Informações Adicionais</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledInputGroup>
                      <label>Local da campanha</label>
                      <input 
                        name="CAMPANHA_LOCAL"
                        value={formData.CAMPANHA_LOCAL}
                        onChange={handleInputChange}
                        placeholder="Digite o local da campanha"
                      />
                    </StyledInputGroup>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                    <StyledInputGroup>
                      <label>Observações</label>
                      <input 
                        name="CAMPANHA_OBSERVACOES"
                        value={formData.CAMPANHA_OBSERVACOES}
                        onChange={handleInputChange}
                        placeholder=""
                      />
                    </StyledInputGroup>
                  </Grid>
                

                <StyledFooter>
                  <ButtonContainer>
                    <button type="submit" className="primary-button" disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button type="button" onClick={handleClose} className="secondary-button">
                      Cancelar
                    </button>
                  </ButtonContainer>
                </StyledFooter>
              </form>
            </StyledPaper>
        </Fade>
      </Modal>
    </>
  );
}