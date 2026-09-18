


import React, { useState, useEffect } from "react";
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
import { Pesquisa, Form, ButtonStyled } from "../styles";
import {API} from "../../../config/api"


const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));


function EIR4002() {
  const classes = useStyles();
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const perfil = sessionStorage.getItem("perfil");
  const clientes = JSON.parse(sessionStorage.getItem("clientes"));


  const [PanelOpen, setPanelOpen] = React.useState(true);

  const { register, getValues } = useForm();

  // AutoComplete
  const [auto, setAuto] = useState([]);

  const [Estados, setEstados] = useState([]);
  const [nomeEstado, setNomeEstado] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [dadosPedidos, setDadosPedidos] = useState();


  let value = "";
  let valueId="";
  if(perfil==='vendedor'){
     value = clientes && clientes[0].vendedorPadrao === null ? "" : clientes[0].vendedorPadrao.nome;
     valueId = clientes && clientes[0].vendedorPadrao === null ? "" : clientes[0].vendedorPadrao.id;
  }
  const [valueAutoId, setValueAutoId] = useState(valueId);
  const [valueAutoNome, setValueAutoNome] = useState(value);



  const [autoCliente, setAutoCliente] = useState(clientes);
  
  const [nomeCliente, setNomeCliente] = useState("");
  const [idCliente, setIdCliente] = useState("");

  const [loading, setLloading] = useState(false);


  useEffect(() => {
    async function handleClean() {
       setIdCliente("");
    }
    async function handleCleanEstado() {
      setIdEstado("");
    }
   
    async function handleCleanVendedor() {
      setValueAutoId("");
     }
   

     if(valueAutoNome.length===0){
         handleCleanVendedor();
     }
   
    if(nomeCliente.length===0){
         handleClean();
    }
    if(nomeEstado.length===0){
         handleCleanEstado();
    }

  }, [nomeCliente,nomeEstado,valueAutoNome]);

  useEffect(() => {
    async function handleReq() {
      try {
        const response = await axios.get(
          `${API.vendedores}?email=${email}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );

        const list = response.data.data;
        setAuto(list);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar login");
          sessionStorage.clear();
        } else {
          toast.error("Erro ao carregar ");
        }
      }
    }

    async function getEstados() {
      try {
        const response = await axios.get(
          `${API.estados}?email=${email}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );

        const Estados = response.data.data;
        setEstados(Estados);
        console.log(Estados);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar login");
          sessionStorage.clear();
        } else {
          toast.error("Erro ao carregar ");
        }
      }
    }
    getEstados();
    handleReq();
  }, []);

  const Pesquisaitem = (data, e) => {
    e.preventDefault();
   // setPanelOpen(false);
    handleSearch(data);
  };

  const handleSearch = async data => {
    try {
      setLloading(true);
      if(data.dataini==='' || data.datafim===''){
            toast.error("Campo data Inicial e final são obrigatórios."); 
            setLloading(false);
      }else{

  
          var axios_search = "";
    
          console.log(data);
         
          var    where =`&dt_ini=${data.dataini}&dt_fim=${data.datafim}&filtro_data=${data.filtro_data}`;
 
     
      //    if (data.agrupamento !== '') {     
        //    where = where+`&agrupamento=${data.agrupamento}`;
       //   }
          if(data.vendedorPadraoId > 0){
            where = data.vendedorPadraoId?where+`&vendedor=${data.vendedorPadraoId}`: where;
          }
         
    
    
      axios_search = `${API.relatorios}/?relatorio=EIR4002&email=${email}${where}`;
      try {
        toast.success("Aguarde seu Relatório está sendo gerado.");
        const response = await axios.get(`${axios_search}`, {
          responseType: "blob",
          headers: {
            "x-access-token": token
          }})
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
  

    }
    } catch (error) {
      setLloading(false);

      toast.error("Não localizado, verifique os campos de pesquisa.");
    }
  };
  
  //const listPedidos = useSelector(state => state.filter.listPedido);
  //console.log(dadosPedidos);

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
              <Typography component={"span"} className={classes.heading}>
                Painel de pesquisa
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography component={"div"}>
                <Form>
                  <Grid container spacing={1}>
                   
                   
                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Data Inicial</label>
                        <input type="date" className="data" name="dataini" ref={register} />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={6}>
                      <div className="input">
                        <label>Data Final</label>
                        <input type="date" className="data" name="datafim" ref={register} />
                      </div>
                    </Grid>

              

                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="input">
                        <label>Vendedor</label>
                        <input

                          name="vendedorPadraoId"
                          type="hidden"
                          ref={register}
                          defaultValue={valueAutoId}
                        />
                        <input
                          name="vendedorPadraoNome"
                          type="hidden"
                          ref={register}
                        />
                        <Autocomplete
                          items={auto}
                          wrapperStyle={{
                            position: "relative",
                            zIndex: "240000",
                            display: "inline-block"
                          }}
                          shouldItemRender={(item, value) =>
                            item.NOME.toLowerCase().indexOf(
                              value.toLowerCase()
                            ) > -1
                          }
                          getItemValue={item => {
                            setValueAutoId(item.NUMCAD1);
                            return item.NOME;
                          }}
                          renderItem={(item, isHighlighted) => (
                            <div
                              key={item.NUMCAD1}
                              inputVariant="outlined"
                              style={{
                                background: isHighlighted
                                  ? "lightgray"
                                  : "white",
                                width: "100%",
                                fontSize: '0.7rem'
                              }}
                            >
                              <span
                                key={item.NUMCAD1}
                                style={{
                                  fontWeight: isHighlighted ? 700 : 400
                                }}
                              >
                                {item.NOME}
                              </span>
                            </div>
                          )}
                          value={valueAutoNome}
                          onChange={(perfil==='vendedor')?"":e => setValueAutoNome(e.target.value)}
                          onSelect={val => setValueAutoNome(val)}
                        />
                      </div>
                     </Grid>
                      
  
                    
                  </Grid>
                  <ButtonStyled
                    variant="contained"
                    color="primary"
                    onClick={e => Pesquisaitem(getValues(), e)}
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

export default connect()(EIR4002);
