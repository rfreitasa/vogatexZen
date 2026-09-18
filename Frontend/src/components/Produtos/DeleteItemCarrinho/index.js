import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import PropTypes from "prop-types";
import { Refresh } from "@material-ui/icons";
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
  // Token
  const token = sessionStorage.getItem('token');

  const handleDell = async () => {
    var answer = window.confirm(
      "Tem certeza que deseja excluir esse item do carrinho?"
    );
    if (answer) {
      try {
        await axios.delete(
          `${API.carrinhoremoveitem}/${id}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );
        toast.success("Item removido do carrinho com sucesso");
        
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
