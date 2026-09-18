var express = require('express')

const cors = require('cors')

const fs = require('fs')
const env = require('./.envfile.js')
const path = require('path')
const compression = require('compression')
const bodyParser = require('body-parser')
const session = require('express-session')

require('dotenv').config()

const app = express()

app.use(cors())
const config = {
  fsRoot: path.resolve(__dirname, './imagens/specs'),
  rootName: 'Diretorios',
}

const host = process.env.HOST || 'localhost'
const port = '3024'
var window = ''
fs.writeFileSync(
  path.resolve(__dirname, './.envfile.js'),
  'windowenv = ' + JSON.stringify(env) + ';',
)

app.use(compression())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

const baseUrl = process.env.BASE_URL || '/'


const SESS_LIFETIME = parseInt(process.env.SESS_LIFETIME) || 1000 * 60 * 60

const DEBUG = process.env.DEBUG || false
if (!DEBUG) {
  console.info = () => {}
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: 10024 * 10024 })) // 1MB of json is a lot of json

app.use(
  bodyParser.raw({ limit: 100240 * 100024, type: 'application/octet-stream' }),
) // 10 MB of attachments

app.use(bodyParser.raw({ type: 'image/png', limit: '20mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  session({
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET || 'senhaslbreathe',
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
    },
  }),
)

// rotas
const indexRoutes = require('./routes/index')
app.use('/api/v1/index', indexRoutes)

const userRoutes = require('./routes/usuarios')
app.use('/api/v1/usuarios', userRoutes)

const organizacaoRoutes = require("./routes/organizacao");
app.use("/api/v1/organizacao", organizacaoRoutes);

const empresaRoutes = require("./routes/empresa");
app.use("/api/v1/empresa", empresaRoutes);

const clientesRoutes = require("./routes/clientes");
app.use("/api/v1/clientes", clientesRoutes);

const produtosRoutes = require("./routes/produtos");
app.use("/api/v1/produtos", produtosRoutes);

const carrinhoRoutes = require("./routes/carrinho");
app.use("/api/v1/carrinho", carrinhoRoutes);

const pedidosRoutes = require("./routes/pedidos");
app.use("/api/v1/pedidos", pedidosRoutes);

const regrasRoutes = require("./routes/regras");
app.use("/api/v1/regras", regrasRoutes);

const utilitiesRoutes = require("./routes/utilities");
app.use("/api/v1/utilities", utilitiesRoutes);

const impressosRoutes = require("./routes/impressos");
app.use("/api/v1/impressos", impressosRoutes);


const relatoriosRoutes = require("./routes/relatorios");
app.use("/api/v1/relatorios", relatoriosRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/v1/dashboard", dashboardRoutes);


const campaignsRoutes = require("./routes/campaigns");
app.use("/api/v1/campaigns", campaignsRoutes);

const leadsRoutes = require("./routes/leads");
app.use("/api/v1/leads", leadsRoutes);
/*

const permissoesRoutes = require("./routes/permissoes");
app.use("/api/v1/permissoes", permissoesRoutes);








const dashboardRoutes = require("./routes/dashboard");
app.use("/api/v1/dashboard", dashboardRoutes);

const bancoERPRoutes = require("./routes/bancoERP");
app.use("/api/v1/bancoERP", bancoERPRoutes);
*/
// Caso de erro retorne codigo 404
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    message: 'notFound',
    type: 'SalesBreath Força de vendas',
    action: req.method + ' ' + req.originalUrl,
    data: [],
    meta: {},
  })
})

// error handler
app.use((err, req, res, next) => {
  if (err && err.status == 520) {
    return next()
  }
  console.error(
    {
      type: 'uncaughtException',
      err: err,
    },
    'uncaughtException',
  )
  res.status(520).send({
    success: false,
    message: 'somethingWentWrong',
    type: 'Salesbreath Força de vendas',
    action: 'uncaughtException',
  })
})

module.exports = app
