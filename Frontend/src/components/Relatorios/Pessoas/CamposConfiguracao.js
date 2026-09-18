import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { API } from "../../../config/api";
import { toast } from 'react-toastify';
import Grid from "@material-ui/core/Grid";

import "./styles.css";

const CamposConfiguracao = ({ isOpen, onRequestClose, opcoesCampos, escolhasIniciais, lista }) => {
  const { handleSubmit, control } = useForm();
  const [escolhas, setEscolhas] = useState(escolhasIniciais);
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const usuario = sessionStorage.getItem("id");

  useEffect(() => {
    if (isOpen) {
      const escolhasSalvas = JSON.parse(sessionStorage.getItem(lista) || "[]");
      const escolhasIniciais = {};

      opcoesCampos.forEach((campo) => {
        const escolhaSalva = escolhasSalvas.find((escolha) => escolha.campo === campo.campo && escolha.status == "1");
        // Ajuste para considerar a diferença entre 1/0 e true/false
        escolhasIniciais[campo.campo] = escolhaSalva || campo.default == 's' ? escolhaSalva && escolhaSalva.status == "1" || campo.default == 's' : false;
      });

      setEscolhas(escolhasIniciais);
    }
  }, [isOpen, opcoesCampos]);

  const handleCheckboxChange = (campo) => {
    setEscolhas((prevEscolhas) => ({
      ...prevEscolhas,
      [campo]: !prevEscolhas[campo],
    }));
  };


  const formatarDados = () => {
    return opcoesCampos.map((campo) => ({
      campo: campo.campo,
      referencia: lista,
      // Ajuste para enviar 0 ou 1 em vez de true ou false
      status: escolhas[campo.campo] ? "1" : "0",
    }));
  };

  const onSubmit = async () => {
    const dadosFormatados = formatarDados();
    console.log(dadosFormatados)
    try {
      const response = await axios.post(
        `${API.salvafiltro}?email=${email}`,
        { campos: dadosFormatados, usuario, referencia: lista },
        {
          headers: {
            "x-access-token": token
          }
        }
      );

      // Atualiza o localStorage com as novas escolhas
      sessionStorage.setItem(lista, JSON.stringify(dadosFormatados));

      toast.success('Configurações salvas com sucesso!');

    } catch (error) {
      toast.error('Configurações não foram salvas!');

      //      console.error("Erro ao enviar os dados:", error);
    }

    onRequestClose();
  };

  return (


    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Configurar Campos do Relatório"
      className="modal-content"
      overlayClassName="modal-overlay"
      style={{
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          padding: "20px",
          width: "90%",
          maxWidth: "70%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className="modal-header">
        <h2 className="modal-title">Escolha os Campos a Exibir</h2>
      </div>
      <div className="modal-content-container"> {/* Novo contêiner adicionado */}
        <div className="header-divider"></div>

        <form onSubmit={handleSubmit(() => onSubmit())} style={{ width: "100%" }}>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Grid container spacing={1}>
              {opcoesCampos.map((campo, index) => (
                <Grid key={campo.campo} item xs={12} sm={12} lg={4}>
                  <div className="campo-checkbox">
                    <label>
                      <Controller
                        as={<input type="checkbox" className="checkbox-input" />}
                        name={campo.campo}
                        control={control}
                        onChange={() => handleCheckboxChange(campo.campo)}
                        checked={!!escolhas[campo.campo]}
                      />
                      <span className="checkbox-label">{campo.label}</span>
                    </label>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
          <button
            type="submit"
            className="salvar-btn"
            style={{ alignSelf: "flex-end", marginTop: "10px" }}
          >
            Salvar Configurações
          </button>
        </form>
      </div>
      <button className="modal-close-btn" onClick={onRequestClose}>
        &times;
      </button>
    </Modal>);
};

export default CamposConfiguracao;
