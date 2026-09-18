import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DataTable from "../../Table/Table";


function createData(
  ITEM_ID,
  ITEM_NOME,
  ITEM_GRADE,
  EMPRESA_APELIDO,
  PE_OU_PROG,
  QUANTIDADE,
  VALOR_UNITARIO,
  VALOR_TOTAL,
  TOTAL
) {
  return {
    ITEM_ID,
    ITEM_NOME,
    ITEM_GRADE,
    EMPRESA_APELIDO,
    PE_OU_PROG,
    QUANTIDADE,
    VALOR_UNITARIO,
    VALOR_TOTAL,
    TOTAL
  };
}

const rowHead = [
  {
    title: "Código",
    field: "ITEM_ID",
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
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Quantidade",
    field: "QUANTIDADE",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Valor unitário",
    field: "VALOR_UNITARIO",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  },
  {
    title: "Valor Total",
    field: "VALOR_TOTAL",
    cellStyle: {
      fontSize: "10px",
      whiteSpace: "nowrap",
      textAlign: "left"
    }
  }
];

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "80%",
    overflow: "scroll"
  },
  button: {
    border: 0,
    borderRadius: "20px",
    color: "#00acc1",
    background: "transparent",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  number: {
    // position: "absolute",
    top: "-10px",
    left: "10px",
    // marginRight: "8px",
    borderRadius: "50px",
    // padding: "5px",

    backgroundColor: "#fff",
    index: 999
  }
}));

const StyledBadge = withStyles(theme => ({
  badge: {
    right: 4,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}))(Badge);

export default function Carrinho({ itemCart }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const rowsList = itemCart
    ? itemCart.map(item => {
        const {
          ITEM_CODIGO,
          ITEM_NOME,
          ITEM_GRADE,
          ITEM_UNIDADE,
          EMPRESA_APELIDO,
          TIPO_VENDA,
          QUANTIDADE,
          VALOR_UNITARIO
        } = item;

        const row = createData(
          ITEM_CODIGO,
          ITEM_NOME,
          ITEM_GRADE,
          EMPRESA_APELIDO,
          TIPO_VENDA,
          QUANTIDADE +" "+ITEM_UNIDADE,
          VALOR_UNITARIO.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          }),
          (QUANTIDADE * VALOR_UNITARIO).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          }),
          QUANTIDADE * VALOR_UNITARIO
        );

        return row;
      })
    : [{ error: "Não encontrado" }];

  if (rowsList.length > 1) {
    let totalPedido = 0;
    rowsList.map(item => {
      totalPedido = totalPedido + item.TOTAL;
      // console.log(">>> ", item);
      // console.log(">>> ", totalPedido);
    });
    rowsList.push(
      createData(
        "",
        "",
        "",
        "",
        "",
        "",
        "Total do Pedido:",
        totalPedido.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      )
    );
  }

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
              title={"Itens do Pedido"}
              titleNoData={""}
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
