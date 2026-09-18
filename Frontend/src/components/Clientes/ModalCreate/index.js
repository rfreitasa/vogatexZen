import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Grid from '@material-ui/core/Grid';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import Async from 'react-select/async';
import Select from 'react-select';
import { MenuItem, Typography, Box, TextField } from '@material-ui/core';
import moment from 'moment';

import { API } from '../../../config/api';
import debounce from 'debounce-promise';
import {
  StyledModalContainer,
  StyledPaper,
  StyledButton,
  StyledInputGroup,
  StyledCampaignHeader,
  StyledSectionTitle,
  StyledFooter,
  ButtonContainer,
} from './styles';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    border: 0,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: '#fff',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    marginLeft: 'auto',
    marginRight: '15px',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.3s ease',

    '&:hover': {
      transform: 'rotate(90deg)',
      boxShadow: '0 6px 12px rgba(37, 99, 235, 0.4)',
    },
  },
  selectContainer: {
    '& .css-1s2u09g-control': {
      padding: '6px 0',
      borderRadius: '8px',
      border: '1px solid #d1d5db',

      '&:hover': {
        borderColor: '#d1d5db',
      },
    },
    '& .css-1pahdxg-control': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 1px #2563eb',
    },
  },
}));
const formatCnpj = value => {
  const clean = value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .substring(0, 14);

  let formatted = clean;

  if (clean.length > 2) {
    formatted = `${clean.slice(0, 2)}.${clean.slice(2)}`;
  }

  if (clean.length > 5) {
    formatted = `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
  }

  if (clean.length > 8) {
    formatted = `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(
      5,
      8,
    )}/${clean.slice(8)}`;
  }

  if (clean.length > 12) {
    formatted = `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(
      5,
      8,
    )}/${clean.slice(8, 12)}-${clean.slice(12)}`;
  }

  return formatted;
};
export default function ModalCreate({ onSuccess, onClose }) {
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState([]);
  const [taxProfile, setTaxProfile] = useState([]);
  const [taxdefault, setTaxdefault] = useState([]);
  const [cityDefault, setCityDefault] = useState('');
  const [tipoRequired, setTipoRequired] = useState(true);

  // Estados para os campos do formulário
  const [valueAutoId, setValueAutoId] = useState('');
  const [valueAutoNome, setValueAutoNome] = useState('');
  const [taxchoose, setTaxChoose] = useState('');
  const [taxchoosecomplete, setTaxChooseComplete] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');

  // Estados para todos os campos do formulário
  const [logradouroApi, setLogradouro] = useState('');
  const [bairroApi, setBairro] = useState('');
  const [numeroApi, setNumero] = useState('');
  const [telefoneApi, setTelefone] = useState('');
  const [emailApi, setEmail] = useState('');
  const [nomeApi, setNome] = useState('');
  const [nomeFantasiaApi, setNomeFantasia] = useState('');
  const [cep, setCep] = useState('');
  const [complementoApi, setComplemento] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [dt_nasc, setDt_nasc] = useState('');
  const [emailNfe, setEmailNfe] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleOpen = () => {
    setOpen(true);
    getData();
    resetForm();
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const resetForm = () => {
    setLogradouro('');
    setBairro('');
    setNumero('');
    setTelefone('');
    setEmail('');
    setNome('');
    setNomeFantasia('');
    setCep('');
    setComplemento('');
    setCnpj('');
    setCpf('');
    setRg('');
    setInscricaoEstadual('');
    setDt_nasc('');
    setEmailNfe('');
    setObservacoes('');
    setCidade('');
    setEstado('');
    setPais('');
    setCityDefault('');
    setTaxChoose('');
    setTaxChooseComplete(null);
  };

  const loadcity = async (inputValue, callback, busca) => {
    try {
      const response = await axios.get(
        `${API.cidadeErp}?${busca}=${inputValue}`,
        {
          headers: { 'x-access-token': token },
        },
      );
      const data = response.data.data.map(item => {
        return {
          value: item.id,
          label:
            item.name + '/' + item.state.name + ' - ' + item.state.country.name,
          state: item.state.id,
          state_name: item.state.code,
          country: item.state.country.id,
        };
      });
      return data;
    } catch (err) {
      return [];
    }
  };

  const loadOptionscity = (inputValue, callback) =>
    loadcity(inputValue, callback, 'parametro');

  const debouncedLoadOptioncity = debounce(loadOptionscity, 1000, {
    leading: true,
  });

  const getData = async () => {
    try {
      // Buscar vendedores
      const vendedoresResponse = await axios.get(
        `${API.vendedores}?email=${email}`,
        {
          headers: { 'x-access-token': token },
        },
      );

      if (perfil === 'vendedor' && vendedoresResponse.data.data[0]) {
        setValueAutoId(vendedoresResponse.data.data[0].id);
        setValueAutoNome(vendedoresResponse.data.data[0].name);
      }

      const vendedoresList = vendedoresResponse.data.data.map(item => {
        return { value: item.id, label: item.name };
      });
      setAuto(vendedoresList);

      // Buscar perfis fiscais
      const taxResponse = await axios.get(`${API.clientesPerfilFiscal}`, {
        headers: { 'x-access-token': token },
      });

      const taxList = taxResponse.data.data
        .filter(item =>
          /(Consumidor|Regime Normal|Simples Nacional)/.test(item.description),
        )
        .map(item => {
          return { value: item.id, label: item.description };
        });

      setTaxdefault(taxList);
      setTaxProfile(taxList);
    } catch (err) {
      toast.error('Erro ao carregar dados');
    }
  };

  const handleRequiretipo = tipo => {
    setTipoRequired(tipo === 'JURIDICA');
  };

  const handleCep = async cepValue => {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepValue}/json`,
      );
      const { logradouro, bairro, uf, localidade, complemento } = response.data;

      const retorno = await loadcity(response.data.ibge, '', 'codigo_fiscal');

      if (retorno[0]) {
        setCidade(retorno[0].value);
        setEstado(retorno[0].state);
        setPais(retorno[0].country);
        setCityDefault(retorno[0].label);

        const perfil_fisc = taxdefault.filter(item =>
          item.label.includes(retorno[0].state_name),
        );
        setTaxProfile(perfil_fisc);

        const selectedOption = perfil_fisc.find(item =>
          item.label.includes('Regime Normal'),
        );
        if (selectedOption) {
          setTaxChoose(selectedOption.value);
          setTaxChooseComplete(selectedOption);
        }
      }

      setLogradouro(logradouro);
      setBairro(bairro);
      setComplemento(complemento || '');
    } catch (err) {
      toast.error('CEP inválido');
    }
  };

const handleCnpj = async cnpjValue => {
  try {
    const cnpjLimpo = cnpjValue
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase();

    if (cnpjLimpo.length !== 14) {
      return;
    }

    const response = await axios.get(
      `https://publica.cnpj.ws/cnpj/${cnpjLimpo}`,
    );

    const data = response.data;
    const est = data?.estabelecimento;

    setCep(est?.cep?.replace(/\D/g, '') || '');
    setNumero(est?.numero || '');

    setTelefone(
      est?.ddd1 && est?.telefone1
        ? `(${est.ddd1}) ${est.telefone1}`
        : '',
    );

    setEmail(est?.email || '');
    setNome(data?.razao_social || '');
    setNomeFantasia(est?.nome_fantasia || '');

    if (est?.cep?.replace(/\D/g, '')) {
      handleCep(est.cep.replace(/\D/g, ''));
    }
  } catch (err) {
    // Silencioso - CNPJ pode não existir no sistema ainda
  }
};

  const formatPhone = phone => {
    return phone.replace(/\D/g, '');
  };

const formatDocument = document => {
  return document
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
};
  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Obter valores dos campos com máscara
      const cnpjValue = tipoRequired ? formatDocument(cnpj) : '';
      const cpfValue = !tipoRequired ? formatDocument(cpf) : '';
      const telefoneValue = formatDocument(telefoneApi);

      await axios.post(
        `${API.clientes}`,
        {
          ativa: true,
          bloqueada: false,
          tipo: tipoRequired ? 'JURIDICA' : 'FISICA',
          nome: nomeApi,
          apelido: nomeFantasiaApi,
          cnpj: cnpjValue,
          inscricaoEstadual: inscricaoEstadual,
          cpf: cpfValue,
          rg: rg,
          enderecoLogradouro: logradouroApi,
          enderecoNumero: numeroApi,
          enderecoComplemento: complementoApi,
          enderecoBairro: bairroApi,
          enderecoCidade: cidade,
          enderecoEstado: estado,
          enderecoPais: pais,
          enderecoCep: cep.replace(/\D/g, ''),
          observacoes: observacoes,
          telefone: telefoneValue,
          fiscalProfile: taxchoose,
          email: emailApi,
          email_nfe: emailNfe,
          vendedorPadrao: {
            id: valueAutoId,
            nome: valueAutoNome,
          },
        },
        {
          headers: { 'x-access-token': token },
        },
      );

      toast.success('Cliente criado com sucesso!');
      handleClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err.response) {
        toast.error('Falha na criação: ' + err.response.data.message);
      } else {
        toast.error('Falha na criação');
      }
    }
  };

  return (
    <>
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
          zIndex: 1400,
        }}
      >
        <Fade in={open}>
          <StyledModalContainer>
            <StyledPaper>
              <StyledCampaignHeader>
                <h2>Novo Cliente</h2>
              </StyledCampaignHeader>

              <form onSubmit={onSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledSectionTitle>Informações Básicas</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledInputGroup>
                      <label>Tipo de Pessoa *</label>
                      <select
                        onChange={e => handleRequiretipo(e.target.value)}
                        defaultValue="JURIDICA"
                      >
                        <option value="JURIDICA">Pessoa Jurídica</option>
                        <option value="FISICA">Pessoa Física</option>
                      </select>
                    </StyledInputGroup>
                  </Grid>

                  {tipoRequired ? (
                    <>
                      <Grid item xs={12} md={4}>
  <StyledInputGroup>
    <label>CNPJ *</label>

    <input
      type="text"
      value={formatCnpj(cnpj)}
      placeholder="00.000.000/0000-00"
      maxLength={18}
      onChange={e => {
        const value = e.target.value
          .replace(/[^A-Za-z0-9]/g, '')
          .toUpperCase()
          .substring(0, 14);

        setCnpj(value);
      }}
      onBlur={e => {
        handleCnpj(e.target.value);
      }}
    />
  </StyledInputGroup>
</Grid>
                      <Grid item xs={12} md={4}>
                        <StyledInputGroup>
                          <label>Inscrição Estadual</label>
                          <input
                            type="text"
                            value={inscricaoEstadual}
                            onChange={e => setInscricaoEstadual(e.target.value)}
                          />
                        </StyledInputGroup>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} md={4}>
                        <StyledInputGroup>
                          <label>CPF *</label>
                          <InputMask
                            mask="999.999.999-99"
                            value={cpf}
                            onChange={e => setCpf(e.target.value)}
                          >
                            <input type="text" />
                          </InputMask>
                        </StyledInputGroup>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StyledInputGroup>
                          <label>RG *</label>
                          <input
                            type="text"
                            value={rg}
                            onChange={e => setRg(e.target.value)}
                          />
                        </StyledInputGroup>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StyledInputGroup>
                          <label>Data de Nascimento</label>
                          <input
                            type="date"
                            value={dt_nasc}
                            onChange={e => setDt_nasc(e.target.value)}
                          />
                        </StyledInputGroup>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Nome *</label>
                      <input
                        type="text"
                        value={nomeApi}
                        onChange={e => setNome(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Nome Fantasia *</label>
                      <input
                        type="text"
                        value={nomeFantasiaApi}
                        onChange={e => setNomeFantasia(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledSectionTitle>Endereço</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <StyledInputGroup>
                      <label>CEP *</label>
                      <input
                        type="text"
                        value={cep}
                        onChange={e => setCep(e.target.value)}
                        onBlur={e => handleCep(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Endereço *</label>
                      <input
                        type="text"
                        value={logradouroApi}
                        onChange={e => setLogradouro(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <StyledInputGroup>
                      <label>Número *</label>
                      <input
                        type="text"
                        value={numeroApi}
                        onChange={e => setNumero(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Complemento</label>
                      <input
                        type="text"
                        value={complementoApi}
                        onChange={e => setComplemento(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Bairro *</label>
                      <input
                        type="text"
                        value={bairroApi}
                        onChange={e => setBairro(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledInputGroup>
                      <label>Cidade *</label>
                      <div className={classes.selectContainer}>
                        <Async
                          loadOptions={debouncedLoadOptioncity}
                          cacheOptions
                          defaultOptions
                          value={{ value: cidade, label: cityDefault }}
                          onChange={val => {
                            setCidade(val?.value || '');
                            setCityDefault(val?.label || '');
                            setEstado(val?.state || '');
                            setPais(val?.country || '');
                          }}
                          placeholder="Selecione a cidade"
                          styles={{
                            control: base => ({
                              ...base,
                              minHeight: '44px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                            }),
                          }}
                        />
                      </div>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledInputGroup>
                      <label>Vendedor</label>
                      <div className={classes.selectContainer}>
                        <Select
                          options={auto}
                          isClearable={perfil !== 'vendedor'}
                          value={{ label: valueAutoNome, value: valueAutoId }}
                          onChange={val => {
                            setValueAutoId(val?.value || '');
                            setValueAutoNome(val?.label || '');
                          }}
                          placeholder="Selecione o vendedor"
                          styles={{
                            control: base => ({
                              ...base,
                              minHeight: '44px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                            }),
                          }}
                        />
                      </div>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledInputGroup>
                      <label>Perfil Fiscal *</label>
                      <div className={classes.selectContainer}>
                        <Select
                          options={taxProfile}
                          value={taxchoosecomplete}
                          onChange={val => {
                            setTaxChooseComplete(val);
                            setTaxChoose(val?.value || '');
                          }}
                          placeholder="Selecione o perfil fiscal"
                          styles={{
                            control: base => ({
                              ...base,
                              minHeight: '44px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                            }),
                          }}
                        />
                      </div>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledInputGroup>
                      <label>Observações</label>
                      <textarea
                        rows={4}
                        value={observacoes}
                        onChange={e => setObservacoes(e.target.value)}
                        placeholder="Digite observações adicionais"
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <StyledSectionTitle>Contatos</StyledSectionTitle>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Email *</label>
                      <input
                        type="email"
                        value={emailApi}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Telefone *</label>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={telefoneApi}
                        onChange={e => setTelefone(e.target.value)}
                      >
                        <input type="text" />
                      </InputMask>
                    </StyledInputGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledInputGroup>
                      <label>Email NF-e</label>
                      <input
                        type="email"
                        value={emailNfe}
                        onChange={e => setEmailNfe(e.target.value)}
                      />
                    </StyledInputGroup>
                  </Grid>
                </Grid>

                <StyledFooter>
                  <ButtonContainer>
                    <button type="submit" className="primary-button">
                      Criar Cliente
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="secondary-button"
                    >
                      Cancelar
                    </button>
                  </ButtonContainer>
                </StyledFooter>
              </form>
            </StyledPaper>
          </StyledModalContainer>
        </Fade>
      </Modal>
    </>
  );
}
