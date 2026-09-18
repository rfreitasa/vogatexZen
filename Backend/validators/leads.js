"use strict";

const { errorResponse } = require("../libs/response");
const { validateCNPJ, validateCPF } = require("../libs/utilities");

exports.validaCadastroLeadJuridica = (body) => {
  const bodyStruct = {};

  const arr = [
    "ativa",
    "bloqueada",
    "tipo",
    "nome",
    "apelido",
    "cnpj",
    "inscricaoEstadual",
    "enderecoLogradouro",
    "enderecoNumero",
    "enderecoComplemento",
    "enderecoBairro",
    "enderecoCidade",
    "enderecoEstado",
    "enderecoPais",
    "enderecoCep",
    "observacoes",
    "vendedorPadrao",
  ];

  // Validação de CNPJ
  if (body.documentNumber) {
    if (!validateCNPJ(body.documentNumber)) {
      throw errorResponse(401, "CNPJ_INVALIDO");
    }
  }

  // Campos obrigatórios
  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  // Campos opcionais
  const optionalFields = [
    "complement",
    "observations",
    "fiscalProfile",
    "rg",
    "inscricaoEstadual",
  ];

  optionalFields.map((item) => {
    if (body.hasOwnProperty(item)) {
      bodyStruct[item] = body[item];
    }
  });

  // Tipo de documento fixo para jurídica
  bodyStruct.documentType = "CNPJ";

  return bodyStruct;
};

exports.validaCadastroLeadFisica = (body) => {
  const bodyStruct = {};
  const arr = [
    "ativa",
    "bloqueada",
    "tipo",
    "nome",
    "apelido",
    "cpf",
    "rg",
    "enderecoNumero",
    "enderecoComplemento",
    "enderecoBairro",
    "enderecoCidade",
    "enderecoEstado",
    "enderecoPais",
    "enderecoCep",
    "observacoes",
    "vendedorPadrao",
  ];

  // Validação de CPF
  if (body.documentNumber) {
    if (!validateCPF(body.documentNumber)) {
      throw errorResponse(401, "CPF_INVALIDO");
    }
  }

  // Campos obrigatórios
  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  // Campos opcionais
  const optionalFields = [
    "fantasyName",
    "complement",
    "observations",
    "fiscalProfile",
    "rg",
  ];

  optionalFields.map((item) => {
    if (body.hasOwnProperty(item)) {
      bodyStruct[item] = body[item];
    }
  });

  // Tipo de documento fixo para física
  bodyStruct.documentType = "CPF";

  return bodyStruct;
};

exports.validaAtualizacaoLead = (body) => {
  const bodyStruct = {};

  const allowedFields = [
    "name",
    "fantasyName",
    "email",
    "phone",
    "street",
    "number",
    "complement",
    "district",
    "cityId",
    "stateId",
    "country",
    "zipcode",
    "observations",
    "fiscalProfile",
    "salesPersonId",
    "active",
    "blocked",
  ];

  // Verificar se pelo menos um campo válido foi enviado
  const hasValidField = allowedFields.some((field) =>
    body.hasOwnProperty(field)
  );

  if (!hasValidField) {
    throw errorResponse(400, "Nenhum campo válido para atualização");
  }

  // Adicionar apenas campos válidos
  allowedFields.map((item) => {
    if (body.hasOwnProperty(item)) {
      bodyStruct[item] = body[item];
    }
  });

  return bodyStruct;
};

exports.validaConversaoLead = (body) => {
  const bodyStruct = {};

  const arr = ["id"];

  // Campos obrigatórios
  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  return bodyStruct;
};

exports.validaBuscaLeads = (body) => {
  const bodyStruct = {};

  const allowedFilters = [
    "name",
    "fantasyName",
    "documentNumber",
    "email",
    "city",
    "salesPersonId",
    "status",
  ];

  // Adicionar apenas filtros válidos
  allowedFilters.map((item) => {
    if (body.hasOwnProperty(item)) {
      bodyStruct[item] = body[item];
    }
  });

  // Se nenhum filtro foi fornecido, retornar objeto vazio
  // (a busca sem filtros é permitida)
  return bodyStruct;
};

exports.validateDocument = (body) => {
  const bodyStruct = {};

  const arr = ["documentNumber"];

  // Campos obrigatórios
  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  // Determinar tipo de documento baseado no tamanho
  if (bodyStruct.documentNumber) {
    const doc = bodyStruct.documentNumber.replace(/\D/g, "");
    if (doc.length === 11) {
      if (!validateCPF(bodyStruct.documentNumber)) {
        throw errorResponse(401, "CPF_INVALIDO");
      }
      bodyStruct.documentType = "CPF";
    } else if (doc.length === 14) {
      if (!validateCNPJ(bodyStruct.documentNumber)) {
        throw errorResponse(401, "CNPJ_INVALIDO");
      }
      bodyStruct.documentType = "CNPJ";
    } else {
      throw errorResponse(401, "DOCUMENTO_INVALIDO");
    }
  }

  return bodyStruct;
};

exports.validateEmail = (body) => {
  const bodyStruct = {};

  const arr = ["email"];

  // Campos obrigatórios
  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(bodyStruct.email)) {
    throw errorResponse(401, "EMAIL_INVALIDO");
  }

  return bodyStruct;
};

exports.validateRequiredId = (body) => {
  const bodyStruct = {};

  const arr = ["id"];

  // Campos obrigatórios
  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");

    // Validar se é um número válido
    const id = Number(body[item]);
    if (isNaN(id) || id <= 0) {
      throw errorResponse(401, "ID_INVALIDO");
    }

    bodyStruct[item] = id;
  });

  return bodyStruct;
};

// Validador genérico para operações que requerem ID
exports.validateLeadId = (body) => {
  return exports.validateRequiredId(body);
};

// Validador para criação de lead que detecta automaticamente o tipo
exports.validaCadastroLead = (body) => {
  // Determinar tipo baseado no documento ou parâmetro explícito
  if (body.documentType) {
    if (body.documentType === "CNPJ" || body.documentType === "JURIDICA") {
      return exports.validaCadastroLeadJuridica(body);
    } else if (body.documentType === "CPF" || body.documentType === "FISICA") {
      return exports.validaCadastroLeadFisica(body);
    }
  }

  // Auto-detectar baseado no documento
  if (body.documentNumber) {
    const doc = body.documentNumber.replace(/\D/g, "");
    if (doc.length === 11) {
      return exports.validaCadastroLeadFisica(body);
    } else if (doc.length === 14) {
      return exports.validaCadastroLeadJuridica(body);
    }
  }

  // Se não conseguiu detectar, assume jurídica como padrão
  return exports.validaCadastroLeadJuridica(body);
};
