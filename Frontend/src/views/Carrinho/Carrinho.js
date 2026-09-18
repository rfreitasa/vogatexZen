import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import DataTable from "components/Table/Table.js";
import ItemProdutos from "components/Pedidos/ModalItemProdutos";
import { ToastContainer, toast } from "react-toastify";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import axios from "axios";
import moment from "moment";
import history from "../../services/history";
import FinalizaPedido from "../Produtos/FinalizaPedido";
import { API } from "../../config/api";
import {
  GradientBackground,
  ActionButton,
  StyledSectionTitle,
  StyledInputGroup,
  StyledFooter,
  ButtonContainer,
  StyledButton,
  StyledCard,
  StyledCardHeader,
  StyledCardContent,
} from "./styles";

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    margin: '2px 2px',
  },
}));

// Função para criar OBJ dos Pedidos
function createRequest(
  view,
  busines,
  typeSales,
  VlTot
) {
  return {
    view,
    busines,
    typeSales,
    VlTot
  };
}

const headRequest = [
  {
    title: "",
    field: "view",
    headerStyle: {
      width: 80,
      textAlign: 'center',
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      padding: '10px 8px',
    },
    cellStyle: {
      textAlign: 'center',
      padding: '8px',
    }
  },
  {
    title: "Empresa",
    field: "busines",
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    }
  },
  {
    title: "Programação",
    field: "typeSales",
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
    }
  },
  {
    title: "Valor",
    field: "VlTot",
    headerStyle: {
      backgroundColor: '#2563eb',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 16px',
      textAlign: 'right',
      width: '150px',
    },
    cellStyle: {
      fontSize: '14px',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
      textAlign: 'right',
      fontWeight: '600',
    },
  }
];

function Carrinho() {
  const classes = useStyles();
  const [lista, setLista] = useState([]);
  const [listCart, setListCart] = useState([]);
  const [loading, setLloading] = useState(true);
  const [isConfirmRequest, setIsConfirmRequest] = useState(false);
  const [ConfirmPedido, setConfirmPedido] = useState(false);
  const [autoTransp, setTransp] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const userId = sessionStorage.getItem("id");

  const isRequest = listCart.length === 0;
  var moeda = 'BRL';

  useEffect(() => {
    confirmRequest();
   
  }, []);

  async function confirmRequest() {
    try {
      setIsConfirmRequest(true);

      const response = await axios.get(
        `${API.carrinho}?email=${email}`,
        {
          headers: {
            "x-access-token": token
          }
        }
      );

      var newarray = [];

      response.data.data.map(item => {
        item.map(newitem => {
          newarray.push(newitem);
        });
      });

      setLista(newarray);

      for (let index = 0; index < response.data.data.length; index++) {
        if (index == 0) {
          const get_currency = await axios.get(
            `${API.getCurrencyById}?email=${email}&parametro=${response.data.data[index][index].LISTA_PRECOS_MOEDA}`,
            {
              headers: {
                "x-access-token": token
              }
            }
          );
          moeda = get_currency.data.data[0].code;
        }
      }

      const idNumberRequest = [];
      var totalGPedido = 0;
      for (let index = 0; index < response.data.data.length; index++) {
        const listProducts = [];
        let companyName = "";
        let dateProgram = "";
        let tipoVenda = "";
        let totalPedido = 0;

        for (let idx = 0; idx < response.data.data[index].length; idx++) {
          listProducts.push(response.data.data[index][idx]);

          totalPedido =
            totalPedido +
            response.data.data[index][idx].QUANTIDADE *
            response.data.data[index][idx].VALOR_UNITARIO;

          if (companyName === "") {
            companyName = response.data.data[index][idx].EMPRESA_APELIDO;
            dateProgram = response.data.data[index][idx].DATA_PROGRAMACAO;
            tipoVenda = (response.data.data[index][idx].TIPO_VENDA != 'P.E' ? response.data.data[index][idx].PEDIDO_NUM + ' - ' : '') + response.data.data[index][idx].TIPO_VENDA;
          }
        }
        totalGPedido = totalGPedido + totalPedido;

        const row = createRequest(
          <ItemProdutos itemCart={listProducts} />,
          <span>{companyName}</span>,
          <span>{tipoVenda}</span>,
          <span>{totalPedido.toLocaleString("pt-BR", {
            style: "currency",
            currency: moeda
          })}</span>,
        );

        idNumberRequest.push(row);
      }
      
      setTotalGeral(totalGPedido);
      setLloading(false);
      setListCart(idNumberRequest);
    } catch (error) {
      setLloading(false);
      return false;
    }
  }

  async function cancelRequest() {
    setListCart([]);
    setLista([]);

    const handleDell = async () => {
      var answer = window.confirm(
        "Tem certeza que deseja excluir esse carrinho ?"
      );
      if (answer) {
        try {
          await axios.delete(
            `${API.carrinho_removecart}?email=${email}`,
            {
              headers: {
                "x-access-token": token
              }
            }
          );
          toast.success("Carrinho excluido com sucesso");
          window.location.reload();
        } catch (err) {
          toast.error("Ocorreu algum erro!");
        }
      }
    };
    handleDell();
  }

  async function addProdutosRequest() {
    history.push("/admin/produtos");
  }

  function confirmaPedido(e) {
    e.preventDefault();
    setConfirmPedido(true);
    setIsConfirmRequest(true);
  }

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
            shopping_cart
          </span>
          Carrinho 
        </h2>
      </GradientBackground>

      <Paper className={classes.paper}>
        {ConfirmPedido ? (
          <FinalizaPedido itemCart={lista} Transp={autoTransp} />
        ) : (
          <>
            <StyledCard style={{ marginBottom: '24px' }}>
                <DataTable
                  rows={listCart}
                  rowHead={headRequest}
                  title={""}
                  titleNoData={""}
                  searchInput={false}
                  maxHeight="50"

                  sort={false}
                  load={loading}
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
                
                {totalGeral > 0 && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'right'
                  }}>
                    <strong style={{ fontSize: '18px', color: '#2563eb' }}>
                      Total Geral: {totalGeral.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: moeda
                      })}
                    </strong>
                  </div>
                )}
            </StyledCard>

            <StyledFooter>
              <ButtonContainer>
                <StyledButton
                  bg="#ff5858"
                  disabled={isRequest}
                  onClick={cancelRequest}
                >
                  Limpar Carrinho
                </StyledButton>

             

                {!isRequest && (
                  <StyledButton
                    bg="#00c156"
                    onClick={confirmaPedido}
                  >
                    Finalizar Pedido
                  </StyledButton>
                )}
              </ButtonContainer>
            </StyledFooter>
          </>
        )}
        <ToastContainer />
      </Paper>
    </div>
  );
}

export default connect()(Carrinho);