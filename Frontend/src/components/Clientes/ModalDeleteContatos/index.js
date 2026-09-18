import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import PropTypes from "prop-types";
import {API} from "../../../config/api"

const useStyles = makeStyles(() => ({
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "5px",
    cursor: "pointer"
  }
}));
export default function DeleteContato({ id,idcliente,onchangechild}) {
  const classes = useStyles();
  // Token
  const token = sessionStorage.getItem('token');
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
  
    onchangechild(false);
    setOpen(false);

  };

  const handleDell = async () => {
    var answer = window.confirm(
      "Tem certeza que deseja excluir esse contato?"
    );
    if (answer) {
      console.log(`${API.clientes}/${idcliente}/contatos/${id}`)
      try {
        await axios.delete(
          `${API.clientes}/${idcliente}/contatos/${id}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        toast.success("Item removido com sucesso");
        handleClose();
      
      } catch (err) {
        toast.error("Ocorreu algum erro!");
      }
    }
  };

  return (
    <button className={classes.button} onClick={() => handleDell()}>
      <DeleteIcon />
    </button>
  );
}

DeleteContato.propTypes = {
  id: PropTypes.number.isRequired
};
