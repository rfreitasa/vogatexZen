"use strict";

const { errorResponse } = require("../libs/response");

exports.validaCadastroOrganizacao = (body) => {
  const bodyStruct = {};
  const arr = [
    "nome",
    "tipo",
    "api",
    "usuario",
    "password",
    "ativo",
    "exibe_obs",
  ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  return bodyStruct;
};

exports.validaUpdateOrganizacao = (body) => {
  const bodyStruct = {};
  const arr = [
    "ORGANIZACAO_ID",
    "ORGANIZACAO_NOME",
    "ORGANIZACAO_FRETE",
    "ORGANIZACAO_FRETE_REDESP",
    "ORGANIZACAO_LISTA_ORDEM",
    "ORGANIZACAO_LISTA_DEFAULT",
    "ORGANIZACAO_USER_SMTP",
    "ORGANIZACAO_PASSWD_SMTP",
    "ORGANIZACAO_DOMINIO_SMTP",
    "ORGANIZACAO_EXIBE_OBS",
    "ORGANIZACAO_PRODUTO_SESTOQUE",
    "ORGANIZACAO_VENDE_SESTOQUE",
 
  ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + "Missing");
    bodyStruct[item] = body[item];
  });

  return bodyStruct;
};
