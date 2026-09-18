import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, makeStyles } from "@material-ui/core";
import { API } from "../../../config/api";
import DescriptionIcon from "@material-ui/icons/Description"; 

const useStyles = makeStyles((theme) => ({
  button: {
    position: "relative",
    minWidth: "30px",
    padding: theme.spacing(1),
  },
 
  spinner: {
    color: "#1976d2",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function Pdf({ num }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
const handlePdf = async () => {
  setLoading(true);

  try {
    toast.success("Aguarde, seu PDF está sendo gerado.");

    const req = await axios.get(`${API.produtos_espec}?id=${num}`, {
      headers: {
        "x-access-token": token,
      },
    });

    const pdfBase64 = req.data.content;

    if (!pdfBase64) {
      throw new Error("Conteúdo do PDF não encontrado.");
    }

    // Remove prefixo caso venha como data URI
    const base64 = pdfBase64.replace(
      /^data:application\/pdf;base64,/,
      ""
    );

    // Converte Base64 para binário
    const binaryString = window.atob(base64);

    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Cria o PDF
    const pdfBlob = new Blob([bytes], {
      type: req.data.contentType || "application/pdf",
    });

    // Cria URL somente depois que o PDF estiver pronto
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Só agora abre a nova aba
    window.open(pdfUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 300000);

  } catch (err) {
    console.error("Erro ao gerar/exibir PDF:", err);
    toast.error("Não foi possível gerar seu PDF");
  } finally {
    setLoading(false);
  }
};

  return (
    <Tooltip title="Ficha técnica">
    <span>
      <Button
        className={classes.button}
        onClick={handlePdf}
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
  
  
  );
}

Pdf.propTypes = {
  num: PropTypes.number.isRequired,
};
