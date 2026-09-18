"use strict";

const express = require("express");

const router = express.Router();

const userController = require("../controllers/usuarios");

const { verifyToken, verifyERPToken } = require("../libs/common");

router.post("/", verifyToken, async (req, res) => {
  const response = await userController.createUser(req.body);

  if (response.success && response.meta) {
    req.session.email = response.meta.email;

    req.session.password = req.body.senha;
  }

  return res.status(response.status).send(response);
});

router.get("/restricoes/listar", verifyToken, async (req, res) => {
  const response = await userController.fetchRestricoes(req.body);

  return res.status(response.status).send(response);
});

router.get("/restricoes/atribuidas", verifyToken, async (req, res) => {
  req.body.usuario = Number(req.query.usuario);

  const response = await userController.fetchRestricoesAtribuidas(req.body);

  return res.status(response.status).send(response);
});

router.get("/restricoes/usuario/:id", verifyToken, async (req, res) => {
  req.body.usuario = Number(req.params.id);

  const response = await userController.fetchRestricoesUsuario(req.body);

  return res.status(response.status).send(response);
});

router.get("/", verifyToken, verifyERPToken, async (req, res) => {
  console.log("Listando usuários");

  const response = await userController.fetchAllUser(req.body);

  return res.status(response.status).send(response);
});

router.get("/usuarios_erp", verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.user) {
    req.body.user = req.query.user;
  } else if (req.query.email) {
    req.body.email = req.query.email;
  }

  const response = await userController.fetchAllUserERP(req.body);

  return res.status(response.status).send(response);
});

router.get("/personal", verifyToken, async (req, res) => {
  const response = await userController.fetchAllUserPersonal(req.body);

  return res.status(response.status).send(response);
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id);

  const response = await userController.removeUser(req.body);

  return res.status(response.status).send(response);
});

router.post("/login", verifyERPToken, async (req, res) => {
  const response = await userController.loginUser(req.body);

  if (response) {
    return res.status(response.status).send(response);
  }
});

router.post("/refreshToken", async (req, res) => {
  const response = await userController.refreshToken(req.body);

  console.log(response);

  return res.status(response.status).send(response);
});

router.post("/logout", verifyToken, async (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("sid");

    return res.status(200).send("loggout");
  });
});

router.get("/:id", verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id);

  const response = await userController.fetchUser(req.body);

  return res.status(response.status).send(response);
});

router.put("/:id", verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id);

  const response = await userController.updateUser(req.body);

  return res.status(response.status).send(response);
});

module.exports = router;
