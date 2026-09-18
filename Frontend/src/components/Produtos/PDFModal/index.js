import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { Description, SettingsRemoteOutlined } from "@material-ui/icons";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Button } from "./styles";

import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";
import {API} from "../../../config/api"


const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 0),
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "auto"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#00acc1",
    color: "#fff",
    padding: "5px",
    cursor: "pointer"
  }
}));

const StyledBadge = withStyles(theme => ({
  badge: {
    right: 4,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 0px"
  }
}))(Badge);

export default function PdfModal({ num }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const perfil = sessionStorage.getItem("perfil");
  
  
  var toastId=null;



const handlePdf = async (e) => {
  e.preventDefault();
          try {
          // check if we already displayed a toast
          if(toastId === null){
            toastId = toast.success('Gerando ficha técnica do produto, aguarde.', {
            progress: 10000
          });
        }
        //  toast.info("Desative o ADBLOCK");
    const req = await axios.get(
      `${API.produtos_espec}?id=${num}`,
      {
        responseType: "blob",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json"
        }
      },
    );

   



                const file = new Blob([req.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setUrl(fileURL);
        toast.done(toastId);
        
        window.open(fileURL);
    


        //setOpen(true);
        

  
  } catch (err) {
    toast.error("Não foi possível gerar seu PDF");
  }
};

  return (
    <>
      <Button type="button" onClick={e => handlePdf(e)}>
        <Description />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <iframe src={url} width="800px" height="500px" />
          </div>
        </Fade>

      </Modal>
    </>
  );
}

PdfModal.propTypes = {
  num: PropTypes.number.isRequired
};
