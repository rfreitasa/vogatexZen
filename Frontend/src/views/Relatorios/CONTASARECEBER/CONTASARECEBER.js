


import React, { useState, useEffect, useRef } from "react";
import { useSelector, connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import axios from "axios";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Autocomplete from "react-autocomplete";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Pesquisa, Form, ButtonStyled } from '../styles';
import { API } from "../../../config/api"
import CamposConfiguracao from "../../../components/Relatorios/Pessoas/CamposConfiguracao"; // Certifique-se de fornecer o caminho correto
import { FaCog } from "react-icons/fa";
import Async from 'react-select/async';
import debounce from 'debounce-promise';
import Select from 'react-select';
import { disabled } from "glamor";


const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '5px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paper2: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minWidth: '50%',
    minHeight: '50%',
  },
  progress: {
    marginTop: 200,

    textAlign: 'center',
    alignItems: 'center',
    width: '100%',
    '& > * + *': {},
  },
  root: {
    display: 'flex',
    minWidth: 320,
    maxWidth: 500,
    flexDirection: 'column', //change to row for horizontal layout
    '& .MuiCardHeader-root': {
      backgroundColor: 'yellow',
    },
    '& .MuiCardHeader-root': {
      backgroundColor: 'yellow',
    },
    '& .MuiCardHeader-title': {
      //could also be placed inside header class
      backgroundColor: '#FCFCFC',
    },
    '& .MuiCardHeader-subheader	': {
      backgroundImage: 'linear-gradient(to bottom right, #090977, #00d4ff);',
    },
    '& .MuiCardContent-root': {
      backgroundImage: 'linear-gradient(to bottom right, #00d4ff, #00ff1d);',
    },
  },
  header: {
    fontSize: '1.15rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 500,
    textAlign: 'center',
    color: 'black',
    lineHeight: 1.4,
  },
  content: {
    display: 'flex',
    minHeight: '100%',
    flexWrap: 'wrap',
  },
  contentItem: {
    flex: 'calc(50% - 4px)',
    '@media (max-width: 500px)': {},
  },
  textContent: {
    fontSize: 18,
    textAlign: 'center',
    border: '1px solid black',
  },
  footer: {
    fontSize: 14,
    backgroundImage: 'linear-gradient(to bottom right, #8c9d9b, #bdcdbf);',
  },
  card: {
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    boxShadow: '0 5px 8px 0 rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fafafa',
  },
}));


function CONTASARECEBER() {
  const classes = useStyles();


  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opcoesEscolhidas, setOpcoesEscolhidas] = useState({});


  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const clientes = JSON.parse(sessionStorage.getItem('clientes'));
  const [vendedorEscolhido, setVendedorEscolhido] = useState('');
  const [defaultSellerID, setDefaultSellerID] = useState('');
  const [defaultSeller, setDefaultSeller] = useState('');

  const [businessGroupChoose, setbusinessGroupChoose] = useState('');
  const [city, setcityChoose] = useState('');
  const [state, setstateChoose] = useState('');
  const [states, setstates] = useState('');
  const [listEmpresas, setListEmpresas] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');
  const [autoNomeSupervisor, setAutoNomeSupervisor] = useState('');
  const [idSupervisor, setIdSupervisor] = useState('');
  const [autoListSupervisor, setAutoListSupervisor] = useState([]);
  const [hidden, sethidden] = useState(false);





  const loadSellers = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.vendedores}?email=${email}&parametro=${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });
      //    console.log(response.data.data[0]);
      if (perfil === 'vendedor' && response.data.data[0]) {
        if (response.data.data[0].id) {
          setDefaultSellerID(response.data.data[0].id);
          setDefaultSeller(response.data.data[0].name);
          setVendedorEscolhido(response.data.data[0].id)
          sethidden(false);
        }
      }



      if (response.data.data[0]) {
        sethidden(false);
      }

      const data = response.data.data
        .map(item => {
          return { value: item.id, label: item.name.toUpperCase() };
        })
        .filter(item => {
          return item.label.includes(inputValue.toUpperCase());
        });
      return data;
    } catch (err) {
      sethidden(true)
      setLloading(false);
    }
  };
  const loadCompany = async () => {
    try {
      const response = await axios.get(`${API.empresa}`, {
        headers: {
          'x-access-token': token,
        },
      });

      //const lista = response.data.data;

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

  const loadbusinessGroup = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.businessGroup}?parametro=${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });
      const data = response.data.data
        .map(item => {
          return { value: item.id, label: item.description.toUpperCase() };
        });
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };

  const loadcity = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.cidadeErp}?parametro=${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });
      const data = response.data.data
        .map(item => {
          return { value: item.id, label: item.name.toUpperCase() };
        });
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };
  const loadstates = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${API.estados}?parametro=${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });

      const data = response.data.data
        .map(item => {
          return { value: item.id, label: item.code.toUpperCase() };
        });
      setstates(data);
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
    }
  };
  const loadClients = async (inputValue, callback) => {
    try {
      var busca = encodeURIComponent(inputValue);

      var where = `&concat_cliente='*${busca}*'`;

      const response = await axios.get(
        `${API.clientes}?email=${email}${where}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      //função que troca null por "" para evitar erro em tela para objeto nulo .
      var k = '';
      var v = ';';
      for (const obj of response.data.data) {
        if (typeof obj !== 'object') continue;
        for (k in obj) {
          if (!obj.hasOwnProperty(k)) continue;
          v = obj[k];
          if (v === null || v === undefined) {
            obj[k] = '';
          }
        }
      }

      const data = response.data.data.map(item => {
        return {
          value: item.id,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<strong>Id:</strong> ' +
                  item.id +
                  '<br> <strong>Nome/Apelido:</strong>' +
                  item.name +
                  '<br><strong>CNPJ/CPF:</strong>' +
                  item.documentNumber +
                  '<br><strong>Cidade:</strong>' +
                  item.city.name +
                  '/' +
                  item.city.state.name +
                  '<hr>',
              }}
            />
          ),
          labelshow: item.id + ' ' + item.name + ' ' + item.documentNumber,
          dados: item,
        };
      });
      return data;
    } catch (err) { }
  };
  //DEBOUNCE CLIENTES
  const loadOptionsClientes = (inputValue, callback) =>
    loadClients(inputValue, callback);

  const debouncedLoadOptionsClientes = debounce(loadOptionsClientes, 3000, {
    leading: false,
  });

  //DEBOUNCE VENDEDORES
  const loadOptionsSellers = (inputValue, callback) =>
    loadSellers(inputValue, callback);

  const debouncedLoadOptionSellers = debounce(loadOptionsSellers, 1000, {
    leading: true,
  });

  const loadOptionsbusinessGroup = (inputValue, callback) =>
    loadbusinessGroup(inputValue, callback);

  const debouncedLoadOptionbusinessGroup = debounce(loadOptionsbusinessGroup, 1000, {
    leading: true,
  });

  const loadOptionscity = (inputValue, callback) =>
    loadcity(inputValue, callback);

  const debouncedLoadOptioncity = debounce(loadOptionscity, 1000, {
    leading: true,
  });


  const opcoesCampos = [
    { campo: "type", label: "Tipo", size: '40', tipo: 'select', referencia: "listagem_pessoas", status: "1", default: 's' },
    { campo: "name", label: "Nome", size: '120', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 's' },
    { campo: "email", label: "Email", size: '60', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "phone", label: "Telefone", size: '60', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "fantasyName", label: "Nome fantasia", size: '100', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "document_number_1", label: "Documento", size: '60', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "address_city_name", label: "Cidade", size: '60', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "address_state_name", label: "Estado", size: '60', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "address_zipcode", label: "Cep", size: '30', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "address_number", label: "Numero", size: '20', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "address_complement", label: "Complemento", size: '60', tipo: 'input', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "country_name", label: "Agrupamento", size: '60', tipo: 'autocomplete', referencia: "listagem_pessoas", status: "1", default: 'n' },
    { campo: "salesperson_name", label: "Vendedor", size: '120', tipo: 'autocomplete', referencia: "listagem_pessoas", status: "1", default: 'n' },
  ];

  const opcoesTipoPessoa = [
    { value: "", label: "TODOS" },
    { value: "CORPORATION", label: "Tipo Jurídico" },
    { value: "INDIVIDUAL", label: "Tipo Físico" },
  ];


  // Monta as options para o select de agrupamento
  const options = opcoesCampos.map((campo) => (
    <option key={campo.campo} value={campo.campo}>
      {campo.label}
    </option>
  ));

  const optionsTipoPessoa = opcoesTipoPessoa.map((opcao) => (
    <option key={opcao.value} value={opcao.value}>
      {opcao.label}
    </option>
  ));
  const montarOpcoes = () => {
    const escolhasSalvas = JSON.parse(
      sessionStorage.getItem("listagem_pessoas") || "[]"
    );

    const escolhasFiltradas = escolhasSalvas.filter(
      (escolha) => escolha.status === "1"
    );

    const escolhasIniciais = {};
    opcoesCampos.forEach((campo) => {
      const escolhaSalva = escolhasFiltradas.find(
        (escolha) => escolha.campo === campo.campo
      );

      escolhasIniciais[campo.campo] = escolhaSalva || campo.default == 's' ? true : false;

    });



    setOpcoesEscolhidas(escolhasIniciais);
  };
  const getSupervisores = async () => {
    try {
      const response = await axios.get(`${API.usuarios}`, {
        headers: {
          'x-access-token': token,
        },
      });

      const data = response.data.data;


      if (perfil != 'vendedor') {
        // Função para encontrar os vendedores de um supervisor
        function encontrarVendedores(supervisorId, arrayDeObjetos) {
          return arrayDeObjetos.filter(objeto => objeto.USUARIO_CONTA_SUPERVISOR_ID === supervisorId)
            .map(objeto => objeto.USUARIO_CONTA_ID_ERP);
        }

        setAutoListSupervisor(
          data.filter(function (obj) {
            if (obj.USUARIO_PERFIL === 'supervisor') {
              const vendedores = encontrarVendedores(obj.USUARIO_ID, data);
              obj.VENDEDORES = vendedores.join(',');
            }
            if (perfil == 'supervisor') {
              return obj.USUARIO_PERFIL === 'supervisor' && obj.USUARIO_EMAIL.trim().toUpperCase() == email.trim().toUpperCase();
            }
            else {
              return obj.USUARIO_PERFIL === 'supervisor';
            }

          }),
        );


      }
      else {
        setAutoListSupervisor(
          data.filter(function (obj) {
            return obj.USUARIO_PERFIL === 'supervisor';
          }),
        );
      }
      //filter perfil por supervisor
      //      setAutoListGerente(data);
    } catch (error) {
      toast.error('Erro ao carregar lista.');
    }
  };

  useEffect(() => {

    getSupervisores();
    loadCompany();
    loadSellers();
    montarOpcoes();
    loadstates();
  }, []); // Chama a função na montagem inicial


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    montarOpcoes();

  };

  const handleConfiguracaoSubmit = (data) => {
    // Atualize o estado opcoesEscolhidas com as escolhas feitas no modal
    setOpcoesEscolhidas(data);
    handleCloseModal();
  };





  let value = "";
  let valueId = "";
  /* if (perfil === 'vendedor') {
     value = clientes && clientes[0].vendedorPadrao === null ? "" : clientes[0].vendedorPadrao.nome;
     valueId = clientes && clientes[0].vendedorPadrao === null ? "" : clientes[0].vendedorPadrao.id;
   }*/
  const [valueAutoId, setValueAutoId] = useState('');
  const [valueAutoNome, setValueAutoNome] = useState('');



  const [autoCliente, setAutoCliente] = useState(clientes);

  const [nomeCliente, setNomeCliente] = useState("");
  const [idCliente, setIdCliente] = useState("");

  const [loading, setLloading] = useState(false);
  const [Estados, setEstados] = useState([]);
  const [nomeEstado, setNomeEstado] = useState("");
  const [valoresCampos, setValoresCampos] = useState({});

  const estadosBrasileiros = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' },
  ];


  useEffect(() => {

    async function handleCleanVendedor() {
      setValueAutoId("");
    }


    if (valueAutoNome.length === 0) {
      handleCleanVendedor();
    }





  }, [valueAutoNome]);


  const Pesquisaitem = (data, e) => {
    e.preventDefault();
    // setPanelOpen(false);
    handleSearch(data);
  };

  const handleSearch = async data => {
    try {


      const camposEscolhidos = Object.keys(opcoesEscolhidas);
      const campos = Object.keys(opcoesEscolhidas).filter(key => opcoesEscolhidas[key]);
      const labels = campos.map(campo => opcoesCampos.find(opcao => opcao.campo === campo).label);
      const tamanhos = campos.map(campo => parseInt(opcoesCampos.find(opcao => opcao.campo === campo).size));

      var where = '';

      const verificaEAtualizaArray = (array) => {
        if (Array.isArray(array) && array.length > 0) {
          return array.map(item => item.value).join(',');
        } else {
          return null;
        }
      };


      if (vendedorEscolhido > 0) {
        data.salesperson = vendedorEscolhido;
      }


      if (idCliente > 0) {
        data.person = idCliente;
      }

      if (data.supervisorId > 0) {

        if (autoListSupervisor[0].VENDEDORES) {

          data.salesperson = autoListSupervisor[0].VENDEDORES;

        }
        //  console.log(autoListSupervisor)

      }
      if (businessGroupChoose > 0) {

        data.personGroup = businessGroupChoose;

      }
      if (idEmpresas.length > 0) {

        const empresas_selecionadas = verificaEAtualizaArray(idEmpresas);

        data.company = empresas_selecionadas;
        ;
      }
      if (state.length > 0) {


        const state_escolhidos = JSON.stringify(state.map(item => { return item.value }));
        data.state = state_escolhidos;
      }


      var axios_search = `${API.relatorios}/?relatorio=CONTASARECEBER&email=${email}`;
      const parametros = {
        data,  // Mantém os dados existentes
      };
      if (perfil == 'vendedor' && vendedorEscolhido == '') { axios_search = ''; }
      try {
        toast.success("Aguarde seu Relatório está sendo gerado.");
        const response = await axios.get(axios_search, {
          responseType: "arraybuffer",

          params: parametros,  // Passa os parâmetros para a API
          headers: {
            "x-access-token": token
          }
        });

        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setLloading(false);
        window.open(fileURL);

      } catch (err) {

        if (err.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar login");
          sessionStorage.clear();
        } else {

          toast.error("Não foi possível gerar seu Relatório");
        }
      }


    } catch (error) {
      setLloading(false);

      toast.error("Não localizado, verifique os campos de pesquisa.");
    }

  };

  //const listPedidos = useSelector(state => state.filter.listPedido);
  //console.log(dadosPedidos);
  const renderizarCamposDefaults = () => {


    return (
      <>
        <Grid container spacing={1}>
          <Grid
            className="index"
            item
            sm={12}
            lg={6}
            md={12}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <label>Cliente*</label>

            <Async
              //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
              loadOptions={
                debouncedLoadOptionsClientes
              }
              cacheOptions
              isClearable={true}
              menuPortalTarget={document.body}
              noOptionsMessage={() =>
                'Nenhuma opção encontrada'
              }
              placeholder="Clientes"
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9998,
                }),
              }}
              value={{
                label: nomeCliente ? nomeCliente : '',
                value: idCliente ? idCliente : '',
              }}
              onSelect={val => {
                if (val.length > 1) {
                  //   setIdVendedorP(val.dados.properties.salesPerson);
                  // setVendedorP(autoVendedor.filter(item => item.value == val.dados.properties.salesPerson)[0] ? autoVendedor.filter(item => item.value == val.dados.properties.salesPerson)[0].label : '');

                  setIdCliente(val.value);
                }
              }}
              onChange={value => {
                const valor =
                  value === null ? '' : value.value;
                if (valor > 1) {
                  //  console.log(value)
                  //  console.log(autoVendedor)
                  setIdCliente(valor);
                  setNomeCliente(value.labelshow);
                  //setIdVendedorP(value.dados.properties.salesPerson);
                  //console.log(autoVendedor.filter(item => item.id == value.dados.properties.salesPerson)[0].name)
                  //setVendedorP(autoVendedor.filter(item => item.id == value.dados.properties.salesPerson)[0].name)

                  /*
                                              if (autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0] && autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0].label != '') {
                                                setfieldsReadonly(true);
                                                setIdVendedorP(value.dados.properties.salesPerson);
                                                setVendedorP(autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0] ? autoVendedor.filter(item => item.value == value.dados.properties.salesPerson)[0].label : '');
                  
                                              }
                                              else {
                                                if (perfil !== 'vendedor') {
                                                  setfieldsReadonly(false);
                                                }
                                              }
                  
                  */
                } else {
                  setIdCliente('');
                  setNomeCliente('');
                }
              }}
            />
          </Grid>
          <Grid key="empresas" item xs={12} sm={12} lg={3}>
            <div className="input">
              <label>Empresas</label>
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
          <Grid key="grupo" item xs={12} sm={12} lg={3}>

            <div className="input" >

              <label>Grupo empresarial</label>

              <Async
                //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                loadOptions={
                  debouncedLoadOptionbusinessGroup
                }
                cacheOptions
                styles={{

                  menuPortal: base => ({
                    ...base,
                    zIndex: 16,
                  }),
                  container: provided => ({
                    ...provided,
                    maxHeight: '100%',
                    height: '100%',
                    // ajuste a altura conforme necessário
                  }),
                  control: provided => ({
                    ...provided,
                    fontSize: '12px', // Ajusta o tamanho da fonte
                    height: '10px',
                    maxHeight: '1rem',  // ajuste a altura conforme necessário
                  }),
                  indicatorsContainer: base => ({
                    ...base,
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px', // Ajusta a altura dos botões
                  }),
                  indicatorSeparator: base => ({
                    ...base,
                    display: 'none', // Remove o separador entre os botões
                  }),
                }}
                ref={register}
                isClearable={true}

                noOptionsMessage={() =>
                  'Nenhuma opção encontrada'
                }

                menuPortalTarget={document.body}
                placeholder="Grupo empresarial"
                onSelect={e => {
                  setbusinessGroupChoose(e.target.value);
                }}
                onChange={valor => {
                  //   if (perfil !== 'vendedor') {
                  const value = valor === null ? '' : valor.value;
                  setbusinessGroupChoose(value);
                  // }
                }}
              />
            </div>
          </Grid>
          <Grid key="vendedor" item xs={12} sm={12} lg={6}>

            <div className="input" >

              <label>Vendedor</label>

              <Async
                //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                loadOptions={
                  debouncedLoadOptionSellers
                }
                cacheOptions
                styles={{

                  menuPortal: base => ({
                    ...base,
                    zIndex: 16,
                  }),
                  container: provided => ({
                    ...provided,
                    maxHeight: '100%',
                    height: '100%',
                    // ajuste a altura conforme necessário
                  }),
                  control: provided => ({
                    ...provided,
                    fontSize: '12px', // Ajusta o tamanho da fonte
                    height: '10px',
                    maxHeight: '1rem',  // ajuste a altura conforme necessário
                  }),
                  indicatorsContainer: base => ({
                    ...base,
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px', // Ajusta a altura dos botões
                  }),
                  indicatorSeparator: base => ({
                    ...base,
                    display: 'none', // Remove o separador entre os botões
                  }),
                }}
                ref={register}
                menuPlacement={'top'}   // Define a posição do menu para cima
                isClearable={perfil !== 'vendedor' ? true : false}
                value={{
                  label: defaultSeller ? defaultSeller : '',
                  value: defaultSellerID ? defaultSellerID : '',
                }}
                isDisabled={perfil === 'vendedor'}

                noOptionsMessage={() =>
                  'Nenhuma opção encontrada'
                }

                menuPortalTarget={document.body}
                placeholder="Vendedor"
                onSelect={e => {
                  setVendedorEscolhido(e.target.value);
                }}
                onChange={valor => {
                  //   if (perfil !== 'vendedor') {
                  const value = valor === null ? '' : valor.value;

                  setVendedorEscolhido(value);

                  setDefaultSellerID(value);
                  setDefaultSeller(valor?.label ? valor.label : '');



                  // }
                }}
              />
            </div>
          </Grid>


          <Grid key="supervisor" item xs={6} sm={12} lg={6}>
            <div className="input">
              <label>Supervisor</label>
              <input
                name="supervisorId"
                type="hidden"
                ref={register}
                defaultValue={idSupervisor}
                disabled
              />

              <Autocomplete
                renderInput={props => (
                  <input {...props} autoComplete={false} />
                )}
                items={autoListSupervisor}
                shouldItemRender={(item, value) =>
                  item.USUARIO_NOME.toLowerCase().indexOf(
                    value.toLowerCase(),
                  ) > -1
                }
                getItemValue={item => {
                  setIdSupervisor(item ? item.USUARIO_ID : ''); // Define o idSupervisor como uma string vazia se item for falso
                  return item ? item.USUARIO_NOME : ''; // Retorna o nome do usuário ou uma string vazia se item for falso

                }}
                menuStyle={{
                  borderRadius: '3px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 0',
                  fontSize: '90%',
                  position: 'fixed',
                  overflow: 'auto',
                  maxHeight: '50%',
                  zIndex: '400',
                }}
                renderItem={(item, isHighlighted) => (
                  <div
                    key={item.USUARIO_CONTA_ID_ERP}
                    style={{
                      background: isHighlighted
                        ? 'lightgray'
                        : 'white',
                      width: '100%',
                    }}
                  >
                    {item.USUARIO_NOME}
                  </div>
                )}
                inputProps={{
                  disabled: perfil === 'vendedor', // aqui você desabilita o campo
                }}
                value={autoNomeSupervisor}
                onChange={e => {
                  if (e.target.value == '') {
                    setIdSupervisor('');
                  }
                  setAutoNomeSupervisor(e.target.value)

                }}
                onSelect={(val) => setAutoNomeSupervisor(val || '')}
              />
            </div>
          </Grid>


          <Grid item xs={12} sm={12} lg={4}>
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <legend style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Intervalo</legend>
              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Data Inicial</label>
                  <input
                    type="date"
                    defaultValue=""
                    name="dateStart"
                    ref={register}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Data Final</label>
                  <input type="date" name="dateEnd" ref={register} />
                </div>
              </Grid>

            </fieldset>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <legend style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Intervalo de emissão</legend>
              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Data Inicial</label>
                  <input
                    type="date"
                    defaultValue=""
                    name="issueDateStart"
                    ref={register}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Data Final</label>
                  <input type="date" name="issueDateEnd" ref={register} />
                </div>
              </Grid>

            </fieldset>
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <legend style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Intervalo de vencimento</legend>
              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Data Inicial</label>
                  <input
                    type="date"
                    defaultValue=""
                    name="dueDateStart"
                    ref={register}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <div className="input">
                  <label>Data Final</label>
                  <input type="date" name="dueDateEnd" ref={register} />
                </div>
              </Grid>

            </fieldset>
          </Grid>


          <Grid key="Agrupamento" item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Agrupamento</label>

              <select name="group1" ref={register}>
                <option value="person_name">Pessoa</option>
                <option value="personGroup">Grupo empresarial</option>
                <option value="wallet">Carteira</option>
                <option value="salesperson">Vendedor</option>
                <option value="issueDate">Emissão</option>
                <option value="dueDate">Vencimento</option>

              </select>
            </div>
          </Grid>
          <Grid key="qtd" item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Numero de registros</label>
              <select name="maxRecords" ref={register}>
                <option value="10000000">Todos</option>
                <option value="100">100</option>
                <option value="1000">1000</option>
                <option selected value="5000">5000</option>
                <option value="10000">10000</option>
              </select>
            </div>
          </Grid>
          <Grid key="ordenacao" item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Ordenação</label>
              <select name="sort1" ref={register}>
                <option value="person_nameCalc">Pessoa</option>
                <option value="personGroup">Grupo empresarial</option>
                <option value="wallet">Carteira</option>
                <option value="salesperson">Vendedor</option>
                <option value="issueDate">Emissão</option>
                <option value="dueDate">Vencimento</option>
              </select>

            </div>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderizarCampos = () => {


    return opcoesCampos.filter(item => item.default == 'n').map((campo) => {

      // Renderiza apenas se o campo estiver marcado como true
      if (opcoesEscolhidas[campo.campo]) {
        return (
          <Grid key={campo.campo} item xs={12} sm={12} lg={4}>
            {campo.tipo === 'input' && (
              <div className="input">
                <label>{campo.label}</label>
                <input
                  type="text"
                  required="required"
                  name={campo.campo}
                  ref={register}
                />
              </div>
            )}
            {campo.tipo === 'date' && (
              <div className="input">
                <label>{campo.label}</label>
                <input
                  type="date"
                  className="data"
                  required="required"
                  name={campo.campo}
                  ref={register}
                />
              </div>
            )}
            {campo.campo === "type" && (
              <div className="input">
                <label>{campo.label}</label>
                <select name={campo.campo} ref={register}>
                  {optionsTipoPessoa}
                </select>
              </div>
            )}
          </Grid>
        );
      }
      return null; // Retorna null para campos não selecionados
    });
  };

  return (
    <>
      <CamposConfiguracao
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSubmit={handleConfiguracaoSubmit}
        opcoesCampos={opcoesCampos}
        escolhasIniciais={opcoesEscolhidas}
        lista='listagem_pessoas'
      />

      <Pesquisa>
        <div>
          <ExpansionPanel expanded={PanelOpen}>
            <ExpansionPanelSummary
              expanded={PanelOpen}
              onClick={() => { }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography component={"span"} >
                Painel de pesquisa
              </Typography>

            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={"div"}>
                <Form>

                  {renderizarCamposDefaults()}
                  <ButtonStyled
                    variant="contained"
                    color="primary"

                    onClick={(e) => Pesquisaitem(getValues(), e)}
                  >
                    Pesquisar
                  </ButtonStyled>
                </Form>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Pesquisa>
    </>
  );

}

export default connect()(CONTASARECEBER);
