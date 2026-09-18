import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Modal, Backdrop, CircularProgress, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PhotoCamera, Close as CloseIcon, NavigateBefore, NavigateNext } from '@material-ui/icons';
import { API } from '../../../config/api';
import { WhatsappShareButton } from 'react-share';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    position: 'relative',
    width: '90%', // Ocupar 90% da largura
    height: '90%', // Ocupar 90% da altura
    overflow: 'hidden',
  },
  button: {
    position: 'relative',
    minWidth: '30px',
    padding: theme.spacing(1),
  },
  spinner: {
    color: '#4caf50',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  image: {
    width: '100%', // Ocupar 100% da largura do modal
    height: '100%', // Ocupar 100% da altura do modal
    objectFit: 'cover', // Manter a proporção da imagem
    cursor: 'zoom-in',
  },
  zoomedImage: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1300,
    maxWidth: '90%',
    maxHeight: '90%',
    cursor: 'zoom-out',
  },
  navigation: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
    background: 'rgba(255, 255, 255, 0.7)',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1300,
  },
  whatsappButton: {
    position: 'absolute',
    top: '10px', // Manter a distância do topo
    right: '10px',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 2,
  },
  shareContainer: {
    position: 'absolute',
    bottom: '10px', // Posicionar abaixo da imagem
    right: '10px',
    zIndex: 2,
  },
}));


export default function ImagesProducts({ num,grade,mestre,mestre_codigo }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagens, setImagens] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setZoomedImage(null); // Reset zoomed image
  };

  const handlePdf = async () => {
    setLoading(true);
    try {
      const req = await axios.get(`${API.external_imagens}?item_id=${num}&grade=${grade}&mestre_id=${mestre}&mestre_codigo=${mestre_codigo}&type=carrosel`, {
        headers: {
          'x-access-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });

      const new_img = req.data.data.map((item) => ({
        url: item.url,
        nome: item.name,
      }));

      setImagens(new_img);
      handleOpen();
    } catch (err) {
      toast.error('Nenhuma imagem encontrada.');
    } finally {
      setLoading(false);
    }
  };

  const handleZoom = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagens.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imagens.length) % imagens.length);
  };

  return (
    <>
      <Tooltip title="Imagens">
        <span>
          <Button className={classes.button} onClick={handlePdf} disabled={loading}>
            {loading ? <CircularProgress size={24} className={classes.spinner} /> : <PhotoCamera />}
          </Button>
        </span>
      </Tooltip>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <div className={classes.paper}>
          <IconButton
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          {loading ? (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {imagens.length > 0 && (
                <>
                  <IconButton className={classes.navigation} onClick={prevImage}>
                    <NavigateBefore />
                  </IconButton>
                  <img
                    src={imagens[currentIndex].url}
                    alt={imagens[currentIndex].nome}
                    className={classes.image}
                    onClick={() => handleZoom(imagens[currentIndex].url)}
                  />
                  <p>{imagens[currentIndex].nome}</p>

                  <div className={classes.shareContainer}>
                    <WhatsappShareButton url={imagens[currentIndex].url} title={imagens[currentIndex].nome}>
                      <Button variant="contained" color="primary">
                        Compartilhar no WhatsApp
                      </Button>
                    </WhatsappShareButton>
                  </div>

                  <IconButton className={classes.navigation} style={{ right: 0 }} onClick={nextImage}>
                    <NavigateNext />
                  </IconButton>
                </>
              )}
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={!!zoomedImage}
        onClose={handleCloseZoom}
        className={classes.modal}
        BackdropComponent={Backdrop}
      >
        <img src={zoomedImage} alt="Zoomed" className={classes.zoomedImage} />
      </Modal>
    </>
  );
}

ImagesProducts.propTypes = {
  num: PropTypes.number.isRequired,
};
