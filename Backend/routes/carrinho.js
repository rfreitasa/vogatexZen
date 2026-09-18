const express  = require('express');
const router  = express.Router();
;
const carrinhoController = require('../controllers/carrinho');
const {verifyToken, verifyERPToken} = require('../libs/common');


router.post('/AdicionaAoCarrinho', verifyToken,verifyERPToken, async (req, res) => {
console.log('Adicionando item ');
  console.log(req.body);
  const response = await carrinhoController.CriaeAdicionaAoCarrinho(req.body)
  return res.status(response.status).send(response)
})

//Retorna dados do carrinho do usuário
router.get('/',verifyToken,  async (req, res) => {
  if(req.query.email){  req.body.email= req.query.email; }
  const response = await carrinhoController.ObtemCarrinho(req.body)
  return res.status(response.status).send(response)
  });




router.delete('/removeItem/:id', verifyToken, async (req, res) => {
  
  req.body.id = Number(req.params.id);
  console.log(req.body);
  const response = await carrinhoController.removeDoCarrinho(req.body);
  return res.status(response.status).send(response)
})


router.delete('/removecart', verifyToken, async (req, res) => {
  if(req.query.email){  req.body.email= req.query.email; }
  console.log(req.body);
  const response = await carrinhoController.removeCarrinho(req.body);
  return res.status(response.status).send(response)
})
module.exports = router;