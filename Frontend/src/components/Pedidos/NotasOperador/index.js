import React, { useState } from "react";
import DescriptionIcon from "@material-ui/icons/Description"; // Ícone de notas ou documentos
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { API } from "../../../config/api";
import DataTable from "components/Table/Table";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { Button, makeStyles } from "@material-ui/core";
import { format } from "date-fns";
import { Badge, CircularProgress, Tooltip } from '@material-ui/core';


function createData(date, note, user) {
  return {
    date,
    note,
    user,
  };
}

const rowHead = [
  {
    title: "Data",
    field: "date",
    cellStyle: {
      fontSize: "12px",
      textAlign: "left",
    },
  },
  {
    title: "Nota",
    field: "note",
    cellStyle: {
      fontSize: "12px",
      textAlign: "left",
    },
  },
  {
    title: "Usuário",
    field: "user",
    cellStyle: {
      fontSize: "12px",
      whiteSpace: "nowrap",
      textAlign: "left",
    },
  },
];

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 0),
    width: "90%", // Defina a largura do modal aqui
    maxWidth: "90%", // Defina a largura máxima do modal
    maxHeight: "90%", // Defina a altura máxima do modal
    overflow: "scroll",
  },

  button: {
    position: "relative",
    minWidth: "30px",
    padding: theme.spacing(1),
  },
  badge: {
    backgroundColor: '#ffff00',
    fontWeight: "bold",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
  },
  spinner: {
    color: '#ffff00',
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  text: {
    padding: "10px",
    color: "#656464",
  },
  tab: {
    marginLeft: "20px", // Adicionando espaço à esquerda para o tab
  },
}));

export default function NotasOperador({ num }) {
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const [open, setOpen] = useState(false);
  const [rowsList, setRowsList] = useState([]);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const getNotes = async () => {
    try {
      setLoading(true); // Ativar o loading
      toast.success("Aguarde obtendo notas do operador.");
      const req = await axios.get(`${API.operatorNotes}/${num}`, {
        headers: {
          "x-access-token": token,
        },
      });

      if (req.data.data) {
        const list = req.data.data.map((item) => {
          const { dateTime, content } = item;
          const user = item.session.user.description;
          const row = createData(
            format(new Date(dateTime), "dd/MM/yyyy HH:mm"),
            content,
            user
          );
          return row;
        });
        setRowsList(list);
        setOpen(true);
      } else {
        setRowsList([{ error: "Não encontrado" }]);
      }
    } catch (err) {
      toast.error("Não foi possível obter as notas do operador");
    } finally {
      setLoading(false); // Desativar o loading, independentemente do resultado
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Notas do operador">
        <span>
          <Button
            className={classes.button}
            onClick={() => getNotes()}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} className={classes.spinner} />
            ) : (
              <DescriptionIcon />
            )}
          </Button>
        </span>
      </Tooltip>
      {loading && <Loading />}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paper}>
          <DataTable
            rows={rowsList}
            rowHead={rowHead}
            title={"Notas do operador"}
          />
        </div>
      </Modal>
    </>
  );
}

NotasOperador.propTypes = {
  num: PropTypes.number.isRequired,
};
