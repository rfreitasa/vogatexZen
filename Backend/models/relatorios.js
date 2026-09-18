const db = require("../models/db");
const moment = require("moment");
const axios = require("axios");
const { API, ERP_CONF } = require("../configuration/api");
const { sr } = require("date-fns/locale");
const funcoes = require("../libs/functions");


exports.getNfs = async (dados) => {
 console.log(dados)
  const columns = [
    "company_code",
    "invoice_date",
    "invoice_number",
    "fiscalProfileOperation_code",
    "person_name",
    "product_code",
    "product_description",
    "productPacking_code",
    "productVariant_description",
    "sum_quantity",
    "invoiceItem_unitValue",
    "sum_grossProductValue",
    "salesCommission"
  ];


  const groupColumnMap = {
    invoice_date: "invoice_date",
    person_name: "person_name",
    company_code: "company_code",
    fiscalProfileOperation_code: "fiscalProfileOperation_code",
    product_description: "product_description"
  };
  
  const groupColumn = groupColumnMap[dados.group1];

  const filteredColumns = columns.filter(
    column => column !== groupColumn
  );  

 
  //Obtem as empresas apontadas ou verifico quais estao ativas para filtro
  if (dados.company == null) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();
    dados.company = empresasAtivas;
  }
  const postData = {
    code: `/fiscal/report/invoiceList`,
    parameters: {
      DATE_START: `${dados.dateStart}`,
      DATE_END: `${dados.dateEnd}`,
      PERSON_SALESPERSON_PERSON_SALESPERSON_IDS:`${dados.supervisorId}`,
      PERSON_IDS:`${dados.person}`,
      PRODUCT_IDS:`${dados.product}`,
      PRODUCT_PACKING_IDS:`${dados.productPacking}`,
      SIGN: -1,
      MULT: -1,
    
      FISCAL_PROFILE_OPERATION_TAGS: ["expense", "revenue"],
    
      SHOW_INVOICE: true,
      SHOW_INVOICE_ITEM: true,
      SHOW_FLOW: false,
      SHOW_RETURNED: false,
      SHOW_SIGN: false,
      SHOW_STATUS: false,
    
      SHOW_DATE: true,
      SHOW_DAY: false,
      SHOW_MONTH: false,
      SHOW_YEAR: false,
      SHOW_ISSUE_DATE: false,
    
      SHOW_FREIGHT_TYPE: false,
    
      SHOW_COMPANY: true,
      SHOW_FISCAL_PROFILE_OPERATION: true,
      SHOW_INVOICE_SERIES: false,
    
      SHOW_PERSON: true,
      SHOW_PERSON_GROUP: false,
      SHOW_PERSON_CATEGORY_1: false,
      SHOW_PERSON_CATEGORY_2: false,
      SHOW_PERSON_CATEGORY_3: false,
      SHOW_PERSON_CATEGORY_4: false,
      SHOW_PERSON_CATEGORY_5: false,
    
      SHOW_CITY: false,
      SHOW_STATE: false,
      SHOW_COUNTRY: false,
    
      SHOW_SHIPPING: false,
    
      SHOW_PRODUCT: true,
      SHOW_FISCAL_PROFILE_PRODUCT: false,
      SHOW_PRODUCT_CATEGORY_1: false,
      SHOW_PRODUCT_CATEGORY_2: false,
      SHOW_PRODUCT_CATEGORY_3: false,
      SHOW_PRODUCT_CATEGORY_4: false,
      SHOW_PRODUCT_CATEGORY_5: false,
    
      SHOW_PRODUCT_PACKING: true,
      SHOW_PRODUCT_VARIANT: true,
    
      SHOW_TAXATION_OPERATION: false,
      SHOW_ACCOUNT: false,
    
      SHOW_UNIT: true,
      SHOW_UNIT_VALUE: true,
    
      SHOW_SALESPERSON: true,
      SHOW_SALESPERSON_CATEGORY_1: false,
      SHOW_SALESPERSON_CATEGORY_2: false,
      SHOW_SALESPERSON_CATEGORY_3: false,
      SHOW_SALESPERSON_CATEGORY_4: false,
      SHOW_SALESPERSON_CATEGORY_5: false,
    
      SHOW_SALES_COMMISSION: false,
      SHOW_SALES_HUB: false,
      SHOW_SALES_CHANNEL: false,
    
      SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
      SHOW_PRODUCT_PROPERTIES_BR_CEST: false,
    
      MAX_RECORDS: `${dados.maxRecords}`,
    },
      dataSource: {
        code: "/fiscal/report/invoiceCube",
        parameters: {
          DATE_START: `${dados.dateStart}`,
          DATE_END: `${dados.dateEnd}`,
        
          SIGN: "-1",
          MULT: "-1",
    
          FISCAL_PROFILE_OPERATION_TAGS: ["expense", "revenue"],
    
          SHOW_INVOICE: true,
          SHOW_INVOICE_ITEM: true,
          SHOW_FLOW: false,
          SHOW_RETURNED: false,
          SHOW_SIGN: false,
          SHOW_STATUS: false,
    
          SHOW_DATE: true,
          SHOW_DAY: false,
          SHOW_MONTH: false,
          SHOW_YEAR: false,
          SHOW_ISSUE_DATE: false,
    
          SHOW_FREIGHT_TYPE: false,
    
          SHOW_COMPANY: true,
          SHOW_FISCAL_PROFILE_OPERATION: true,
          SHOW_INVOICE_SERIES: false,
    
          SHOW_PERSON: true,
          SHOW_PERSON_GROUP: false,
          SHOW_PERSON_CATEGORY_1: false,
          SHOW_PERSON_CATEGORY_2: false,
          SHOW_PERSON_CATEGORY_3: false,
          SHOW_PERSON_CATEGORY_4: false,
          SHOW_PERSON_CATEGORY_5: false,
    
          SHOW_CITY: false,
          SHOW_STATE: false,
          SHOW_COUNTRY: false,
    
          SHOW_SHIPPING: false,
    
          SHOW_PRODUCT: true,
          SHOW_FISCAL_PROFILE_PRODUCT: false,
          SHOW_PRODUCT_CATEGORY_1: false,
          SHOW_PRODUCT_CATEGORY_2: false,
          SHOW_PRODUCT_CATEGORY_3: false,
          SHOW_PRODUCT_CATEGORY_4: false,
          SHOW_PRODUCT_CATEGORY_5: false,
    
          SHOW_PRODUCT_PACKING: true,
          SHOW_PRODUCT_VARIANT: true,
    
          SHOW_TAXATION_OPERATION: false,
          SHOW_ACCOUNT: false,
    
          SHOW_UNIT: true,
          SHOW_UNIT_VALUE: true,
    
          SHOW_SALESPERSON: true,
          SHOW_SALESPERSON_CATEGORY_1: false,
          SHOW_SALESPERSON_CATEGORY_2: false,
          SHOW_SALESPERSON_CATEGORY_3: false,
          SHOW_SALESPERSON_CATEGORY_4: false,
          SHOW_SALESPERSON_CATEGORY_5: false,
    
          SHOW_SALES_COMMISSION: false,
          SHOW_SALES_HUB: false,
          SHOW_SALES_CHANNEL: false,
    
          SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
          SHOW_PRODUCT_PROPERTIES_BR_CEST: false,
    
          MAX_RECORDS: Number(dados.maxRecords) || 20000,
    
          COMPANY_IDS: dados.company
            ? `{${dados.company}}`
            : null,
    
          SALESPERSON_IDS: dados.salesperson
            ? `{${dados.salesperson}}`
            : null,

        PERSON_IDS: dados.person
          ? `{${dados.person}}`
          : null,
          PERSON_SALESPERSON_PERSON_SALESPERSON_IDS
          : dados.supervisorId
          ? `{${dados.supervisorId}}`
          : null,
          PRODUCT_IDS
          : dados.product
          ? `{${dados.product}}`
          : null,
          PRODUCT_PACKING_IDS
          : dados.productPacking
          ? `{${dados.productPacking}}`
          : null




        }
      },
    
        "properties": {
        "filters": {
            "fiscalProfileOperationTags": "expense,revenue",
            "sign": "-1",
            "mult": "-1",
             "dateStart": `${dados.dateStart}`,
          "dateEnd": `${dados.dateEnd}`
        },
           columns: filteredColumns, 
        groups: [
          {
            columnId: dados.group1 || "sale_date",
            break: false
          }
        ],
    
        sort: [
          {
            columnId: dados.sort1 || "sale_date",
            direction: "asc"
          },
          {
            columnId: "sale_id",
            direction: "asc"
          }
        ]
    }
  };
    console.log(postData.properties.settings)
   /*
    parameters: {
      MULT: -1,
      SIGN: -1,
      SHOW_INVOICE: dados.filtros.relatorio == "EIR6000COM" ? true : false,
      SHOW_COMPANY: false,
      SHOW_CITY:
        dados.filtros.dados == "city_name" ||
        dados.filtros.agrupamento == "city_name"
          ? true
          : false,
      SHOW_STATE:
        dados.filtros.dados == "state_name" ||
        dados.filtros.agrupamento == "state_code"
          ? true
          : false,
      SHOW_COUNTRY: false,
      SHOW_QUANTITY: false,
      SHOW_PERSON: dados.filtros.dados == "person_nameCalc" ? true : false,
      SHOW_PRODUCT: dados.filtros.dados == "product_code" ? true : false,
      SHOW_PRODUCT_PACKING:
        dados.filtros.dados == "productPacking_code" ? true : false,
      SHOW_FISCAL_PROFILE_OPERATION: false,
      SHOW_PERSON_GROUP:
        dados.filtros.dados == "personGroup_description" ? true : false,
      SHOW_SHIPPING: false,
      SHOW_SALESPERSON:
        dados.filtros.dados == "salesperson_name" ||
        dados.filtros.agrupamento == "salesperson_name"
          ? true
          : false,
      SHOW_PRODUCT_CATEGORY_1:
        dados.filtros.dados == "product_category_description_1" ? true : false,
      SHOW_PRODUCT_CATEGORY_2: false,
      SHOW_PRODUCT_CATEGORY_3: false,
      SHOW_PRODUCT_CATEGORY_4: false,
      SHOW_PRODUCT_CATEGORY_5: false,
      SHOW_SALES_HUB: false,
      SHOW_SALES_CHANNEL: false,
      SHOW_TAXATION_OPERATION: false,
      SHOW_PRODUCT_VARIANT: false,
      SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
      SHOW_PRODUCT_PROPERTIES_BR_CEST: false,
      SHOW_INVOICE_SERIES: false,
      PERSON_IDS:
        dados.filtros.cliente != "" ? `{${dados.filtros.cliente}}` : null,
      SALESPERSON_IDS:
        dados.filtros.vendedor != "" ? `{${dados.filtros.vendedor}}` : null,
      CITY_IDS: null,
      STATE_IDS: null,
      COUNTRY_IDS: null,
      PRODUCT_IDS: dados.filtros.produtomestre,
      PRODUCT_PACKING_IDS: dados.filtros.produtograde,
      TAXATION_OPERATION_IDS: null,
      COMPANY_IDS: dados.filtros.empresas,
      FISCAL_PROFILE_OPERATION_IDS: null,
      INVOICE_SERIES_IDS: null,
      DATE_START: `${dados.filtros.dt_ini}`,
      DATE_END: `${dados.filtros.dt_fim}`,
      MAX_RECORDS: null,
      FISCAL_PROFILE_OPERATION_TAGS: ["expense", "revenue"]
    },*/
  
  try {
    const query = await axios
      .post(`${ERP_CONF.reportPrint}`,postData, {
        timeout: 20000,
                headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${dados.token}`,
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
/*
exports.getPedidoDeVendas = async (dados) => {
console.log(dados)



  const columns = [
    "sale_id",
    "sale_status",
    "sale_date",
    "person_nameCalc",
    "productPacking_code",
    "productPacking_descriptionCalc",
    "sum_quantity",
    "sum_totalValue"
  ];

  const groupColumnMap = {
    sale_id: "sale_id",
    sale_status: "sale_status",
    sale_date: "sale_date",
    person_nameCalc: "person_nameCalc",
    productPacking_code: "productPacking_code",
    productPacking_descriptionCalc: "productPacking_descriptionCalc"
  };

  const groupColumn = groupColumnMap[dados.group1];

  const filteredColumns = columns.filter(
    column => column !== groupColumn
  );

  // Obtem as empresas apontadas ou verifico quais estao ativas para filtro
  if (dados.company == null) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();
    dados.company = empresasAtivas;
  }

  const postData = {
    code: `/sale/report/saleList`,

    parameters: {
      DATE_START: `${dados.dateStart}`,
      DATE_END: `${dados.dateEnd}`,
      AVAILABILITY_DATE_END:`${dados.availabilityDateStart}`,
      AVAILABILITY_DATE_START:`${dados.availabilityDateEnd}`,
      SALESPERSON_IDS:`${dados.salesperson}`,
      PERSON_SALESPERSON_PERSON_SALESPERSON_IDS:`${dados.supervisorId}`,
      PERSON_IDS:`${dados.person}`,
      PRODUCT_IDS:`${dados.product}`,
      PRODUCT_PACKING_IDS:`${dados.productPacking}`,
      SHOW_SALE: true,
      SHOW_STATUS: true,
      SHOW_WORKFLOW: false,
      SHOW_WORKFLOW_NODE: false,

      SHOW_DATE: true,
      SHOW_DAY: false,
      SHOW_MONTH: false,
      SHOW_YEAR: false,
      SHOW_ISSUE_DATE: false,

      SHOW_FREIGHT_TYPE: false,

      SHOW_COMPANY: false,
      SHOW_FISCAL_PROFILE_OPERATION: false,
      SHOW_SALE_PROFILE: false,

      SHOW_CURRENCY: true,

      SHOW_PERSON: true,
      SHOW_PERSON_GROUP: false,

      SHOW_CITY: false,
      SHOW_STATE: false,
      SHOW_COUNTRY: false,

      SHOW_SHIPPING: false,

      SHOW_PRODUCT: true,
      SHOW_PRODUCT_UNIT: false,
      SHOW_FISCAL_PROFILE_PRODUCT: false,

      SHOW_PRODUCT_PACKING: true,
      SHOW_UNITS: false,
      SHOW_PRODUCT_VARIANT: true,

      SHOW_TAXATION_OPERATION: false,
      SHOW_ACCOUNT: false,

      SHOW_UNIT: true,
      SHOW_UNIT_VALUE: false,
      SHOW_COST_UNIT_VALUE: false,
      SHOW_RETAIL_UNIT_VALUE: false,

      
      SHOW_PERSON_SALESPERSON_PERSON_SALESPERSON: false,





      SHOW_SALESPERSON:
        dados.salesperson 
          ? true
          : false,
 








      
      SHOW_SALES_COMMISSION: false,
      SHOW_SALES_HUB: false,
      SHOW_SALES_CHANNEL: false,

      SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
      SHOW_PRODUCT_PROPERTIES_BR_CEST: false,

      SHOW_PERSON_CATEGORY_1: false,
      SHOW_PRODUCT_CATEGORY_1: false,
      SHOW_SALESPERSON_CATEGORY_1: false,

      SHOW_PERSON_CATEGORY_2: false,
      SHOW_PRODUCT_CATEGORY_2: false,
      SHOW_SALESPERSON_CATEGORY_2: false,

      SHOW_PERSON_CATEGORY_3: false,
      SHOW_PRODUCT_CATEGORY_3: false,
      SHOW_SALESPERSON_CATEGORY_3: false,

      SHOW_PERSON_CATEGORY_4: false,
      SHOW_PRODUCT_CATEGORY_4: false,
      SHOW_SALESPERSON_CATEGORY_4: false,

      SHOW_PERSON_CATEGORY_5: false,
      SHOW_PRODUCT_CATEGORY_5: false,
      SHOW_SALESPERSON_CATEGORY_5: false,

      MAX_RECORDS: `${dados.maxRecords}`
    },

    dataSource: {
      code: "/sale/report/saleCube",

      parameters: {
        DATE_START: `${dados.dateStart}`,
        DATE_END: `${dados.dateEnd}`,
      
        SHOW_SALE: true,
        SHOW_STATUS: true,
        SHOW_WORKFLOW: false,
        SHOW_WORKFLOW_NODE: false,

        SHOW_DATE: true,
        SHOW_DAY: false,
        SHOW_MONTH: false,
        SHOW_YEAR: false,
        SHOW_ISSUE_DATE: false,

        SHOW_FREIGHT_TYPE: false,

        SHOW_COMPANY: false,
        SHOW_FISCAL_PROFILE_OPERATION: false,
        SHOW_SALE_PROFILE: false,

        SHOW_CURRENCY: true,

        SHOW_PERSON: true,
        SHOW_PERSON_GROUP: false,

        SHOW_CITY: false,
        SHOW_STATE: false,
        SHOW_COUNTRY: false,

        SHOW_SHIPPING: false,

        SHOW_PRODUCT: true,
        SHOW_PRODUCT_UNIT: false,
        SHOW_FISCAL_PROFILE_PRODUCT: false,

        SHOW_PRODUCT_PACKING: true,
        SHOW_UNITS: false,
        SHOW_PRODUCT_VARIANT: true,

        SHOW_TAXATION_OPERATION: false,
        SHOW_ACCOUNT: false,

        SHOW_UNIT: true,
        SHOW_UNIT_VALUE: false,
        SHOW_COST_UNIT_VALUE: false,
        SHOW_RETAIL_UNIT_VALUE: false,

        SHOW_SALESPERSON: false,
        SHOW_PERSON_SALESPERSON_PERSON_SALESPERSON: false,

        SHOW_SALES_COMMISSION: false,
        SHOW_SALES_HUB: false,
        SHOW_SALES_CHANNEL: false,

        SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
        SHOW_PRODUCT_PROPERTIES_BR_CEST: false,

        SHOW_PERSON_CATEGORY_1: false,
        SHOW_PRODUCT_CATEGORY_1: false,
        SHOW_SALESPERSON_CATEGORY_1: false,

        SHOW_PERSON_CATEGORY_2: false,
        SHOW_PRODUCT_CATEGORY_2: false,
        SHOW_SALESPERSON_CATEGORY_2: false,

        SHOW_PERSON_CATEGORY_3: false,
        SHOW_PRODUCT_CATEGORY_3: false,
        SHOW_SALESPERSON_CATEGORY_3: false,

        SHOW_PERSON_CATEGORY_4: false,
        SHOW_PRODUCT_CATEGORY_4: false,
        SHOW_SALESPERSON_CATEGORY_4: false,

        SHOW_PERSON_CATEGORY_5: false,
        SHOW_PRODUCT_CATEGORY_5: false,
        SHOW_SALESPERSON_CATEGORY_5: false,

        MAX_RECORDS: Number(dados.maxRecords) || 20000,

        COMPANY_IDS: dados.company
          ? `{${dados.company}}`
          : null,

        SALESPERSON_IDS: dados.salesperson
          ? `{${dados.salesperson}}`
          : null,
        PERSON_IDS: dados.person
          ? `{${dados.person}}`
          : null,
          PERSON_SALESPERSON_PERSON_SALESPERSON_IDS
          : dados.supervisorId
          ? `{${dados.supervisorId}}`
          : null,
          PRODUCT_IDS
          : dados.product
          ? `{${dados.product}}`
          : null,
          PRODUCT_PACKING_IDS
          : dados.productPacking
          ? `{${dados.productPacking}}`
          : null

        }
    },

      "properties": {
        "filters": {
            "fiscalProfileOperationTags": "expense,revenue",
            "sign": "-1",
            "mult": "-1",
             "dateStart": `${dados.dateStart}`,
          "dateEnd": `${dados.dateEnd}`
        },
           columns: filteredColumns, 
        groups: [
          {
            columnId: dados.group1 || "sale_date",
            break: false
          }
        ],
    
        sort: [
          {
            columnId: dados.sort1 || "sale_date",
            direction: "asc"
          },
          {
            columnId: "sale_id",
            direction: "asc"
          }
        ]
    }
    
  };

  try {
    const query = await axios
      .post(`${ERP_CONF.reportPrint}`, postData, {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${dados.token}`,
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
*/
exports.getPedidoDeVendas = async (dados) => {
  console.log(dados);

  const statusList = dados.status ? `{${dados.status}}` : null;

  const columns = [
    "sale_id",
    "sale_status",
    "sale_date",
    "person_nameCalc",
    "productPacking_code",
    "productPacking_descriptionCalc",
    "sum_quantity",
    "saleItem_unitValue",
    "sum_totalValue",
  ];

  const groupColumnMap = {
    sale_id: "sale_id",
    sale_status: "sale_status",
    sale_date: "sale_date",
    person_nameCalc: "person_nameCalc",
    productPacking_code: "productPacking_code",
    productPacking_descriptionCalc: "productPacking_descriptionCalc",
  };

  const groupColumn = groupColumnMap[dados.group1];

  const filteredColumns = columns.filter((column) => column !== groupColumn);

  // Obtem as empresas apontadas ou verifico quais estao ativas para filtro
  if (dados.company == null) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();
    dados.company = empresasAtivas;
  }

  const postData = {
    code: `/sale/report/saleList`,

    parameters: {
      DATE_START: `${dados.dateStart}`,
      DATE_END: `${dados.dateEnd}`,
      AVAILABILITY_DATE_END: `${dados.availabilityDateStart}`,
      AVAILABILITY_DATE_START: `${dados.availabilityDateEnd}`,
      SALESPERSON_IDS: `${dados.salesperson}`,
      PERSON_IDS: `${dados.person}`,
      PRODUCT_IDS: `${dados.product}`,
      PRODUCT_PACKING_IDS: `${dados.productPacking}`,
      STATUS_LIST: statusList,
      SHOW_SALE: true,
      SHOW_STATUS: true,
      SHOW_WORKFLOW: false,
      SHOW_WORKFLOW_NODE: false,

      SHOW_DATE: true,
      SHOW_DAY: false,
      SHOW_MONTH: false,
      SHOW_YEAR: false,
      SHOW_ISSUE_DATE: false,

      SHOW_FREIGHT_TYPE: false,

      SHOW_COMPANY: false,
      SHOW_FISCAL_PROFILE_OPERATION: false,
      SHOW_SALE_PROFILE: false,

      SHOW_CURRENCY: true,

      SHOW_PERSON: true,
      SHOW_PERSON_GROUP: false,

      SHOW_CITY: false,
      SHOW_STATE: false,
      SHOW_COUNTRY: false,

      SHOW_SHIPPING: false,

      SHOW_PRODUCT: true,
      SHOW_PRODUCT_UNIT: false,
      SHOW_FISCAL_PROFILE_PRODUCT: false,

      SHOW_PRODUCT_PACKING: true,
      SHOW_UNITS: false,
      SHOW_PRODUCT_VARIANT: true,

      SHOW_TAXATION_OPERATION: false,
      SHOW_ACCOUNT: false,

      SHOW_UNIT: true,
      SHOW_UNIT_VALUE: false,
      SHOW_COST_UNIT_VALUE: false,
      SHOW_RETAIL_UNIT_VALUE: false,

      SHOW_PERSON_SALESPERSON_PERSON_SALESPERSON: false,

      SHOW_SALESPERSON: dados.salesperson ? true : false,

      SHOW_SALES_COMMISSION: false,
      SHOW_SALES_HUB: false,
      SHOW_SALES_CHANNEL: false,

      SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
      SHOW_PRODUCT_PROPERTIES_BR_CEST: false,

      SHOW_PERSON_CATEGORY_1: false,
      SHOW_PRODUCT_CATEGORY_1: false,
      SHOW_SALESPERSON_CATEGORY_1: false,

      SHOW_PERSON_CATEGORY_2: false,
      SHOW_PRODUCT_CATEGORY_2: false,
      SHOW_SALESPERSON_CATEGORY_2: false,

      SHOW_PERSON_CATEGORY_3: false,
      SHOW_PRODUCT_CATEGORY_3: false,
      SHOW_SALESPERSON_CATEGORY_3: false,

      SHOW_PERSON_CATEGORY_4: false,
      SHOW_PRODUCT_CATEGORY_4: false,
      SHOW_SALESPERSON_CATEGORY_4: false,

      SHOW_PERSON_CATEGORY_5: false,
      SHOW_PRODUCT_CATEGORY_5: false,
      SHOW_SALESPERSON_CATEGORY_5: false,

      MAX_RECORDS: `${dados.maxRecords}`,
    },

    dataSource: {
      code: "/sale/report/saleCube",

      parameters: {
        DATE_START: `${dados.dateStart}`,
        DATE_END: `${dados.dateEnd}`,
        STATUS_LIST: statusList,
        SHOW_SALE: true,
        SHOW_STATUS: true,
        SHOW_WORKFLOW: false,
        SHOW_WORKFLOW_NODE: false,

        SHOW_DATE: true,
        SHOW_DAY: false,
        SHOW_MONTH: false,
        SHOW_YEAR: false,
        SHOW_ISSUE_DATE: false,

        SHOW_FREIGHT_TYPE: false,

        SHOW_COMPANY: false,
        SHOW_FISCAL_PROFILE_OPERATION: false,
        SHOW_SALE_PROFILE: false,

        SHOW_CURRENCY: true,

        SHOW_PERSON: true,
        SHOW_PERSON_GROUP: false,

        SHOW_CITY: false,
        SHOW_STATE: false,
        SHOW_COUNTRY: false,

        SHOW_SHIPPING: false,

        SHOW_PRODUCT: true,
        SHOW_PRODUCT_UNIT: false,
        SHOW_FISCAL_PROFILE_PRODUCT: false,

        SHOW_PRODUCT_PACKING: true,
        SHOW_UNITS: false,
        SHOW_PRODUCT_VARIANT: true,

        SHOW_TAXATION_OPERATION: false,
        SHOW_ACCOUNT: false,

        SHOW_UNIT: true,
        SHOW_UNIT_VALUE: false,
        SHOW_COST_UNIT_VALUE: false,
        SHOW_RETAIL_UNIT_VALUE: false,

        SHOW_SALESPERSON: false,
        SHOW_PERSON_SALESPERSON_PERSON_SALESPERSON: false,

        SHOW_SALES_COMMISSION: false,
        SHOW_SALES_HUB: false,
        SHOW_SALES_CHANNEL: false,

        SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
        SHOW_PRODUCT_PROPERTIES_BR_CEST: false,

        SHOW_PERSON_CATEGORY_1: false,
        SHOW_PRODUCT_CATEGORY_1: false,
        SHOW_SALESPERSON_CATEGORY_1: false,

        SHOW_PERSON_CATEGORY_2: false,
        SHOW_PRODUCT_CATEGORY_2: false,
        SHOW_SALESPERSON_CATEGORY_2: false,

        SHOW_PERSON_CATEGORY_3: false,
        SHOW_PRODUCT_CATEGORY_3: false,
        SHOW_SALESPERSON_CATEGORY_3: false,

        SHOW_PERSON_CATEGORY_4: false,
        SHOW_PRODUCT_CATEGORY_4: false,
        SHOW_SALESPERSON_CATEGORY_4: false,

        SHOW_PERSON_CATEGORY_5: false,
        SHOW_PRODUCT_CATEGORY_5: false,
        SHOW_SALESPERSON_CATEGORY_5: false,

        MAX_RECORDS: Number(dados.maxRecords) || 20000,

        COMPANY_IDS: dados.company ? `{${dados.company}}` : null,

        SALESPERSON_IDS: dados.salesperson ? `{${dados.salesperson}}` : null,
        PERSON_IDS: dados.person ? `{${dados.person}}` : null,
        PRODUCT_IDS: dados.product ? `{${dados.product}}` : null,
        PRODUCT_PACKING_IDS: dados.productPacking
          ? `{${dados.productPacking}}`
          : null,
      },
    },

    properties: {
      filters: {
        fiscalProfileOperationTags: "expense,revenue",
        sign: "-1",
        mult: "-1",

        dateStart: `${dados.dateStart}`,
        dateEnd: `${dados.dateEnd}`,
      },
      columns: filteredColumns,
      groups: [
        {
          columnId: dados.group1 || "sale_date",
          break: false,
        },
      ],

      sort: [
        {
          columnId: dados.sort1 || "sale_date",
          direction: "asc",
        },
        {
          columnId: "sale_id",
          direction: "asc",
        },
      ],
    },
  };

  try {
    const query = await axios
      .post(`${ERP_CONF.reportPrint}`, postData, {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${dados.token}`,
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
//metodos do primeiro banco
exports.getVendaSintetico = async (filtro) => {
  filtro.supervisor ? (filtro.gerente = filtro.supervisor) : "";

  console.log(`select
a.detalhe_id,
a.detalhe,
a.numero_sistema,
a.pedido_numero,
cast(a.emissao as varchar(50)) as a.emissao,
cast(a.previsao as varchar(50)) as a.previsao,
a.cliente,
a.vendedor,
a.status,
a.valor_total
from
sp_sb_rel_vendas_sintetica(${
    filtro.agrupamento === "" ? null : filtro.agrupamento
  }, ${filtro.filtro_data === "" ? null : filtro.filtro_data}, ${
    filtro.dt_inicial === "" ? null : filtro.dt_inicial
  }, ${filtro.dt_final === "" ? null : filtro.dt_final},  ${
    filtro.cliente === "" ? null : filtro.cliente
  },
${filtro.vendedor === "" ? null : filtro.vendedor}, ${
    filtro.gerente === "" ? null : filtro.gerente
  }, ${filtro.produto === "" ? null : filtro.produto}, 
${filtro.status === "" ? null : filtro.status}) a
order by
a.detalhe,
a.detalhe_id,
a.numero_sistema`);
  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      var sql = `select
      a.detalhe_id,
      a.detalhe,
      a.numero_sistema,
      a.pedido_numero,
      cast(a.emissao as varchar(50)) as emissao,
      cast(a.previsao as varchar(50)) as previsao,
      a.cliente,
      a.vendedor,
      a.status,
      a.valor_total
     from
      sp_sb_rel_vendas_sintetica(${
        filtro.agrupamento === "" ? null : filtro.agrupamento
      }, ${filtro.filtro_data === "" ? null : filtro.filtro_data}, ${
        filtro.dt_inicial === "" ? null : filtro.dt_inicial
      }, ${filtro.dt_final === "" ? null : filtro.dt_final},  ${
        filtro.cliente === "" ? null : filtro.cliente
      },
      ${filtro.vendedor === "" ? null : filtro.vendedor}, ${
        filtro.gerente === "" ? null : filtro.gerente
      }, ${filtro.produto === "" ? null : filtro.produto}, 
      ${filtro.status === "" ? null : filtro.status}) a
     order by
      a.detalhe,
      a.detalhe_id,
      a.numero_sistema`;

      db.query(`${sql}`, function (err, result) {
        try {
          if (err) {
            console.log(err);

            return err;
          }
          if (result != undefined) {
            //console.log(result);
            resolve(result);
            //return result;
          } else {
            reject(err);
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => console.log(err));

  return query;
};

exports.getVendaAnalitico = async (filtro) => {
  filtro.supervisor ? (filtro.gerente = filtro.supervisor) : "";
  filtro.saldo == "false" ? (filtro.saldo = "N") : (filtro.saldo = "S");
  console.log(`select
a.detalhe_id,
a.detalhe,
a.numero_sistema,
a.pedido_numero,
cast(a.emissao as varchar(50)) as a.emissao,
a.previsao,
a.cliente,
a.vendedor,
a.st
a.mestre_codigo,
a.mestre_nome,
a.item_codigo,
a.item_nome,
a.item_grade,
a.quantidade,
a.unidade,
a.valor_unitario,
a.valor_total
from
sp_sb_rel_vendas_analitica(${
    filtro.agrupamento === "" ? null : filtro.agrupamento
  }, ${filtro.filtro_data === "" ? null : filtro.filtro_data}, 
${filtro.dt_inicial === "" ? null : filtro.dt_inicial}, ${
    filtro.dt_final === "" ? null : filtro.dt_final
  }, ${filtro.cliente === "" ? null : filtro.cliente}, 
${filtro.vendedor === "" ? null : filtro.vendedor}, ${
    filtro.gerente === "" ? null : filtro.gerente
  }, ${filtro.produto === "" ? null : filtro.produto}, 
  ${filtro.status === "" ? null : `'${filtro.status}'`}, ${
    filtro.classe === "" ? null : filtro.classe
  }) a
order by
a.detalhe,
a.detalhe_id,
a.numero_sistema`);
  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      var sql = `select
      a.detalhe_id,
      a.detalhe,
      a.numero_sistema,
      a.pedido_numero,
      cast(a.emissao as varchar(50)) as emissao,
      cast(a.previsao as varchar(50)) as previsao,
      a.cliente,
      a.vendedor,
      a.status,
      a.mestre_codigo,
      a.mestre_nome,
      a.item_codigo,
      a.item_nome,
      a.item_grade,
      a.quantidade,
      a.unidade,
      a.valor_unitario,
      a.valor_total
     from
      sp_sb_rel_vendas_analitica(${
        filtro.agrupamento === "" ? null : filtro.agrupamento
      }, ${filtro.filtro_data === "" ? null : filtro.filtro_data}, 
      ${filtro.dt_inicial === "" ? null : filtro.dt_inicial}, ${
        filtro.dt_final === "" ? null : filtro.dt_final
      }, ${filtro.cliente === "" ? null : filtro.cliente}, 
      ${filtro.vendedor === "" ? null : filtro.vendedor}, ${
        filtro.gerente === "" ? null : filtro.gerente
      }, ${filtro.produto === "" ? null : filtro.produto}, 
      ${filtro.status === "" ? null : `'${filtro.status}'`}, ${
        filtro.classe === "" ? null : filtro.classe
      }) a
     order by
      a.detalhe,
      a.detalhe_id,
      a.numero_sistema`;

      db.query(`${sql}`, function (err, result) {
        try {
          if (err) {
            console.log(err);

            return err;
          }
          if (result != undefined) {
            //console.log(result);
            resolve(result);
            //return result;
          } else {
            reject(err);
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => console.log(err));

  return query;
};
exports.getProgramacao = async (filtro) => {
  filtro.saldo == "false" ? (filtro.saldo = "N") : (filtro.saldo = "S");
  filtro.parametro = filtro.parametro !== "" ? `'${filtro.parametro}'` : null;
  filtro.classe_id = filtro.classe_id !== "" ? `'${filtro.classe_id}'` : null;

  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      var sql = `select
      a.pedido,
      a.previsao,
      a.mestre_id,
      a.mestre_codigo,
      a.mestre_nome,
      a.item_id,
      a.item_codigo,
      a.item_grade,
      a.item_unidade,
      a.valor_unitario,
      a.estoque,
      a.reserva,
      a.saldo
    from
      sp_sb_rel_programacao(${filtro.parametro}, ${filtro.classe_id}, '${filtro.saldo}') a
    order by
      mestre_codigo,
      mestre_id,
      pedido,
      item_codigo,
      item_id`;

      db.query(`${sql}`, function (err, result) {
        try {
          if (err) {
            console.log(err);

            return err;
          }
          if (result != undefined) {
            //console.log(result);
            resolve(result);
            //return result;
          } else {
            reject(err);
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => console.log(err));

  return query;
};

exports.getProntaEntrega = async (filtro) => {
  filtro.parametro = filtro.parametro !== "" ? `'${filtro.parametro}'` : null;
  filtro.classe_id = filtro.classe_id !== "" ? `'${filtro.classe_id}'` : null;
  console.log(filtro);
  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      var sql = `select
             a.mestre_id,
             a.mestre_codigo,
             a.mestre_nome,
             a.item_id,
             a.item_codigo,
             a.item_grade,
             a.item_unidade,
             a.valor_unitario,
             a.estoque,
             a.reserva,
             a.saldo
           from
             sp_sb_rel_pronta_entrega(${filtro.parametro}, ${filtro.classe_id}) a
           order by
             mestre_codigo,
             mestre_id,
             item_codigo,
             item_id`;
      db.query(`${sql}`, function (err, result) {
        try {
          if (err) {
            console.log(err);

            return err;
          }
          if (result != undefined) {
            //      console.log(result);
            resolve(result);
            //return result;
          } else {
            reject(err);
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => console.log(err));

  return query;
};

exports.getEIR4002 = async (filtro) => {
  console.log(filtro);

  var vendedor = "";
  var where_sup1 = "";
  var where_sup2 = "";

  filtro.vendedor
    ? (vendedor = vendedor + `and (a.conta_id_vendedor = '${filtro.vendedor}')`)
    : "";

  if (filtro.supervisor) {
    where_sup1 = `and (c.u4_conta_id_gerente = ${filtro.supervisor})`;
    where_sup2 = `and (e.u4_conta_id_gerente = ${filtro.supervisor})`;
  }

  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      var sql = `select
           cast(null as varchar(100)) as id,
           a.conta_id_vendedor,
           (select s1.nome from cad1 s1 where s1.numcad1 = a.conta_id_vendedor) as vendedor_nome,
           cast('SaldoAnterior' as varchar(50)) as tipo,
           cast(null as date) as data,
           cast(null as varchar(100)) as comissao_descricao,
           cast(null as varchar(100)) as conta_nome,
           cast(null as varchar(100)) as conta_apelido,
           cast(null as varchar(100)) as conta_id,
           cast(null as numeric(11,2)) as valor_contabil,
           cast(null as numeric(11,2)) as comissao_base_calc,
           cast(null as numeric(5,2)) as comissao_porc,
           coalesce(sum(a.comissao_valor), 0) as comissao_valor,
           0 as order_column,
           cast(null as varchar(50)) as pedido_numero,
           cast(null as varchar(50)) as nf_numero  
         from
           v3$comissoes a
           left join cad1 c on c.numcad1 = a.conta_id_vendedor
         where
           (a.data < '${filtro.dt_ini}')
           ${vendedor}
           and (c.u4_gerente = 'N')   
           ${where_sup1}
   
         group by
           a.conta_id_vendedor
         union all
         select
           a.id,
           min(a.conta_id_vendedor) as conta_id_vendedor,
           (select s1.nome from cad1 s1 where s1.numcad1 = min(a.conta_id_vendedor)) as vendedor_nome,
           min(a.tipo) as tipo,
           a.data as data,
           a.descricao as comissao_descricao,
           max(c.nome) as conta_nome,
           max(c.apelido) as conta_apelido,
           c.numcad1 as conta_id,
           sum(a.valor_contabil) as valor_contabil,
           sum(a.comissao_base_calc) as comissao_base_calc,
           a.comissao_porc,
           sum(a.comissao_valor) as comissao_valor,
           1 as order_column,
           (select result from sp_propriedades_obter(min(a.observacoes), 'pedido_numero')) as pedido_numero,
           (select result from sp_propriedades_obter(min(a.observacoes), 'nf_numero')) as nf_numero
         from
           v3$comissoes a
           inner join cad1 e on e.numcad1 = a.conta_id_vendedor                                                                                                                   
           left join cad1 c on c.numcad1 = a.conta_id
         where
           (a.data between '${filtro.dt_ini}' and '${filtro.dt_fim}')
           ${vendedor}
           and (e.u4_gerente = 'N')
           ${where_sup2}
         group by
           a.id,
           a.data,
           a.descricao,
           a.comissao_porc,
           c.numcad1
         order by
           3,
           2,
           14,
           4,
           5`;
      db.query(`${sql}`, function (err, result) {
        try {
          if (err) {
            console.log(err);

            return err;
          }
          if (result != undefined) {
            //      console.log(result);
            resolve(result);
            //return result;
          } else {
            reject(err);
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => console.log(err));

  return query;
};

exports.getEIR6000 = async (dados) => {
  //Obtem as empresas apontadas ou verifico quais estao ativas para filtro
  dados.filtros.empresas = JSON.parse(dados.filtros.empresas);
  if (dados.filtros.empresas == null) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();
    dados.filtros.empresas = empresasAtivas;
  }

  dados.filtros.produtograde = JSON.parse(dados.filtros.produtograde);
  dados.filtros.produtomestre = JSON.parse(dados.filtros.produtomestre);

  const postData = {
    code: `${dados.relatorio}`,
    parameters: {
      MULT: -1,
      SIGN: -1,
      SHOW_INVOICE: dados.filtros.relatorio == "EIR6000COM" ? true : false,
      SHOW_COMPANY: false,
      SHOW_CITY:
        dados.filtros.dados == "city_name" ||
        dados.filtros.agrupamento == "city_name"
          ? true
          : false,
      SHOW_STATE:
        dados.filtros.dados == "state_name" ||
        dados.filtros.agrupamento == "state_code"
          ? true
          : false,
      SHOW_COUNTRY: false,
      SHOW_QUANTITY: false,
      SHOW_PERSON: dados.filtros.dados == "person_nameCalc" ? true : false,
      SHOW_PRODUCT: dados.filtros.dados == "product_code" ? true : false,
      SHOW_PRODUCT_PACKING:
        dados.filtros.dados == "productPacking_code" ? true : false,
      SHOW_FISCAL_PROFILE_OPERATION: false,
      SHOW_PERSON_GROUP:
        dados.filtros.dados == "personGroup_description" ? true : false,
      SHOW_SHIPPING: false,
      SHOW_SALESPERSON:
        dados.filtros.dados == "salesperson_name" ||
        dados.filtros.agrupamento == "salesperson_name"
          ? true
          : false,
      SHOW_PRODUCT_CATEGORY_1:
        dados.filtros.dados == "product_category_description_1" ? true : false,
      SHOW_PRODUCT_CATEGORY_2: false,
      SHOW_PRODUCT_CATEGORY_3: false,
      SHOW_PRODUCT_CATEGORY_4: false,
      SHOW_PRODUCT_CATEGORY_5: false,
      SHOW_SALES_HUB: false,
      SHOW_SALES_CHANNEL: false,
      SHOW_TAXATION_OPERATION: false,
      SHOW_PRODUCT_VARIANT: false,
      SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
      SHOW_PRODUCT_PROPERTIES_BR_CEST: false,
      SHOW_INVOICE_SERIES: false,
      PERSON_IDS:
        dados.filtros.cliente != "" ? `{${dados.filtros.cliente}}` : null,
      SALESPERSON_IDS:
        dados.filtros.vendedor != "" ? `{${dados.filtros.vendedor}}` : null,
      CITY_IDS: null,
      STATE_IDS: null,
      COUNTRY_IDS: null,
      PRODUCT_IDS: dados.filtros.produtomestre,
      PRODUCT_PACKING_IDS: dados.filtros.produtograde,
      TAXATION_OPERATION_IDS: null,
      COMPANY_IDS: dados.filtros.empresas,
      FISCAL_PROFILE_OPERATION_IDS: null,
      INVOICE_SERIES_IDS: null,
      DATE_START: `${dados.filtros.dt_ini}`,
      DATE_END: `${dados.filtros.dt_fim}`,
      MAX_RECORDS: null,
      FISCAL_PROFILE_OPERATION_TAGS: ["expense", "revenue"]
    },
  };
  try {
    const query = await axios
      .post(`${ERP_CONF.reportData}`, postData, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${dados.token}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        // console.log(result)
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

exports.getEGR1000 = async (dados) => {
  console.log("acesosu");
  const filtros = JSON.parse(dados.filtros);
  const filtros_search = {};
  for (const chave in filtros) {
    if (filtros.hasOwnProperty(chave)) {
      const valor = filtros[chave];
      filtros_search[chave] = `${valor}`;
    }
  }
  //filtros_search.document_number_1 = filtros_search.document_number_1?filtros_search.document_number_1.replace(/[.-]/g, ""):''
  //filtros_search.type = filtros_search.type == "" ? null : filtros_search.type;
  filtros_search.city
    ? (filtros_search.city = JSON.parse(filtros_search.city))
    : null;
  filtros_search.state
    ? (filtros_search.state = JSON.parse(filtros_search.state))
    : null;

  const postData = {
    code: `${dados.relatorio}`,
    parameters: {
      IDS: null,
      NAMES: `{%${filtros_search.name}%}`,
      DOCUMENT_NUMBER_1: null,
      DOCUMENT_NUMBER_2: null,
      CITY_IDS: filtros_search.city ? `{${filtros_search.city}}` : null,
      STATE_IDS: filtros_search.state ? `{${filtros_search.state}}` : null,
      COUNTRY_IDS: null,
      FISCAL_PROFILE_PERSON_IDS: null,
      PERSON_GROUP_IDS: null,
      CATEGORY_IDS_1: null,
      CATEGORY_IDS_2: null,
      CATEGORY_IDS_3: null,
      CATEGORY_IDS_4: null,
      CATEGORY_IDS_5: null,
      CREATED_START: null,
      CREATED_END: null,
      TAGS: '{"customer"}',
      SALESPERSON_IDS: filtros_search.salesperson_id
        ? `{${filtros_search.salesperson_id}}`
        : null,
      TYPE: filtros_search.type ? filtros_search.type : null,
      MAX_RECORDS: filtros_search.qtd_registros,
    },
  };
  try {
    const query = await axios
      .post(`${ERP_CONF.reportData}`, postData, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${dados.token}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};
//  console.log(`${ERP_CONF.person}?${sintaxe})`)

/*
exports.getALP0008 = async (filtro) => {
  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      db.query(
        `
          select
          cast(? as integer) as dias_ativos,
          cast(? as date) as data_analise,
          a.vendedor_id,
          a.vendedor_nome_fantasia,
          a.vendedor_razao_social,
          a.cliente_id,
          a.cliente_nome_fantasia,
          a.cliente_razao_social,
          a.cliente_desde,
          a.ultima_compra,
          a.dias_inativos,
          a.cliente_telefone,
          a.grupo_ordem,
          a.grupo_descricao,
          a.clientes,
          a.ativos,
          a.inativos
        from
          sp_act0008(?, ?, ?, ?) a
          inner join cad1 b on b.numcad1 = a.vendedor_id
        where
          (a.ativos + a.inativos) > 0
          and a.dias_inativos >= ? 
        ${where}
        order by
          a.vendedor_razao_social,
          a.vendedor_id,
          a.grupo_ordem,
          a.dias_inativos,
          a.cliente_razao_social,
          a.cliente_id`,
        function (err, result) {
          try {
            if (err) {
              return err;
            }
            if (result != undefined) {
              resolve(result);
              //return result;
            } else {
              reject(err);
            }
          } catch (err) {
            reject(err);
          }
        }
      );
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => alert(err));

  return query;
};
*/
exports.getALP0008 = async (filtro) => {
  if (filtro.vendedor == "") {
    filtro.vendedor = -1;
  }

  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      db.query(
        `select
            cast(${filtro.dias_ativos} as integer) as dias_ativos,
            current_date as data_analise,
            a.vendedor_id,
            a.vendedor_nome_fantasia,
            a.vendedor_razao_social,
            a.cliente_id,
            a.cliente_nome_fantasia,
            a.cliente_razao_social,
            a.cliente_desde,
            a.ultima_compra,
            a.dias_inativos,
            a.cliente_telefone,
            a.grupo_ordem,
            a.grupo_descricao,
            a.clientes,
            a.ativos,
            a.inativos,
            b.endereco || coalesce(', ' || b.numero, '') || coalesce(', ' || b.bairro, '') || coalesce(', ' || b.complemento, '') || coalesce(' - ' || c.nome, '') || coalesce('/' || d.sigla, '') as endereco      
      from
            sp_act0008(${filtro.vendedor}, -1, ${filtro.dias_ativos}, current_date) a
            inner join cad1 b on b.numcad1 = a.cliente_id
            inner join cid1 c on c.numcid1 = b.numcid1
            inner join ufs1 d on d.numufs1 = c.numufs1                                                                                                    
      where
            (a.ativos + a.inativos) > 0
      order by
            a.vendedor_razao_social,
            a.vendedor_id,
            a.grupo_ordem,
            a.dias_inativos,
            a.cliente_razao_social,
            a.cliente_id`,
        function (err, result) {
          try {
            if (err) {
              //   console.log(err)
              return err;
            }
            if (result != undefined) {
              // console.log(result);
              resolve(result);
            } else {
              reject(err);
            }
          } catch (err) {
            reject(err);
          }
        }
      );
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => alert(err));

  return query;
};

exports.getDataALP0001 = async (filtro) => {
  const myPromise = new Promise((resolve, reject) => {
    db.bancoexterno.get(function (err, db) {
      const consulta = 7841;
      db.query(
        `select
  
   a.numv2$fin1 as financa_id,
   a.documento as financa_documento,
   a.parcela as financa_parcela,
   a.emissao as financa_emissao,
   a.entrada as financa_entrada,
   a.vencimento as financa_vencimento,
   b.nome as conta_nome,
   c.nome as carteira_nome,
   a.previsao,                                                    
   d.descricao as departamento,
   e.descricao as tipo_financa,
   a.valor as valor_financa,
   f.saldo as saldo_financa,
   a.cartorio,
   a.protesto,
   h.nome as nome_vendedor,
   g.conta_id_vendedor,
   coalesce((
     select
       sum(s1.descontos)
     from
       v2$fnr1 s1
     where
       (s1.numv2$fin1_liquidado = a.numv2$fin1)
   ), 0) as descontos,
   coalesce((
     select
       sum(s1.juros)
     from
       v2$fnr1 s1
     where
       (s1.numv2$fin1_liquidado = a.numv2$fin1)
   ), 0) as juros    
 from
   v2$fin1 a
   inner join cad1 b on b.numcad1 = a.numcad1
   inner join crt1 c on c.numcrt1 = a.numcrt1
   inner join v2$dpt1 d on d.numv2$dpt1 = a.numv2$dpt1
   inner join v2$tpf1 e on e.numv2$tpf1 = a.numv2$tpf1
   left join v2$fnt1 f on f.numv2$fin1 = a.numv2$fin1                                  
   left join v3$notas_fiscais g on g.id = a.nota_fiscal_id
   left join cad1 h on h.numcad1 = g.conta_id_vendedor
 where
   (a.es = 1)
   and (upper(a.situacao) not in ('CANCELAR','CANCELADA'))
   and (a.tipo_movimento = 'P')
  and g.conta_id_vendedor = '457901'
 order by
   /* ORDER */
   a.valor,                    
   a.numv2$fin1`,
        function (err, result) {
          try {
            if (err) {
              return err;
            }
            if (result != undefined) {
              // console.log(result);
              resolve(result);
              //return result;
            } else {
              reject(err);
            }
          } catch (err) {
            reject(err);
          }
        }
      );
      // return query;
      db.detach();
    });
    db.bancoexterno.destroy();
  });

  const query = myPromise
    .then((resultado) => {
      return resultado;
    })
    .catch((err) => alert(err));

  return query;
};

exports.getDataALP0002 = async (data) => {
  db.bancoexterno.get(function (err, db) {
    try {
      db.query(
        "select uuid_to_char(a.programacao_id) as programacao_id, a.empresa_id, a.empresa_apelido,  \
      a.descricao,      a.pe_ou_prog,      a.item_id,      a.item_codigo,      a.item_nome,      a.item_grade,  \
      a.item_unidade,      a.item_valor_unitario,      a.item_saldo,      a.item_previsao   \
      from      sp_ud_consulta_estoque(7840) a    \
      order by      a.item_codigo",
        function (err, result) {
          try {
            if (err) {

              return "erro";
            }

            if (result != undefined) {


              return result;
            } else {
            }
          } catch {

            return "erro ao buscar";
          }
        }
      );
      db.detach();
    } catch {
      console.log("Ocorreu um erro ao gerar o pool conexões");
    }
  });

  db.bancoexterno.destroy();
};

exports.getDataALP0002 = async (reqdata) => {
  const query = await axios
    .get(
      `http://modelo-erp.c.personalsoft.com.br/services/rest/v1/itens`,
      {
        auth: { username: "clienteps", password: "clienteps" },
        timeout: 150000,
      },
      {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      }
    )
    .then((result) => {
      return result.data;
    })
    .catch(function (error) {});

  return query;
};

/*
exports.getDataALP0001 = async (data) => {
console.log('1')

    db.bancoexterno.get(function(err, db) {
     try {
 
       db.query("select uuid_to_char(a.programacao_id) as programacao_id, a.empresa_id, a.empresa_apelido,  \
                         a.descricao,      a.pe_ou_prog,      a.item_id,      a.item_codigo,      a.item_nome,      a.item_grade,  \
                         a.item_unidade,      a.item_valor_unitario,      a.item_saldo,      a.item_previsao   \
                         from      sp_ud_consulta_estoque(7840) a    \
                         order by      a.item_codigo",
                           function(err, result) {     
                                  try {
                                       if (err) {
                                         return "erro";
                                           
                                       }
 
                                       if (result != undefined) {   
                                        console.log('tem coisa'+dados);
         
                                                 return result;
                                       } else {
                                                      }
                                 } catch {
                                     return "erro ao buscar";
                                 }
                         }
       );
       db.detach();
     } 
     catch {
           console.log("Ocorreu um erro ao gerar o pool conexões");
     }
   });
 
 
 db.bancoexterno.destroy();
   
 };
 


 exports.getDataALP0002 = async (reqdata) =>{


    const query = await axios.get(`http://modelo-erp.c.personalsoft.com.br/services/rest/v1/itens`,{
                auth:{ username: 'clienteps', password: 'clienteps'},
                timeout: 150000
            },
            {
                withCredentials: true,
                headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000'       ,Origin: 'http://localhost:3000'
                }
            })
            .then((result) => {
                          return result.data;
            })
            .catch(function(error) {
                          
            });

            return query;


}
*/
