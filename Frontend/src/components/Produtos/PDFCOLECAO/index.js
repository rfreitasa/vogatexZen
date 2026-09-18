import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, makeStyles } from "@material-ui/core";
import { API } from "../../../config/api";
import PhotoAlbum from '@material-ui/icons/PhotoAlbum';


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


export default function PdfColecao({ num }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");

  const handlePdf = async () => {
    setLoading(true);
    try {
      toast.success("Aguarde, seu PDF está sendo gerado.");
      const req = await axios.get(
        `${API.external_imagens}?item_id=${num}&type=catalogo`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (req?.data?.data?.url) {
        window.open(req.data.data.url);
      } else {
        toast.error("Não foi possível obter o catálogo");
      }
    } catch (err) {
      toast.error("Não foi possível obter seu PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Catálogo">
      <span>
        <Button
          className={classes.button}
          onClick={handlePdf}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} className={classes.spinner} />
          ) : (
            <PhotoAlbum />
          )}
        </Button>
      </span>
    </Tooltip>
  );
}

PdfColecao.propTypes = {
  num: PropTypes.number.isRequired,
};
