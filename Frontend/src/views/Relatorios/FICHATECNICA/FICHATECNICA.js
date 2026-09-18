import React, { useState, useEffect } from 'react';
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

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '90%',
    minHeight: '90%',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'scroll',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    border: 0,
    borderRadius: '20px',
    backgroundColor: '#00acc1',
    color: '#fff',
    padding: '2px',
    cursor: 'pointer',
  },
}));

function FICHATECNICA() {
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
  const [loading, setLoading] = useState(false);
  const [listEmpresas, setListEmpresas] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');
  const [listPrice, setListPrice] = useState([]);
  const [listPriceChoose, setListPriceChoose] = useState('');
  const [optionlist, setOptionList] = useState('');
  const [idProdutoGrade, setIdProdutoGrade] = useState('');

  const loadProdutosGrade = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos_NameOrCod}?tipo=grade&pesquisa=${inputValue}`,
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
            return item.id + item.code == y.id + y.code;
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
              item.code +
              ' - ' +
              (item.product.description ? item.product.description : '') +
              ' - ' +
              (item.complement
                ? item.complement
                : item.variant
                ? item.variant.description
                : ''),
          };
        })
        .sort((a, b) => {
          return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        });

      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLoading(false);
    }
  };
  const loadOptionsProdutosGrade = (inputValue, callback) =>
    loadProdutosGrade(inputValue, callback);

  const debouncedLoadOptionsProdutosGrade = debounce(
    loadOptionsProdutosGrade,
    3000,
    {
      leading: false,
    },
  );

  const Pesquisaitem = (data, e) => {
    e.preventDefault();
    handleSearch(data);
  };

  const handleSearch = async data => {
    setLoading(true);

    try {
      toast.success('Aguarde, seu PDF está sendo gerado.');

      const req = await axios.get(
        `${API.produtos_espec}?id=${idProdutoGrade}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      const pdfBase64 = req.data.content;

      if (!pdfBase64) {
        throw new Error('Conteúdo do PDF não encontrado.');
      }

      // Remove prefixo caso venha como data URI
      const base64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

      // Converte Base64 para binário
      const binaryString = window.atob(base64);

      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Cria o PDF
      const pdfBlob = new Blob([bytes], {
        type: req.data.contentType || 'application/pdf',
      });

      // Cria URL somente depois que o PDF estiver pronto
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Só agora abre a nova aba
      window.open(pdfUrl, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 300000);
    } catch (err) {
      console.error('Erro ao gerar/exibir PDF:', err);
      toast.error('Não foi possível gerar seu PDF');
    } finally {
      setLoading(false);
    }
  };

  //const listPedidos = useSelector(state => state.filter.listPedido);

  return (
    <>
      <Pesquisa>
        <div>
          <ExpansionPanel expanded={PanelOpen}>
            <Typography component={'span'} className={classes.heading}>
              Painel de pesquisa
            </Typography>

            <Typography component={'div'}>
              <Form>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={6}
                    style={{
                      marginLeft: '2px',
                      marginTop: '10px',
                      marginBottom: '30px',
                    }}
                  >
                    <div className="input">
                      <label>Produto Grade</label>
                      <Async
                        loadOptions={debouncedLoadOptionsProdutosGrade}
                        cacheOptions
                        isClearable={true}
                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                        placeholder="Produto"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9996,
                          }),
                          container: provided => ({
                            ...provided,
                            width: '100%',
                          }),
                          control: provided => ({
                            ...provided,
                            width: '100%',
                          }),
                        }}
                        onChange={value => {
                          setIdProdutoGrade(value.value);
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <ButtonStyled
                      variant="contained"
                      color="primary"
                      disabled={!loading ? false : true}
                      onClick={e => Pesquisaitem(getValues(), e)}
                    >
                      {loading && (
                        <i
                          className="fa fa-refresh fa-spin"
                          style={{ marginRight: '5px' }}
                        />
                      )}
                      {loading && <span>Gerando relatório...</span>}
                      {!loading && <span>Pesquisar</span>}{' '}
                    </ButtonStyled>
                  </Grid>
                </Grid>
              </Form>
            </Typography>
          </ExpansionPanel>
        </div>
      </Pesquisa>
    </>
  );
}

export default connect()(FICHATECNICA);
