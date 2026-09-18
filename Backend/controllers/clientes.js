const axios = require("axios");
const clientesModel = require("../models/clientes");
const organizacaoModel = require("../models/organizacao");

const { successResponse, errorResponse } = require("../libs/response");
const {
  validaCadastroContaFisica,
  validaCadastroContaJuridica,
  validateVendedores,
} = require("../validators/clientes");
const { validateId } = require("../validators/common");

const logStruct = (func, error) => {
  return { func: func, file: "ClientesController", error };
};

//POST
const createConta = async (reqData) => {
  try {
    if (reqData.obervacoes && reqData.observacoes.length > 1) {
      reqData.observacoes = reqData.observacoes.split("\n").join("\r\n"); // troco os caracteres "&s= por ; e altero
    }
    var validInput;
    if (reqData.tipo === "JURIDICA") {
      validInput = validaCadastroContaJuridica(reqData);
    } else {
      validInput = validaCadastroContaFisica(reqData);
    }
    const sintaxe =
      reqData.tipo == "JURIDICA"
        ? "q=documentNumber" + encodeURIComponent("==" + reqData.cnpj)
        : "q=documentNumber" + encodeURIComponent("==" + reqData.cpf);
    //Verifica se a conta ja existe "consulta pelo nome".
    const contaExists = await clientesModel.getContas(
      sintaxe,
      reqData.token_erp
    );
    if (contaExists && contaExists.length) {
      //   console.log(contaExists)
      return errorResponse(403, "Conta já existe");
    }

    const response = await clientesModel.criaConta(reqData);

    if (response.id) {
      //CRIANDO A LISTA DE CONTATOS ( SE EXISTIR)
      if (reqData.email && reqData.email.length > 0) {
        let dados = {
          id: response.id,
          tipo: "EMAIL",
          descricao: reqData.email,
          complemento: "EMAIL",
        };
        await clientesModel.CreateContact(dados);
      }
      if (reqData.email_nfe != undefined && reqData.email_nfe.length > 0) {
        let dados = {
          id: response.id,
          tipo: "EMAIL_NFE",
          descricao: reqData.email_nfe,
          complemento: "EMAIL NFE",
        };
        await clientesModel.CreateContact(dados);
      }
      if (reqData.telefone && reqData.telefone.length > 0) {
        let dados = {
          id: response.id,
          tipo: "TELEFONE",
          descricao: reqData.telefone,
          complemento: "TELEFONE",
        };
        await clientesModel.CreateContact(dados);
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
  } catch (error) {
    console.error("error -> ", logStruct("createconta", error));
    return errorResponse(error.status, error.message);
  }
};

const createContato = async (reqData) => {
  try {
    const response = await clientesModel.CreateContact(reqData);
    if (response.id) {
      return successResponse(
        201,
        response,
        { nome: reqData.nome },
        "contatoCriado"
      );
    } else {
      
      return errorResponse(401, response.mensagem);
    }
  } catch (error) {
    console.error("error -> ", logStruct("createcontato", error));
    return errorResponse(error.status, error.message);
  }
};

const updateContato = async (reqData) => {
  try {
    var validInput = "";
    if (reqData.descricao) {
      const response = await clientesModel.updateContato(reqData);
      if (response) {
        return successResponse(204, "Contato alterada");
      } else {
        return errorResponse(404, "Contato não encontrado");
      }
    }
    return errorResponse(404, "Erro ao alterar");
  } catch (error) {
    console.error("error -> ", logStruct("updateContato", error));
    return errorResponse(error.status, error.message);
  }
};

//GET
const fetchAllClientsWithoutParameters = async (reqData) => {
  //COLETANDO OS DADOS DO USUARIO(PERFIL,PERMISSOES,ID ERP,ETC)
  //   const validInput = validateEmail(reqData);
  // if(validInput.email){
  //   console.log(reqData)
  const response = await clientesModel.getAllClientesNoParameters(
    reqData.where,
    reqData.token_erp
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
    return successResponse(200, ArrayOrderbyName);
  }
};
const fetchAllClientes = async (reqData) => {
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
    if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
      const ArrayVendedores = await clientesModel.getArrayVendedores(
        Number(dados_usuario[0].USUARIO_ID)
      );
      //   console.log(reqData)
      const response = await clientesModel.getAllClientes(
        ArrayVendedores,
        reqData.where,
        reqData.token_erp
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
      const response = await clientesModel.getAllClientes(
        ArrayVendedores,
        reqData.where,
        reqData.token_erp
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
      const response = await clientesModel.getAllClientes(
        "",
        reqData.where,
        reqData.token_erp
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
      const response = await clientesModel.getAllClientes(
        "",
        reqData.where,
        reqData.token_erp
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

const fetchCliente = async (reqData) => {
  try {
    // const validInput = validateId(reqData);
    const response = await clientesModel.getContaById(reqData);

    if (response && !response[0].id) {
      return errorResponse(404, "ClientesNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchClientes", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchInfoComerciais = async (reqData) => {
  try {
    const response = await clientesModel.getInfoComerciais(
      Number(reqData.conta_cliente),
      reqData.token_erp
    );
    if (response && !response.length) {
      return errorResponse(404, "InfoComerciaisnotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("InfoComerciaisnotfound", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchAllClientesByName = async (reqData) => {
  try {
    const response = await clientesModel.getContaByName(reqData.nome);

    if (response && !response.length) {
      return errorResponse(404, "ContaNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchClientes", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchContatos = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await clientesModel.getContatosByClienteId(
      validInput.id,
      reqData.token_erp
    );
    if (response && !response.length) {
      return errorResponse(404, "ContatosNotfound");
    }
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchContatos", error));
    return errorResponse(error.status, error.message);
  }
};

const removeContatos = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await clientesModel.removeContato(
      reqData.id,
      reqData.idcontato
    );
    return successResponse(204, null, null, "removido");
  } catch (error) {
    return errorResponse(error.status, error.message);
  }
};

const fetchAllTransportadoras = async (reqData) => {
  try {
    const response = await clientesModel.getTransportadoras(
      reqData.where,
      reqData.token_erp
    );

    if (response && !response.length) {
      return errorResponse(404, "TransportadorasNotfound");
    } else {
      return successResponse(200, response);
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchTransportadoras", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchTransportadorasByClienteId = async (reqData) => {
  try {
    const response = await clientesModel.getTransportadorasByCliente(
      reqData.cliente_id
    );

    if (response && !response.length) {
      return errorResponse(404, "TransportadorasNotfound");
    } else {
      return successResponse(200, response);
    }
  } catch (error) {
  
    return errorResponse(error.status, error.message);
  }
};

const fetchAllVendedores = async (reqData) => {
  try {
    const validInput = validateVendedores(reqData);
    const dados_usuario = await clientesModel.getUserInformation(
      validInput.email
    );
    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      //////////////////REGRA CLIENTES//////////////////////////
      //VENDEDOR SÓ LISTARÁ CLIENTES DELE,
      //OPERADOR LISTARÁ TODOS OS CLIENTES,
      //SUPERVISOR LISTARÁ TODOS OS CLIENTES DOS VENDEDORES DA CARTEIRA DELE
      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        reqData.id = dados_usuario[0].USUARIO_CONTA_ID_ERP;
        const response = await clientesModel.getContas(
          `q=id==${dados_usuario[0].USUARIO_CONTA_ID_ERP};tags=='salesPerson'`,
          reqData.token_erp
        );

        if (response && !response.length) {
          return errorResponse(404, "VendedoresNotfound");
        } else {
          return successResponse(200, response);
        }
      } else {
        let VendedoresString = "";
        var ArrayVendedores = "";
        if (
          dados_usuario[0].USUARIO_PERFIL === "assistente" ||
          dados_usuario[0].USUARIO_PERFIL === "supervisor"
        ) {
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_ID)
          );
        } else {
          ArrayVendedores = await clientesModel.getArrayVendedoresOperador(
            Number(dados_usuario[0].USUARIO_ID)
          );
        }
        for (index = 0; index < ArrayVendedores.length; index++) {
          if (index == 0) {
            VendedoresString =
              VendedoresString +
              `q=tags=='salesperson';(id==${dados_usuario[0].USUARIO_CONTA_ID_ERP},id==${ArrayVendedores[index].USUARIO_CONTA_ID_ERP}`;
          } else {
            VendedoresString =
              VendedoresString +
              `,id==${ArrayVendedores[index].USUARIO_CONTA_ID_ERP}`;
          }
        }

        VendedoresString = VendedoresString + ")";
        const response = await clientesModel.getContas(
          `${VendedoresString}`,
          reqData.token_erp
        );

        //        console.log(response)
        if (response && !response.length) {
          return errorResponse(404, "VendedoresNotfound");
        } else {
          return successResponse(200, response);
        }
      }
    }

    if (response && !response.length) {
      return errorResponse(404, "TransportadorasNotfound");
    } else {
      return successResponse(200, response);
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchTransportadoras", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchContatosById = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await clientesModel.getContatosByContatoId(
      validInput.id,
      validInput.idcontato
    );
    if (!response) {
      return errorResponse(404, "ContatosNotfound");
    }
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchContatos", error));
    return errorResponse(error.status, error.message);
  }
};

const updateCliente = async (reqData) => {
  try {
    var validInput = "";
    if (reqData.tipo === "JURIDICA") {
      validInput = validaCadastroContaJuridica(reqData);
    } else {
      validInput = validaCadastroContaFisica(reqData);
    }

    const response = await clientesModel.updateCliente(reqData);
    if (response) {
      return successResponse(204, "Conta alterada");
    } else {
      return errorResponse(404, "Conta não encontrada");
    }
  } catch (error) {
    console.error("error -> ", logStruct("updateClientes", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchtaxProfile = async (reqData) => {
  try {
  
    const response = await clientesModel.getTaxProfile(reqData.token_erp);

    if (response && !response.length) {
      return errorResponse(404, "ContaNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchClientes", error));
    return errorResponse(error.status, error.message);
  }
};
const fetchAddress = async (reqData) => {
  try {
    const response = await clientesModel.getClientAddress(
      Number(reqData.id),
      reqData.token_erp
    );
   
    if (response && !response.length) {
      return errorResponse(404, "infoaddress");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("infoaddressnotfound", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchFiles = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await clientesModel.getFilesByClientId(
      validInput.id,
      reqData.token_erp
    );
    if (response && !response.length) {
      return errorResponse(404, "FIlesNotfound");
    }
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchFiles", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchClientErpInfo = async (reqData) => {
  try {
    const response = await clientesModel.getClientErpInformations(reqData);
    if (response && !response.documentType.length) {
      return errorResponse(404, "Infonotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("Infonotfound", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  fetchFiles,
  fetchAllClientes,
  fetchCliente,
  fetchContatos,
  fetchContatosById,
  updateCliente,
  createConta,
  createContato,
  fetchAllTransportadoras,
  fetchAllVendedores,
  fetchAllClientesByName,
  fetchTransportadorasByClienteId,
  fetchInfoComerciais,
  removeContatos,
  updateContato,
  fetchtaxProfile,
  fetchAddress,
  fetchClientErpInfo,
  fetchAllClientsWithoutParameters,
};
