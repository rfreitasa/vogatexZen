const dashboardModel = require("../models/dashboard");
const usuariosModel = require("../models/usuarios");
const pedidosModel = require("../models/pedidos");

const clientesModel = require("../models/clientes");
const organizacaoModel = require("../models/organizacao");
const { successResponse, errorResponse } = require("../libs/response");
const { validateEmail } = require("../validators/common");
const { validaTotFaturado } = require("../validators/dashboard");
const { validatePedidos } = require("../validators/pedidos");

const logStruct = (func, error) => {
  return { func: func, file: "dashboardController", error };
};

async function ObtemdadosPedidos(reqData) {
  const response = await pedidosModel.getpedidos(reqData);

  var PedidoSeparado = [];

  //    console.log(response);
  var PedidoSeparado = [];

  for (const item of response) {
    var workflow = "";
    if (item.sale_status == "PREPARED" || item.status == "PREPARED") {
      if (item.workpiece && item.workpiece.workflowNode.description) {
        workflow = item.workpiece.workflowNode.description;
      } else {
        workflow = item.workflowNode_description;
      }
    } else {
      workflow = item.sale_status ? item.sale_status : item.status;
    }
    const pedido = {
      NUMERO_SISTEMA: item.sale_id ? item.sale_id : item.id,
      REFERENCIA: item.sale_code ? item.sale_code : item?.code,
      STATUS: item.sale_status ? item.sale_status : item.status,
      EMPRESA: item.company_code ? item.company_code : item.company.code,
      APELIDO: item.person_name
      ? item.person_name
      : item.person.name
      ? item.person.name
      : item.person.fantasyName,
      PEDIDO_EMISSAO: item.sale_date ? item.sale_date : item.date,
      CLIENTE_CGC: "",
      CLIENTE_COD: item.person_id ? item.person_id : item.person.id,
      PEDIDO_REFERENCIA: "",
      PEDIDO_VALOR: item.sum_totalValue
        ? item.sum_totalValue
        : item.totalValue,
      NOTA_FISCAL_NUMERO: "",
      NOTA_FISCAL_EMISSAO: "",
      NOTA_FISCAL_VALOR: "",
      ROMANEIO_NUMERO: "",
      STATE_NAME: item.state_code,
      CITY_NAME: item.city_name,
      PEDIDO_OBSERVACAO: item.properties ? item.properties.comments : "",
      TRANSPORTADORA_NOME: item.shipping_fantasyName
        ? item.shipping_fantasyName
        : item?.personShipping?.name,
      VENDEDOR_APELIDO: item.salesperson_fantasyName
        ? item.salesperson_fantasyName
        : item?.personSalesperson?.fantasyName
        ? item?.personSalesperson?.fantasyName
        : item?.personSalesperson?.name,
      VENDEDOR_ID: item.salesperson_id
        ? item.salesperson_id
        : item.personSalesperson?.id,
      WORKFLOW: workflow,
      itens: "", // Adiciona o item atual ao array de itens
    };
    // Verifica se já existe um pedido com o mesmo ID
    const existingPedido = PedidoSeparado.find(
      (p) => p.NUMERO_SISTEMA === item.sale_id
    );

    if (existingPedido) {
      // Se existir, apenas adicione o item aos itens existentes
      existingPedido.itens.push(item);
    } else {
      // Se não existir, adicione o novo pedido ao array
      PedidoSeparado.push(pedido);
    }
  }

  //Aplicando filtros especificos para o dashboard
  //filtrar o total de pedidos faturados:

  // Inicializando objetos para armazenar os totais por status e os agrupamentos por vendedor
  const statusVenda = {
    FINISHED: { valor: 0, pedidos: 0 },
    PREPARING: { valor: 0, pedidos: 0 },
    PREPARED: { valor: 0, pedidos: 0 },
    APPROVED: { valor: 0, pedidos: 0 },
    PICKING: { valor: 0, pedidos: 0 },
    LACK: { valor: 0, pedidos: 0 },
    CANCELED: { valor: 0, pedidos: 0 },
    //  MERGED: { valor: 0, pedidos: 0 },
  };

  const vendedorGroups = {};
  const clienteGroups = {};
  const transportadoraGroups = {};
  const estadoCidadesMap = {}; // Mapa para armazenar dados de estado e suas cidades

  // Função para processar os dados
  PedidoSeparado.forEach((pedido) => {
    const status = pedido.STATUS;
    const valor = pedido.PEDIDO_VALOR > 0 ? pedido.PEDIDO_VALOR : 0;
    const vendedor = pedido.VENDEDOR_APELIDO;
    const cliente = pedido.CLIENTE_COD + " - " + pedido.APELIDO;
    const transportadora = pedido.TRANSPORTADORA_NOME;

    const estado = pedido.STATE_NAME;
    const cidade = pedido.CITY_NAME;
    if (pedido != "MERGED") {
      // Verifica se o estado já existe no mapa
      if (pedido.STATUS == "FINISHED") {
        if (!estadoCidadesMap[estado]) {
          estadoCidadesMap[estado] = {
            quantidadeTotal: 0,
            cidades: {},
          };
        }

        // Adiciona a quantidade ao total do estado
        estadoCidadesMap[estado].quantidadeTotal += valor;

        // Verifica se a cidade já existe para esse estado
        if (!estadoCidadesMap[estado].cidades[cidade]) {
          estadoCidadesMap[estado].cidades[cidade] = {
            valor: 0,
          };
        }

        // Adiciona a quantidade da cidade
        estadoCidadesMap[estado].cidades[cidade].valor += valor;
      }

      // Atualizando o total por status de forma dinâmica
      if (!statusVenda[status]) {
        statusVenda[status] = { valor: 0, pedidos: 0 };
      }

      statusVenda[status].valor += valor;
      statusVenda[status].pedidos += 1;

      // Agrupando por vendedor e status de forma dinâmica
      if (!vendedorGroups[vendedor]) {
        vendedorGroups[vendedor] = {};
      }
      if (!vendedorGroups[vendedor][status]) {
        vendedorGroups[vendedor][status] = { valor: 0, pedidos: 0 };
      }
      vendedorGroups[vendedor][status].valor += valor;
      vendedorGroups[vendedor][status].pedidos += 1;

      // Agrupando por transportadora e status de forma dinâmica
      if (!transportadoraGroups[transportadora]) {
        transportadoraGroups[transportadora] = {};
      }
      if (!transportadoraGroups[transportadora][status]) {
        transportadoraGroups[transportadora][status] = { valor: 0, pedidos: 0 };
      }
      transportadoraGroups[transportadora][status].valor += valor;
      transportadoraGroups[transportadora][status].pedidos += 1;

      // Agrupando por cliente e status de forma dinâmica
      if (!clienteGroups[cliente]) {
        clienteGroups[cliente] = {};
      }
      if (!clienteGroups[cliente][status]) {
        clienteGroups[cliente][status] = { valor: 0, pedidos: 0 };
      }
      clienteGroups[cliente][status].valor += valor;
      clienteGroups[cliente][status].pedidos += 1;
    }
  });
  // Exibindo os resultados
  // console.log('Agrupamento por vendedor:', vendedorGroups);
  // console.log('Agrupamento por cliente:', transportadoraGroups);
  // console.log('Agrupamento por cliente:', clienteGroups);

  const dadosDashboard = {
    estadoCidadesMap,
    statusVenda,
    vendedorGroups,
    transportadoraGroups,
    clienteGroups,
  };

  if (response && !response.length) {
    return "PedidoNotfound";
  } else {
    return dadosDashboard;
  }
}

const getMetas = async (reqData) => {
  try {
    const response = await usuariosModel.getUserByIdERP(reqData.id_erp);
    reqData.id_erp =
      response && response[0].USUARIO_PERFIL != "vendedor" ? 2 : reqData.id_erp;
    const metaDoUsuario = await dashboardModel.getSalesTarget(reqData);
    return metaDoUsuario
      ? successResponse(200, metaDoUsuario)
      : errorResponse(404, "Meta não encontrada");
  } catch (error) {
    console.error("error -> ", logStruct("getMetas", error));
    return errorResponse(error.status, error.message);
  }
};

const getVlVendasMes = async (reqData) => {
  try {
    const validInput = validateEmail(reqData);

    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        const ArrayVendedores = await clientesModel.getArrayVendedores(
          Number(dados_usuario[0].USUARIO_ID)
        );

        reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
          encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
        );
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "supervisor" ||
        dados_usuario[0].USUARIO_PERFIL === "assistente"
      ) {
        //pega todos os IDs de seus subordinados e insere dentro de um array
        var ArrayVendedores = "";
        if (dados_usuario[0].USUARIO_PERFIL === "assistente") {
          const dados_usuario = await clientesModel.getUserInformation(
            reqData.email
          );
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_CONTA_SUPERVISOR_ID)
          );
        } else {
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_ID)
          );
        }

        //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
        ArrayVendedores = ArrayVendedores.filter(
          (li, idx, self) =>
            self
              .map((itm) => itm.USUARIO_CONTA_ID_ERP)
              .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
        );
        //console.log(ArrayVendedores)

        if (!reqData.where.SALESPERSON_IDS) {
          reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
            encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
          );
        }
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "operador" ||
        dados_usuario[0].USUARIO_PERFIL === "funcionario" ||
        dados_usuario[0].USUARIO_PERFIL === "ti" ||
        dados_usuario[0].USUARIO_PERFIL === "admin_global"
      ) {
        //nao deve filtrar os vendedores pois precisa retornar todos, mesmo os que nao estao cadastrados no salesbreath
        //           console.log('000000000000000000000000000000')
        //const dados_usuario = await clientesModel.getUserInformation(reqData.email);
        // var ArrayVendedores = "";
        //pega todos os IDs de seus subordinados e insere dentro de um array
        /*    ArrayVendedores = await clientesModel.getArrayVendedoresOperador(
          Number(dados_usuario[0].USUARIO_ID)
        );

        //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
        ArrayVendedores = ArrayVendedores.filter(
          (li, idx, self) =>
            self
              .map((itm) => itm.USUARIO_CONTA_ID_ERP)
              .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
        );
        reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
          encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
        );*/
      }
    }

    const response = await dashboardModel.getvlvendasmes(reqData);
    //console.log(response);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("getvlvendasmes", error));
    return errorResponse(error.status, error.message);
  }
};

const getQtdVendasMes = async (reqData) => {
  try {
    const validInput = validatePedidos(reqData);

    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      //////////////////REGRA PEDIDOS//////////////////////////
      //VENDEDOR SÓ LISTARÁ PEDIDOS DELE,
      //OPERADOR LISTARÁ TODOS OS PEDIDOS,
      //SUPERVISOR LISTARÁ TODOS OS PEDIDOS DOS VENDEDORES DA CARTEIRA DELE

      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        const ArrayVendedores = await clientesModel.getArrayVendedores(
          Number(dados_usuario[0].USUARIO_ID)
        );
        //   console.log(ArrayVendedores);

        //        console.log(ArrayVendedores)

        reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
          encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
        );

        const response = await ObtemdadosPedidos(reqData);

        if (response && response == "PedidoNotfound") {
          return errorResponse(404, "PedidoNotfound");
        } else {
          return successResponse(200, response);
        }
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "supervisor" ||
        dados_usuario[0].USUARIO_PERFIL === "assistente"
      ) {
        //pega todos os IDs de seus subordinados e insere dentro de um array
        var ArrayVendedores = "";
        if (dados_usuario[0].USUARIO_PERFIL === "assistente") {
          const dados_usuario = await clientesModel.getUserInformation(
            reqData.email
          );
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_CONTA_SUPERVISOR_ID)
          );
        } else {
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_ID)
          );
        }

        //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
        ArrayVendedores = ArrayVendedores.filter(
          (li, idx, self) =>
            self
              .map((itm) => itm.USUARIO_CONTA_ID_ERP)
              .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
        );
        //console.log(ArrayVendedores)

        if (!reqData.where.SALESPERSON_IDS) {
          reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
            encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
          );
        }

        const response = await ObtemdadosPedidos(reqData);

        if (response && response == "PedidoNotfound") {
          return successResponse(200, []);
        } else {
          return successResponse(200, response);
        }
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "operador" ||
        dados_usuario[0].USUARIO_PERFIL === "funcionario" ||
        dados_usuario[0].USUARIO_PERFIL === "ti" ||
        dados_usuario[0].USUARIO_PERFIL === "admin_global"
      ) {
        //           console.log('000000000000000000000000000000')
        //const dados_usuario = await clientesModel.getUserInformation(reqData.email);
        var ArrayVendedores = "";
        //pega todos os IDs de seus subordinados e insere dentro de um array
        /*   ArrayVendedores = await clientesModel.getArrayVendedoresOperador(
          Number(dados_usuario[0].USUARIO_ID)
        );
*/
        //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
        /*      ArrayVendedores = ArrayVendedores.filter(
          (li, idx, self) =>
            self
              .map((itm) => itm.USUARIO_CONTA_ID_ERP)
              .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
        );
*/
        const response = await ObtemdadosPedidos(reqData);

        if (response && response == "PedidoNotfound") {
          return successResponse(200, []);
        } else {
          return successResponse(200, response);
        }
      }
    }

    const response = await dashboardModel.getqtdvendasmes(
      validInput.conta_id,
      validInput.perfil
    );
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("getvlvendasmes", error));
    return successResponse(200, []);
  }
};

const getTotalFaturado = async (reqData) => {
  try {
    const validInput = validaTotFaturado(reqData);
    const DadosDoUsuario = await usuariosModel.getUserDetailsByNameOrEmail(
      validInput.email
    );
    if (DadosDoUsuario && DadosDoUsuario.length) {
      validInput.conta_id = DadosDoUsuario[0].USUARIO_CONTA_ID_ERP;
      validInput.perfil = DadosDoUsuario[0].USUARIO_PERFIL;
    }

    if (reqData.periodo === "1m") {
      //1 mes
      const response = await dashboardModel.gettotfaturado_1mes(
        validInput.conta_id,
        validInput.perfil
      );
      return successResponse(200, response);
    } else if (reqData.periodo === "8s") {
      //8 semanas
      const response = await dashboardModel.gettotfaturado_8s(
        validInput.conta_id,
        validInput.perfil
      );
      return successResponse(200, response);
    } else if (reqData.periodo === "12m") {
      const response = await dashboardModel.gettotfaturado_12m(
        validInput.conta_id,
        validInput.perfil
      );
      return successResponse(200, response);
    } else if (reqData.periodo === "tot") {
      //total geral
      const response = await dashboardModel.gettotfaturado(
        validInput.conta_id,
        validInput.perfil
      );
      return successResponse(200, response);
    } else {
      return errorResponse(404, "Dados não encontrados");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("getvlvendasmes", error));
    return errorResponse(error.status, error.message);
  }
};
/*
const fetchdashboard = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await dashboardModel.getdashboardById(validInput.id);

    if (response && !response.length) {
        return errorResponse(404, 'dashboardNotfound');
      }
  

    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchdashboard', error))
    return errorResponse(error.status, error.message);
  }
};

const fetchdashboardERP = async (reqData) => {
  try {
    const response = await dashboardModel.getdashboardERP();

    if (response && !response.length) {
        return errorResponse(404, 'dashboardNotfound');
      }
  

    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchdashboard', error))
    return errorResponse(error.status, error.message);
  }
 };
*/
module.exports = {
  getVlVendasMes,
  getQtdVendasMes,
  getTotalFaturado,
  getMetas,
};
