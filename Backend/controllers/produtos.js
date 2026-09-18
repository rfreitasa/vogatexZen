const produtosModel = require("../models/produtos");
const userModel = require("../models/usuarios");
const carrinhoModel = require("../models/carrinho");
const empresaModel = require("../models/empresa");
const regrasModel = require("../models/regras");
const organizacaoModel = require("../models/organizacao");

const moment = require("moment");
const { REGRAS, API } = require("../configuration/api");

const { successResponse, errorResponse } = require("../libs/response");
const {
  validateCodigo,
  validateGetSaldo,
  validateNome,
  validateClasseCodigo,
  validateGrade,
} = require("../validators/produtos");
const { exists } = require("fs");
const { versions } = require("process");

const logStruct = (func, error) => {
  return { func: func, file: "ProdutosController", error };
};

const getSaldoCarrinho = async (reqData) => {
  try {
    const validInput = validateGetSaldo(reqData);
    var lista_produtos_sem_estoque = "nao";
    //  var vende_produtos_sem_estoque = 'nao';
    const responseOrganizacao = await organizacaoModel.getOrganizacoes();

    const organizacao = responseOrganizacao?.find(
      (org) =>
        org.ORGANIZACAO_PRODUTO_SESTOQUE != null ||
        org.ORGANIZACAO_VENDE_SESTOQUE != null
    );

    if (organizacao?.ORGANIZACAO_PRODUTO_SESTOQUE === 0) {
      // 0 = Permite Listar produtos sem estoque
      lista_produtos_sem_estoque = "sim";
    }

    /*if (organizacao?.ORGANIZACAO_VENDE_SESTOQUE === 0) {
      // 0 = Permite vender produtos sem estoque
      vende_produtos_sem_estoque = 'sim';
    }
*/
    if (validInput) {
      //remove todos os carrinho abertos a mais de 30 minutos
      await carrinhoModel.RemovecarrinhosVencidos();
      const DadosDoUsuario = await carrinhoModel.getDataUser(validInput.email);
      const DadosEmpresa = await empresaModel.getEmpresaById_ERP(
        reqData.empresa_id
      );

      reqData.empresa_apelido = DadosEmpresa[0].EMPRESA_NOME;

      //reqData.empresa_id_erp = API.tenant == 'act' ? reqData.empresa_id == '1001' ? '1004' : '1003' : reqData.empresa_id;
      //reqData.empresa_id_erp = DadosEmpresa.find(item => Number(item.EMPRESA_CLUSTER) === Number(reqData.empresa_id)).EMPRESA_ID_ERP
      reqData.empresa_id_erp = reqData.empresa_id;

      if (DadosDoUsuario && DadosDoUsuario.length) {
        validInput.usuario_id = DadosDoUsuario[0].usuario_id;
        validInput.conta_id = DadosDoUsuario[0].usuario_conta_id_erp;
        validInput.nome_conta = DadosDoUsuario[0].usuario_nome;
        validInput.organizacao_id = DadosDoUsuario[0].organizacao_id;
        validInput.usuario_nome = DadosDoUsuario[0].usuario_nome;
        validInput.password_erp = DadosDoUsuario[0].usuario_password_erp;
        validInput.codigo = reqData.item_id; //codigo do produto
        validInput.cod_carrinho;
        validInput.programacao_data = reqData.programacao_data;
        //Verifica se há um carrinho em aberto para o usuário ( 30 minutos de tolerancia)
        const HacarrinhoemAberto = await carrinhoModel.HacarrinhoemAberto(
          validInput.usuario_id
        ); //somente

        const produtoDataERP = await produtosModel.getProdutos(
          validInput,
          reqData.token_erp
        );

        var resultadoFiltrado = "";
        if (produtoDataERP) {
          reqData.empresa_id_cluster = DadosEmpresa[0].EMPRESA_CLUSTER;
          //reqData.empresa_cluster =  DadosEmpresa.find(item => Number(item.EMPRESA_CLUSTER) === Number(response_organized[index].stockCluster_id)).EMPRESA_CLUSTER;
          resultadoFiltrado =
            reqData.empresa_id_cluster != reqData.empresa_id
              ? produtoDataERP.filter((produto) => {
                  return produto.stockCluster_id == reqData.empresa_id_cluster;
                })
              : produtoDataERP;

          // Agrupamento por productPacking_id, schedule_id e company.id
          const purchaseSet = new Set();
          produtoDataERP.forEach((item) => {
            if (item.subtype === "PURCHASE" && item.schedule_id !== null) {
              purchaseSet.add(item.schedule_id);
            }
          });

          /*   groupedResponse = resultadoFiltrado.reduce((grouped, cur) => {
            const scheduleIdKey =
              cur.schedule_id !== null ? cur.schedule_id : "null";

            // Verifica a existência do scheduleId no conjunto de compras
            const isPurchaseActive =
              scheduleIdKey > 0 && purchaseSet.has(scheduleIdKey);
            const companyIdKey =
              cur.stockCluster_id !== null ? cur.stockCluster_id : null;
            const schedulePart =
              cur.schedule_id && isPurchaseActive ? `-${scheduleIdKey}` : "";

            const key = `${cur.productPacking_id}${schedulePart}-${companyIdKey}`;
            if (!grouped[key]) {
              grouped[key] = { ...cur, quantity: 0 };
            }

            grouped[key].quantity += cur.quantity;
            return grouped;
          }, {});
*/
        }
//console.log(resultadoFiltrado)
        // Agrupamento por productPacking_id, schedule_id e company.id
        // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
        const filteredGroupedResponse =
          (reqData.saldo_zero && reqData.saldo_zero == "sim") ||
          lista_produtos_sem_estoque == "sim"
            ? Object.fromEntries(Object.entries(resultadoFiltrado))
            : Object.fromEntries(
                Object.entries(resultadoFiltrado).filter(
                  ([key, value]) => value.quantity > 0
                )
              );
        // Convertendo o objeto agrupado de volta para um array
        response_organized = Object.values(filteredGroupedResponse);



        if (String(reqData.tipo_venda).trim() != "P.E") {
          response_organized =
            reqData.tipo_venda != ""
              ? response_organized.filter(
                  (item) =>
                    (item.productPacking_id =
                      reqData.item_id &&
                      Number(item?.schedule_key) == Number(reqData.tipo_venda))
                )
              : response_organized.filter(
                  (item) =>
                    (item.productPacking_id =
                      reqData.item_id && item.schedule_id == 0)
                );
        } else {
          response_organized = response_organized.filter((item) => {
            return (
              !item.schedule_id &&
              item.stockCluster_id == reqData.empresa_id_cluster
            );
          });
        }

        // reqData.empresa_id_erp = response_organized[0].schedule_id

        //filtro pelo tipo de venda(pronta entrega ou programação), e devolvo o saldo do produto do erp
        const saldoERP = response_organized[0].quantity;
        if (isNaN(saldoERP)) {
          // Se não houver saldo ou o produto nao tiver sido encontrado
          saldoERP = 0;
        }
        var carrinho = "";
        //Se não houver carrinho em aberto passo 0 só para poder consultar todos os outros  normalmente
        if (HacarrinhoemAberto.length < 1) {
          carrinho_id = 0;
        } else {
          carrinho_id = HacarrinhoemAberto[0].CARRINHO_ID;
        }
        const saldoreservado = await carrinhoModel.ConsultaSaldoProdutoBD(
          carrinho_id,
          reqData
        );

        if (
          isNaN(
            saldoreservado[0].QUANTIDADE ||
              saldoreservado[0].QUANTIDADE === null
          )
        ) {
          saldoreservado[0].QUANTIDADE = "0";
        }

        const saldoTotal = Number(
          saldoERP - Number(saldoreservado[0].QUANTIDADE)
        );
        return successResponse(200, { saldo: saldoTotal });
      } else {
        return errorResponse(400, "Erro ao coletar os dados do usuário");
      }
    } else {
      return errorResponse(400, "Dados faltantes");
    }
  } catch (error) {
    console.error("error -> ", logStruct("ConsultaSaldo", error));
    return errorResponse(400, "Erro ao coletar saldo no sistema");
  }
};

const getListaPreco = async (reqData) => {
  try {
    const userData = await userModel.getUserDetailsByNameOrEmail(reqData.email);
    const operador = userData[0].USUARIO_NOME;
    const senha = userData[0].USUARIO_PASSWORD_ERP;

    const response = await produtosModel.getListaPreco();

    if (response && !response.length) {
      return errorResponse(404, "ListaNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchLista", error));
    return errorResponse(error.status, error.message);
  }
};

const getListaPrecoById = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await produtosModel.getContaById(validInput.id);

    if (response && !response.length) {
      return errorResponse(404, "ListaNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchClientes", error));
    return errorResponse(error.status, error.message);
  }
};

//GET
const fetchProdutosbkp = async (reqData) => {
  try {
    await carrinhoModel.RemovecarrinhosVencidos();
    var validInput = "";
    var lista_produtos_sem_estoque = "nao";

    const responseOrganizacao = await organizacaoModel.getOrganizacoes();
    const organizacao_data = responseOrganizacao
      ? responseOrganizacao.find(
          (org) =>
            org.ORGANIZACAO_PRODUTO_SESTOQUE !== null &&
            org.ORGANIZACAO_PRODUTO_SESTOQUE !== ""
        )
      : null;
    if (
      organizacao_data &&
      organizacao_data.ORGANIZACAO_PRODUTO_SESTOQUE == 0
    ) {
      //Verifica se é para listar produtos sem estoque 0-LIsta 1- Não lista
      lista_produtos_sem_estoque = "sim";
    }
    if (reqData.codigo) {
      validInput = validateCodigo(reqData);
    } else if (reqData.nome) {
      validInput = validateNome(reqData);
    } else if (reqData.classeCodigo) {
      validInput = validateClasseCodigo(reqData);
    } else if (reqData.nome) {
      validInput = validateGrade(reqData);
    }

    const response_regras = await regrasModel.getAllListaPrecos();
    var regra = response_regras.find(
      (item) => Number(item.LISTA_PRECOS_ID) === Number(reqData.lista_preco)
    );
    validInput.lista_preco = reqData.lista_preco
      ? Number(regra.LISTA_PRECOS_NOME)
      : null;

    const DadosDoUsuario = await carrinhoModel.getDataUser(reqData.email);
    reqData.usuario_id = DadosDoUsuario[0].usuario_id;
    var response = await produtosModel.getProdutos(
      validInput,
      reqData.token_erp
    );

    var exibe_valor = regra ? regra.LISTA_PRECOS_EXIBE_VALOR : null;
    var permite_listar = regra ? regra.LISTA_PRECOS_PERMITE_LISTAR_TODOS : null;

    //if (exibe_valor == "sim") {
    /*  response_lista = await produtosModel.getListaPreco(
        Number(regra.LISTA_PRECOS_NOME),
        reqData.token_erp
      );
    }*/
    //calcula o saldo do produto somando entradas e subtraindo as vendas (ou seja, somo saldos positivos e subtraio saldos negativos para elementos com o mesmo id)
    var response_organized = "";
    if (response) {
      // Agrupamento por productPacking_id, schedule_id e company.id
      const purchaseSet = new Set();
      response.forEach((item) => {
        if (item.subtype === "PURCHASE" && item.schedule_id !== null) {
          purchaseSet.add(item.schedule_id);
        }
      });

      const groupedResponse = response.reduce((grouped, cur) => {
        const scheduleIdKey =
          cur.schedule_id !== null ? cur.schedule_id : "null";

        // Verifica a existência do scheduleId no conjunto de compras
        const isPurchaseActive =
          scheduleIdKey > 0 && purchaseSet.has(scheduleIdKey);

        const companyIdKey =
          cur.stockCluster_id !== null ? cur.stockCluster_id : null;
        const schedulePart =
          cur.schedule_id && isPurchaseActive ? `-${scheduleIdKey}` : "";

        const key = `${cur.productPacking_id}${schedulePart}-${companyIdKey}`;
        if (!grouped[key]) {
          grouped[key] = { ...cur, quantity: 0 };
        }

        grouped[key].quantity += cur.quantity;
        return grouped;
      }, {});

      // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
      const filteredGroupedResponse =
        (reqData.saldo_zero && reqData.saldo_zero == "sim") ||
        lista_produtos_sem_estoque == "sim"
          ? Object.fromEntries(Object.entries(groupedResponse))
          : Object.fromEntries(
              Object.entries(groupedResponse).filter(
                ([key, value]) => value.quantity > 0
              )
            );

      // Convertendo o objeto agrupado de volta para um array
      response_organized = Object.values(filteredGroupedResponse);
    }
    // console.log(response)
    //Verifica se há um carrinho em aberto para o usuário ( 30 minutos de tolerancia)
    const HacarrinhoemAberto = await carrinhoModel.HacarrinhoemAberto(
      reqData.usuario_id
    ); //somente

    if (HacarrinhoemAberto.length < 1) {
      carrinho_id = 0;
    } else {
      carrinho_id = HacarrinhoemAberto[0].CARRINHO_ID;
    }

    const DadosEmpresa = await empresaModel.getEmpresas();
    //console.log(DadosEmpresa);

    listProducts = []; //Array que receberá os produtos
    for (let index = 0; index < response_organized.length; index++) {
      reqData.codigo = response_organized[index].productPacking_code;
      //      reqData.empresa_id_erp = API.tenant == 'act' ? response_organized[index].stockCluster_id == 1001 ? 1004 : 1003 : response_organized[index].stockCluster_id
      //    console.log(reqData.empresa_id_erp);
      reqData.empresa_id_erp = DadosEmpresa.find(
        (item) =>
          Number(item.EMPRESA_CLUSTER) ===
          Number(response_organized[index].stockCluster_id)
      ).EMPRESA_ID_ERP;

      //console.log(reqData.empresa_id_erp_NEW);

      if (exibe_valor == "sim") {
        response_organized[index].VALOR_UNITARIO = response_organized[index]
          .unit_value_retail
          ? response_organized[index].unit_value_retail
          : 0;
        // console.log(response_organized[index]);
      } else {
        response_organized[index].VALOR_UNITARIO = 0;
      }
      //var vl_produto = '';
      //console.log(vl_produto)

      //  response_organized[index].VALOR_UNITARIO = 0
      //console.log(response_organized[index].VALOR_UNITARIO)
      var Tot_saldo_reservado = 0;
      var existeItemNoCarrinho = "";
      var saldoreservado = 0;
      console.log('aqui')
      saldoreservado = await carrinhoModel.ConsultaSaldoReservado(
        carrinho_id,
        reqData,
        response_organized[index].schedule_key
          ? response_organized[index].schedule_key
          : "P.E",
          response_organized[index].schedule_availabilityDate
      );

      var Tot_saldo_reservado =
        saldoreservado.length > 0
          ? saldoreservado[0].QTD + saldoreservado[0].QTD_EXT
          : 0;

      if (carrinho_id != 0) {
        //  console.log(reqData)
        reqData.item_id = reqData.codigo;

        existeItemNoCarrinho = await carrinhoModel.ConsultaItemNoCarrinho(
          carrinho_id,
          reqData,
          response_organized[index].schedule_key
            ? response_organized[index].schedule_key
            : "P.E",
            response_organized[index].schedule_availabilityDate
        );
      }
      reqData.item_id = response_organized[index].id;
      /*const pe_prog = response_organized[index].schedule_id ? await produtosModel.ObtemDataProgramacao(
        response_organized[index].schedule_id,
        reqData.token_erp,
      ) : 'P.E';
      */
      const item = {
        TIPO: response_organized[index].type,
        SUBTIPO: response_organized[index].subtype,
        PERMITE_VENDA_SEM_SALDO:
          response_organized[index].permite_venda_sem_saldo,

        RESERVADO:
          saldoreservado != 0 &&
          saldoreservado != "" &&
          saldoreservado[0].QTD_EXT != null
            ? saldoreservado[0].QTD_EXT
            : 0,
        QUANTIDADE:
          saldoreservado != 0 &&
          saldoreservado != "" &&
          saldoreservado[0].QTD != null
            ? saldoreservado[0].QTD
            : 0,
        PEDIDO_NUM: response_organized[index].schedule_id
          ? response_organized[index].schedule_code
          : null,
        PEDIDO_ID: response_organized[index].schedule_id
          ? response_organized[index].schedule_id
          : null,
        PROGRAMACAO_ID: response_organized[index].schedule_id
          ? response_organized[index].schedule_key
          : "P.E",
        PROGRAMACAO_DATA: response_organized[index].schedule_id
          ? response_organized[index].schedule_availabilityDate
          : null,
        EMPRESA_ID: DadosEmpresa.find(
          (item) =>
            Number(item.EMPRESA_CLUSTER) ===
            Number(response_organized[index].stockCluster_id)
        ).EMPRESA_ID_ERP,
        EMPRESA_APELIDO: response_organized[index].stockCluster_code,
        DESCRICAO: response_organized[index].productPacking_code,
        PE_OU_PROG: response_organized[index].subtype,
        ITEM_ID: response_organized[index].productPacking_id,
        MESTRE_ID: response_organized[index].product_id,
        MESTRE_CODIGO: response_organized[index].product_code,
        ITEM_CODIGO: response_organized[index].productPacking_code,
        ITEM_NOME: response_organized[index].product_description,
        ITEM_COD_GRADE: response_organized[index].productVariant_code
          ? response_organized[index].productVariant_code
          : response_organized[index].productPacking_complement,
        ITEM_GRADE:
          response_organized[index].productPacking_complement &&
          response_organized[index].productPacking_complement.length > 0
            ? response_organized[index].productPacking_complement
            : response_organized[index].productVariant_description,
        ITEM_UNIDADE: response_organized[index].unit_code,
        ITEM_VALOR_UNITARIO: response_organized[index].VALOR_UNITARIO,
        ITEM_VALOR_UNITARIO_ESCOLHIDO:
          existeItemNoCarrinho === "" || existeItemNoCarrinho.length == 0
            ? response_organized[index].VALOR_UNITARIO.toFixed(2)
            : existeItemNoCarrinho[0].VALOR_UNITARIO.toFixed(2),

        ITEM_SALDO: (
          parseFloat(response_organized[index].quantity) -
          parseFloat(Tot_saldo_reservado)
        ).toFixed(2),
        ITEM_PREVISAO: "",
        SALEPROFILE: response_organized[index].saleProfile_id
          ? response_organized[index].saleProfile_id
          : null,
      };
      if (
        parseFloat(response_organized[index].quantity) -
          parseFloat(Tot_saldo_reservado) >
        0
      ) {
        //      if(item.ITEM_VALOR_UNITARIO!=0){ //adiciona somente produtos com preço
        if (permite_listar == "nao") {
          if (item.ITEM_VALOR_UNITARIO > 0) {
            listProducts.push(item);
          }
        } else {
          listProducts.push(item);
        }
      }
      //  }
    }

    if (response && !response.length) {
      return errorResponse(404, "ProdutosNotfound");
    }
    // console.log(listProducts)
    return successResponse(200, listProducts);
  } catch (error) {
    console.error("error -> ", logStruct("fetchProdutos", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchProdutos = async (reqData) => {
  try {
    await carrinhoModel.RemovecarrinhosVencidos();
    var validInput = "";
    var lista_produtos_sem_estoque = "nao";

    const responseOrganizacao = await organizacaoModel.getOrganizacoes();
    const organizacao_data = responseOrganizacao
      ? responseOrganizacao.find(
          (org) =>
            org.ORGANIZACAO_PRODUTO_SESTOQUE !== null &&
            org.ORGANIZACAO_PRODUTO_SESTOQUE !== ""
        )
      : null;
    if (
      organizacao_data &&
      organizacao_data.ORGANIZACAO_PRODUTO_SESTOQUE == 0
    ) {
      //Verifica se é para listar produtos sem estoque 0-LIsta 1- Não lista
      lista_produtos_sem_estoque = "sim";
    }
    if (reqData.codigo) {
      validInput = validateCodigo(reqData);
    } else if (reqData.nome) {
      validInput = validateNome(reqData);
    } else if (reqData.classeCodigo) {
      validInput = validateClasseCodigo(reqData);
    } else if (reqData.nome) {
      validInput = validateGrade(reqData);
    }

    const response_regras = await regrasModel.getAllListaPrecos();
    var regra = response_regras.find(
      (item) => Number(item.LISTA_PRECOS_ID) === Number(reqData.lista_preco)
    );
    validInput.lista_preco = reqData.lista_preco
      ? Number(regra.LISTA_PRECOS_NOME)
      : null;

    const DadosDoUsuario = await carrinhoModel.getDataUser(reqData.email);
    reqData.usuario_id = DadosDoUsuario[0].usuario_id;
    var response = await produtosModel.getProdutos(
      validInput,
      reqData.token_erp
    );

    var exibe_valor = regra ? regra.LISTA_PRECOS_EXIBE_VALOR : null;
    var permite_listar = regra ? regra.LISTA_PRECOS_PERMITE_LISTAR_TODOS : null;

    //if (exibe_valor == "sim") {
    /*  response_lista = await produtosModel.getListaPreco(
        Number(regra.LISTA_PRECOS_NOME),
        reqData.token_erp
      );
    }*/
    //calcula o saldo do produto somando entradas e subtraindo as vendas (ou seja, somo saldos positivos e subtraio saldos negativos para elementos com o mesmo id)
    var response_organized = "";
    if (response) {
      // Agrupamento por productPacking_id, schedule_id e company.id
      const purchaseSet = new Set();
      response.forEach((item) => {
        if (item.subtype === "PURCHASE" && item.schedule_id !== null) {
          purchaseSet.add(item.schedule_id);
        }
      });

      /*  const groupedResponse = response.reduce((grouped, cur) => {
        const scheduleIdKey =
          cur.schedule_id !== null ? cur.schedule_id : "null";

        // Verifica a existência do scheduleId no conjunto de compras
        const isPurchaseActive =
          scheduleIdKey > 0 && purchaseSet.has(scheduleIdKey);

        const companyIdKey =
          cur.stockCluster_id !== null ? cur.stockCluster_id : null;
        const schedulePart =
          cur.schedule_id && isPurchaseActive ? `-${scheduleIdKey}` : "";

        const key = `${cur.productPacking_id}${schedulePart}-${companyIdKey}`;
        if (!grouped[key]) {
          grouped[key] = { ...cur, quantity: 0 };
        }

        grouped[key].quantity += cur.quantity;
        return grouped;
      }, {});
*/
      // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
      const filteredGroupedResponse =
        (reqData.saldo_zero && reqData.saldo_zero == "sim") ||
        lista_produtos_sem_estoque == "sim"
          ? Object.fromEntries(Object.entries(response))
          : Object.fromEntries(
              Object.entries(response).filter(
                ([key, value]) => value.quantity > 0
              )
            );

      // Convertendo o objeto agrupado de volta para um array
      response_organized = Object.values(filteredGroupedResponse);
    }
    console.log(response_organized);
    //Verifica se há um carrinho em aberto para o usuário ( 30 minutos de tolerancia)
    const HacarrinhoemAberto = await carrinhoModel.HacarrinhoemAberto(
      reqData.usuario_id
    ); //somente

    if (HacarrinhoemAberto.length < 1) {
      carrinho_id = 0;
    } else {
      carrinho_id = HacarrinhoemAberto[0].CARRINHO_ID;
    }

    const DadosEmpresa = await empresaModel.getEmpresas();
    //console.log(DadosEmpresa);

    listProducts = []; //Array que receberá os produtos
    for (let index = 0; index < response_organized.length; index++) {
      reqData.codigo = response_organized[index].productPacking_code;
      //      reqData.empresa_id_erp = API.tenant == 'act' ? response_organized[index].stockCluster_id == 1001 ? 1004 : 1003 : response_organized[index].stockCluster_id
      //    console.log(reqData.empresa_id_erp);
      reqData.empresa_id_erp = DadosEmpresa.find(
        (item) =>
          Number(item.EMPRESA_CLUSTER) ===
          Number(response_organized[index].stockCluster_id)
      ).EMPRESA_ID_ERP;

      //console.log(reqData.empresa_id_erp_NEW);

      if (exibe_valor == "sim") {
        response_organized[index].VALOR_UNITARIO = response_organized[index]
          .unit_value_retail
          ? response_organized[index].unit_value_retail
          : 0;
        // console.log(response_organized[index]);
      } else {
        response_organized[index].VALOR_UNITARIO = 0;
      }
      //var vl_produto = '';
      //console.log(vl_produto)

      //  response_organized[index].VALOR_UNITARIO = 0
      //console.log(response_organized[index].VALOR_UNITARIO)
      var Tot_saldo_reservado = 0;
      var existeItemNoCarrinho = "";
      var saldoreservado = 0;
      console.log('aqui22')
      saldoreservado = await carrinhoModel.ConsultaSaldoReservado(
        carrinho_id,
        reqData,
        response_organized[index].schedule_key
          ? response_organized[index].schedule_key
          : "P.E",
          response_organized[index].schedule_availabilityDate
      );
console.log('passou')
      var Tot_saldo_reservado =
        saldoreservado.length > 0
          ? saldoreservado[0].QTD + saldoreservado[0].QTD_EXT
          : 0;

      if (carrinho_id != 0) {
        //  console.log(reqData)
        reqData.item_id = reqData.codigo;

        existeItemNoCarrinho = await carrinhoModel.ConsultaItemNoCarrinho(
          carrinho_id,
          reqData,
          response_organized[index].schedule_key
            ? response_organized[index].schedule_key
            : "P.E",
            response_organized[index].schedule_availabilityDate
        );
      }
      console.log(response_organized[index])
      reqData.item_id = response_organized[index].id;
      /*const pe_prog = response_organized[index].schedule_id ? await produtosModel.ObtemDataProgramacao(
        response_organized[index].schedule_id,
        reqData.token_erp,
      ) : 'P.E';
      */
      const item = {
        TIPO: response_organized[index].type,
        SUBTIPO: response_organized[index].subtype,
        PERMITE_VENDA_SEM_SALDO:
          response_organized[index].permite_venda_sem_saldo,
        RESERVADO:
          saldoreservado != 0 &&
          saldoreservado != "" &&
          saldoreservado[0].QTD_EXT != null
            ? saldoreservado[0].QTD_EXT
            : 0,
        QUANTIDADE:
          saldoreservado != 0 &&
          saldoreservado != "" &&
          saldoreservado[0].QTD != null
            ? saldoreservado[0].QTD
            : 0,
        PEDIDO_NUM: response_organized[index].schedule_id
          ? response_organized[index].schedule_code
          : null,
        PEDIDO_ID: response_organized[index].schedule_id
          ? response_organized[index].schedule_id
          : null,
        PROGRAMACAO_ID: response_organized[index].schedule_id
          ? response_organized[index].schedule_key
          : "P.E",
        PROGRAMACAO_DATA: response_organized[index].schedule_id
          ? response_organized[index].schedule_availabilityDate
          : null,

        EMPRESA_ID: DadosEmpresa.find(
          (item) =>
            Number(item.EMPRESA_CLUSTER) ===
            Number(response_organized[index].stockCluster_id)
        ).EMPRESA_ID_ERP,
        EMPRESA_APELIDO: response_organized[index].stockCluster_code,
        DESCRICAO: response_organized[index].productPacking_code,
        PE_OU_PROG: response_organized[index].subtype,
        ITEM_ID: response_organized[index].productPacking_id,
        MESTRE_ID: response_organized[index].product_id,
        MESTRE_CODIGO: response_organized[index].product_code,
        ITEM_CODIGO: response_organized[index].productPacking_code,
        ITEM_NOME: response_organized[index].product_description,
        ITEM_COD_GRADE: response_organized[index].productVariant_code
          ? response_organized[index].productVariant_code
          : response_organized[index].productPacking_complement,
        ITEM_GRADE:
          response_organized[index].productPacking_complement &&
          response_organized[index].productPacking_complement.length > 0
            ? response_organized[index].productPacking_complement
            : response_organized[index].productVariant_description,
        ITEM_UNIDADE: response_organized[index].unit_code,
        ITEM_VALOR_UNITARIO: response_organized[index].VALOR_UNITARIO,
        ITEM_VALOR_UNITARIO_ESCOLHIDO:
          existeItemNoCarrinho === "" || existeItemNoCarrinho.length == 0
            ? response_organized[index].VALOR_UNITARIO.toFixed(2)
            : existeItemNoCarrinho[0].VALOR_UNITARIO.toFixed(2),

        ITEM_SALDO:
          response_organized[index].subtype === "FILA DE ESPERA" &&
          response_organized[index].permite_venda_sem_saldo === "S"
            ? parseFloat(0).toFixed(2)
            : (
                parseFloat(response_organized[index].quantity) -
                parseFloat(Tot_saldo_reservado)
              ).toFixed(2),
        ITEM_PREVISAO: "",
        SALEPROFILE: response_organized[index].saleProfile_id
          ? response_organized[index].saleProfile_id
          : null,
      };
      if (
        parseFloat(response_organized[index].quantity) -
          parseFloat(Tot_saldo_reservado) >
        0
      ) {
        //      if(item.ITEM_VALOR_UNITARIO!=0){ //adiciona somente produtos com preço
        if (permite_listar == "nao") {
          if (item.ITEM_VALOR_UNITARIO > 0) {
            listProducts.push(item);
          }
        } else {
          listProducts.push(item);
        }
      } else {
        if (
          lista_produtos_sem_estoque == "sim" &&
          response_organized[index].permite_venda_sem_saldo == "S"
        ) {
          //SE HABILITADO QUE PERMITE LISTAR PRODUTO SEM SALDO E  O PRODUTO PERMITIR SER VENDIDO, MOSTRAR NA TELA

          listProducts.push(item);
        }
      }
      //  }
    }

    if (response && !response.length) {
      return errorResponse(404, "ProdutosNotfound");
    }

    console.log("00000000000000000000000000000000000");

    return successResponse(200, listProducts);
  } catch (error) {
    console.error("error -> ", logStruct("fetchProdutos", error));
    return errorResponse(error.status, error.message);
  }
};

const getEspecProduto = async (reqData) => {
  try {
    // var validInput = validateIDProduto(reqData.id);
    const response = await produtosModel.getEspecProduto(reqData.id);
    const response_image = await produtosModel.getImageEspecProduto(reqData.id);

    const response_espec = { ...response["0"], ...response_image };

    if (response && !response.length) {
      return errorResponse(404, "ProdutosNotfound");
    }

    return successResponse(200, response_espec);
  } catch (error) {
    console.error("error -> ", logStruct("fetchProdutos", error));
    return errorResponse(error.status, error.message);
  }
};

const getProdByNameandCod = async (reqData) => {
  try {
    const response = await produtosModel.getProdByNameandCod(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchProdutos", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  fetchProdutos,
  getEspecProduto,
  getListaPreco,
  getListaPrecoById,
  getSaldoCarrinho,
  getProdByNameandCod,
};
