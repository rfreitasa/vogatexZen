const db = require("../models/db");
const moment = require("moment");
const axios = require("axios");
const { API, ERP_CONF, REGRAS } = require("../configuration/api");
//metodos do primeiro banco
exports.getClientErpInformations = async (data) => {
  try {
    const cnpj = encodeURIComponent(data.cnpj);
    console.log(data);
    //console.log(`${ERP_CONF.clientInformations}?documentType=BR_CNPJ&documentNumber=${data.cnpj}`)
    const query = await axios
      .post(
        `${ERP_CONF.clientInformations}?documentType=BR_CNPJ&documentNumber=${cnpj}`,
        {},
        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${data.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    console.log(error);
    return "erro";
  }
};

exports.getClientAddress = async (id, token_erp) => {
  try {
    const where =
      "q=person.id" +
      encodeURIComponent("==") +
      id +
      ";tags%3D%3D%22%23default%22";
    //q=person.id==<id da pessoa que irá receber o produto>;tags=="#default#

    const query = await axios
      .get(`${ERP_CONF.personAddress}?${where}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getTaxProfile = async (token_erp) => {
  try {
    // console.log(`${ERP_CONF.person}?${sintaxe})`)
    const query = await axios
      .get(`${ERP_CONF.taxProfile}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};
exports.getContas = async (sintaxe, token_erp) => {
  try {
    console.log(`${ERP_CONF.person}?${sintaxe})`);
    const query = await axios
      .get(`${ERP_CONF.person}?${sintaxe}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        //     console.log(result.data)
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getUserInformationById = async (id) => {
  try {
    const query = db.read
      .select("*")
      .from("USUARIOS")
      .where("USUARIO_ID", "=", id);
    return query;
  } catch (error) {
    return "";
  }
};
exports.getUserInformation = async (email) => {
  try {
    const query = db.read
      .select("*")
      .from("USUARIOS")
      .where("USUARIO_EMAIL", "=", email);
    return query;
  } catch (error) {
    return "";
  }
};

exports.CreateContact = async (reqData) => {
  try {
    var postData = {
      tipo: reqData.tipo,
      descricao: reqData.descricao,
      complemento: reqData.complemento,
      prioridade: 0,
    };

    const query = await axios
      .post(
        `${API.contas}/${reqData.id}/contatos`,
        postData,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        return error.response.data;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.updateContato = async (reqData) => {
  try {
    var postData = {
      tipo: reqData.tipo,
      descricao: reqData.descricao,
      complemento: reqData.complemento,
      prioridade: 0,
    };

    const query = await axios
      .put(
        `${API.contas}/${reqData.cliente_id}/contatos/${reqData.id}`,
        postData,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        return error.response.data;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getContaByCPForCNPJ = async (reqdata) => {
  try {
    if (reqdata.cnpj && reqdata.cnpj.length) {
      const query = await axios
        .get(
          `${API.contas}?s=cnpj==${reqdata.cnpj}`,
          {
            auth: {
              username: API.conexao.user,
              password: API.conexao.password,
            },
            timeout: 150000,
          },
          {
            withCredentials: true,
            headers: {
              tenant: `${API.tenant}`,
              "Access-Control-Allow-Origin": "http://localhost:3000",
              Origin: "http://localhost:3000",
            },
          }
        )
        .then((result) => {
          return result.data;
        })
        .catch(function (error) {
          //    console.log('Erro na obtenção dos dados');
          return error;
        });

      return query;
    } else {
      const query = await axios
        .get(
          `${API.contas}?s=cpf==${reqdata.cpf}`,
          {
            auth: {
              username: API.conexao.user,
              password: API.conexao.password,
            },
            timeout: 150000,
          },
          {
            withCredentials: true,
            headers: {
              tenant: `${API.tenant}`,
              "Access-Control-Allow-Origin": "http://localhost:3000",
              Origin: "http://localhost:3000",
            },
          }
        )
        .then((result) => {
          return result.data;
        })
        .catch(function (error) {
          return error;
        });

      return query;
    }
  } catch (error) {
    return "erro";
  }
};

exports.getArrayVendedores = async (id) => {
  try {
    const query = db.read
      .select("USUARIO_ID", "USUARIO_CONTA_ID_ERP", "USUARIO_EMAIL")
      .from("USUARIOS")
      .where("USUARIO_CONTA_SUPERVISOR_ID", "=", id)
      .orWhere("USUARIO_ID", "=", id);

    return query;
  } catch (error) {
    return "";
  }
};

exports.getArrayVendedoresOperador = async () => {
  try {
    const query = db.read
      .select("USUARIO_ID", "USUARIO_CONTA_ID_ERP", "USUARIO_EMAIL")
      .from("USUARIOS");
    //    .where('USUARIO_PERFIL', '=', 'vendedor');

    return query;
  } catch (error) {
    return "";
  }
};

exports.getContaById = async (dados) => {
  try {
    var new_array = [];

    const query = await axios
      .get(
        `${ERP_CONF.person}/${dados.id}`,

        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${dados.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        new_array.push(result.data);
        //     console.log(new_array)
        return new_array;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
    return query;
  } catch (error) {
    return "";
  }
};

exports.getContaByName = async (nome) => {
  try {
    const query = await axios
      .get(
        `${API.contas}?s=nome==%${nome}%`,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 1500,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        return error;
      });
    return query;
  } catch (err) {
    return "erro";
  }
};

exports.getContatosByClienteId = async (id, token_erp) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.personContact}?q=person.id==${id}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    return "";
  }
};
exports.getContatosByContatoId = async (id, idcontato) => {
  try {
    const query = await axios
      .get(
        `${API.contas}/${id}/contatos/${idcontato}`,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {});

    return query;
  } catch (error) {
    return "";
  }
};
exports.getAllClientesNoParameters = async (where, token_erp) => {
  try {
    //LISTA TODAS AS CONTAS
    const query = await axios
      .get(`${ERP_CONF.person}?${where}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        //console.log(result.data)
        return result.data;
      })
      .catch(function (error) {
        console.log("Erro na obtenção dos dados");
        return [];
        //    return id
      });

    return query;
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getAllClientes = async (array, where, token_erp) => {
  try {
    //LISTA TODAS AS CONTAS DE ACORDO COM O COD ERP PASSADO
    if (array && array.length) {
      var vendedores = "(";
      array
        ? array.map(function (id) {
            vendedores =
              vendedores + `personSalesperson.id==${id.USUARIO_CONTA_ID_ERP},`;
          })
        : "";
      vendedores = vendedores.slice(0, -1);
      vendedores = vendedores + ")";
      where = where.replace(/q=;\(/, 'q=(');

      var new_array = [];
      const query = await axios
        .get(`${ERP_CONF.person}?${where};${vendedores}`, {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        })
        .then((result) => {
          new_array.push(result.data);
        })
        .catch(function (error) {
          //console.log(error)
          //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
          return [];
        });

      return new_array;
    } else {
      where = where.replace(/q=;\(/, 'q=(');

      //LISTA TODAS AS CONTAS
      const query = await axios
        .get(`${ERP_CONF.person}?${where}`, {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        })
        .then((result) => {
          return result.data;
        })
        .catch(function (error) {
          return [];
          //    return id
        });

      return query;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

exports.getVendedoresByApi = async () => {
  try {
    //LISTA TODAS AS CONTAS DE ACORDO COM O COD ERP PASSADO
    //LISTA TODAS AS CONTAS SEM "WHERE"
    const query = await axios
      .get(
        `${API.contas}?s=vendedor==true`,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log("Erro na obtenção dos dados");
        return id;
      });

    return query;
  } catch (error) {
    return "";
  }
};

exports.getVendedores = async (dados) => {
  try {
    const query = await axios
      .get(
        `${ERP_CONF.person}/`,

        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${dados.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
    return query;
  } catch (error) {
    return "";
  }
};

exports.getTransportadoras = async (sintaxe, token_erp) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.person}?${sintaxe}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getInfoComerciais = async (conta, token) => {
  const PERSON_IDS = ({} = String(`{${conta}}`));
  const postDatas = [
    {
      code: "/financial/report/billingTitleStats",
      parameters: {
        FLOW: 1,
        SHOW_PERSON: true,
        SHOW_PERSON_GROUP: false,
        PERSON_IDS,
        PERSON_GROUP_IDS: null,
      },
    },
    {
      code: "/financial/report/settlementStats",
      parameters: {
        FLOW: 1,
        SHOW_PERSON: true,
        SHOW_PERSON_GROUP: false,
        PERSON_IDS,
        PERSON_GROUP_IDS: null,
      },
    },
    {
      code: "/fiscal/report/invoiceStats",
      parameters: {
        FLOW: 1,
        SHOW_PERSON: true,
        SHOW_PERSON_GROUP: false,
        PERSON_IDS,
        PERSON_GROUP_IDS: null,
      },
    },
    {
      code: "/financial/credit/dataSource/creditLineStats",
      parameters: { PERSON_IDS, PERSON_GROUP_IDS: null, CREDIT_LINE_ID: 1001 },
    },
  ];
  const results = [];

  for (const postData of postDatas) {
    try {
      const response = await axios.post(`${ERP_CONF.reportData}`, postData, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      });
      results.push({ [postData.code]: response.data });
    } catch (error) {
      results.push({ [postData.code]: { error: error.message } });
    }
  }

  return results;
};

exports.getTransportadorasByCliente = async (conta_cliente_id) => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
             a.numcad1tra as transportadora_id,
             (select s1.nome from cad1 s1 where s1.numcad1 = a.numcad1tra) as transportadora_nome,
             (select s1.apelido from cad1 s1 where s1.numcad1 = a.numcad1tra) as transportadora_apelido,

             (select s1.cgc from cad1 s1 where s1.numcad1 = a.numcad1tra) as transportadora_cnpj,
             a.numcad1red as redespacho_id,
             (select s1.nome from cad1 s1 where s1.numcad1 = a.numcad1red) as redespacho_nome,
             (select s1.apelido from cad1 s1 where s1.numcad1 = a.numcad1red) as redespacho_apelido,

             (select s1.cgc from cad1 s1 where s1.numcad1 = a.numcad1red) as redespacho_cnpj,
             cast(substring(a.observacao from 1 for 4096) as varchar(4096)) as observacoes
           from
             cad1 a
           where
             a.numcad1 =   ${conta_cliente_id}`,
            function (err, result) {
              try {
                if (err) {
                  return err;
                }
                if (result != undefined) {
                  resolve(result);
                  db.detach();
                } else {
                  reject(err);
                }
                setTimeout(function () {
                  reject(err);
                }, 1000);
                db.detach();
              } catch (err) {
                reject(err);
                db.detach();
              }
            }
          );
        // return query;
      });
      db.bancoexterno.destroy();
    });

    const query = myPromise
      .then((resultado) => {
        return resultado;
      })
      .catch((err) => {
        return err;
      });
    return query;
  } catch (error) {
    return "";
  }
};

exports.criaConta = async (dados) => {
  try {
    if (dados.enderecoComplemento == "") {
      dados.enderecoComplemento = null;
    }
    var postData = {
      type: dados.tipo == "FISICA" ? "INDIVIDUAL" : "CORPORATION",
      name: dados.nome,
      fantasyName: dados.apelido,
      documentType: dados.tipo == "JURIDICA" ? "BR_CNPJ" : "BR_CPF",
      documentNumber: dados.tipo == "JURIDICA" ? dados.cnpj : dados.cpf,
      document2Type:
        dados.tipo == "JURIDICA" ? "BR_INSCRICAO_ESTADUAL" : "BR_RG",
      document2Number:
        dados.tipo == "JURIDICA" ? dados.inscricaoEstadual : dados.rg,
      nationality: {
        id: dados.enderecoPais,
      },

      zipcode: dados.enderecoCep,
      street: dados.enderecoLogradouro,
      district: dados.enderecoBairro,
      number: dados.enderecoNumero,
      complement: dados.enderecoComplemento,
      email: dados.email,
      phone: dados.telefone,

      city: {
        id: dados.enderecoCidade,
      },
      state: {
        id: dados.enderecoEstado,
      },
      country: {
        id: dados.enderecoPais,
      },
      tags: REGRAS.client_tag_add,
      personSalesperson: { id: Number(dados.vendedorPadrao.id) || "" },
      properties: {
        salesChannel: "SALESBREATH",
        comments: dados.observacoes,
      },

      fiscalProfilePerson: { id: dados.fiscalProfile },
    };

    const query = await axios
      .post(`${ERP_CONF.person}`, postData, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${dados.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error.response.data;
      });

    return query;
  } catch (error) {
    return "erro ao criar";
  }
};

exports.updateCliente = async (dados) => {
  try {
    var putData = {
      id: dados.id,
      ativa: dados.ativa,
      bloqueada: dados.bloqueada,
      tipo: dados.tipo,
      nome: dados.nome,
      apelido: dados.apelido,
      cnpj: dados.cnpj,
      inscricaoEstadual: dados.inscricaoEstadual,
      inscricaoMunicipal: dados.inscricaoMunicipal,
      cpf: dados.cpf,
      rg: dados.rg,
      enderecoLogradouro: dados.enderecoLogradouro,
      enderecoNumero: dados.enderecoNumero,
      enderecoComplemento: dados.enderecoComplemento,
      enderecoBairro: dados.enderecoBairro,
      enderecoCidade: dados.enderecoCidade,
      enderecoEstado: dados.enderecoEstado,
      enderecoPais: dados.enderecoPais,
      enderecoCep: dados.enderecoCep,
      enderecoLatitude: null,
      enderecoLongitude: null,
      cliente: dados.cliente,
      fornecedor: dados.fornecedor,
      vendedor: dados.vendedor,
      transportadora: dados.transportadora,
      funcionario: dados.funcionario,
      segmentoDescricao: dados.segmentoDescricao,
      tags: dados.tags,
      observacoes: dados.observacoes,
      vendedorPadrao: {
        id: dados.vendedorPadrao.id,
        nome: dados.vendedorPadrao.nome,
        apelido: dados.vendedorPadrao.apelido,
      },
    };

    const query = await axios
      .put(
        `${API.contas}/${dados.id}`,
        putData,
        {
          auth: { username: "clienteps", password: "clienteps" },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        return error;
      });

    return query;
  } catch (error) {
    return error;
  }
};

exports.removeContato = async (id, idcontato) => {
  try {
    const query = await axios
      .delete(
        `${API.contas}/${id}/contatos/${idcontato}`,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {});

    return query;
  } catch (error) {
    return "";
  }
};

exports.getFilesByClientId = async (id, token_erp) => {
  try {
    const query = await axios
      .get(
        `${ERP_CONF.files}&q=(source==/catalog/person/person:${id};tags==salesbreath)&order=id`,
        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    return "";
  }
};
