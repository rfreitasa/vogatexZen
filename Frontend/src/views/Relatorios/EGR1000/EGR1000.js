


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


function EGR1000() {
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




  const loadSellers = async (inputValue, callback) => {
    try {
      console.log('entrou')
      const response = await axios.get(`${API.vendedores}?email=${email}&parametro=${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });
      console.log(perfil)
      if (perfil === 'vendedor' && response.data.data[0]) {
        if (response.data.data[0].id) {
          setDefaultSellerID(response.data.data[0].id);
          setDefaultSeller(response.data.data[0].name);
setVendedorEscolhido(response.data.data[0].id)
        }
      }
      const data = response.data.data
        .map(item => {
          return { value: item.id, label: item.name.toUpperCase() };
        })
        .filter(item => {
          return item.label.includes(inputValue.toUpperCase());
        });
      // console.log(data);
      // console.log(inputValue)



      // //console.log(data);
      return data;
    } catch (err) {
      //              toast.error("Não encontrado");
      setLloading(false);
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
      console.log(response)
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
  useEffect(() => {
    loadSellers();
    montarOpcoes();
  }, []); // Chama a função na montagem inicial


  useEffect(() => {

    loadstates();

  }, []);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    montarOpcoes();

  };

  const handleConfiguracaoSubmit = (data) => {
    // Atualize o estado opcoesEscolhidas com as escolhas feitas no modal
    console.log(data)
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
      if (vendedorEscolhido > 0) {
        data.salesperson_id = vendedorEscolhido;
      } 
      if (businessGroupChoose > 0) {
        data.businessgroup = businessGroupChoose;
      }
      if (state.length > 0) {


        const state_escolhidos = JSON.stringify(state.map(item => { return item.value }));
        
        data.state = state_escolhidos;
      }
     
      if (city > 0) {

        data.city = city;
      }
      var axios_search = `${API.relatorios}/?relatorio=EGR1000&email=${email}`;
      const parametros = {
        data,  // Mantém os dados existentes
        camposEscolhidos: campos,
        labels,
        tamanhos  // Adiciona campos escolhidos
      };
      if (perfil == 'vendedor' && vendedorEscolhido == '') { axios_search = ''; }

      try {
        toast.success("Aguarde seu Relatório está sendo gerado.");
        const response = await axios.get(axios_search, {
          params: parametros,  // Passa os parâmetros para a API
          responseType: "blob",
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
          <Grid key="nome" item xs={12} sm={12} lg={12}>

            <div className="input">
              <label>Nome</label>
              <input
                type="text"
                name='name'
                ref={register}
              />
            </div>

          </Grid>

          <Grid key="vendedor" item xs={12} sm={12} lg={12}>

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
                defaultValue={{
                  label: defaultSeller,
                  value: defaultSellerID,
                }}
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
                  // }
                }}
              />
            </div>
          </Grid>
          <Grid key="grupo" item xs={12} sm={12} lg={12}>

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
                menuPlacement={'top'}   // Define a posição do menu para cima
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

          <Grid key="cidade" item xs={12} sm={12} lg={6}>

            <div className="input" >

              <label>Cidade</label>

              <Async
                //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                loadOptions={
                  debouncedLoadOptioncity
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
                isClearable={true}

                noOptionsMessage={() =>
                  'Nenhuma opção encontrada'
                }

                menuPortalTarget={document.body}

                onSelect={e => {
                  setcityChoose(e.target.value);
                }}
                onChange={valor => {
                  //   if (perfil !== 'vendedor') {
                  const value = valor === null ? '' : valor.value;
                  setcityChoose(value);
                  // }
                }}
              />
            </div>
          </Grid>
          <Grid key="estado" item xs={12} sm={12} lg={6}>

            <div className="input" >

              <label>Estado</label>

              <Select
                name="estado"

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



                options={states}
                onChange={value => {
                  setstateChoose(
                    value
                  );
                }}
                isMulti
              />
            </div>
          </Grid>

          <Grid key="Agrupamento" item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Agrupamento</label>

              <select name="agrupamento" ref={register}>
                <option value="name">Nome</option>
                {options}
              </select>
            </div>
          </Grid>
          <Grid key="qtd" item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Numero de registros</label>
              <select name="qtd_registros" ref={register}>
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
              <select name="ordenacao" ref={register}>
                <option value="name">Nome</option>
                {options}
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
              <button
                onClick={handleOpenModal}
                title="Configurações de campos"
                style={{
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  borderRadius: "5px",
                  fontSize: "1em",
                  marginLeft: "auto",
                }}
              >
                <FaCog style={{ marginBottom: "-2px", }} />
                Configurar Campos
              </button>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={"div"}>
                <Form>
                  <Grid container spacing={1}>

                    {renderizarCamposDefaults()}
                  </Grid>
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

export default connect()(EGR1000);
