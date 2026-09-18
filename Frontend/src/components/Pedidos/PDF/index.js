import React, { useState } from "react";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Loading from "../../Loading"
import { API } from "../../../config/api";
import { Badge, CircularProgress, Tooltip } from '@material-ui/core';
import { Button, makeStyles } from "@material-ui/core";




const useStyles = makeStyles((theme) => ({
 
  button: {
    position: "relative",
    minWidth: "30px",
    padding: theme.spacing(1),
  },
  badge: {
    backgroundColor: "#d32f2f",
    fontWeight: "bold",
    color: "#fff",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px 4px",
    borderRadius: "4px",
  },
  spinner: {
    color: "#d32f2f",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function Pdf({ num }) {
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const classes = useStyles();


  const handlePdf = async () => {
    try {
      setLoading(true); // Ativar o loading

      toast.success("Aguarde seu PDF está sendo gerado.");

      const req = await axios.get(
        `${API.impressos_pedidos}/${num}/?email=${email}`,
        {
          responseType: "arraybuffer",

          headers: {
            "x-access-token": token,
          },
        }
      );
console.log(req.data)
      const file = new Blob([req.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (err) {
      toast.error("Não foi possível gerar seu PDF");
    } finally {
      setLoading(false); // Desativar o loading, independentemente do resultado
    }
  };

  return (
    <Tooltip title="Download">
      <span>

        <Button
          className={classes.button}
          onClick={handlePdf}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} className={classes.spinner} />
          ) : (
            <PictureAsPdfIcon />
          )}
        </Button>
      </span>
    </Tooltip>

  );
}

Pdf.propTypes = {
  num: PropTypes.number.isRequired,
};
