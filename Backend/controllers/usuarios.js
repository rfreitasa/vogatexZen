const bcrypt = require("bcryptjs");
const digitos_minimos = 10;

const userModel = require("../models/usuarios");

const { successResponse, errorResponse } = require("../libs/response");

const { validateUser, validateAuth } = require("../validators/usuarios");

const { validateId } = require("../validators/common");

const organizacaoModel = require("../models/organizacao");

require("dotenv-safe").config();

var jwt = require("jsonwebtoken");
var randtoken = require("rand-token");
var refreshTokens = {};


const logStruct = (func, error) => {
  return {
    func: func,
    file: "userController",
    error,
  };
};

/*
 * ========================================
 * CRIAR USUÁRIO
 * ========================================
 */

const createUser = async (reqData) => {
  try {
    const validInput = validateUser(reqData);

    validInput.RESTRICOES = Array.isArray(reqData.RESTRICOES)
      ? reqData.RESTRICOES
      : [];

    const userExists = await userModel.getUserDetailsByEmail(validInput.email);

    if (userExists && userExists.length) {
      return errorResponse(403, "userExists");
    }

    validInput.senha = bcrypt.hashSync(
      String(validInput.senha),
      digitos_minimos,
    );

    const response = await userModel.createUser(validInput);

    return successResponse(
      201,
      response,
      {
        email: validInput.email,
      },
      "userRegistered",
    );
  } catch (error) {
    console.error("erro -> ", logStruct("createUser", error));

    return errorResponse(
      error.status || 500,
      error.message || "Erro ao criar usuário",
    );
  }
};


const updateUser = async (reqData) => {
  try {
    const validInput = validateId(reqData);

    if (
      reqData.USUARIO_PASSWORD !== undefined &&
      reqData.USUARIO_PASSWORD !== null &&
      String(reqData.USUARIO_PASSWORD).length > 0
    ) {
      reqData.USUARIO_PASSWORD = bcrypt.hashSync(
        String(reqData.USUARIO_PASSWORD),
        digitos_minimos,
      );
    }

    if (
      reqData.USUARIO_PASSWORD === undefined ||
      reqData.USUARIO_PASSWORD === null
    ) {
      reqData.USUARIO_PASSWORD = "";
    }

    reqData.LISTAS = Array.isArray(reqData.LISTAS) ? reqData.LISTAS : [];

    reqData.RESTRICOES = Array.isArray(reqData.RESTRICOES)
      ? reqData.RESTRICOES
      : [];

    console.log("Atualizando usuario:", validInput.id);

    console.log("Listas:", reqData.LISTAS);

    console.log("Restrições:", reqData.RESTRICOES);

    const response = await userModel.updateUser(reqData);

    if (response === "ok") {
      return successResponse(204);
    }

    return errorResponse(403, "ERRO");
  } catch (error) {
    console.error("error -> ", logStruct("updateUser", error));

    return errorResponse(
      error.status || 500,
      error.message || "Erro ao atualizar usuário",
    );
  }
};

/*
 * ========================================
 * REMOVER USUÁRIO
 * ========================================
 */

const removeUser = async (reqData) => {
  try {
    const validInput = validateId(reqData);

    const response = await userModel.removeUser(validInput.id);

    return successResponse(204, null, null, "removido");
  } catch (error) {
    console.error("error -> ", logStruct("removeUser", error));

    return errorResponse(error.status || 500, error.message);
  }
};

/*
 * ========================================
 * LISTAR TODOS OS USUÁRIOS
 * ========================================
 */

const fetchAllUser = async (reqData) => {
  try {
    const response = await userModel.getUsers();

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllUser", error));

    return errorResponse(error.status || 500, error.message);
  }
};

/*
 * ========================================
 * BUSCAR USUÁRIO POR ID
 * ========================================
 */

const fetchUser = async (reqData) => {
  try {
    const validInput = validateId(reqData);

    const response = await userModel.getUserById(validInput.id);

    if (response && !response.length) {
      return errorResponse(404, "userNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchUser", error));

    return errorResponse(error.status || 500, error.message);
  }
};

/*
 * ========================================
 * LOGIN
 * ========================================
 */

const loginUser = async (reqData) => {
  try {
    const validInput = validateAuth(reqData);

    /*
     * Localiza usuário.
     */
    const response = await userModel.getUserDetailsByNameOrEmail(
      validInput.email,
    );

    if (!response || response.length === 0) {
      return errorResponse(401, "Usuario ou senha não localizada");
    }

    if (
      response[0].USUARIO_PASSWORD !== undefined &&
      response[0].USUARIO_PASSWORD !== null
    ) {
      const matched = bcrypt.compareSync(
        String(validInput.senha),
        response[0].USUARIO_PASSWORD,
      );

      if (!matched) {
        return errorResponse(401, "wrongPassword");
      }
    } else {
      return errorResponse(401, "Usuario ou senha não localizada");
    }

    const id = response[0].USUARIO_ID;

    /*
     * Usuário inativo.
     */
    if (response[0].USUARIO_ATIVO === 1) {
      return errorResponse(401, "Usuário inativo");
    }

    /*
     * Gera token JWT.
     */
    var token = jwt.sign(
      {
        id,
      },
      process.env.SECRET,
      {
        expiresIn: 30000,
      },
    );

    /*
     * Organização.
     */
    const organizacao_info = await organizacaoModel.getOrganizacoes();

    /*
     * Localiza organização com
     * lista de ordenação preenchida.
     */
    const organizacao_data = organizacao_info
      ? organizacao_info.find(
          (org) =>
            org.ORGANIZACAO_LISTA_ORDEM !== null &&
            org.ORGANIZACAO_LISTA_ORDEM !== "",
        )
      : null;

    /*
     * =====================================
     * RESTRIÇÕES DO USUÁRIO
     * =====================================
     *
     * Retorna somente os menus/relatórios
     * que o usuário NÃO pode acessar.
     */
    const restricoes = await userModel.getRestricoesUsuarioDetalhada(id);

    
    const restricoesFrontend = restricoes.map((item) => {
      return {
        id: item.RECURSO_ID,

        tipo: item.RECURSO_TIPO,

        codigo: item.RECURSO_CODIGO,

        descricao: item.RECURSO_DESCRICAO,
      };
    });

    /*
     * Retorno login.
     */
    return successResponse(200, {
      auth: true,

      token: token,

      email: response[0].USUARIO_EMAIL,

      perfil: response[0].USUARIO_PERFIL,

      id: response[0].USUARIO_ID,

      id_erp: response[0].USUARIO_CONTA_ID_ERP,

      /*
       * NOVO
       */
      restricoes: restricoesFrontend,

      /*
       * Dados organização.
       */
      ordenacao_lista: organizacao_data
        ? organizacao_data.ORGANIZACAO_LISTA_ORDEM
        : "",

      frete: organizacao_data ? organizacao_data.ORGANIZACAO_FRETE : "",

      frete_redesp: organizacao_data
        ? organizacao_data.ORGANIZACAO_FRETE_REDESP
        : "",

      exibe_obs: organizacao_data ? organizacao_data.ORGANIZACAO_EXIBE_OBS : "",
    });
  } catch (error) {
    console.error("error -> ", logStruct("loginUser", error));

    return errorResponse(error.status || 500, error.message);
  }
};

/*
 * ========================================
 * REFRESH TOKEN
 * ========================================
 */

const refreshToken = async (reqData) => {
  try {
    const token_antigo = reqData.token;

    if (token_antigo) {
      const response = await userModel.getUserDetailsByNameOrEmail(
        reqData.email,
      );

      if (!response || response.length === 0) {
        return errorResponse(402, "erro refreshtoken");
      }

      const id = response[0].USUARIO_ID;

      const email = response[0].USUARIO_EMAIL;

      var token;

      var id_request = "";

      jwt.verify(token_antigo, process.env.SECRET, function (err, decoded) {
        if (err) {
          return;
        }

        token = jwt.sign(
          {
            id,
          },
          process.env.SECRET,
          {
            expiresIn: 30000,
          },
        );

        id_request = decoded.id;
      });

      if (id_request) {
        const restricoes = await userModel.getRestricoesUsuarioDetalhada(id);

        const restricoesFrontend = restricoes.map((item) => {
          return {
            id: item.RECURSO_ID,

            tipo: item.RECURSO_TIPO,

            codigo: item.RECURSO_CODIGO,

            descricao: item.RECURSO_DESCRICAO,
          };
        });

        return successResponse(200, {
          auth: true,

          token: token,

          email: email,

          restricoes: restricoesFrontend,
        });
      }

      return errorResponse(402, "erro refreshtoken");
    }

    return errorResponse(402, "erro refreshtoken");
  } catch (error) {
    console.error("error -> ", logStruct("refreshToken", error));

    return errorResponse(402, error.message);
  }
};

/*
 * ========================================
 * SEGUNDO BANCO / PERSONAL
 * ========================================
 *
 * PREPARANDO A BASE PARA UMA POSSÍVEL
 * AUTENTICAÇÃO DIRETA AO BANCO DA
 * PERSONAL.
 */

/*
 * Lista usuários Personal.
 */
const fetchAllUserPersonal = async (reqData) => {
  try {
    const response = await userModel.getUsersPersonal();

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllUserPersonal", error));

    return errorResponse(error.status || 500, error.message);
  }
};

/*
 * ========================================
 * USUÁRIOS ERP
 * ========================================
 */

const fetchAllUserERP = async (reqData) => {
  try {
    const response = await userModel.getUsersErp(reqData);

    if (response && !response.length) {
      return errorResponse(404, "usersNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllUserERP", error));

    return errorResponse(error.status || 500, error.message);
  }
};


const fetchRestricoes = async (reqData) => {
  try {
    const response = await userModel.getRestricoes();

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchRestricoes", error));

    return errorResponse(
      error.status || 500,
      error.message || "Erro ao buscar restrições",
    );
  }
};


const fetchRestricoesAtribuidas = async (reqData) => {
  try {
    const usuario = Number(reqData.usuario);

    if (!usuario) {
      return errorResponse(400, "Usuário não informado");
    }

    const recursos = await userModel.getRestricoes();

    const atribuidas = await userModel.getRestricoesUsuario(usuario);

    const idsAtribuidos = atribuidas.map((item) => {
      return Number(item.RECURSO_ID);
    });

    const response = recursos.map((item) => {
      const selecionado = idsAtribuidos.includes(Number(item.RECURSO_ID));

      return {
        RECURSO_ID: item.RECURSO_ID,

        RECURSO_TIPO: item.RECURSO_TIPO,

        RECURSO_CODIGO: item.RECURSO_CODIGO,

        RECURSO_DESCRICAO: item.RECURSO_DESCRICAO,

        RECURSO_ATIVO: item.RECURSO_ATIVO,

        SELECIONADO: selecionado ? "selected" : "",
      };
    });

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchRestricoesAtribuidas", error));

    return errorResponse(
      error.status || 500,
      error.message || "Erro ao buscar restrições atribuídas",
    );
  }
};

/*
 * ========================================
 * RESTRIÇÕES DE UM USUÁRIO
 * ========================================
 *
 * Retorna SOMENTE aquilo que
 * determinado usuário não pode acessar.
 */
const fetchRestricoesUsuario = async (reqData) => {
  try {
    const usuario = Number(reqData.usuario);

    if (!usuario) {
      return errorResponse(400, "Usuário não informado");
    }

    const response = await userModel.getRestricoesUsuarioDetalhada(usuario);

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchRestricoesUsuario", error));

    return errorResponse(
      error.status || 500,
      error.message || "Erro ao buscar restrições do usuário",
    );
  }
};

/*
 * ========================================
 * EXPORTS
 * ========================================
 */

module.exports = {
  /*
   * Usuários
   */
  createUser,

  updateUser,

  removeUser,

  fetchUser,

  fetchAllUser,

  /*
   * Login
   */
  loginUser,

  refreshToken,

  /*
   * ERP / Personal
   */
  fetchAllUserPersonal,

  fetchAllUserERP,

  /*
   * Restrições
   */
  fetchRestricoes,

  fetchRestricoesAtribuidas,

  fetchRestricoesUsuario,
};
