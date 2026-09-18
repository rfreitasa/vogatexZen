import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { toast } from 'react-toastify';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@material-ui/core';
import Autocomplete from 'react-autocomplete';

import ModalClientes from '../../components/Clientes/ModalClientes';
import DataTable from 'components/Table/Table.js';
import { API, rules } from '../../config/api';
import ModalCreate from '../../components/Clientes/ModalCreate';
import {
  GradientBackground,
  ActionButton,
  StyledSectionTitle,
  StyledInputGroup,
  StyledFooter,
  ButtonContainer,
  SearchPanel,
  SearchForm,
} from './styles';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    margin: '2px 2px',
  },
  heading: {
    fontWeight: 600,
    fontSize: '18px',
    color: '#2563eb',
  },
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  formControl: {
    minWidth: '100%',
    marginTop: '8px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  chip: {
    margin: '2px',
  },
}));

function createRow(
  acoes,
  id,
  name,
  fantasyName,
  cnpj,
  addressStreet,
  addressDistrict,
  city,
) {
  return {
    acoes,
    id,
    name,
    fantasyName,
    cnpj,
    addressStreet,
    addressDistrict,
    city,
  };
}

const tableColumns = [
  {
    field: 'acoes',
    title: 'Ações',
    headerStyle: {
      width: 100,
      textAlign: 'center',
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      padding: '10px 8px',
    },
    cellStyle: {
      textAlign: 'center',
      padding: '8px',
    },
  },
  {
    title: 'Código',
    field: 'id',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 8px',
      width: 100,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 8px',
      textAlign: 'center',
    },
  },
  {
    title: 'Nome',
    field: 'name',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 200,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Nome fantasia',
    field: 'fantasyName',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 180,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'CNPJ/CPF',
    field: 'cnpj',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 140,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
  },
  {
    title: 'Endereço',
    field: 'addressStreet',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 200,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Bairro',
    field: 'addressDistrict',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 150,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Cidade',
    field: 'city',
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      minWidth: 150,
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    },
  },
];

export default function Clients() {
  const classes = useStyles();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const profile = sessionStorage.getItem('profile');
  const perfil = sessionStorage.getItem('perfil');
  const { register, getValues, handleSubmit } = useForm();
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [selectedAutoId, setSelectedAutoId] = useState('');
  const [selectedAutoName, setSelectedAutoName] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  //const [valueAutoId, setValueAutoId] = useState('');
  //const [valueAutoName, setValueAutoName] = useState('');

  useEffect(() => {
    async function cleanAutoValue() {
      setSelectedAutoId('');
    }
    if (selectedAutoName.length === 0) {
      cleanAutoValue();
    }
  }, [selectedAutoName]);

  useEffect(() => {
    async function fetchAutocompleteData() {
      try {
        const response = await axios.get(`${API.vendedores}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const list = response.data.data;
        setAutocompleteData(list);


        if (perfil === 'vendedor' && response.data.data[0]) {
          if (response.data.data[0].id) {
            setSelectedAutoId(response.data.data[0].id);
            setSelectedAutoName(response.data.data[0].name);
          }
        }



        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchAutocompleteData();
    // loadfirst();
  }, [refreshTrigger]);

  if (profile === 'vendedor') {
    // value = !clientes ? '' : clientes[0].vendedorPadrao.nome;
    // valueId = !clientes ? '' : clientes[0].vendedorPadrao.id;
  }
 
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleModalClose = () => {
    handleRefresh();
  };

  const searchItem = (data, e) => {
    e.preventDefault();
    setLoading(true);
    handleSearch(data);
    setPanelOpen(false);
  };

  const handleSearch = async data => {
    try {
      setClientList([]);
      setLoading(true);

      let axiosSearch = '';

      const hasFilters =
        data.vendedorPadraoId > 0 ||
        data.codigo > 0 ||
        data.nome?.trim() !== '' ||
        data.cnpj?.trim() !== '' ||
        data.cidade?.trim() !== '';

      if (hasFilters) {
        if (data.codigo > 0) {
          axiosSearch = `${API.clientes}/${data.codigo}`;
        } else {
          let where = '';

          if (data.vendedorPadraoId > 0) {
            where += `&personSalesperson.id=${data.vendedorPadraoId}`;
          }
          if (data.nome?.trim()) {
            where += `&fantasyName='*${encodeURIComponent(data.nome)}*'`;
          }
          if (data.cnpj?.trim()) {
            where += `&documentNumber=*${data.cnpj}*`;
          }
          if (data.cidade?.trim()) {
            where += `&city.name='*${encodeURIComponent(data.cidade)}*'`;
          }

          axiosSearch = `${API.clientes}?email=${email}${where}`;
        }
      }

      if (!axiosSearch) {
        toast.info('Informe ao menos um parâmetro para pesquisa.');
        setLoading(false);
        return;
      }

      const response = await axios.get(axiosSearch, {
        headers: { 'x-access-token': token },
      });
      const rawData = response.data?.data || [];
      const itemData = Array.isArray(rawData)
        ? rawData
            .filter(
              item => typeof item === 'object' && item.hasOwnProperty('name'),
            )
            .map(item =>
              Object.fromEntries(
                Object.entries(item).map(([k, v]) => [k, v ?? '']),
              ),
            )
        : [rawData].filter(item => item && item.hasOwnProperty('name'));
      setClientList(itemData);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 402) {
          toast.error('Token expirado. Faça login novamente.');
          sessionStorage.clear();
        } else if (error.response.status === 404) {
          toast.error('Nenhum cliente encontrado.');
          setClientList([]);
        } else {
          toast.error('Erro ao pesquisar. Verifique os parâmetros.');
        }
      } else {
        toast.error('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const rowsList = clientList
    ? clientList.map(item => {
        return createRow(
          <div className={classes.tableActions}>
            <ActionButton>
              <ModalClientes data={item} onSuccess={handleRefresh} />
            </ActionButton>
          </div>,
          item.id ? item.id : '',
          item.name ? item.name : '',
          item.fantasyName ? item.fantasyName : '',
          item.documentNumber ? item.documentNumber : '',
          item.street ? item.street : '',
          item.district ? item.district : '',
          item.city && item.city.name ? item.city.name : '',
        );
      })
    : [{ error: 'Not found' }];

  return (
    <div style={{ padding: '2px' }}>
      <GradientBackground>
        <h2
          style={{
            margin: 0,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontWeight: '600',
          }}
        >
          <span className="material-icons" style={{ fontSize: '28px' }}>
            people
          </span>
          Clientes
        </h2>
        {rules.block_client_add_button == 'sim' ? null : (
          <ModalCreate onSuccess={handleRefresh} onClose={handleModalClose} />
        )}
      </GradientBackground>

      <Paper className={classes.paper}>
        <SearchPanel>
          <ExpansionPanel expanded={isPanelOpen}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setPanelOpen(!isPanelOpen)}
            >
              <Typography className={classes.heading}>
                Painel de Pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <SearchForm
                onSubmit={handleSubmit(data =>
                  searchItem(data, { preventDefault: () => {} }),
                )}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StyledInputGroup>
                      <label>ID</label>
                      <input type="number" name="codigo" ref={register} />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <StyledInputGroup>
                      <label>Nome</label>
                      <input type="text" name="nome" ref={register} />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <StyledInputGroup>
                      <label>CNPJ/CPF</label>
                      <input type="text" name="cnpj" ref={register} />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <StyledInputGroup>
                      <label>Cidade</label>
                      <input type="text" name="cidade" ref={register} />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <StyledInputGroup>
                      <label>Vendedor</label>
                      <Autocomplete
                        items={autocompleteData}
                        wrapperStyle={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '100%',
                        }}
                        shouldItemRender={(item, value) =>
                          item.name.toLowerCase().includes(value.toLowerCase())
                        }
                        getItemValue={item => item.name}
                        renderItem={(item, isHighlighted) => (
                          <div
                            style={{
                              background: isHighlighted ? '#e0f2fe' : 'white',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #e5e7eb',
                            }}
                          >
                            {item.name}
                          </div>
                        )}
                        value={selectedAutoName}
                        onChange={e => setSelectedAutoName(e.target.value)}
                        onSelect={val => {
                          setSelectedAutoName(val);
                          const selected = autocompleteData.find(
                            v => v.name === val,
                          );
                          if (selected) {
                            setSelectedAutoId(selected.id);
                          }
                        }}
                      />
                      <input
                        name="vendedorPadraoId"
                        type="hidden"
                        ref={register}
                        value={selectedAutoId}
                      />
                    </StyledInputGroup>
                  </Grid>
                </Grid>

                <StyledFooter>
                  <ButtonContainer>
                    <button type="submit" className="primary-button">
                      Pesquisar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanelOpen(false)}
                      className="secondary-button"
                    >
                      Fechar
                    </button>
                  </ButtonContainer>
                </StyledFooter>
              </SearchForm>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </SearchPanel>

        <DataTable
          load={loading}
          rows={rowsList}
          rowHead={tableColumns}
          sort={true}
          title={''}
          options={{
            headerStyle: {
              position: 'sticky',
              top: 0,
              zIndex: 10,
            },
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            padding: 'dense',
            rowStyle: {
              fontSize: '14px',
            },
          }}
        />
      </Paper>
    </div>
  );
}
