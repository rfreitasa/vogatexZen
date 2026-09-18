import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import axios from 'axios';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Pesquisa, Form, ButtonStyled } from '../styles';
import { API } from '../../../config/api';
import Select from 'react-select';
import Async from 'react-select/async';
import debounce from 'debounce-promise';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import agrupaObjetos from "../../../utils/agrupaObjetos";
import formatDecimal from "../../../utils/formatDecimal";
import { ReactToPrint } from 'react-to-print';
import './styles.css';




const moment = require('moment-timezone')





const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    minWidth: "90%",
    minHeight: "90%",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "90%",
    maxHeight: "90%",
    overflow: "scroll"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#00acc1",
    color: "#fff",
    padding: "2px",
    cursor: "pointer"
  }
}));

function ESTOQUEIMAGEM() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const usuario_id = sessionStorage.getItem('id');


  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete

  const [classesReport, setClassesReport] = useState([]);
  const [nomeClassesReport, setNomeClassesReport] = useState('');
  const [idClassesReport, setIdClassesReport] = useState('');
  const [loading, setLloading] = useState(false);
  const [produtoEscolhido, setProdutoEscolhido] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [open, setOpen] = React.useState(false);
  const modalRef = useRef(null);
  const [idProduto, setIdProduto] = useState('');
  const [listEmpresas, setListEmpresas] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');
  const [listPrice, setListPrice] = useState([]);
  const [listPriceChoose, setListPriceChoose] = useState('');
  const [optionlist, setOptionList] = useState('');


  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await axios.get(`${API.empresa}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const data = response.data ? response.data.data.filter(item => item.EMPRESA_NOME != 'PERSONAL SOFTWARE' && item.EMPRESA_ATIVO == 0).map(item => {
          return { value: item.EMPRESA_ID_ERP, label: item.EMPRESA_NOME.toUpperCase() };
        }) : '';

        setListEmpresas(data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          toast.error('Erro ao carregar lista');
        }
      }
    };
    const getListPrice = async usuario => {
      try {
        const response = await axios.get(
          `${API.regras}/atribuidas?email=${email}&usuario=${usuario}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );
        const lista = response.data.data.map(item => {
          return {
            value: item.LISTA_PRECOS_ID,
            label: item.LISTA_PRECOS_NOME + '-' + item.LISTA_PRECOS_DESCRICAO,
            selected: item.SELECIONADO,
          };
        });

        //   setListPrice(lista);
        const listitems = lista.filter(item => {
          return item.selected == 'selected';
        })

        setListPrice(listitems);
        setOptionList(listitems[0]
          ? listitems.map(item => {
            return <option value={item.value}>{item.label}</option>;

          })
          : ' <option value=""></option>'
        )

      } catch (err) {
        toast.error('Erro ao carregar lista de preços de venda.');
      }
    };

    loadCompany();
    getListPrice(usuario_id);
  }, []);


  const loadProducts = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?email=${email}&tipo=='filho'&pesquisa=${inputValue}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      var reduced = [];

      response.data.data.forEach(item => {
        var duplicated =
          reduced.findIndex(y => {
            return  item.product.code ==  y.product.code;
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });
      const data = reduced
        .map(item => {
          return {
            value: item.product.id,
            label:
              item.product.code +
              ' - ' +
              (item.product.description ? item.product.description : '') +
              ' - ' +
              (item.product.id ),

          };
        })
        .sort((a, b) => {
          return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        });

      // console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };

  //DEBOUNCE PRODUCTS
  const loadOptionsProducts = (inputValue, callback) =>
    inputValue.length > 3 ? loadProducts(inputValue, callback) : '';

  const debouncedLoadOptionProducts = debounce(loadOptionsProducts, 2000, {
    leading: true,
  });
  const contentRef = useRef(null);

  const handlePrint = () => {
    //const content = document.getElementById('content-to-print').outerHTML;
    const content = modalRef.current.innerHTML;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Salesbreath Report Images</title>
          <link rel="stylesheet" href="./styles.css">
          <style>
          .image-report {
            display: flex;
            flex-wrap: wrap;
          }
          
          .row {
            display: flex;
            width: 100%;
            height:170px;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          
          .column {
            flex-basis: calc(50% - 10px);
          }
          
          .image-container {
            text-align: center;
            margin-bottom: 10px;
            border: solid;
          }
          
          img {
            width: 100%;
            max-height: 120px;
            max-width: 100%;
            
          }
          
          h3 {
            margin-top: 5px;
          }
          </style>
        </head>
        <body>
          <div>
            ${content}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
              
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const Pesquisaitem = (data, e) => {
    //console.log(produtoEscolhido)

    e.preventDefault();
    handleSearch(data);
  };
  const rows = [];
  function gera_relatorio(images) {
    //agrupando objetos pelo Mestre_codigo
    const agrupados_Mestre_codigo = agrupaObjetos(images, "product_code");
    var Saldo_g = 0

    //console.log(agrupados_Mestre_codigo)

    const groupedArray = Array.from(Object.entries(agrupados_Mestre_codigo));
    var position = 0;
    var position_tot_img = 0;
    for (var [key, value] of groupedArray) {
      //Object.entries(agrupados_Mestre_codigo).map(([category, objects]) => {

      var Saldo = 0;
      Saldo = value.reduce(function (acc, obj) {
        return acc + obj.quantity
      }, 0);

      Saldo_g = Saldo_g + Saldo;

      var row = (
        <Grid item xs={12} lg={12} md={12}>
          <div className="image-row" >
            <div key={key} className="image-item">
              <p><strong>{
                value ?
                  value[0].product_code + ' - ' + value[0].product_description : ''}</strong></p>
              <p>Total disponível: {formatDecimal(Saldo) + ' ' + value[0].unit_code}</p>

            </div>
            <hr></hr>
            <br></br>
          </div>
        </Grid>

      );
      rows.push(row);

      const maxImagesPerRow = 6; // Número máximo de imagens por linha

      const rows_line = [];
      let currentRow = [];

      position += 90;
      value.forEach((image, index) => {

        currentRow.push(image);


        if (currentRow.length === maxImagesPerRow || index === value.length - 1) {
          rows_line.push(currentRow);
          currentRow = [];
        }

      });

      const linha = (
        <div className="image-report">
          {rows_line.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((image, imageIndex) => {
                if (imageIndex == 0) { position += 100; }
                // position_tot_img+=100;

                if (image.schedule_key) {
                  image.ITEM_PREVISAO = moment(image.schedule_availabilityDate).format(
                    'DD/MM/YYYY',
                  )
                }
                const shouldAddPageBreak = position > 390 || imageIndex == 3; // Verifica se a próxima posição ultrapassa 700
                if (position > 390 || imageIndex == 3) { position = 0; }
                return (
                  <div key={imageIndex} className="column" style={{ pageBreakAfter: shouldAddPageBreak ? 'always' : 'auto' }}>
                    <div className="image-container">
                    <img src={image.URL} alt={image.alt} />

                      <table>
                        <tr>
                          <td nowrap style={{ fontSize: '12px', paddingRight: '10px' }}><strong>Produto</strong></td>
                          <td nowrap style={{ fontSize: '10px', paddingRight: '10px' }}><p>{image.productPacking_code}</p></td>
                          <td nowrap style={{ fontSize: '10px', paddingRight: '10px' }}><strong><p>{
                            !image.schedule_key
                              ? 'P.E'
                              : `${image.schedule_code}  ${image.ITEM_PREVISAO}`
                          }</p></strong></td>
                          <td nowrap style={{ fontSize: '10px', paddingRight: '10px' }}>{image
                            ? formatDecimal(image.quantity) + ' ' + image.unit_code
                            : ''}</td>
                        </tr>
                        <tr>

                          <td nowrap style={{ fontSize: '12px', paddingRight: '10px' }}><strong>Cor</strong></td>
                          <td nowrap style={{ fontSize: '10px', paddingRight: '10px' }}><p>{image.productPacking_complement ? image.productPacking_complement : image.productVariant_description}</p></td>

                          <td nowrap style={{ fontSize: '12px', paddingRight: '10px' }}><strong>Empresa</strong></td>
                          <td nowrap style={{ fontSize: '10px', paddingRight: '10px' }}><p>{image.stockCluster_code}</p></td>

                          <td nowrap style={{ fontSize: '12px', paddingRight: '10px' }}><strong>Valor</strong></td>
                          <td nowrap style={{ fontSize: '10px', paddingRight: '10px' }}><p>{image.VALOR_UNITARIO}</p></td>
                        </tr>

                      </table>


                    </div>
                  </div>

                );
              })}
            </div>
          ))}
        </div>);
      rows.push(linha);

      /*
            value.map((item, key) => {
      
              //  Saldo = Saldo + item.ITEM_SALDO;
              if (item.ITEM_PREVISAO != null) {
                item.ITEM_PREVISAO = moment(item.ITEM_PREVISAO).format(
                  'DD/MM/YYYY',
                )
              }
              console.log(key);
              var row = '';
      
              row = (
      
                <Grid
      
                  item xs={6} lg={6} md={6}>
      
                  <Grid
      
                    item xs={12} lg={12} md={12}>
                    <Grid
                      container
                      spacing={3}
                      style={{
                        width: '100%',
                        minHeight: '100%',
                      }}
                    >
      
                      <Grid
      
                        item xs={4} lg={4} md={4}>
                        <p>Produto</p>
                      </Grid>
      
                      <Grid
      
                        item xs={4} lg={4} md={4}>
                        <p>Cor</p>
                      </Grid>
      
                      <Grid
      
                        item xs={4} lg={4} md={4}>
                        <p>{
                          item.PROGRAMACAO_ID == null
                            ? 'P.E'
                            : `PRG ${item.ITEM_PREVISAO}`
                        }</p>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={3}
                      style={{
                        width: '100%',
                        minHeight: '100%',
                      }}
                    >
      
                      <Grid
      
                        item xs={4} lg={4} md={4}>
                        <p>{item ? item.ITEM_CODIGO : ''}</p>
                      </Grid>
      
                      <Grid
      
                        item xs={4} lg={4} md={4}>
                        <p>{item ? item.ITEM_GRADE : ''}</p>
                      </Grid>
      
                      <Grid
      
                        item xs={4} lg={4} md={4}>
                      </Grid>
      
                    </Grid>
                    <Grid
      
                      item xs={12} lg={12} md={12}>
      
                      <img src={item.URL} style={{ width: '100%' }} alt={item.ITEM_NOME} />
                    </Grid>
      
                  </Grid>
      
      
                </Grid >
              );
      
              rows.push(row);
      
            })*/

    }
    setSelectedImages(rows);
    setOpen(true);

  }
  const verificaEAtualizaArray = (array) => {
    if (Array.isArray(array) && array.length > 0) {
      return array.map(item => item.value).join(',');
    } else {
      return null;
    }
  };

  const handleSearch = async data => {
    if (idProduto) {
      try {
        setLloading(true);
        var axios_search = '';
        var where = '';
        if (idProduto) {

          const parametros = JSON.stringify(idProduto.map(item => { return item.value }));

          where = where + `&nome=${parametros}`;

        }
        if (idEmpresas.length > 0) {

          const empresas_selecionadas = verificaEAtualizaArray(idEmpresas);

          where = where + `&empresas=${empresas_selecionadas}`;

        }
        if (listPriceChoose.length > 0) {


          where = where + `&lista=${listPriceChoose}`;

        }
        where = where + `&programacao=${data.programacao}`
        axios_search = `${API.relatorios}/?relatorio=ESTOQUEIMAGEM&email=${email}${where}`;

        try {
          toast.success('Aguarde seu Relatório está sendo gerado.');
          const response = await axios.get(`${axios_search}`, {

            headers: {
              'x-access-token': token,
            },
          });
          setLloading(false);
          gera_relatorio(response.data.data); //gerando o relatorio 
          //  window.open(fileURL);
        } catch (err) {
          setLloading(false);

          if (err.response.status === 402) {
            //token expirado
            toast.error('Sua sessão expirou, favor efetuar login');
            sessionStorage.clear();
          } else {
            toast.error('Não foi possível gerar seu Relatório');
          }
        }

      } catch (error) {
        setLloading(false);

        toast.error('Não localizado, verifique os campos de pesquisa.');
      }
    } else {
      toast.success('Por favor selecione um produto.');
    }
  };

  //const listPedidos = useSelector(state => state.filter.listPedido);
  //console.log(dadosPedidos);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Pesquisa>
        <div>
          <ExpansionPanel expanded={PanelOpen}>
            <ExpansionPanelSummary
              expanded={PanelOpen}
              onClick={() => {
                //  setPanelOpen(!PanelOpen);
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography component={'span'} className={classes.heading}>
                Painel de pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={'div'}>
                <Form>
                  <Grid container spacing={0}>


                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Produto</label>
                        <Async
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          loadOptions={debouncedLoadOptionProducts}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Produto"
                          menuPortalTarget={document.body}

                          styles={{
                            control: base => ({
                              ...base,
                              fontSize: '12px',
                            }),
                            input: base => ({
                              ...base,
                              fontSize: '12px',
                            }),
                            menuPortal: base => ({
                              ...base,
                              zIndex: 22194,
                            }),

                            container: base => ({
                              ...base,
                              minWidth: '8rem',
                            }),
                          }}

                          isMulti

                          onChange={value => {
                            setIdProduto(value);
                          }}


                        />
                      </div>
                    </Grid>




                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Programação</label>
                        <select name="programacao" ref={register}>
                          <option value="PRONTA_ENTREGA">PRONTA ENTREGA</option>
                          <option value="PROGRAMACAO">PROGRAMAÇÃO</option>
                          <option value="TODOS" selected>TODOS</option>
                        </select>
                      </div>
                    </Grid>
                    <Grid key="empresas" item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label
                         style={{
                          minWidth: '10rem',
                          height: 'calc(2em + 0.75rem + 2px)',
                          fontSize: '12px',
                          marginRight: '5px',
                        }}
                        >Empresas</label>
                        <Select
                          //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                          options={listEmpresas ? listEmpresas : []}
                          cacheOptions
                          isClearable={true}
                          noOptionsMessage={() => 'Nenhuma opção encontrada'}
                          placeholder="Empresas"
                          menuPortalTarget={document.body}
                          isMulti

                          styles={{
                            control: base => ({
                              ...base,
                              fontSize: '12px',
                            }),
                            input: base => ({
                              ...base,
                              fontSize: '12px',
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 10000,
                            }),
                          }}
                          onChange={value => {

                            setIdEmpresas(value);

                          }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Lista</label>
                        <select
                          id="lista"
                          name="lista"
                          placeholder="Lista de preço"
                          style={{
                            minWidth: '10rem',
                            height: 'calc(2em + 0.75rem + 2px)',
                            fontSize: '12px',
                            marginRight: '5px',
                          }}
                          ref={register}
                          value={listPriceChoose ? listPriceChoose : ''}
                          //defaultValue={frete}
                          onChange={e => {

                            setListPriceChoose(e.target.value);

                          }}
                        >
                          <option value="">Selecione uma opção</option> {/* Opção vazia */}

                          ${optionlist}

                        </select>
                      </div>
                    </Grid>
                  
                    <Grid item xs={12} sm={12} lg={12}>
                      <ButtonStyled
                        variant="contained"
                        color="primary"
                        //disabled={!loading ? false : true}
                        onClick={e => Pesquisaitem(getValues(), e)}
                      >
                        {loading && (
                          <i
                            className="fa fa-refresh fa-spin"
                            style={{ marginRight: '5px' }}
                          />
                        )}
                        {loading && <span>Gerando relatório...</span>}
                        {!loading && <span>Pesquisar</span>}
                      </ButtonStyled>
                    </Grid>
                  </Grid>
                </Form>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Pesquisa>

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
            <button onClick={handlePrint}>Imprimir</button>
            <button onClick={handleClose}>Fechar</button>
            <div id="content-to-print" ref={modalRef} >
              <center><h2>Relatório de Imagens</h2></center>
              {selectedImages}
            </div>

          </div>
        </Fade>
      </Modal>


    </>
  )
}

export default connect()(ESTOQUEIMAGEM);
