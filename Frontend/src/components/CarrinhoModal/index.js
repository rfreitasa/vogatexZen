import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DataTable from "../Table/Table";
import Delete from "../Produtos/DeleteItemCarrinho";
import { Form, ButtonStyled } from "./styles";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "scroll",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    border: 0,
    borderRadius: "20px",

    backgroundColor: "#00acc1",
    color: "#fff",
    padding: "10px",
    cursor: "pointer",
   // minHeight: '100%', // Garante que o botão ocupe toda a altura da linha
    //minWidth: '100%', // Garante que o botão ocupe toda a altura da linha

    display: 'flex',
    alignItems: 'center', // Centraliza o conteúdo verticalmente
  },
  icon: {
    fontSize: '24px', // Ajusta o tamanho do ícone
   minHeight: '100%', // Garante que o ícone ocupe toda a altura disponível
  },
}));
function createData(
  ID,
  ITEM_CODIGO,
  ITEM_NOME,
  ITEM_GRADE,
  EMPRESA_APELIDO,
  PE_OU_PROG,
  QUANTIDADE,
  ITEM_VALOR_UNITARIO,
  TOTAL
) {
  return {
    ID,
    ITEM_CODIGO,
    ITEM_NOME,
    ITEM_GRADE,
    EMPRESA_APELIDO,
    PE_OU_PROG,
    QUANTIDADE,
    ITEM_VALOR_UNITARIO,
    TOTAL
  };
}

const rowHead = [
  {
title:"",
field:"ID"
  },
  {
    title: "Código",
    field: "ITEM_CODIGO",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Nome",
    field: "ITEM_NOME",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Grade",
    field: "ITEM_GRADE",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Empresa",
    field: "EMPRESA_APELIDO",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Programação",
    field: "PE_OU_PROG",
    headerStyle: {
            padding: 1
    },
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Quantidade",
    field: "QUANTIDADE",
    headerStyle: {
      width: 80,
      maxWidth: 80,
      padding: 1
    },
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "right"
    }
  },
  
  {
    title: "Valor",
    headerStyle: {
      width: 100,
      maxWidth: 100,
      padding: 1,
      textAlign:"center"
    },
    field: "ITEM_VALOR_UNITARIO",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "right"
    }
  },
  {
    title: "Total",
    field: "TOTAL",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "right"
    }
  }
];

const StyledBadge = withStyles(theme => ({
  badge: {
    right: 4,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 1px"
  }
}))(Badge);

export default function Carrinho({ itemCart, moeda }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const lista = useSelector(state => state.carrinho.cart);

  const rowsList = itemCart
    ? itemCart.map(item => {
        const {
          ID,
          ITEM_CODIGO,
          ITEM_NOME,
          ITEM_GRADE,
          EMPRESA_APELIDO,
          TIPO_VENDA,
          QUANTIDADE,
          ITEM_UNIDADE,
          VALOR_UNITARIO,
        } = item;
      
        const row = createData(
          <Delete id={ID} />,
          ITEM_CODIGO,
          ITEM_NOME,
          ITEM_GRADE,
          EMPRESA_APELIDO,
          TIPO_VENDA,
          QUANTIDADE +" "+ITEM_UNIDADE,
          (VALOR_UNITARIO)?VALOR_UNITARIO.toLocaleString("pt-BR", {
            style: "currency",
            currency: moeda
          }):"R$ 0,00",
          (QUANTIDADE * VALOR_UNITARIO).toLocaleString("pt-BR", {
            style: "currency",
            currency: moeda
          })

        );

        return row;
      })
    : [{ error: "Não encontrado" }];

  return (
    <div>
      <button className={classes.button} type="button" onClick={handleOpen}>
        <StyledBadge badgeContent={itemCart.length} color="secondary">
          <ShoppingCartIcon />
        </StyledBadge>
      </button>
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
            <DataTable
              rows={rowsList}
              rowHead={rowHead}
              title={"Itens adicionados ao carrinho"}
              titleNoData={"Pesquise os produtos"}
              pagination={true}
              searchInput={true}
            />
          </div>  

        </Fade>
      </Modal>
    </div>
  );
}

Carrinho.propTypes = {
  itemCart: PropTypes.arrayOf(PropTypes.object).isRequired
};
