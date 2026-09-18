
import React from "react";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Button } from "./styles";
import { API } from "../../../config/api"
import pdf from "assets/pdf.png";



export default function Pdf({ num }) {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const handlePdf = async () => {
    try {
      toast.success("Aguarde seu PDF está sendo gerado.");
      const req = await axios.get(`${API.romaneio}/${num}/?email=${email}`,
        {
          responseType: "blob",

          headers: {
            "x-access-token": token
          }
        });

      //const file = new Blob([req], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(req.data);
      window.open(fileURL);
    } catch (err) {
      toast.error("Não foi possível gerar seu PDF");
    }
  };
  return (

    <>
      <a
        onClick={(e) => handlePdf(e)}
        target="_blank"
        download={`danfe.pdf`}
        style={{ textDecoration: 'none', marginBottom: '10px' }}
      >
        <img
          src={pdf}
          alt="Download Romaneio"
          style={{ width: '44px', height: '44px' }}
        />
        <div style={{ fontSize: '12px' }}>Romaneio</div>
      </a>
    </>

  );
}

Pdf.propTypes = {
  num: PropTypes.number.isRequired
};
