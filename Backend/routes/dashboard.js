"use strict";

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard");
const { verifyToken, verifyERPToken } = require("../libs/common");
const moment = require("moment");

//ROTAS DASHBOARD
router.get("/getmetas", verifyToken, async (req, res) => {
  try {
    console.log("acessouuuuuu");
    if (req.query.id_erp) {
      req.body.id_erp = req.query.id_erp;
    }

    const response = await dashboardController.getMetas(req.body);
    return res.status(response.status).send(response);
  } catch {}
});
router.get("/vlvendasmes", verifyToken, verifyERPToken, async (req, res) => {
  try {
    var where = { SHOW_SALE: true };

    for (const key in req.query) {
      if (key !== "email") {
        console.log(key);
        if (key === "DATE_START" || key === "DATE_END") {
          where[key] = moment(req.query[key]).format("YYYY-MM-DD");
        }
        if (key === "SHOW_YEAR" || key === "SHOW_MONTH") {
          where[key] = req.query[key];
        }
      }
    }
    req.body.where = where;
    req.body.email = req.query.email;

    const response = await dashboardController.getVlVendasMes(req.body);
    return res.status(response.status).send(response);
  } catch {}
});

router.get("/qtdvendasmes", verifyToken, verifyERPToken, async (req, res) => {
  try {
    var where = { SHOW_SALE: true };
    var qtd_date = 0;
    for (const key in req.query) {
      if (key !== "email") {
        console.log(key);
        if (key === "DATE_START" || key === "DATE_END" || key === "AVAILABILITY_DATE_START" || key === "AVAILABILITY_DATE_END") {
          qtd_date = 1;
          where[key] = moment(req.query[key]).format("YYYY-MM-DD");
        }
      }
    }

    if (qtd_date == 0) {
      //oBTEM PEDIDOS EM ABERTO (SEM FILTRO DE DATA), lista geral
      var where = {
        SHOW_SALE: true,
        STATUS_LIST: "{PREPARING,PREPARED,APPROVED,PICKING}",
      };
    }
    req.body.where = where;
    req.body.email = req.query.email;

    const response = await dashboardController.getQtdVendasMes(req.body);

    return res.status(response.status).send(response);
  } catch {}
});


router.get("/totalfaturado", verifyToken, async (req, res) => {
  try {
    if (req.query.email) {
      req.body.email = req.query.email;
    }
    if (req.query.periodo) {
      req.body.periodo = req.query.periodo;
    }

    const response = await dashboardController.getTotalFaturado(req.body);
    return res.status(response.status).send(response);
  } catch {}
});

/*
  router.get('/dashboard/vlfaturadomes',  async (req, res) => {
    try{
      if(req.query.email){  req.body.email= req.query.email;}
      req.body.numero_pedido = Number(req.params.id);
      if(req.query.sendto){  req.body.sendto= req.query.sendto;}
      
      const response = await dashboardController.printPedido(req.body)
     
      if(!req.query.sendto){ //se nao for para enviar email 
          var file = fs.createReadStream(response.data);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename=pedido.pdf');
          file.pipe(res);
          return res.status(response.status).send(res);
      }else{
        return res.status(response.status).send(response);
  
      }
    }
    catch{
  
    }
    });
    router.get('/dashboard/qtdvendasmes',  async (req, res) => {
        try{
          if(req.query.email){  req.body.email= req.query.email;}
          req.body.numero_pedido = Number(req.params.id);
          if(req.query.sendto){  req.body.sendto= req.query.sendto;}
          
          const response = await dashboardController.printPedido(req.body)
         
          if(!req.query.sendto){ //se nao for para enviar email 
              var file = fs.createReadStream(response.data);
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', 'inline; filename=pedido.pdf');
              file.pipe(res);
              return res.status(response.status).send(res);
          }else{
            return res.status(response.status).send(response);
      
          }
        }
        catch{
      
        }
        });
       
                
  
*/
module.exports = router;
