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

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import agrupaObjetos from '../../../utils/agrupaObjetos';
import formatDecimal from '../../../utils/formatDecimal';
import formatMoney from '../../../utils/formatMoney';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import ReactToPrint from 'react-to-print';

import './styles.css';

const moment = require('moment-timezone');

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO DA IMPRESSÃO
|--------------------------------------------------------------------------
|
| IMPORTANTE:
|
| O relatório impresso agora é o MESMO conteúdo exibido no modal.
| Não existe mais uma segunda cópia com display:none.
|
*/
const pageStyle = `
  @page {
    size: auto;
    margin: 8mm;
  }

  @media print {

    html,
    body {
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      background: #ffffff !important;
    }

    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }

    #print-area {
      display: block !important;
      position: relative !important;
      width: 100% !important;
      max-width: none !important;
      height: auto !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      background: #ffffff !important;
    }

    #print-area .image-report {
      width: 100% !important;
      display: block !important;
      overflow: visible !important;
    }

    #print-area .row {
      display: flex !important;
      flex-wrap: nowrap !important;
      width: 100% !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 8px !important;
    }

    #print-area .column {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      padding: 2px !important;
      box-sizing: border-box !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    #print-area .image-container {
      width: 100% !important;
      height: 90px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    #print-area .image-container img {
      display: block !important;
      max-width: 100% !important;
      max-height: 90px !important;
      object-fit: contain !important;
      margin: 0 auto !important;
    }

    #print-area .image-details {
      font-size: 8px !important;
      line-height: 1.15 !important;
      margin-top: 2px !important;
    }

    #print-area .image-details p {
      margin: 1px 0 !important;
      padding: 0 !important;
    }

    #print-area h2 {
      font-size: 18px !important;
      margin: 0 0 10px 0 !important;
      padding: 0 !important;
    }

    #print-area p {
      color: #000000 !important;
    }

    img {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    padding: 0,
    margin: 0,
  },

  paper: {
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[4],

    /*
     * Este scroll serve SOMENTE para visualização.
     * Durante a impressão o conteúdo referenciado será clonado
     * pelo react-to-print.
     */
    maxHeight: '90vh',
    overflowY: 'auto',

    width: '95vw',
    maxWidth: '1400px',
    boxSizing: 'border-box',
  },

  buttonContainer: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },

  printButton: {
    fontWeight: 'bold',
  },

  closeButton: {
    fontWeight: 'bold',
  },
}));

function ESTOQUEIMAGEM() {
  const classes = useStyles();

  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const usuario_id = sessionStorage.getItem('id');

  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  const [classesReport, setClassesReport] = useState([]);
  const [nomeClassesReport, setNomeClassesReport] = useState('');
  const [idClassesReport, setIdClassesReport] = useState('');

  const [loading, setLloading] = useState(false);

  const [produtoEscolhido, setProdutoEscolhido] = useState('');

  const [selectedImages, setSelectedImages] = useState([]);

  const [open, setOpen] = React.useState(false);

  const [idProduto, setIdProduto] = useState('');

  const [listEmpresas, setListEmpresas] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');

  const [listPrice, setListPrice] = useState([]);
  const [listPriceChoose, setListPriceChoose] = useState('');

  const [optionlist, setOptionList] = useState('');

  /*
  |--------------------------------------------------------------------------
  | REF DA IMPRESSÃO
  |--------------------------------------------------------------------------
  |
  | Agora aponta DIRETAMENTE para o conteúdo visualizado.
  |
  */
  const printRef = useRef(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await axios.get(`${API.empresa}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const data = response.data
          ? response.data.data
              .filter(
                item =>
                  item.EMPRESA_NOME !== 'PERSONAL SOFTWARE' &&
                  item.EMPRESA_ATIVO === 0,
              )
              .map(item => {
                return {
                  value: item.EMPRESA_ID_ERP,
                  label: item.EMPRESA_NOME.toUpperCase(),
                };
              })
          : '';

        setListEmpresas(data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          toast.error(
            'Sua sessão expirou, favor efetuar login',
          );

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
            label:
              item.LISTA_PRECOS_NOME +
              '-' +
              item.LISTA_PRECOS_DESCRICAO,
            selected: item.SELECIONADO,
          };
        });

        const listitems = lista.filter(
          item => item.selected === 'selected',
        );

        setListPrice(listitems);

        setOptionList(
          listitems[0]
            ? listitems.map(item => {
                return (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                );
              })
            : ' <option value=""></option>',
        );
      } catch (err) {
        toast.error(
          'Erro ao carregar lista de preços de venda.',
        );
      }
    };

    loadCompany();
    getListPrice(usuario_id);
  }, [email, token, usuario_id]);

  /*
  |--------------------------------------------------------------------------
  | PESQUISA DOS PRODUTOS
  |--------------------------------------------------------------------------
  */

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

      const reduced = [];

      response.data.data.forEach(item => {
        const duplicated =
          reduced.findIndex(
            y => item.product.code === y.product.code,
          ) > -1;

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
              (item.product.description
                ? item.product.description
                : '') +
              ' - ' +
              item.product.id,
          };
        })
        .sort((a, b) => {
          return a.value > b.value
            ? 1
            : b.value > a.value
            ? -1
            : 0;
        });

      return data;
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      return [];
    }
  };

  const loadOptionsProducts = (inputValue, callback) =>
    inputValue.length > 3
      ? loadProducts(inputValue, callback)
      : '';

  const debouncedLoadOptionProducts = debounce(
    loadOptionsProducts,
    2000,
    {
      leading: true,
    },
  );

  /*
  |--------------------------------------------------------------------------
  | PESQUISA
  |--------------------------------------------------------------------------
  */

  const Pesquisaitem = async (data, e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLloading(true);

    try {
      await handleSearch(data);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setLloading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GERA RELATÓRIO
  |--------------------------------------------------------------------------
  */

  function gera_relatorio(images) {
    const agrupados_Mestre_codigo = agrupaObjetos(
      images,
      'product_code',
    );

    const groupedArray = Array.from(
      Object.entries(agrupados_Mestre_codigo),
    );

    const rows = [];

    let Saldo_g = 0;

    groupedArray.forEach(([key, value]) => {
      const Saldo = value.reduce(
        (acc, obj) => acc + obj.quantity,
        0,
      );

      Saldo_g += Saldo;

      /*
       * Cabeçalho do produto
       */
      rows.push(
        <Grid
          item
          xs={12}
          lg={12}
          md={12}
          key={`header-${key}`}
        >
          <div
            className="report-product-header"
            style={{
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              boxShadow:
                '0 2px 8px rgba(0, 0, 0, 0.08)',
              marginBottom: '14px',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <div
              style={{
                marginBottom: '12px',
              }}
            >
              <p
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {value[0]?.product_code}
                {' - '}
                {value[0]?.product_description}
              </p>

              <p
                style={{
                  margin: '1px 0 0 0',
                  fontSize: '0.95rem',
                  color: '#555',
                }}
              >
                Total disponível:{' '}
                <strong>
                  {formatDecimal(Saldo)}{' '}
                  {value[0]?.unit_code}
                </strong>
              </p>
            </div>
          </div>
        </Grid>,
      );

      /*
       * Quantidade máxima de produtos por linha.
       */
      const maxImagesPerRow = 8;

      const rows_line = [];

      let currentRow = [];

      value.forEach((image, index) => {
        currentRow.push(image);

        if (
          currentRow.length === maxImagesPerRow ||
          index === value.length - 1
        ) {
          rows_line.push(currentRow);

          currentRow = [];
        }
      });

      rows.push(
        <div
          className="image-report"
          key={`group-${key}`}
        >
          {rows_line.map((row, rowIndex) => (
            <div
              className="row"
              key={`row-${rowIndex}`}
            >
              {row.map((image, imageIndex) => {
                if (image.schedule_key) {
                  image.ITEM_PREVISAO = moment(
                    image.schedule_availabilityDate,
                  ).format('DD/MM/YYYY');
                }

                return (
                  <div
                    className="column"
                    key={`img-${imageIndex}`}
                  >
                    <div
                      className="image-container"
                      style={{
                        width: '100%',
                        height: '100px',
                        backgroundColor: '#f9f9f9',

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        position: 'relative',

                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={image.URL || ''}
                        alt={image.alt || 'Imagem'}
                        onError={e => {
                          e.target.style.visibility =
                            'hidden';

                          const fallback =
                            e.target.nextSibling;

                          if (fallback) {
                            fallback.style.display =
                              'flex';
                          }
                        }}
                        style={{
                          maxHeight: '100px',

                          maxWidth: '100%',

                          objectFit: 'contain',
                        }}
                      />

                      <div
                        className="fallback-text"
                        style={{
                          display: 'none',

                          position: 'absolute',

                          color: '#999',

                          fontSize: '14px',

                          fontStyle: 'italic',
                        }}
                      >
                        Sem imagem
                      </div>
                    </div>

                    <div className="image-details">
                      <p>
                        <strong>Cod:</strong>{' '}
                        {image.productPacking_code}
                      </p>

                      <p>
                        <strong>
                          {!image.schedule_availabilityDate
                            ? 'P.E'
                            : `${image.schedule_code} ${image.ITEM_PREVISAO}`}
                        </strong>

                        &nbsp;

                        {formatDecimal(
                          image.quantity,
                        )}{' '}
                        {image.unit_code}
                      </p>

                      <p>
                        <strong>Cor:</strong>{' '}
                        {image.productPacking_complement ||
                          image.productVariant_description}
                      </p>

                      <p>
                        <strong>Empresa:</strong>{' '}
                        {image.stockCluster_code}
                      </p>

                      <p>
                        <strong>Valor:</strong>{' '}
                        {formatMoney(
                          image.VALOR_UNITARIO,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>,
      );
    });

    setSelectedImages(rows);

    setOpen(true);
  }

  /*
  |--------------------------------------------------------------------------
  | AUXILIAR PARA SELECT
  |--------------------------------------------------------------------------
  */

  const verificaEAtualizaArray = array => {
    if (
      Array.isArray(array) &&
      array.length > 0
    ) {
      return array
        .map(item => item.value)
        .join(',');
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | BUSCA RELATÓRIO
  |--------------------------------------------------------------------------
  */

  const handleSearch = async data => {
    if (idProduto && idProduto.length > 0) {
      try {
        let axios_search = '';

        let where = '';

        if (idProduto) {
          const parametros = JSON.stringify(
            idProduto.map(item => item.value),
          );

          where += `&nome=${parametros}`;
        }

        if (
          idEmpresas &&
          idEmpresas.length > 0
        ) {
          const empresas_selecionadas =
            verificaEAtualizaArray(idEmpresas);

          where += `&empresas=${empresas_selecionadas}`;
        }

        if (
          listPriceChoose &&
          listPriceChoose.length > 0
        ) {
          where += `&lista=${listPriceChoose}`;
        }

        where += `&programacao=${data.programacao}`;

        axios_search =
          `${API.relatorios}/?relatorio=ESTOQUEIMAGEM` +
          `&email=${email}${where}`;

        try {
          toast.success(
            'Aguarde, seu relatório está sendo gerado.',
          );

          const response = await axios.get(
            `${axios_search}`,
            {
              headers: {
                'x-access-token': token,
              },
            },
          );

          gera_relatorio(response.data.data);
        } catch (err) {
          if (
            err.response &&
            err.response.status === 402
          ) {
            toast.error(
              'Sua sessão expirou, favor efetuar login',
            );

            sessionStorage.clear();
          } else {
            console.error(
              'Erro ao gerar relatório:',
              err,
            );

            toast.error(
              'Não foi possível gerar seu Relatório',
            );
          }
        }
      } catch (error) {
        console.error(error);

        toast.error(
          'Não localizado, verifique os campos de pesquisa.',
        );
      }
    } else {
      toast.warning(
        'Por favor selecione um produto.',
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FECHAR MODAL
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {
    setOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* ============================================================
          ÁREA PRINCIPAL
      ============================================================ */}

      <Pesquisa>
        <div>
          <ExpansionPanel expanded={PanelOpen}>
            <ExpansionPanelSummary
              expanded={PanelOpen}
              onClick={() => {}}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography
                component={'span'}
                className={classes.heading}
              >
                Painel de pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={'div'}>
                <Form>
                  <Grid
                    container
                    spacing={0}
                  >
                    {/* Produto */}

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      lg={12}
                    >
                      <div className="input">
                        <label>
                          Produto
                        </label>

                        <Async
                          loadOptions={
                            debouncedLoadOptionProducts
                          }
                          cacheOptions
                          isClearable
                          noOptionsMessage={() =>
                            'Nenhuma opção encontrada'
                          }
                          placeholder="Produto"
                          menuPortalTarget={
                            document.body
                          }
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

                    {/* Programação */}

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      lg={12}
                    >
                      <div className="input">
                        <label>
                          Programação
                        </label>

                        <select
                          name="programacao"
                          ref={register}
                        >
                          <option value="PRONTA_ENTREGA">
                            PRONTA ENTREGA
                          </option>

                          <option value="PROGRAMACAO">
                            PROGRAMAÇÃO
                          </option>

                          <option
                            value="TODOS"
                            defaultValue
                          >
                            TODOS
                          </option>
                        </select>
                      </div>
                    </Grid>

                    {/* Empresas */}

                    <Grid
                      key="empresas"
                      item
                      xs={12}
                      sm={12}
                      lg={12}
                    >
                      <div className="input">
                        <label
                          style={{
                            minWidth:
                              '10rem',

                            height:
                              'calc(2em + 0.75rem + 2px)',

                            fontSize:
                              '12px',

                            marginRight:
                              '5px',
                          }}
                        >
                          Empresas
                        </label>

                        <Select
                          options={
                            listEmpresas
                              ? listEmpresas
                              : []
                          }
                          cacheOptions
                          isClearable
                          noOptionsMessage={() =>
                            'Nenhuma opção encontrada'
                          }
                          placeholder="Empresas"
                          menuPortalTarget={
                            document.body
                          }
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

                            menuPortal: base => ({
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

                    {/* Lista */}

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      lg={12}
                    >
                      <div className="input">
                        <label>
                          Lista
                        </label>

                        <select
                          id="lista"
                          name="lista"
                          placeholder="Lista de preço"
                          style={{
                            minWidth:
                              '10rem',

                            height:
                              'calc(2em + 0.75rem + 2px)',

                            fontSize:
                              '12px',

                            marginRight:
                              '5px',
                          }}
                          ref={register}
                          value={
                            listPriceChoose
                              ? listPriceChoose
                              : ''
                          }
                          onChange={e => {
                            setListPriceChoose(
                              e.target.value,
                            );
                          }}
                        >
                          <option value="">
                            Selecione uma opção
                          </option>

                          {optionlist}
                        </select>
                      </div>
                    </Grid>

                    {/* Botão pesquisar */}

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      lg={12}
                    >
                      <ButtonStyled
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={e =>
                          Pesquisaitem(
                            getValues(),
                            e,
                          )
                        }
                        style={{
                          position:
                            'relative',

                          minWidth:
                            '120px',
                        }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress
                              size={24}
                              style={{
                                position:
                                  'absolute',

                                left:
                                  '50%',

                                marginLeft:
                                  '-12px',

                                color:
                                  'white',
                              }}
                            />

                            <span
                              style={{
                                opacity:
                                  0,
                              }}
                            >
                              Pesquisar
                            </span>
                          </>
                        ) : (
                          'Pesquisar'
                        )}
                      </ButtonStyled>
                    </Grid>
                  </Grid>
                </Form>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Pesquisa>

      {/* ============================================================
          MODAL
      ============================================================ */}

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
            {/* Botões */}

            <div
              className={
                classes.buttonContainer
              }
            >
              <ReactToPrint
                trigger={() => (
                  <Button
                    variant="contained"
                    color="primary"
                    className={
                      classes.printButton
                    }
                  >
                    Imprimir
                  </Button>
                )}

                /*
                 * AGORA O REF APONTA PARA
                 * O RELATÓRIO VISÍVEL.
                 */
                content={() =>
                  printRef.current
                }

                pageStyle={pageStyle}

                /*
                 * Útil principalmente em navegadores
                 * móveis que demoram um pouco mais
                 * para preparar imagens.
                 */
                removeAfterPrint
              />

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                className={
                  classes.closeButton
                }
              >
                Fechar
              </Button>
            </div>

            {/* ======================================================
                ESTE É O RELATÓRIO VISÍVEL E IMPRIMÍVEL
            ====================================================== */}

            <Box
              id="print-area"
              ref={printRef}
              style={{
                width: '100%',
                margin: 0,
                padding: '2px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
              }}
            >
              <Typography
                variant="h5"
                align="center"
                gutterBottom
              >
                Relatório de Imagens
              </Typography>

              {selectedImages}
            </Box>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default connect()(ESTOQUEIMAGEM);