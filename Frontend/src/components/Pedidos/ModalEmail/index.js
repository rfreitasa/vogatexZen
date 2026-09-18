import React, { useState } from "react";
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import MailOutline from "@material-ui/icons/MailOutline";
import { ReactMultiEmail } from "react-multi-email";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { API } from "../../../config/api"
import CircularProgress from "@material-ui/core/CircularProgress";
import Badge from "@material-ui/core/Badge";
import { Button, makeStyles, Tooltip } from "@material-ui/core";






import { Form, ButtonStyled } from "./styles";
import "react-multi-email/style.css";

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
    padding: theme.spacing(0, 0, 0),
  },
  badge: {
    backgroundColor: '#4caf50',
    fontWeight: "bold",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
  },

  button: {
    position: "relative",
    minWidth: "30px",
    padding: theme.spacing(1),
  },

  spinner: {
    color: '#4caf50',
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));
const styles = {
  fontFamily: "sans-serif",
  width: "500px",
  border: "1px solid #eee",
  background: "#f3f3f3",
  padding: "25px",
  margin: "20px"
};

export default function SendEmail({ num,empresa }) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [emails, setEmail] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { register, handleSubmit } = useForm();
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  const onSubmit = async data => {
    try {
      setLoading(true);
      const e = emails.join(";");
      await axios.post(
        `${API.impressos_pedidos}/${num}/?email=${email}&empresa=${empresa}&sendto=${e}`,
        {
          assunto: data.assunto
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );
      setOpen(false);
      toast.success("Email enviado com sucesso");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Erro ao enviar email.");
    }
  };

  return (
    <div>
      <Tooltip title="Email">
        <span>
          <Button
            className={classes.button}
            onClick={handleOpen}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} className={classes.spinner} />
            ) : (
              <MailOutline />
            )}
          </Button>
        </span>
      </Tooltip>
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
          <div style={styles}>
            <h3>Informe os dados para completar o envio.</h3>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="input">
                <label>Assunto</label>
                <input type="text" required name="assunto" ref={register} />
              </div>
              <label>Emails</label>

              <ReactMultiEmail
                placeholder="Emails que receberão o pdf"
                emails={emails}
                onChange={_emails => {
                  setEmail(_emails);
                }}
                getLabel={(email, index, removeEmail) => {
                  return (
                    <div data-tag key={index}>
                      {email}
                      <span data-tag-handle onClick={() => removeEmail(index)}>
                        ×
                      </span>
                    </div>
                  );
                }}
              />

              <ButtonStyled type="submit">
                {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: '5px' }}
                  />
                )}
                {loading && <span>Enviando pedido por email</span>}
                {!loading && <span>Enviar</span>}
              </ButtonStyled>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

SendEmail.propTypes = {
  num: PropTypes.number.isRequired
};
