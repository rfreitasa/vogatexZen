import React, { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { API } from "../../../config/api";
import debounce from "debounce-promise";
import {
  StyledModalContainer,
  StyledPaper,
  StyledButton,
  StyledInputGroup,
  StyledCampaignHeader,
  StyledSectionTitle,
  StyledFooter,
  StyledSelectContainer
} from "./styles";
const id_user = sessionStorage.getItem('id');

export default function ModalCreateCampanha() {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { register, handleSubmit } = useForm();

  // Carregar empresas (autocomplete)
  const loadEmpresas = async (inputValue) => {
    try {
      const response = await axios.get(
        `${API.empresas}?email=${email}&search=${inputValue}`,
        {
          headers: { "x-access-token": token },
        }
      );
      return response.data?.data?.map((item) => ({
        value: item.id,
        label: item.nome,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  const debouncedLoadEmpresas = debounce(loadEmpresas, 500);

  // Envio do formulário
  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${API.campanhas}?email=${email}`,
        {
          nome: data.nome,
          criadoPor: id_user,
          inicio: data.dataInicio,
          fim: data.dataFim,
          valorEsperado: parseFloat(data.valorEsperado),
          status: data.status,
          pedidosBloqueados: data.pedidosBloqueados,
          limitePedido: parseFloat(data.limitePedido || 0),
          linhacredito: data.linhacredito,
          local: data.local,
          observacoes: data.observacoes,
        },
        {
          headers: { "x-access-token": token },
        }
      );
      toast.success("Campanha criada com sucesso!");
      handleClose();
      window.location.reload();
    } catch (err) {
      toast.error("Erro ao criar campanha");
      console.error(err);
    }
  };

  return (
    <div>
      <StyledButton type="button" onClick={handleOpen}>
        <AddCircleOutlineIcon />
      </StyledButton>

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
                <h2>Nova Campanha</h2>
              </StyledCampaignHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledSectionTitle>Informações Básicas</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledInputGroup>
                      <label>Nome da campanha</label>
                      <input name="nome" ref={register} required />
                    </StyledInputGroup>
                  </Grid>


                  <Grid item xs={3}>
                    <StyledInputGroup>
                      <label>Data inicial</label>
                      <input type="date" name="dataInicio" ref={register} required />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={3}>
                    <StyledInputGroup>
                      <label>Data final</label>
                      <input type="date" name="dataFim" ref={register} required />
                    </StyledInputGroup>
                  </Grid>

                  
                  
                  <Grid item xs={12}>
                    <StyledSectionTitle>Configurações Financeiras</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Valor esperado (R$)</label>
                      <input type="number" step="0.01" name="valorEsperado" ref={register} />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Limite de pedido (R$)</label>
                      <input type="number" step="0.01" name="limitePedido" ref={register} />
                    </StyledInputGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>ID linha de crédito</label>
                      <input type="number" name="linhacredito" ref={register} />

                    </StyledInputGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Status</label>
                      <select name="status" ref={register} defaultValue="Ativa">
                        <option value="Ativa">Ativa</option>   
                      </select>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledInputGroup>
                      <label>Leads entrar como bloqueados?</label>
                      <select name="pedidosBloqueados" ref={register}>
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
                      <input name="local" ref={register} />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledInputGroup>
                      <label>Observações</label>
                      <textarea name="observacoes" rows={4} ref={register} />
                    </StyledInputGroup>
                  </Grid>
                </Grid>

                <StyledFooter>
                  <button type="submit" className="primary-button">
                    Criar Campanha
                  </button>
                </StyledFooter>
              </form>
            </StyledPaper>
        </Fade>
      </Modal>
    </div>
  );
}