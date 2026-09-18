const db = require("../models/db");
const axios = require("axios");
const { API, ERP_CONF, REGRAS } = require("../configuration/api");

// Criar lead no ERP
exports.createLead = async (dados) => {
  try {
    var tags_lead = ""
    console.log(dados)
    if(dados.bloqueado=='nao'){

      tags_lead = "customer,salesbreath";
    }
    else{
      tags_lead = "blocked,customer,salesbreath";
    }

    if (dados.enderecoComplemento == "") {
      dados.enderecoComplemento = null;
    }
    if (dados.campanha == "" || dados.campanha == null) {
      dados.campanha = null;
    } else {
      // Remove espaços extras, divide por espaços e junta com _
      dados.campanha =
        "campaign" + dados.campanha.trim().split(/\s+/).join("_");
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
      tags: tags_lead + ",lead," + dados.campanha,
      personSalesperson: { id: Number(dados.vendedorPadrao.id) || "" },
      properties: {
        salesChannel: "SALESBREATH",
        comments: dados.observacoes,
      },

      fiscalProfilePerson: { id: dados.fiscalProfile },
    };

    const response = await axios.post(`${ERP_CONF.person}`, postData, {
      headers: {
        tenant: `${API.tenant}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${dados.token_erp}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar lead no ERP:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Buscar todos os leads do ERP
exports.getLeads = async (array,filters) => {
  try {
    let whereClause = "";
console.log(filters)
console.log(array)
// Corrigir: TAG_LIST está como array dentro de array
    const tagList =
      Array.isArray(filters.TAG_LIST) && filters.TAG_LIST.length > 0
        ? filters.TAG_LIST[0] // Pega o primeiro array interno
        : [];

    console.log("Processed TAG_LIST:", tagList);

    // Condição principal: tags=='lead' OU tags do TAG_LIST
    if (tagList && tagList.length > 0) {
      const tagConditions = [
        `tags==lead`,
        ...tagList.map((tag) => `tags==${tag}`), // Agora funciona corretamente
      ].join(","); // Usando , para OR

      whereClause = `&q=(${tagConditions})`;
    } else {
      whereClause = "&q=(tags==lead)";
    }

    // Filtros adicionais (devem ser adicionados DENTRO do q=)
    const additionalFilters = [];

    if (filters.salesPersonId) {
      additionalFilters.push(`personSalesperson.id==${filters.salesPersonId}`);
    }

    if (filters.name) {
      additionalFilters.push(`name==*${encodeURIComponent(filters.name)}*`);
    }

    if (filters.documentNumber) {
      additionalFilters.push(`documentNumber==*${filters.documentNumber}*`);
    }

    // Combinar todos os filtros
    if (additionalFilters.length > 0) {
      if (whereClause.includes("&q=(")) {
        // Se já tem condições, adiciona com AND (;)
        whereClause = whereClause.replace(
          ")",
          `;${additionalFilters.join(";")})`
        );
      } else {
        whereClause = `&q=(${additionalFilters.join(";")})`;
      }
    }

    console.log("Filters:", filters);
    console.log("Final where clause:", whereClause);

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

      var new_array = [];
      const query = await axios
        .get(`${ERP_CONF.person}?first=0&max=2000${whereClause};${vendedores}`, {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${filters.token_erp}`,
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
      const response = await axios.get(
        `${ERP_CONF.person}?first=0&max=2000${whereClause}`,
        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${filters.token_erp}`,
          },
        }
      );

      return response.data;
    }
  } catch (error) {
    console.error(
      "Erro ao buscar leads do ERP:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Buscar lead por ID no ERP
exports.getLeadById = async (id, token_erp) => {
  try {
    const response = await axios.get(`${ERP_CONF.person}/${id}`, {
      headers: {
        tenant: `${API.tenant}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token_erp}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar lead por ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

exports.getPurchaseLimitCampaign = async (input) => {
  const query = db.read
    .select("*")
    .from("CAMPANHAS")
    .where("CAMPANHA_ID", "=", input);
  return query;
};

exports.insertPurchaseLimitERP = async (dados) => {
  console.log("inserindo o limit ");
  const postData = {
    creditLine: {
      id: dados.creditLine,
    },
    person: {
      id: dados.person,
    },
    value: dados.valor,
    tags: "lead",
  };
  try {
    const query = await axios
      .post(`${ERP_CONF.financialpurchase}`, postData, {
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
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
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

// Buscar lead por documento no ERP
exports.getLeadByDocument = async (documentNumber, token_erp) => {
  try {
    const response = await axios.get(
      `${ERP_CONF.person}?q=documentNumber=='${documentNumber}';tags=='lead'`,
      {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar lead por documento:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Atualizar lead no ERP
exports.updateLead = async (id, data, token_erp) => {
  try {
    const putData = {
      name: data.name,
      fantasyName: data.fantasyName,
      documentNumber: data.documentNumber,
      email: data.email,
      phone: data.phone,
      zipcode: data.zipcode,
      street: data.street,
      district: data.district,
      number: data.number,
      complement: data.complement,
      city: {
        id: data.cityId,
      },
      state: {
        id: data.stateId,
      },
      country: {
        id: data.countryId || 1,
      },
      personSalesperson: {
        id: Number(data.salesPersonId) || null,
      },
      properties: {
        comments: data.observations,
      },
      fiscalProfilePerson: {
        id: data.fiscalProfile || 1,
      },
    };

    const response = await axios.put(`${ERP_CONF.person}/${id}`, putData, {
      headers: {
        tenant: `${API.tenant}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token_erp}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar lead:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Converter lead em cliente no ERP
exports.convertLeadToClient = async (id, token_erp) => {
  try {
    // Primeiro busca o lead atual
    const lead = await axios.get(`${ERP_CONF.person}/${id}`, {
      headers: {
        tenant: `${API.tenant}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token_erp}`,
      },
    });

    // Remove a tag 'lead' e adiciona tag 'client'
    const currentTags = lead.data.tags || [];
    const newTags = currentTags.filter((tag) => tag !== "lead");
    if (!newTags.includes("client")) {
      newTags.push("client");
    }

    const putData = {
      tags: newTags,
      properties: {
        ...lead.data.properties,
        convertedFromLead: true,
        conversionDate: new Date().toISOString(),
      },
    };

    const response = await axios.put(`${ERP_CONF.person}/${id}`, putData, {
      headers: {
        tenant: `${API.tenant}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token_erp}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao converter lead:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Buscar leads com filtros avançados
exports.searchLeads = async (filters, token_erp) => {
  try {
    let whereClause = "tags=='lead'";

    if (filters.name) {
      whereClause += `;name=='*${encodeURIComponent(filters.name)}*'`;
    }

    if (filters.fantasyName) {
      whereClause += `;fantasyName=='*${encodeURIComponent(
        filters.fantasyName
      )}*'`;
    }

    if (filters.documentNumber) {
      whereClause += `;documentNumber=='*${filters.documentNumber}*'`;
    }

    if (filters.email) {
      whereClause += `;email=='*${filters.email}*'`;
    }

    if (filters.city) {
      whereClause += `;city.name=='*${encodeURIComponent(filters.city)}*'`;
    }

    if (filters.salesPersonId) {
      whereClause += `;personSalesperson.id==${filters.salesPersonId}`;
    }

    const response = await axios.get(`${ERP_CONF.person}?${whereClause}`, {
      headers: {
        tenant: `${API.tenant}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token_erp}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar leads com filtros:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Buscar informações de endereço do lead
exports.getLeadAddress = async (leadId, token_erp) => {
  try {
    const response = await axios.get(
      `${ERP_CONF.personAddress}?q=person.id==${leadId}`,
      {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar endereço do lead:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Buscar contatos do lead
exports.getLeadContacts = async (leadId, token_erp) => {
  try {
    const response = await axios.get(
      `${ERP_CONF.personContact}?q=person.id==${leadId}`,
      {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar contatos do lead:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Adicionar contato ao lead
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

// Buscar informações comerciais do lead (similar ao getInfoComerciais)
exports.getLeadCommercialInfo = async (leadId, token_erp) => {
  try {
    const PERSON_IDS = `{${leadId}}`;
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
    ];

    const results = [];

    for (const postData of postDatas) {
      try {
        const response = await axios.post(`${ERP_CONF.reportData}`, postData, {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token_erp}`,
          },
        });
        results.push({ [postData.code]: response.data });
      } catch (error) {
        results.push({ [postData.code]: { error: error.message } });
      }
    }

    return results;
  } catch (error) {
    console.error(
      "Erro ao buscar informações comerciais:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verificar se lead já existe por documento
exports.checkLeadExists = async (documentNumber, token_erp) => {
  try {
    const response = await axios.get(
      `${ERP_CONF.person}?q=documentNumber=='${documentNumber}';tags=='lead'`,
      {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
        },
      }
    );

    return response.data && response.data.length > 0;
  } catch (error) {
    console.error(
      "Erro ao verificar lead existente:",
      error.response?.data || error.message
    );
    throw error;
  }
};
