const leadModel = require("../models/leads");
const clientesModel = require("../models/clientes");
const organizacaoModel = require("../models/organizacao");
const { successResponse, errorResponse } = require("../libs/response");
const {
  validaCadastroLeadJuridica,
  validaCadastroLeadFisica,
} = require("../validators/leads");
const { validateId } = require("../validators/common");
const { response } = require("express");

const logStruct = (func, error) => {
  return { func, file: "leadsController", error };
};

// Criar lead
const createLead = async (reqData) => {
  try {
    console.log(reqData);
    if (reqData.tipo === "JURIDICA") {
      validInput = validaCadastroLeadJuridica(reqData);
    } else {
      validInput = validaCadastroLeadFisica(reqData);
    }
    // Verifica duplicidade pelo documento (CNPJ/CPF)
    if (validInput.documentNumber) {
      const leadExists = await leadModel.getLeadByDocument(
        validInput.documentNumber
      );
      if (leadExists && leadExists.length) {
        return errorResponse(403, "leadExists");
      }
    }

    // Verifica duplicidade pelo email
    if (validInput.email) {
      const emailExists = await leadModel.getLeadByEmail(validInput.email);
      if (emailExists && emailExists.length) {
        return errorResponse(403, "emailExists");
      }
    }
    console.log(reqData);

    const limitPurchase = await leadModel.getPurchaseLimitCampaign(
      reqData.campanha_id
    );
    console.log(limitPurchase[0])
    reqData.bloqueado = limitPurchase[0].CAMPANHA_PEDIDOS_BLOQUEADOS;
    const response = await leadModel.createLead(reqData);

    if (response.id) {
      console.log(response.id);

      reqData.creditLine = limitPurchase[0].CAMPANHA_LINHA_CREDITO;
      reqData.person = response.id;
      reqData.valor = limitPurchase[0].CAMPANHA_LIMITE_PEDIDO;
      //Se for um lead de campanha atribuo o limite estipulado nele
      if (
        limitPurchase[0].CAMPANHA_LIMITE_PEDIDO &&
        limitPurchase[0].CAMPANHA_LIMITE_PEDIDO > 0
      ) {
        const insertpurchaselimit = await leadModel.insertPurchaseLimitERP(
          reqData
        );
      }

      //CRIANDO A LISTA DE CONTATOS ( SE EXISTIR)
      if (reqData.email && reqData.email.length > 0) {
        let dados = {
          id: response.id,
          tipo: "EMAIL",
          descricao: reqData.email,
          complemento: "EMAIL",
        };
        await leadModel.CreateContact(dados);
      }
      if (reqData.email_nfe != undefined && reqData.email_nfe.length > 0) {
        let dados = {
          id: response.id,
          tipo: "EMAIL_NFE",
          descricao: reqData.email_nfe,
          complemento: "EMAIL NFE",
        };
        await leadModel.CreateContact(dados);
      }
      if (reqData.telefone && reqData.telefone.length > 0) {
        let dados = {
          id: response.id,
          tipo: "TELEFONE",
          descricao: reqData.telefone,
          complemento: "TELEFONE",
        };
        await leadModel.CreateContact(dados);
      }

      return successResponse(
        201,
        response,
        { nome: reqData.nome },
        "contaCriada"
      );
    } else {
      return errorResponse(401, response.mensagem);
    }

    return successResponse(
      201,
      response,
      { nome: validInput.name },
      "leadCreated"
    );
  } catch (error) {
    console.error("error -> ", logStruct("createLead", error));
    return errorResponse(error.status, error.message);
  }
};

// Listar todos os leads
/*const fetchAllLeads = async (reqData) => {
  try {








    
    const response = await leadModel.getLeads(reqData)
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchAllLeads', error))
    return errorResponse(error.status, error.message)
  }
}*/
const fetchAllLeads = async (reqData) => {
  //COLETANDO OS DADOS DO USUARIO(PERFIL,PERMISSOES,ID ERP,ETC)
  //   const validInput = validateEmail(reqData);
  // if(validInput.email){
  const dados_usuario = await clientesModel.getUserInformation(reqData.email);
  const dados_conexao = await organizacaoModel.getConnectionData();

  if (dados_usuario[0] && dados_conexao) {
    //////////////////REGRA CLIENTES//////////////////////////
    //VENDEDOR SÓ LISTARÁ CLIENTES DELE,
    //OPERADOR LISTARÁ TODOS OS CLIENTES,
    //SUPERVISOR LISTARÁ TODOS OS CLIENTES DOS VENDEDORES DA CARTEIRA DELE
console.log(dados_usuario)
    if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
      const ArrayVendedores = await clientesModel.getArrayVendedores(
        Number(dados_usuario[0].USUARIO_ID)
      );
        console.log('é vededor')
        console.log(ArrayVendedores)
      const response = await leadModel.getLeads(
        ArrayVendedores,
        reqData
      );
      //console.log(response);
      var newarray = [];
      response.map((item) => {
        item.nome_concat = item.documentNumber ? item.name : item.name;
        newarray.push(item);
        //                                 console.log(subitem);
      });
      var ArrayOrderbyName = newarray.slice(0);
      ArrayOrderbyName.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });

      if (response && !response.length) {
        return errorResponse(404, "ClientesNotfound");
      } else {
        return successResponse(200, ArrayOrderbyName[0]);
      }
    } else if (
      dados_usuario[0].USUARIO_PERFIL === "supervisor" ||
      dados_usuario[0].USUARIO_PERFIL === "assistente"
    ) {
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
      //pega todos os IDs de seus subordinados e insere dentro de um array
      //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
      ArrayVendedores = ArrayVendedores.filter(
        (li, idx, self) =>
          self
            .map((itm) => itm.USUARIO_CONTA_ID_ERP)
            .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
      );
      const response = await leadModel.getLeads(
        ArrayVendedores,
        reqData
      );
      if (response && !response.length) {
        return errorResponse(404, "ClientesNotfound");
      } else {
        //desmontando os arrays vindo do axios.all em um só.
        var newarray = [];
        response.map((item) => {
          item.map((subitem) => {
            subitem.nome_concat = subitem.name;

            newarray.push(subitem);
            //                                 console.log(subitem);
          });
        });
        //       console.log(response);
        //ordenando por nome
        var ArrayOrderbyName = newarray.slice(0);
        ArrayOrderbyName.sort(function (a, b) {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });

        return successResponse(200, ArrayOrderbyName);
      }
    } else if (
      dados_usuario[0].USUARIO_PERFIL === "funcionario" ||
      dados_usuario[0].USUARIO_PERFIL === "ti"
    ) {
      //pega todos os IDs de seus subordinados e insere dentro de um array
      //                      const ArrayVendedores = await clientesModel.getArrayVendedores(Number(dados_usuario[0].USUARIO_ID));
      const response = await leadModel.getLeads(
        "",
        reqData
      );
      //console.log(response);
      //desmontando os arrays vindo do axios.all em um só.
      var newarray = [];
      response.map((item) => {
        item.nome_concat = item.documentNumber ? item.name : item.name;
        newarray.push(item);
        //                                 console.log(subitem);
      });
      var ArrayOrderbyName = newarray.slice(0);
      ArrayOrderbyName.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });

      if (response && !response.length) {
        return errorResponse(404, "ClientesNotfound");
      } else {
        return successResponse(200, ArrayOrderbyName);
      }
    } else if (
      dados_usuario[0].USUARIO_PERFIL === "admin_global" ||
      dados_usuario[0].USUARIO_PERFIL === "operador"
    ) {
      //const response = await clientesModel.getAllClientes('', reqData.where)
      const response = await leadModel.getLeads(
        "",
        reqData
      );
      var newarray = [];
      response.map((item) => {
        item.nome_concat = item.documentNumber ? item.name : item.name;
        newarray.push(item);
        //                                 console.log(subitem);
      });
      var ArrayOrderbyName = newarray.slice(0);
      ArrayOrderbyName.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });

      if (response && !response.length) {
        return errorResponse(404, "ClientesNotfound");
      } else {
        return successResponse(200, ArrayOrderbyName);
      }
    }
  }
  //OBTEM DADOS DA API EXTERNA
  //const response = await clientesModel.getClientes(reqData);
};

// Buscar lead por ID
const getLeadById = async (id) => {
  try {
    const validInput = validateId({ id });
    const response = await leadModel.getLeadById(validInput.id);

    if (!response || !response.length) {
      return errorResponse(404, "leadNotFound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("getLeadById", error));
    return errorResponse(error.status, error.message);
  }
};

// Atualizar lead
const updateLead = async (id, reqData) => {
  try {
    const validInput = validateId({ id });

    // Verificar se o lead existe
    const leadExists = await leadModel.getLeadById(validInput.id);
    if (!leadExists || !leadExists.length) {
      return errorResponse(404, "leadNotFound");
    }

    const response = await leadModel.updateLead(validInput.id, reqData);

    if (response === "ok") {
      return successResponse(204);
    } else {
      return errorResponse(403, "updateError");
    }
  } catch (error) {
    console.error("error -> ", logStruct("updateLead", error));
    return errorResponse(error.status, error.message);
  }
};

// Deletar lead
const deleteLead = async (id) => {
  try {
    const validInput = validateId({ id });

    // Verificar se o lead existe
    const leadExists = await leadModel.getLeadById(validInput.id);
    if (!leadExists || !leadExists.length) {
      return errorResponse(404, "leadNotFound");
    }

    const response = await leadModel.deleteLead(validInput.id);

    if (response === "ok") {
      return successResponse(204);
    } else {
      return errorResponse(403, "deleteError");
    }
  } catch (error) {
    console.error("error -> ", logStruct("deleteLead", error));
    return errorResponse(error.status, error.message);
  }
};

// Converter lead em cliente
const convertLeadToClient = async (id) => {
  try {
    const validInput = validateId({ id });

    // Verificar se o lead existe
    const leadExists = await leadModel.getLeadById(validInput.id);
    if (!leadExists || !leadExists.length) {
      return errorResponse(404, "leadNotFound");
    }

    // Verificar se já é cliente
    if (leadExists[0].status === "client") {
      return errorResponse(409, "alreadyClient");
    }

    const response = await leadModel.convertLeadToClient(validInput.id);

    if (response === "ok") {
      return successResponse(200, null, null, "leadConverted");
    } else {
      return errorResponse(403, "conversionError");
    }
  } catch (error) {
    console.error("error -> ", logStruct("convertLeadToClient", error));
    return errorResponse(error.status, error.message);
  }
};

// Buscar leads com filtros
const searchLeads = async (filters) => {
  try {
    const response = await leadModel.searchLeads(filters);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("searchLeads", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  createLead,
  fetchAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  convertLeadToClient,
  searchLeads,
};
