


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
  margin: {
    margin: theme.spacing(1)
  }
}));


function EGR6000() {
  const classes = useStyles();



  const { register, getValues } = useForm();

  // AutoComplete
  const [vendedorP, setVendedorP] = useState('');
  const [idVendedorP, setIdVendedorP] = useState('');
  const [idEstado, setIdEstado] = useState('');

  const [Departamentos, setDepartamentos] = useState([]);
  const [nomeDepartamento, setNomeDepartamento] = useState('');
  const [idEmpresas, setIdEmpresas] = useState('');
  const [fieldsReadonly, setfieldsReadonly] = useState(false);
  const [listEmpresas, setListEmpresas] = useState('');

  const [PanelOpen, setPanelOpen] = React.useState(true);

  const [Marcas, setMarcas] = useState([]);
  const [nomeMarcas, setNomeMarcas] = useState('');
  const [idMarcas, setIdMarcas] = useState('');

  const [autoNomeSupervisor, setAutoNomeSupervisor] = useState('');
  const [idSupervisor, setIdSupervisor] = useState('');
  const [autoListSupervisor, setAutoListSupervisor] = useState([]);

  const [autoVendedor, setAutoVendedor] = useState([]);

  const [idProduto, setIdProduto] = useState('');

  const [idProdutoGrade, setIdProdutoGrade] = useState('');

  const iframeRef = useRef(null);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opcoesEscolhidas, setOpcoesEscolhidas] = useState({});


  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const perfil = sessionStorage.getItem('perfil');
  const id_user = sessionStorage.getItem('id');
  const clientes = JSON.parse(sessionStorage.getItem('clientes'));
  const [vendedorEscolhido, setVendedorEscolhido] = useState('');
  const [defaultSellerID, setDefaultSellerID] = useState('');
  const [defaultSeller, setDefaultSeller] = useState('');
  const [auto, setAuto] = useState([]);

  const loadSellers = async (inputValue, callback) => {
    try {
      console.log('entrou')
      const response = await axios.get(`${API.vendedores}?email=${email}&parametro=${inputValue}`, {
        headers: {
          'x-access-token': token,
        },
      });
      const data = response.data.data
        .map(item => {
          return { value: item.name, label: item.name.toUpperCase() };
        })
        .filter(item => {
          return item.label.includes(inputValue.toUpperCase());
        });
      return data;
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

  const opcoesCamposPesquisa = [
    { campo: "dados", label: "Dados", size: '40', tipo: 'select', referencia: "ranking_vendas", status: "1" },
    { campo: "agrupamento", label: "Agrupamento", size: '40', tipo: 'select', referencia: "ranking_vendas", status: "1" },
    { campo: "ordenacao", label: "Ordenação", size: '40', tipo: 'select', referencia: "ranking_vendas", status: "1" },
    { campo: "dataini", label: "Data inicial", size: '120', tipo: 'date', referencia: "ranking_vendas", status: "1" },
    { campo: "datafim", label: "Data final", size: '60', tipo: 'date', referencia: "ranking_vendas", status: "1" },
    { campo: "empresas", label: "Empresas", size: '60', tipo: 'autocomplete', referencia: "ranking_vendas", status: "1" },
    { campo: "supervisor", label: "Supervisor", size: '100', tipo: 'autocomplete', referencia: "ranking_vendas", status: "1" },
    { campo: "vendedor", label: "Vendedor", size: '100', tipo: 'autocomplete', referencia: "ranking_vendas", status: "1" },
    { campo: "estado", label: "Estado", size: '100', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "cliente", label: "Cliente", size: '100', tipo: 'autocomplete', referencia: "ranking_vendas", status: "1" },
    { campo: "produto_mestre", label: "Produto mestre", size: '100', tipo: 'autocomplete', referencia: "ranking_vendas", status: "1" },
    { campo: "produto_grade", label: "Produto grade", size: '100', tipo: 'autocomplete', referencia: "ranking_vendas", status: "1" }
  ];


  const opcoesCampos = [
    { campo: "person_id", label: "Dados", size: '40', tipo: 'select', referencia: "ranking_vendas", status: "1" },
    { campo: "person_name", label: "Nome", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "person_fantasyName", label: "Nome fantasia", size: '100', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "person_nameCalc", label: "Pessoa", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceItem_quantity", label: "Quantidade", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceItem_discountValue", label: "Desconto", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceItem_totalValue", label: "Valor total", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceItem_contributionMargin", label: "Margin contribuição", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceItem_salesCommissionValue", label: "Comissão", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceCount", label: "Número de NFs", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
    { campo: "invoiceItemCount", label: "Número de itens de NF", size: '120', tipo: 'input', referencia: "ranking_vendas", status: "1" },
  ];
  const opcoesTipoPessoa = [
    { value: "", label: "TODOS" },
    { value: "CORPORATION", label: "Tipo Jurídico" },
    { value: "INDIVIDUAL", label: "Tipo Físico" },
  ];


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
  const loadProdutosMestre = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos}?email=${email}&nome=${inputValue}`,
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
            return item.MESTRE_ID + item.MESTRE_CODIGO == y.MESTRE_ID + y.MESTRE_CODIGO;
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });

      const data = reduced
        .map(item => {
          return {
            value: item.MESTRE_ID,
            label:
              item.MESTRE_ID +
              ' - ' +
              (item.MESTRE_CODIGO ? item.MESTRE_CODIGO : '')
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
  const loadProdutosGrade = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `${API.produtos}?email=${email}&nome=${inputValue}`,
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
            return item.ITEM_ID + item.ITEM_NOME == y.ITEM_ID + y.ITEM_NOME;
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });

      const data = reduced
        .map(item => {
          return {
            value: item.ITEM_ID,
            label:
              item.ITEM_ID +
              ' - ' +
              (item.ITEM_NOME ? item.ITEM_NOME : '') +
              ' - ' +
              (item.ITEM_GRADE ? item.ITEM_GRADE : ''),
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

  //DEBOUNCE CLIENTES
  const loadOptionsClientes = (inputValue, callback) =>
    loadClients(inputValue, callback);

  const debouncedLoadOptionsClientes = debounce(loadOptionsClientes, 3000, {
    leading: false,
  });
  //DEBOUNCE PRODUTOS
  const loadOptionsProdutosMestre = (inputValue, callback) =>
    loadProdutosMestre(inputValue, callback);


  const loadOptionsProdutosGrade = (inputValue, callback) =>
    loadProdutosGrade(inputValue, callback);

  const debouncedLoadOptionsProdutos = debounce(loadOptionsProdutosMestre, 3000, {
    leading: false,
  });

  const debouncedLoadOptionsProdutosGrade = debounce(loadOptionsProdutosGrade, 3000, {
    leading: false,
  });

  
  const montarOpcoes = () => {
    const escolhasSalvas = JSON.parse(
      sessionStorage.getItem("ranking_vendas") || "[]"
    );

    const escolhasFiltradas = escolhasSalvas.filter(
      (escolha) => escolha.status === "1"
    );

    const escolhasIniciais = {};
    opcoesCampos.forEach((campo) => {
      const escolhaSalva = escolhasFiltradas.find(
        (escolha) => escolha.campo === campo.campo
      );
      escolhasIniciais[campo.campo] = escolhaSalva ? true : false;
    });

    setOpcoesEscolhidas(escolhasIniciais);
  };
  useEffect(() => {

    montarOpcoes();
  }, []); // Chama a função na montagem inicial


  useEffect(() => {
    async function handleReq() {
      try {
        const response = await axios.get(`${API.vendedores}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const list = response.data.data;
        setAuto(list);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          //  toast.error('Erro ao carregar ');
        }
      }
    }

    const getSupervisores = async () => {
      try {
        const response = await axios.get(`${API.usuarios}`, {
          headers: {
            'x-access-token': token,
          },
        });

        const data = response.data.data;
        // console.log(data);

        setAutoListSupervisor(
          data.filter(function (obj) {
            return obj.USUARIO_PERFIL === 'supervisor';
          }),
        ); //filter perfil por supervisor
        //      setAutoListGerente(data);
      } catch (error) {
        toast.error('Erro ao carregar lista.');
      }
    };

    async function getEstados() {
      try {
        const response = await axios.get(`${API.estados}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });

        console.log(response.data.data)
        const data = response.data ? response.data.data.map(item => {
          return { value: item.UFS_ID, label: item.UFS_NOME.toUpperCase() };
        }) : '';
        setEstados(data);
        console.log('passando pelos estados');
        // console.log(Estados);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar login');
          sessionStorage.clear();
        } else {
          //   toast.error('Erro ao carregar ');
        }
      }
    }
    const loadSales = async () => {
      try {
        const response = await axios.get(`${API.vendedores}?email=${email}`, {
          headers: {
            'x-access-token': token,
          },
        });
        if (perfil === 'vendedor' && response.data.data[0]) {
          if (response.data.data[0].id) {
            setIdVendedorP(response.data.data[0].id);
            setVendedorP(response.data.data[0].name);
            setfieldsReadonly(true);

          }
        }

        const data = response.data ? response.data.data.map(item => {
          return { value: item.id, label: item.name.toUpperCase() };
        }) : '';

        setAutoVendedor(data);
      } catch (err) {
        if (err.response && err.response.status === 402) {
          //token expirado
          toast.error('Sua sessão expirou, favor efetuar o login');
        } else {
          toast.error('Erro ao carregar lista de vendedores');
        }
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

        const data = response.data ? response.data.data.filter(item => item.EMPRESA_NOME != 'PERSONAL SOFTWARE').map(item => {
          return { value: item.EMPRESA_ID_ERP, label: item.EMPRESA_NOME.toUpperCase() };
        }) : '';
        console.log(data)

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
    loadCompany();
    loadSales();
    getSupervisores();
    getEstados();
    handleReq();
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

  useEffect(() => {

    async function handleCleanVendedor() {
      setValueAutoId("");
    }


    if (valueAutoNome.length === 0) {
      handleCleanVendedor();
    }





  }, [valueAutoNome]);


  const Pesquisaitem = (data, e) => {
    //e.preventDefault();
    // setPanelOpen(false);
    console.log(idVendedorP)
    handleSearch(data);
  };

  const handleSearch = async data => {
    try {

      console.log('aqui')
      const camposEscolhidos = Object.keys(opcoesEscolhidas);
      const campos = Object.keys(opcoesEscolhidas).filter(key => opcoesEscolhidas[key]);
      const labels = campos.map(campo => opcoesCamposPesquisa.find(opcao => opcao.campo === campo).label);
      const tamanhos = campos.map(campo => parseInt(opcoesCamposPesquisa.find(opcao => opcao.campo === campo).size));
      console.log(labels)
      console.log(tamanhos)
      console.log(campos)
      console.log(vendedorEscolhido)
      if (idVendedorP.length > 0) {
        data.vendedor = idVendedorP;
      }

      if (idEmpresas.length > 0) {
        data.empresas = idEmpresas;
      }
      if (idSupervisor.length > 0) {
        data.supervisor = idSupervisor;
      }
      if (idCliente.length > 0) {
        data.cliente = idCliente;
      }
      if (idProduto.length > 0) {
        data.produto_mestre = idProduto;
      }
      if (idProdutoGrade.length > 0) {
        data.produto_grade = idProdutoGrade;
      }
console.log(idEmpresas);


      
      console.log(data);
      const axios_search = `${API.relatorios}/?relatorio=EGR6000&email=${email}`;
      const parametros = {
        data,  // Mantém os dados existentes
        camposEscolhidos: campos,
        labels,
        tamanhos  // Adiciona campos escolhidos
      };

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

          <Grid item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Dados*</label>
              <select name="dados" ref={register} >
                <option value="" selected>
                  Nenhum
                </option>
                <option value="data=person_nameCalc" selected>
                  Pessoa
                </option>
                <option value="data=personGroup_description">Grupo empresarial</option>
                <option value="grouping=data=city_name">
                  Cidade
                </option>
                <option value="data=state_name">
                  Estado
                </option>
                <option value="grouping=data=salesperson">Vendedor</option>
                <option value="data=product_code">Produto mestre</option>
                <option value="data=productPacking_code">Produto grade</option>
                <option value="data=product_category_description_1">Classe</option>


              </select>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Agrupamento</label>
              <select name="agrupamento" ref={register}>
                <option value="" selected>
                  Nenhum
                </option>
                <option value="grouping=state_name" selected>
                  Estado
                </option>
                <option value="grouping=salesperson">Vendedor</option>
                <option value="grouping=product_code">
                  Produto Mestre
                </option>
                <option value="grouping=productPacking_code">
                  Produto filho
                </option>
                <option value="grouping=person_nameCalc">Cliente</option>
                <option value="grouping=product_category_description_1">Classe</option>

              </select>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} lg={4}>
            <div className="input">
              <label>Ordenação</label>
              <select name="ordenacao" ref={register}>
                <option value="sorting=invoiceItem_quantity" >
                  Quantidade
                </option>
                <option value="sorting=invoiceItem_totalValue" selected>Valor</option>
              </select>
            </div>
          </Grid>


        </Grid>
      </>
    );
  };
  const renderizarCampos = () => {


    return opcoesCamposPesquisa.map((campo) => {
      return (
        // Renderiza apenas se o campo estiver marcado como true
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

          {campo.campo === "vendedor" && (
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
          )}

          {campo.campo === "empresas" && (
            <div className="input" id="empresas">
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
                ref={register}

                styles={{
                  menuPortal: base => ({ ...base, zIndex: 223 }),
                  container: base => ({ ...base, minWidth: '20rem' }),
                }}
                onChange={value => {
                  console.log(value)
                  const valor = value === null ? '' : value.value;
console.log(valor);
                  if (valor > 1) {
                    setIdEmpresas(valor);
                  } else {
                    setIdEmpresas('');
                  }
                }}
              />
            </div>
          )}
          {campo.campo === "supervisor" && (
            <div className="input" id="supervisor">
              <label>Supervisor</label>
              <input
                name="supervisorId"
                type="hidden"
                ref={register}
                defaultValue={idSupervisor}
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
                  setIdSupervisor(item.USUARIO_CONTA_ID_ERP);
                  return item.USUARIO_NOME;
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
                value={autoNomeSupervisor}
                onChange={e => setAutoNomeSupervisor(e.target.value)}
                onSelect={val => setAutoNomeSupervisor(val)}
              />
            </div>
          )}

          {campo.campo === "cliente" && (
            <div className="input" id="cliente">
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
                ref={register}
                placeholder="Clientes"
                styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 16,
                  }),
                  container: base => ({
                    ...base,
                    minWidth: '8rem',
                  }),
                }}
                value={{
                  label: nomeCliente ? nomeCliente : '',
                  value: idCliente ? idCliente : '',
                }}
                onSelect={val => {
                  if (val.length > 1) {
                    setIdVendedorP(val.dados.properties.salesPerson);
                    setVendedorP(autoVendedor.filter(item => item.value == val.dados.properties.salesPerson)[0] ? autoVendedor.filter(item => item.value == val.dados.properties.salesPerson)[0].label : '');

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


                  } else {
                    setIdCliente('');
                    setNomeCliente('');
                  }
                }}
              /></div>
          )}

          {campo.campo === "produto_mestre" && (
            <div className="input" id="produto_mestre">
              <label>Produto Mestre</label>
              <Async
                //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                loadOptions={debouncedLoadOptionsProdutos}
                cacheOptions
                ref={register}
                isClearable={true}
                noOptionsMessage={() => 'Nenhuma opção encontrada'}
                placeholder="Produto"
                menuPortalTarget={document.body}
                isMulti

                styles={{
                  menuPortal: base => ({ ...base, zIndex: 223 }),
                  container: base => ({ ...base, minWidth: '20rem' }),
                }}
                onChange={value => {
                  const valor = value === null ? '' : value.value;

                  if (valor > 1) {
                    setIdProduto(valor);
                  } else {
                    setIdProduto('');
                  }
                }}
              />
            </div>
          )}

          {campo.campo === "produto_grade" && (
            <div className="input" id="produto_grade">
              <label>Produto Grade</label>
              <Async
                //onChange={e => (itemRequest.prazo_pagamentor = e.target.value)}
                loadOptions={debouncedLoadOptionsProdutosGrade}
                cacheOptions
                ref={register}

                isClearable={true}
                noOptionsMessage={() => 'Nenhuma opção encontrada'}
                placeholder="Produto"
                menuPortalTarget={document.body}
                isMulti

                styles={{
                  menuPortal: base => ({ ...base, zIndex: 223 }),
                  container: base => ({ ...base, minWidth: '20rem' }),
                }}
                onChange={value => {
                  const valor = value === null ? '' : value.value;

                  if (valor > 1) {
                    setIdProdutoGrade(valor);
                  } else {
                    setIdProdutoGrade('');
                  }
                }}
              />
            </div>
          )}


        </Grid>
      )
    });
  };

  return (
    <>
      <CamposConfiguracao
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSubmit={handleConfiguracaoSubmit}
        opcoesCampos={opcoesCampos}
        escolhasIniciais={opcoesEscolhidas} // Passe as escolhasIniciais para o modal
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
              <Typography component={"span"} className={classes.heading}>
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
                <FaCog style={{ marginBottom: "-2px", marginRight: "5px" }} />
                Configurar Campos
              </button>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={"div"}>
                <Form>
                  <Grid container spacing={1}>{renderizarCamposDefaults()}{renderizarCampos()}</Grid>
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

export default connect()(EGR6000);
