import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import PropTypes from "prop-types";
import { API } from "../../../config/api";

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

export default function DeleteCampanha({ id, onDelete }) {
  const classes = useStyles();
  const token = sessionStorage.getItem("token");

  const handleDell = async () => {
    const answer = window.confirm(
      "Tem certeza que deseja excluir essa campanha?"
    );
    if (answer) {
      try {
        await axios.delete(`${API.campanhas}/${id}`, {
          headers: { "x-access-token": token }
        });
        toast.success("Campanha excluída com sucesso");
        window.location.reload();
      } catch (err) {
        toast.error("Ocorreu algum erro ao excluir a campanha");
      }
    }
  };

  return (
    <button className={classes.button} onClick={handleDell}>
      <DeleteIcon />
    </button>
  );
}

DeleteCampanha.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};
