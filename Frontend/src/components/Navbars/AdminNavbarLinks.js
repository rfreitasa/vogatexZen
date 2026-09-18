import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// Modal
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Button from "components/CustomButtons/Button.js";

import { signOut } from "../../store/modules/auth/actions";
import profileImg from "../../assets/img/faces/marc.jpg";
import { Form, Img } from "./styles.js";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import {API} from "../../config/api"


const modalStyle = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex:"9"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2, 4, 3),
    textAlign: "center",
    minWidth: "413px",
    zIndex:"8"
  },
  button: {
    backgroundColor: "transparent",
    border: "none"
  }
}));

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const modalClasses = modalStyle();
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const id = sessionStorage.getItem("id");

  //useSelector(state => state.auth.token);
  //const { email, id } = useSelector(state => state.user);

  // Submit
  const { register, handleSubmit } = useForm();

  const onSubmit = async data => {
    try {
     const response =  await axios.put(
        `${API.usuarios}/${id}`,
        {
          USUARIO_NOME: data.nome,
          USUARIO_PASSWORD: data.senha
        },
        {
          headers: {
            "x-access-token": token
          }
        }
      );

  
          if(response.status==204){
            toast.success('Senha alterada com sucesso, favor efetuar login novamente.');

            setTimeout(() => {
              dispatch(signOut());
            }, 2000);
          }
          else{
            toast.error('Erro ao alterar a senha . ');
          }
    } catch (err) {
      toast.error("Erro ao atualizar dados");
    }
  };
  // Modal
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [user, setUser] = useState([]);
  useEffect(() => {
    const req = async () => {
      try {
        const response = await axios.get(
          `${API.usuarios}/${id}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );

        const data = response.data.data;
        setUser(data[0]);
      } catch (err) {
      //  toast.error("Erro ao listar usuário");
      }
    };
    req();
  }, []);
  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch(signOut());
  };

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  return (
    <div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          style={{
            zIndex:4,
          }}
          
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper >
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      className={classes.dropdownItem}
                      onClick={handleOpen}
                    >
                      Perfil
                    </MenuItem>
                    <MenuItem
                      onClick={handleSignout}
                      className={classes.dropdownItem}
                    >
                      Sair
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={modalClasses.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={modalClasses.paper}>
            <Img src={profileImg} alt="logo" />
            <Form onSubmit={handleSubmit(onSubmit)}>
              <span>Email</span>
              <input readOnly type="email" placeholder={email} />
              <span>Nome</span>
              <input
                name="nome"
                type="text"
                ref={register}
                placeholder={user.USUARIO_NOME}
                defaultValue={user.USUARIO_NOME}
                required
              />
              <span>Senha</span>
              <input
                name="senha"
                type="password"
                ref={register({ required: true })}
                placeholder="Insira sua nova senha"
                required
                minLength="6"
                maxLength="20"
              />
              <button type="submit">Atualizar</button>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
