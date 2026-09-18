import React, { useState, useEffect } from "react";
import DataTable from "components/Table/Table.js";
import ModalPedidos from "components/Pedidos/ModalPedidos";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Pdf from "../../components/Pedidos/PDF";
import SendEmail from "../../components/Pedidos/ModalEmail";
import {API} from "../../config/api"

// import { View } from 'react-native';

// import { Container } from './styles';

function createData(
  numeroSistema,
  status,
  nomeEmpresa,
  nomeConta,
  emissao,
  previsao,
  prazoPagto,
  tipoFrete,
  valor,
  view,
  pdf,
  email
) {
  return {
    numeroSistema,
    status,
    nomeEmpresa,
    nomeConta,
    emissao,
    previsao,
    prazoPagto,
    tipoFrete,
    valor,
    view,
    pdf,
    email
  };
}

const rowHead = [
  {
    title: "N° do sistema",
    field: "numeroSistema",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Status",
    field: "status",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Empresa",
    field: "nomeEmpresa",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Conta",
    field: "nomeConta",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Emissão",
    field: "emissao",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Previsão",
    field: "previsao",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Prazo de Pagamento",
    field: "prazoPagto",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Frete",
    field: "tipoFrete",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Valor total",
    field: "valor",
    cellStyle: {
      fontSize: "12px"
    }
  },
  {
    title: "Visualizar",
    field: "view"
  },
  {
    title: "PDF",
    field: "pdf"
  },
  {
    title: "Email",
    field: "email"
  }
];

export default function TabelaPedidos7days() {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  const [auto, setAuto] = useState([]);
  const [loading, setLloading] = useState(true);

  useEffect(() => {
    async function handleReq() {
      try {
        let dateAtual = moment().format("YYYY-MM-DD");
        let date7days = moment()
          .subtract("2", "d")
          .format("YYYY-MM-DD");
        const response = await axios.get(
          `${API.pedidos}/?email=${email}&emissao>=${date7days}&emissao<=${dateAtual}`,
          {
            headers: {
              "x-access-token": token
            }
          }
        );

        const list = response.data.data;
        console.log('exibindo o retorno');
        console.log(list)
        
        setAuto(list);
        setLloading(false);
      } catch (error) {
        if (error.response && error.response.status === 402) {
          //token expirado
          toast.error("Sua sessão expirou, favor efetuar login");
          sessionStorage.clear();
        } else {
          setLloading(false);
          toast.error("Não encontrado nenhum lançamento no período");
        }
      }
    }
    handleReq();
  }, []);

  const rowsList = auto
    ? auto.map(item => {
        const {
          numeroSistema,
          status,
          prazoPagto,
          emissao,
          previsao,
          tipoFrete,
          itens
        } = item;
        const array = [];

        const mapitens = itens
          ? itens.map(i => {
              let result = i.valorUnitario * i.quantidade;
              array.push(result);
              return result;
            })
          : "";

        const reducer = (a, b) => a + b;

        const valor =
          array.length > 0
            ? array
                .reduce(reducer ? reducer : 0)
                .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            : null;
        const { apelido: nomeEmpresa } = item.empresa ? item.empresa : "";
        const { apelido: nomeConta } = item.conta ? item.conta : "";
        let anoEmissao = emissao.substr(0, 4);
        let mesEmissao = emissao.substr(5, 2);
        let diaEmissao = emissao.substr(8, 2);
        let emissaoFormat = `${diaEmissao}/${mesEmissao}/${anoEmissao}`;
        let anoprevisao = previsao.substr(0, 4);
        let mesprevisao = previsao.substr(5, 2);
        let diaprevisao = previsao.substr(8, 2);
        let previsaoFormat = `${diaprevisao}/${mesprevisao}/${anoprevisao}`;
        const row = createData(
          numeroSistema,
          status,
          nomeEmpresa,
          nomeConta,
          emissaoFormat,
          previsaoFormat,
          prazoPagto,
          tipoFrete,
          valor,
          <ModalPedidos data={item} />,
          <Pdf num={numeroSistema} />,
          <SendEmail num={numeroSistema} />
        );

        return row;
      })
    : [{ error: "Não encontrado" }];

  return (
    <DataTable
      rows={rowsList}
      rowHead={rowHead}
      title={"Últimos pedidos"}
      titleNoData={"Pesquise os pedidos"}
      load={loading}
      searchInput={false}
    />
  );
}
