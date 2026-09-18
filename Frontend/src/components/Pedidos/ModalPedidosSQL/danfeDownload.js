// Create a new file, e.g., DanfeDownloadButton.js

import React from 'react';
import { FaFileAlt, FaFilePdf } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: '80%',
      height: '80%',
      overflow: 'scroll',
      minWidth: '50%',
    },
    button: {
      border: 0,
      borderRadius: '20px',
      backgroundColor: 'transparent',
      color: '#00acc1',
      padding: '5px',
      cursor: 'pointer',
    },
    text: {
      padding: '10px',
      color: '#656464',
    },
  }));
const DanfeDownloadButton = ({ onClick, fileUrl, buttonText }) => {
    const classes = useStyles();

    const handleDownload = (e) => {
    e.stopPropagation();
    window.open(fileUrl, '_blank');
  };

  return (
    <button onClick={handleDownload} className={classes.downloadButton}>
      {buttonText === 'XML' ? (
        <FaFileAlt size={24} />
      ) : (
        <FaFilePdf size={24} />
      )}
      {` Download ${buttonText}`}
    </button>
  );
};

export default DanfeDownloadButton;
