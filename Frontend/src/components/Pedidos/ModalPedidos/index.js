import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import PropTypes from "prop-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useForm } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DataTable from "components/Table/Table";
import { Form } from "./styles";

function createData(
  codigo,
  nome,
  grade,
  quantidade,
  valorUnitario,
  total
) {
  return {
    codigo,
    nome,
    grade,
    quantidade,
    valorUnitario,
    total
  };
}

const rowHead = [
  {
    title: "Código",
    field: "codigo",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Nome",
    field: "nome",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Grade",
    field: "grade",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "right"
    }
  },
  {
    title: "Quantidade",
    field: "quantidade",
    headerStyle: {
      width: 100,
      maxWidth: 100,
      minWidth: 100,
      textAlign:"center"
    },
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "right"
    }
  },
  {
    title: "Valor unitário",
    field: "valorUnitario",
    headerStyle: {
      width: 82,
      maxWidth: 82,
      minWidth: 82,
    },
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Valor",
    field: "total",
    headerStyle: {
      width: 72,
      maxWidth: 72,
      minWidth: 72,
    },
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  }
];

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "80%",
    height: "80%",
    overflow: "scroll",
    minWidth: "50%"
  },
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "transparent",
    color: "#00acc1",
    padding: "5px",
    cursor: "pointer"
  },
  text: {
    padding: "10px",
    color: "#656464"
  }
}));

export default function ModalPedidos({ data }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const perfil = sessionStorage.getItem("perfil");

  const handleOpen = () => {
    setOpen(true);
  };

var rowsList=[{ error: "Não encontrado" }];

if(data && data.itens){
  rowsList = data.itens
    ? data.itens.map(item => {
        const { nome, codigo, grade } = item.item;
        
        const { quantidade, unidadeCodigo, valorUnitario } = item;
        const total = (quantidade * valorUnitario).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        });
        (quantidade * valorUnitario).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        });
        const row = createData(
          codigo,
          nome,
          grade,
          quantidade+' '+ unidadeCodigo,
          valorUnitario.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          }),
          total
        );

        return row;
      })
    : [{ error: "Não encontrado" }];
}

  const {
    numeroSistema,
    referencia,
    status,
    prazoPagto,
    emissao,
    previsao,
    tipoFrete,
    observacoes
  } = data;
  const { nome: nomeEmpresa } = data.empresa;
  const { nome: nomeConta } = data.conta;
  const { nome: nomeVendedor } = data.vendedor;
  const { nome: nomeTransportadora } = (data.transportadora)?data.transportadora:'';

  const handleClose = () => {
    setOpen(false);
  };

  const { register } = useForm();

  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <VisibilityIcon />
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Tabs>
              <TabList>
                <Tab>Geral</Tab>
               { (perfil!=='vendedor')?   <Tab>Observação</Tab>:""}
                
                <Tab>Itens</Tab>
              </TabList>

              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Número do Sistema</label>
                        <input
                          readOnly
                          name="numSistema"
                          type="text"
                          ref={register}
                          value={numeroSistema ? numeroSistema : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Referência</label>
                        <input
                          readOnly
                          name="referencia"
                          type="text"
                          ref={register}
                          value={referencia ? referencia : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Empresa</label>
                        <input
                          readOnly
                          name="empresa"
                          type="text"
                          ref={register}
                          value={nomeEmpresa ? nomeEmpresa : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Status</label>
                        <input
                          readOnly
                          name="status"
                          type="text"
                          ref={register}
                          value={status ? status : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Prazo de pagamento </label>
                        <input
                          readOnly
                          name="prazo"
                          type="text"
                          ref={register}
                          value={prazoPagto ? prazoPagto : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Conta</label>
                        <input
                          readOnly
                          name="conta"
                          type="text"
                          ref={register}
                          value={nomeConta ? nomeConta : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>vendedor</label>
                        <input
                          readOnly
                          name="vendedor"
                          type="text"
                          ref={register}
                          value={nomeVendedor ? nomeVendedor : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Emissão</label>
                        <input
                          readOnly
                          name="emissao"
                          type="date"
                          ref={register}
                          value={emissao ? emissao : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Previsão</label>
                        <input
                          readOnly
                          name="previsao"
                          type="date"
                          ref={register}
                          value={previsao ? previsao : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Frete</label>
                        <input
                          readOnly
                          name="frete"
                          type="text"
                          ref={register}
                          value={tipoFrete ? tipoFrete : ""}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Transportadora</label>
                        <input
                          readOnly
                          name="transportadora"
                          type="text"
                          ref={register}
                          value={nomeTransportadora ? nomeTransportadora : ""}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>
              { (perfil!=='vendedor')?
              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Observações</label>
                        <textarea
                          className={classes.text}
                          readOnly
                          name="obs"
                          type="text"
                          ref={register}
                          value={
                            observacoes
                              ? observacoes
                              : "Nenhuma observação foi feita"
                          }
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>:""}
              <TabPanel>
                <DataTable rows={rowsList} rowHead={rowHead} title={"Itens"} />
              </TabPanel>
            </Tabs>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalPedidos.propTypes = {
  data: PropTypes.object.isRequired
};
