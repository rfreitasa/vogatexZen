import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DataTable from 'components/Table/Table';
import { Form } from './styles';
import moment from 'moment';
import { API } from '../../../config/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';
import nfe from "assets/nfe.png";
import xml from "assets/xml.png";
import translate from 'components/Tradutor/tradutor';
import Pdf from './romaneioDownload';
import { Badge, CircularProgress, Tooltip } from '@material-ui/core';
import { Button, makeStyles } from "@material-ui/core";



const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 0),
    maxWidth: '80%',
    height: '80%',
    overflow: 'scroll',
    minWidth: '50%',
  },
  button: {
    position: "relative",
    minWidth: "30px",
    padding: theme.spacing(1),

  },
  text: {
    padding: '10px',
    color: '#656464',
  },

  badge: {
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px 4px",
    borderRadius: "4px",
  },
  spinner: {
    color: "#1976d2",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },

}));


function createData(codigo, nome, grade, quantidade, valorUnitario, total) {
  return {
    codigo,
    nome,
    grade,
    quantidade,
    valorUnitario,
    total,
  };
}

const rowHead = [
  {
    title: 'Código',
    field: 'codigo',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
  },
  {
    title: 'Nome',
    field: 'nome',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
  },
  {
    title: 'Grade',
    field: 'grade',
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
  {
    title: 'Quantidade',
    field: 'quantidade',
    headerStyle: {
      width: 100,
      maxWidth: 100,
      minWidth: 100,
      textAlign: 'center',
    },
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
  },
  {
    title: 'Valor unitário',
    field: 'valorUnitario',
    headerStyle: {
      width: 82,
      maxWidth: 82,
      minWidth: 82,
    },
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
  },
  {
    title: 'Valor',
    field: 'total',
    headerStyle: {
      width: 72,
      maxWidth: 72,
      minWidth: 72,
    },
    cellStyle: {
      fontSize: '10px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
  },
];


export default function ModalPedidosSQL({ data }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loaddata, setLoadData] = React.useState(false);
  const perfil = sessionStorage.getItem('perfil');
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const [rowList, setrowList] = useState([]);
  const [loading, setLloading] = useState(false);
  const [valueAutoId, setValueAutoId] = useState('');
  const [valueAutoname, setValueAutoname] = useState('');
  const [valuePrz, setValuePrz] = useState('');
  const [openTP, setOpenTP] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    // //getprzpag
    if (open) {
      handleReqItens(data.NUMERO_SISTEMA);
      handlePrzpag(data);
      handleReqVendedorPadrao(data);
      setOpenTP(false);
    }
  }, [open]);

  const handlePrzpag = async data => {
    try {
      //   console.log(data)
      if (data.NUMERO_SISTEMA) {
        const response = await axios.get(
          `${API.getprzpag}/${data.NUMERO_SISTEMA}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        setValuePrz(response.data.data);
      }
      //setContatos(contact);
    } catch (err) {
      //  console.log(err)
      toast.error('Prazo de pagamento não obtido.');
    }
  };

  const handleReqVendedorPadrao = async data => {
    try {
      //  console.log(          `${API.clientes}/${data.itens[0].sale.personSalesperson.id}`);      
      if (data.VENDEDOR_ID) {
        const response2 = await axios.get(
          `${API.usuarios}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        const lista = response2.data.data;
        const filtro = lista.filter(item => Number(item.USUARIO_CONTA_ID_ERP) == Number(data.VENDEDOR_ID));
        const supervisor = lista?.filter(function (obj) {
          return obj.USUARIO_ID === filtro[0].USUARIO_CONTA_SUPERVISOR_ID;
        });
        if (supervisor) {
          data.supervisor = supervisor[0].USUARIO_CONTA_ID_ERP + '-' + supervisor[0].USUARIO_NOME
        }

      }
      //setContatos(contact);
    } catch (err) {
      //   toast.error('Houve um erro ao listar clientes.');
    }
  };
  /*
    const handleReq = async data => {
      try {
        const rowL = data.itens
          ? data.itens.map(item => {
            console.log(item);
            const row = createData(
              item.productPacking.product.code,
              item.productPacking.product.description,
              item.productPacking.complement ? item.productPacking.complement : item.productPacking.variant.description,
                item.quantity + ' ' + item.productPacking.product.unit.code,
              item.unitValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }),
              item.totalValue,
            );
  
            return row;
          })
          : [{ error: 'Não encontrado' }];
        console.log(rowList);
        setrowList(rowL);
        /*
        const response2 = await axios.get(
          `${API.clientes}/${data.properties.salesPerson}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        const vendedor = response2.data.data;
        setValueAutoId(vendedor[0].id);
        setValueAutoname(vendedor[0].name);
  
        //setContatos(contact);
      } catch (err) {
        // toast.error('Houve um erro ao listar clientes.');
      }
    };
  */
  async function handleReqItens(NUMERO_SISTEMA) {
    try {
      setLloading(true);

      const response = await axios.get(
        `${API.pedidos}/${NUMERO_SISTEMA}?email=${email}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const itens = response ? response.data.data : '';



      data.itens = itens;
      if (itens) {
        //console.log(itens);
        const rowL = itens
          ? itens.map(item => {
            //  console.log(item);
            const row = createData(
              item.productPacking.code,
              item.productPacking.product.description,
              item.productPacking.complement ? item.productPacking.complement : item.productPacking.variant.description,
              item.quantity + ' ' + item.productPacking.product.unit.code,
              item.unitValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }),
              item.totalValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }),
            );

            return row;
          })
          : [{ error: 'Não encontrado' }];
        setrowList(rowL);
        setLloading(false);
      }
    } catch (err) {
      setLloading(false);

      //  toast.error("Houve um erro ao listar contatos.");
    }
  }
  const {
    APELIDO,
    CLIENTE_CGC,
    CLIENTE_COD,
    NUMERO_SISTEMA,
    STATUS,
    PEDIDO_EMISSAO,
    REFERENCIA,
    PEDIDO_VALOR,
    PEDIDO_OBSERVACAO,
    GERENTE_NOME,
    NOTA_FISCAL_NUMERO,
    NOTA_FISCAL_EMISSAO,
    NOTA_FISCAL_VALOR,
    ROMANEIO_NUMERO,
    TRANSPORTADORA_NOME,
    VENDEDOR_APELIDO,
    VENDEDOR_ID
  } = data;
  moment(PEDIDO_EMISSAO.slice(0, 10)).format('DD/MM/YYYY');

  const handleClose = () => {
    setOpen(false);
    
  };

  const { register } = useForm();

  return (
    <div>
      <Tooltip title="Visualizar Pedido" open={openTP}>
        <span>
          <Button
            className={classes.button}
            onClick={handleOpen}
            onMouseOver={()=>{setOpenTP(true)}}
            onMouseLeave={()=>{setOpenTP(false)}}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} className={classes.spinner} />
            ) : (
              <VisibilityIcon />
            )}
          </Button>
        </span>
      </Tooltip>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Tabs>
              <TabList>
                <Tab>Geral</Tab>
                <Tab>Observação</Tab>
                <Tab>Itens</Tab>
              </TabList>

              <TabPanel>
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} lg={3}>
                      <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <legend style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Downloads</legend>
                        <Grid item xs={12} sm={12} lg={4}>
                          <a
                            href={data?.itens[0]?.danfe?.file?.url}
                            target="_blank"
                            download={`danfe.xml`} // Pode ser ajustado conforme necessário
                            style={{ textDecoration: 'none', marginBottom: '10px' }}
                          >
                            <img
                              src={xml}
                              alt="Download XML"
                              style={{ width: '44px', height: '44px' }} // Ajuste as dimensões conforme necessário
                            />
                            <div style={{ fontSize: '12px' }}>XML</div>
                          </a></Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <a
                            href={data?.itens[0]?.danfe?.fileDanfe?.url}
                            target="_blank"
                            download={`danfe.pdf`} // Pode ser ajustado conforme necessário
                            style={{ textDecoration: 'none' }}
                          >
                            <img
                              src={nfe} // Substitua pelo caminho correto para sua imagem PNG
                              alt="Download DANFe"
                              style={{ width: '44px', height: '44px' }} // Ajuste as dimensões conforme necessário
                            />
                            <div style={{ fontSize: '12px' }}>DANFe</div>
                          </a>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <Pdf num={data?.itens[0]?.sale?.invoice?.outgoingList?.id} />

                        </Grid>
                      </fieldset>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={9}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} lg={4}>
                          <div className="input">
                            <label>Pedido número </label>
                            <input
                              readOnly
                              name="numSistema"
                              type="text"
                              ref={register}
                              value={NUMERO_SISTEMA ? NUMERO_SISTEMA : ''}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <div className="input">
                            <label>Nota Fiscal número</label>
                            <input
                              readOnly
                              name="nf_numero"
                              type="text"
                              ref={register}
                              value={data.itens[0]?.sale.invoice?.number}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <div className="input">
                            <label>Nota Fiscal emissão</label>
                            <input
                              readOnly
                              name="nf_emissao"
                              type="text"
                              ref={register}
                              value={
                                data.itens[0]?.sale.invoice?.issueDate
                                  ? moment(data.itens[0]?.sale.invoice?.issueDate.slice(0, 10)).format(
                                    'DD/MM/YYYY',
                                  )
                                  : ''
                              }
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <div className="input">
                            <label>Nota Fiscal valor</label>
                            <input
                              readOnly
                              name="nf_vl"
                              type="text"
                              ref={register}
                              value={
                                data.itens[0]?.sale.invoice?.totalValue
                                  ? data.itens[0]?.sale.invoice?.totalValue.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })
                                  : ''
                              }
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <div className="input">
                            <label>Pedido Valor</label>
                            <input
                              readOnly
                              name="valor"
                              type="text"
                              ref={register}
                              value={
                                PEDIDO_VALOR
                                  ? PEDIDO_VALOR.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })
                                  : ''
                              }
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <div className="input">
                            <label>Referência</label>
                            <input
                              readOnly
                              name="referencia"
                              type="text"
                              ref={register}
                              value={REFERENCIA ? REFERENCIA : ''}
                            />
                          </div>
                        </Grid>



                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Empresa</label>
                        <input
                          readOnly
                          name="empresa"
                          type="text"
                          ref={register}
                          value={APELIDO ? APELIDO : ''}
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
                          value={STATUS ? translate(STATUS) : ''}
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
                          defaultValue={valuePrz ? valuePrz : ''}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Cod Conta</label>
                        <input
                          readOnly
                          name="cod_conta"
                          type="text"
                          ref={register}
                          value={CLIENTE_COD ? CLIENTE_COD : ''}
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
                          value={APELIDO ? APELIDO : ''}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Conta CNPJ</label>
                        <input
                          readOnly
                          name="conta_cnpj"
                          type="text"
                          ref={register}
                          value={data?.itens[0]?.sale?.person?.documentNumber}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Vendedor</label>
                        <input
                          readOnly
                          name="vendedor"
                          type="text"
                          ref={register}
                          value={data.VENDEDOR_APELIDO} />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Emissão</label>
                        <input
                          readOnly
                          name="emissao"
                          type="text"
                          ref={register}
                          value={
                            PEDIDO_EMISSAO
                              ? moment(PEDIDO_EMISSAO.slice(0, 10)).format(
                                'DD/MM/YYYY',
                              )
                              : ''
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Romaneio</label>
                        <input
                          readOnly
                          name="romaneio_numero"
                          type="text"
                          ref={register}
                          value={data.itens[0]?.sale.invoice?.outgoingList?.id}
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
                          value={TRANSPORTADORA_NOME ? TRANSPORTADORA_NOME : ''}
                        />
                      </div>
                    </Grid>



                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Supervisor</label>
                        <input
                          readOnly
                          name="supervisor"
                          type="text"
                          ref={register}
                          value={data.supervisor ? data.supervisor : ''}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>
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
                          rows={8}
                          ref={register}
                          value={
                            PEDIDO_OBSERVACAO
                              ? PEDIDO_OBSERVACAO
                              : 'Nenhuma observação foi feita'
                          }
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </TabPanel>
              <TabPanel>
                <DataTable
                  rows={rowList}
                  rowHead={rowHead}
                  title={'Itens'}
                  load={loading}
                />
              </TabPanel>
            </Tabs>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

ModalPedidosSQL.propTypes = {
  data: PropTypes.object.isRequired,
};
