import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  StyledModalContainer,
  StyledPaper,
  StyledCampaignHeader,
  StyledSectionTitle,
  StyledFooter,
  ViewButton,
  InfoRow,
  InfoLabel,
  InfoValue,
} from './styles';

export default function ModalVisualizarCampanha({ data }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Função para formatar decimal
  const formatDecimal = numero => {
    if (numero === null || numero === undefined || isNaN(numero)) {
      return '0,00';
    }

    const num = typeof numero === 'string' ? parseFloat(numero) : numero;
    if (isNaN(num)) return '0,00';

    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para formatar data
  const formatDate = dateString => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <ViewButton type="button" onClick={handleOpen}>
        👁️
      </ViewButton>

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
          zIndex: 1400,
        }}
      >
        <Fade in={open}>
          <StyledPaper>
            <StyledCampaignHeader>
              <h2>
                Visualizar Campanha
                <span
                  style={{ fontSize: '16px', marginLeft: '10px', opacity: 0.8 }}
                >
                  {data?.CAMPANHA_NOME}
                </span>
              </h2>
            </StyledCampaignHeader>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledSectionTitle>Informações Básicas</StyledSectionTitle>
              </Grid>

              <Grid item xs={12}>
                <InfoRow>
                  <InfoLabel>Nome da campanha:</InfoLabel>
                  <InfoValue>{data?.CAMPANHA_NOME || '-'}</InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>Data inicial:</InfoLabel>
                  <InfoValue>{formatDate(data?.CAMPANHA_INICIO)}</InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>Data final:</InfoLabel>
                  <InfoValue>{formatDate(data?.CAMPANHA_FIM)}</InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle>
                  Configurações Financeiras
                </StyledSectionTitle>
              </Grid>

              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>Valor esperado:</InfoLabel>
                  <InfoValue>R$ {formatDecimal(data?.CAMPANHA_META)}</InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>Limite de pedido:</InfoLabel>
                  <InfoValue>
                    R$ {formatDecimal(data?.CAMPANHA_LIMITE_PEDIDOS)}
                  </InfoValue>
                </InfoRow>
              </Grid>
              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>ID Linha de crédito:</InfoLabel>
                  <InfoValue>
                     {data?.CAMPANHA_LINHA_CREDITO}
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>Status:</InfoLabel>
                  <InfoValue>{data?.CAMPANHA_STATUS || '-'}</InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={6}>
                <InfoRow>
                  <InfoLabel>Leads entrar como bloqueados?:</InfoLabel>
                  <InfoValue>
                    {data?.CAMPANHA_PEDIDOS_BLOQUEADOS === 'sim'
                      ? 'Sim'
                      : 'Não'}
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle>Informações Adicionais</StyledSectionTitle>
              </Grid>

              <Grid item xs={12}>
                <InfoRow>
                  <InfoLabel>Local da campanha:</InfoLabel>
                  <InfoValue>{data?.CAMPANHA_LOCAL || '-'}</InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12}>
                <InfoRow>
                  <InfoLabel>Observações:</InfoLabel>
                  <InfoValue>{data?.CAMPANHA_OBSERVACOES || '-'}</InfoValue>
                </InfoRow>
              </Grid>
            </Grid>

            <StyledFooter>
              <button
                type="button"
                onClick={handleClose}
                className="secondary-button"
              >
                Fechar
              </button>
            </StyledFooter>
          </StyledPaper>
        </Fade>
      </Modal>
    </>
  );
}
