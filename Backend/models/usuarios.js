const db = require("../models/db");
const moment = require("moment");
const axios = require("axios");
const { API, ERP_CONF } = require("../configuration/api");

exports.getRestricoes = async () => {
  const query = db.read
    .select(
      "RECURSO_ID",
      "RECURSO_TIPO",
      "RECURSO_CODIGO",
      "RECURSO_DESCRICAO",
      "RECURSO_ATIVO",
    )
    .from("RECURSOS_SISTEMA")
    .where("RECURSO_ATIVO", "=", 1)
    .orderBy("RECURSO_TIPO", "asc")
    .orderBy("RECURSO_DESCRICAO", "asc");

  console.info("query restricoes -->", query.toQuery());

  return query;
};

exports.getRestricoesUsuario = async (usuario) => {
  const query = db.read
    .select("RECURSO_ID")
    .from("USUARIOS_RESTRICOES")
    .where("USUARIO_ID", "=", Number(usuario));

  console.info("query restricoes usuario -->", query.toQuery());

  return query;
};

exports.getRestricoesUsuarioDetalhada = async (usuario) => {
  const query = db.read
    .select(
      "UR.ID",
      "UR.USUARIO_ID",
      "R.RECURSO_ID",
      "R.RECURSO_TIPO",
      "R.RECURSO_CODIGO",
      "R.RECURSO_DESCRICAO",
    )
    .from("USUARIOS_RESTRICOES AS UR")
    .innerJoin(
      "RECURSOS_SISTEMA AS R",
      "R.RECURSO_ID",
      "UR.RECURSO_ID",
    )
    .where("UR.USUARIO_ID", "=", Number(usuario))
    .where("R.RECURSO_ATIVO", "=", 1)
    .orderBy("R.RECURSO_TIPO", "asc")
    .orderBy("R.RECURSO_DESCRICAO", "asc");

  console.info(
    "query restricoes detalhada -->",
    query.toQuery(),
  );

  return query;
};

exports.updateRestricoesUsuario = async (
  usuario,
  restricoes,
  trx = null,
) => {
  const banco = trx || db.write;

  await banco("USUARIOS_RESTRICOES")
    .where("USUARIO_ID", Number(usuario))
    .delete();

  if (
    !Array.isArray(restricoes) ||
    restricoes.length === 0
  ) {
    return true;
  }

  const dados = restricoes.map((recursoId) => {
    return {
      USUARIO_ID: Number(usuario),
      RECURSO_ID: Number(recursoId),
    };
  });

  await banco("USUARIOS_RESTRICOES").insert(dados);

  return true;
};

exports.getUserById = async (id) => {
  const query = db.read
    .select("*")
    .from("USUARIOS")
    .where("USUARIO_ID", "=", id);

  return query;
};

exports.getUsers = async () => {
  const query = db.read
    .select("*")
    .from("USUARIOS");

  return query;
};

exports.getUserDetailsByEmail = async (email) => {
  const query = db.read
    .select("*")
    .from("USUARIOS")
    .where("USUARIO_EMAIL", "=", email);

  return query;
};

exports.getUserDetailsByNameOrEmail = async (input) => {
  const query = db.read
    .select("*")
    .from("USUARIOS")
    .where("USUARIO_NOME", "=", input)
    .orWhere("USUARIO_EMAIL", "=", input);

  return query;
};

exports.createUser = async (data) => {
  const createdAt = moment().format(
    "YYYY-MM-DD HH:mm:ss",
  );

  return db.write.transaction(async (trx) => {
    const response = await trx("USUARIOS").insert({
      USUARIO_NOME:
        data.nome || null,

      USUARIO_EMAIL:
        data.email || null,

      USUARIO_ATIVO:
        data.ativo !== undefined
          ? data.ativo
          : 0,

      USUARIO_PASSWORD:
        data.senha || null,

      USUARIO_PERFIL:
        data.perfil || 1,

      USUARIO_CONTA_ID_ERP:
        data.conta_id_erp || 0,

      USUARIO_PASSWORD_ERP:
        data.senha_erp || 0,

      USUARIO_CONTA_SUPERVISOR_ID:
        data.conta_supervisor_id || 0,

      USUARIO_CONTA_GERENTE_ID:
        data.conta_gerente_id || 0,

      USUARIO_EMPRESA_ID:
        data.empresa_id || 0,

      USUARIO_GRUPO_ID:
        data.grupo_id || 1,

      CREATED_AT:
        createdAt,

      UPDATED_AT:
        createdAt,
    });

    const usuarioId = response[0];

    if (
      Array.isArray(data.RESTRICOES)
    ) {
      await exports.updateRestricoesUsuario(
        usuarioId,
        data.RESTRICOES,
        trx,
      );
    }

    return response;
  });
};

exports.updateUser = async (data) => {
  try {
    const id_user = Number(data.id);

    const updatedAt = moment().format(
      "YYYY-MM-DD HH:mm:ss",
    );

    const toBeUpdated = {};

    const canBeUpdated = [
      "USUARIO_NOME",
      "USUARIO_EMAIL",
      "USUARIO_PASSWORD",
      "USUARIO_ATIVO",
      "USUARIO_CONTA_ID_ERP",
      "USUARIO_PASSWORD_ERP",
      "USUARIO_GRUPO_ID",
      "USUARIO_EMPRESA_ID",
      "USUARIO_PERFIL",
      "USUARIO_CONTA_SUPERVISOR_ID",
      "USUARIO_CONTA_GERENTE_ID",
    ];

    for (let i in data) {
      if (
        canBeUpdated.indexOf(i) > -1 &&
        data[i] !== ""
      ) {
        toBeUpdated[i] = data[i];
      }
    }

    toBeUpdated.UPDATED_AT = updatedAt;

    await db.write.transaction(async (trx) => {
      await trx("USUARIOS")
        .where("USUARIO_ID", id_user)
        .update(toBeUpdated);

      if (
        Array.isArray(data.LISTAS)
      ) {
        await trx("LISTA_PRECOS_USUARIOS")
          .where("USUARIO_ID", id_user)
          .delete();

        if (
          data.LISTAS.length > 0
        ) {
          const listas = data.LISTAS
            .filter((item) => item && item.value)
            .map((item) => {
              return {
                USUARIO_ID: id_user,
                LISTA_PRECOS_ID:
                  Number(item.value),
              };
            });

          if (
            listas.length > 0
          ) {
            await trx(
              "LISTA_PRECOS_USUARIOS",
            ).insert(listas);
          }
        }
      }

      if (
        Array.isArray(data.RESTRICOES)
      ) {
        await exports.updateRestricoesUsuario(
          id_user,
          data.RESTRICOES,
          trx,
        );
      }
    });

    return "ok";
  } catch (error) {
    console.log(
      "Erro updateUser:",
      error,
    );

    return "nok";
  }
};

exports.removeUser = async (id) => {
  return db.write.transaction(async (trx) => {
    await trx("USUARIOS_RESTRICOES")
      .where("USUARIO_ID", Number(id))
      .delete();

    await trx("LISTA_PRECOS_USUARIOS")
      .where("USUARIO_ID", Number(id))
      .delete();

    const query = await trx("USUARIOS")
      .where("USUARIO_ID", Number(id))
      .delete();

    return query;
  });
};

exports.getUsersPersonal = async () => {
  try {
    const myPromise = new Promise(
      (resolve, reject) => {
        db.bancoexterno.get(
          function (err, dbPersonal) {
            if (err) {
              reject(err);
              return;
            }

            dbPersonal.query(
              "select * from V3$IMAGENS",
              function (errQuery, result) {
                try {
                  if (errQuery) {
                    reject(errQuery);
                    dbPersonal.detach();
                    return;
                  }

                  if (
                    result !== undefined
                  ) {
                    resolve(result);
                  } else {
                    reject(errQuery);
                  }

                  dbPersonal.detach();
                } catch (error) {
                  reject(error);

                  try {
                    dbPersonal.detach();
                  } catch (detachError) {
                    console.log(
                      detachError,
                    );
                  }
                }
              },
            );
          },
        );
      },
    );

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

exports.getUsersErp = async (dados) => {
  try {
    const query = await axios
      .get(
        `${ERP_CONF.person}?q=(tags==salesperson,tags==employee);(name=ilike='%${dados.user}%',fantasyName=ilike='%${dados.user}%')`,
        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${dados.token_erp}`,
            "Access-Control-Allow-Origin":
              "http://localhost:3000",
            Origin:
              "http://localhost:3000",
          },
        },
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        return [];
      });

    return query;
  } catch (error) {
    return "";
  }
};