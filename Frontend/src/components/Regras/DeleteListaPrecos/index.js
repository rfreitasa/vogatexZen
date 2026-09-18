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
export default function Delete({ id }) {
  const classes = useStyles();

  const token = sessionStorage.getItem('token');

  const handleDell = async () => {
    var answer = window.confirm(
      "Tem certeza que deseja excluir?"
    );
    if (answer) {
      try {
        await axios.delete(
          `${API.listaprecos}/${id}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        toast.success("Lista Preços excluido com sucesso");
        window.location.reload();
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

Delete.propTypes = {
  id: PropTypes.number.isRequired
};
