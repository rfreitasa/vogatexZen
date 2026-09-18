const { enZA } = require("date-fns/locale");

const API = {
  contas: 'http://vogatex-api.c.personalsoft.com.br/rest/v1/contas',
  pedidos: 'http://vogatex-api.c.personalsoft.com.br/rest/v1/pedidosVenda',
  listaprecosvenda: 'http://vogatex-api.c.personalsoft.com.br/rest/v1/listasPrecosVendaItens',
  itensprogramacoes: 'http://vogatex-api.c.personalsoft.com.br/rest/v1/itensProgramacoes',
  imagens_galeria: 'http://produtosvogatex.dyndns.org:8080/Imagens/Artigos',
  imagens_s3 :'https://vogatex.s3.sa-east-1.amazonaws.com',
  tenant: 'vogatex',

  conexao: {
    user: 'suporte@breathitsolutions.com.br',
    password: '@sb#2020',
  }
}
const REGRAS = {
  show_price: true,
  client_tag_add: 'blocked,customer,salesbreath'

}
const ERP_CONF = {
  token: `https://api.zenerp.app.br/system/security/tokenOpRequest`,
  person: `https://api.zenerp.app.br/catalog/person/person`,
  personContact: `https://api.zenerp.app.br/catalog/person/personContact`,
  personAddress: `https://api.zenerp.app.br/catalog/person/personAddress`,
  productDetails: `https://api.zenerp.app.br/catalog/product/product`,
  productPackingDetails: `https://api.zenerp.app.br/catalog/product/productPacking`,
  product: `https://api.zenerp.app.br/salesbreath/stockAvailabilityCube`,
  sales: `https://api.zenerp.app.br/sale/sale`,
  salesdataSource: `https://api.zenerp.app.br/system/data/dataSourceOpRead`,
  salesitem: `https://api.zenerp.app.br/sale/saleItem`,
  salesParcel: `https://api.zenerp.app.br/sale/salePayment`,
  priceListItem: `https://api.zenerp.app.br/sale/priceListItem`,
  printSale: `https://api.zenerp.app.br/system/report/reportOpGenerate`,
  priceList: `https://api.zenerp.app.br/sale/priceList`,
  reportData: `https://api.zenerp.app.br/system/data/dataSourceOpRead`,
  reportUserlist: `/catalog/person/report/personList`,
  reportRankingVendas: `/fiscal/report/invoiceCube`,

  taxProfile: `https://api.zenerp.app.br/fiscal/fiscalProfilePerson?q=tags%21%3Dinactive&order=description&first=0`,
  city: `https://api.zenerp.app.br/catalog/location/city`,
  state: `https://api.zenerp.app.br/catalog/location/state`,

  purchase: `https://api.zenerp.app.br/purchase/purchaseItem/`,
  perfilVendas: `https://api.zenerp.app.br/sale/saleProfile`,
  perfilFiscal: `https://api.zenerp.app.br/fiscal/fiscalProfileOperation`,
  salesStatus: `https://api.zenerp.app.br/system/status?first=0&order=id&q=entity%3D%3D%22%2Fsale%2Fsale%22&max=51`,
  salesDanfe: `https://api.zenerp.app.br/fiscal/br/dfeNfeProcOut`,
  salesChangeStatus: `https://api.zenerp.app.br/sale/saleOpPrepare`,
  businessGroup: `https://api.zenerp.app.br/catalog/person/personGroup`,
  salesCreate: `https://api.zenerp.app.br/sale/saleOpCreate`,
  lambda_htmltopdf:`https://7xbzfurleunvw7xt5mdl7yqt4u0ieyqw.lambda-url.sa-east-1.on.aws`,
  salePrint:`https://api.zenerp.app.br/sale/report/saleForm`,
  receivableReport:`https://zenerp.app.br/financial/receivable/report/receivableList`,
  activityReport:`https://zenerp.app.br/catalog/person/report/personActivityList.html`,
  files:`https://api.zenerp.app.br/system/file/file?first=0&max=50`,
  userlog:`https://api.zenerp.app.br/system/audit/userLog?first=0&order=id`,
  reportSalesOrder: `https://api.zenerp.app.br/system/report/reportOpPrint`,
  reportInvoices: `https://zenerp.app.br/fiscal/report/invoiceList`,
  clientInformations: `https://api.zenerp.app.br/catalog/person/personOpReadFromPersonDirectory`,
  printSpec: `https://zenerp.app.br/catalog/product/report/productTechnicalForm.textile.html`,
  currency: `https://api.zenerp.app.br/financial/currency`,
  romaneioPrint:`https://api.zenerp.app.br/material/report/outgoingListForm`,
  financialpurchase:`https://api.zenerp.app.br/financial/credit/creditLineItem`,
  reportPrint:`https://api.zenerp.app.br/system/report/reportOpPrint`,
  convertUrltoPdf: `https://webprint.microservice.zensoft.com.br/generate`,
  reportsalesCommission:`https://zenerp.app.br/financial/salesCommission/report/salesCommissionList?settingsId=`,

  conexao: {
    user: 'suporte@breathitsolutions.com.br',
    password: '@sb#2020',
  }
}
const EMAIL = {
  assunto_default: 'Pedido emitido - sistema Salesbreath',
  descricao_default: `<p>Voc&ecirc; est&aacute; recebendo uma c&oacute;pia autom&aacute;tica do seu pedido.</p>

 <p>N&atilde;o responda esse email. Qualquer d&uacute;vida referente ao seu pedido, entre em contato com o seu representante.</p>
 
 <p>Att,<br />
 
 <img src="cid:cidgeradoact" height="152" width="492"/>
 `,


   conexao: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "contato@breathitsolutions.com.br",
    user_sent: "contato@breathitsolutions.com.br",
    pass: "beny rnfv uujs hsxx"
  }
}
exports.API = API;
exports.EMAIL = EMAIL;
exports.ERP_CONF = ERP_CONF;
exports.REGRAS = REGRAS;


