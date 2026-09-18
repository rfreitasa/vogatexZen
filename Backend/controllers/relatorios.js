const relatorioModel = require("../models/relatorios");
const clientesModel = require("../models/clientes");
const empresaModel = require("../models/empresa");
const produtosModel = require("../models/produtos");
const regrasModel = require("../models/regras");

const { successResponse, errorResponse } = require("../libs/response");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment-timezone");
const { field, reads3files, getVendedores } = require("../libs/functions");
const savefile = require("../libs/functions");
const { API, ERP_CONF } = require("../configuration/api");
const funcoes = require("../libs/functions");
const { doesNotThrow } = require("assert");

const logStruct = (func, error) => {
  return { func: func, file: "relatorioController", error };
};
//const   agora     = moment().tz("America/Sao_Paulo").format('YYYY-MM-DD HH:mm:ss');
const agora = moment().tz("America/Sao_Paulo").format("DD-MM-YYYY HH:mm:ss");
const hoje = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY");

function getDate(data) {
  var date = new Date(data),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("-");
}

function geraHR(doc, y, color, tamanho) {
  doc
    .strokeColor(color)
    .lineWidth(1)
    .moveTo(20, y)
    .lineTo(tamanho ? tamanho : 580, y)
    .stroke();
}

function formatCurrency(numero) {
  return (
    "R$ " +
    numero
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
  );
}

function formatDecimal(numero) {
  return numero
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}
/*function generatePDF(doc, name, dados_busca, data, fieldsToShow, fieldsNameToShow, groupBy, orderBy,sizeField) {
  const fileName = 'output.pdf';
  var page = 1;
  const stream = fs.createWriteStream(fileName);
  doc.pipe(stream);
  console.log('1')
  const groupedData = {};
  setHeader(doc, name);

  const headerHeight = 10;
  const rowHeight = 18;
  const cellMargin = 10;
  var positionX = 50;
  var positionY = 60;
  const fontName = 'Times-Roman';
  const fontNameBold = 'Times-Bold';
  const fontSize = 6;

  for (var [key, objetos] of data) {
    objetos.sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    positionY += 18;
    doc.fillColor('black');
    doc.text(String(key), positionX, positionY);
    geraHR(doc, positionY + 8, "#000000");

    positionY += rowHeight;

    fieldsToShow.forEach(field => {
      const cellDimensions = calculateCellDimensions(objetos, field, doc, cellMargin, 150);

      doc.font(fontNameBold).fontSize(fontSize);

      // Verifica se há espaço suficiente na linha atual
      if (positionX + cellDimensions.width + cellMargin <= doc.page.width - 50) {
        doc.text(field.toUpperCase(), positionX, positionY);
        positionX += cellDimensions.width + cellMargin;
      } else {
        // Se não houver espaço, inicia uma nova linha
        positionX = 50;
        positionY += rowHeight;
        doc.text(field.toUpperCase(), positionX, positionY);
        positionX += cellDimensions.width + cellMargin;
      }
    });

    positionY += rowHeight;

    objetos.map(item => {
      positionX = 50;

      fieldsToShow.forEach(field => {
        if (positionY >= 770) {
          doc.addPage({ size: "A4", margin: 50, bufferPages: true });
          page = page + 1;
          setHeader(doc, name);
          positionY = 60;
        }

        const cellDimensions = calculateCellDimensions(objetos, field, doc, cellMargin, 150);

        doc.font(fontName).fontSize(fontSize);

        // Verifica se há espaço suficiente na linha atual
        if (positionX + cellDimensions.width + cellMargin <= doc.page.width - 50) {
          doc.text(String(item[field]).toUpperCase(), positionX, positionY, {
            width: cellDimensions.width,
            height: cellDimensions.height,
          });
          positionX += cellDimensions.width + cellMargin;
        } else {
          // Se não houver espaço, inicia uma nova linha
          positionX = 50;
          positionY += rowHeight;
          doc.text(String(item[field]).toUpperCase(), positionX, positionY, {
            width: cellDimensions.width,
            height: cellDimensions.height,
          });
          positionX += cellDimensions.width + cellMargin;
        }
      });

      // Calcula a altura da linha após a geração dos textos
      const lineHeight = calculateLineHeight(fieldsToShow, objetos, doc, cellMargin, 150);

      // Desenha a linha
      geraHR(doc, positionY + lineHeight , "#000000");
      positionX = 50;
      positionY += rowHeight;
    });
  }

  doc.end();
  console.log(`PDF gerado com sucesso: ${fileName}`);
}
*/
function generatePDF(
  doc,
  name,
  dados_busca,
  data,
  fieldsToShow,
  fieldsNameToShow,
  groupBy,
  orderBy,
  sizeField,
  orientacao_pagina
) {
  const fileName = "output.pdf";
  var page = 1;
  var limite_hr = orientacao_pagina == "landscape" ? "820" : "580";

  //const stream = fs.createWriteStream(fileName);
  //doc.pipe(stream);
  const groupedData = {};
  setHeader(doc, name, orientacao_pagina);

  const headerHeight = 10;
  const rowHeight = 10;
  const cellMargin = 10;
  var positionX = 25;
  var positionY = 60;
  const fontName = "Times-Roman";
  const fontNameBold = "Times-Bold";
  const fontSize = 5;
  for (var [key, objetos] of data) {
    objetos.sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
    //console.log('2')
    positionY += 18;
    doc.fillColor("black");
    doc.text(String(key), positionX, positionY);
    geraHR(doc, positionY + 8, "#000000", limite_hr);

    positionY += rowHeight;

    fieldsNameToShow.forEach((field, index) => {
      doc.font(fontNameBold).fontSize(fontSize);

      // Verifica se há espaço suficiente na linha atual
      const fieldSize = sizeField[index] || 150; // Default size if not specified
      if (positionX + fieldSize + cellMargin <= doc.page.width - 50) {
        doc.text(field.toUpperCase(), positionX, positionY);
        positionX += fieldSize + cellMargin;
      } else {
        // Se não houver espaço, inicia uma nova linha
        positionX = 30;
        positionY += rowHeight;
        doc.text(field.toUpperCase(), positionX, positionY);
        positionX += fieldSize + cellMargin;
      }
    });
    //console.log('3')
    positionY += rowHeight;

    objetos.map((item) => {
      positionX = 25;
      var maior_height = 10;
      var txtHeight = 0;
      // Find the maximum height among all fields
      fieldsToShow.forEach((field, index) => {
        var text = item[field] || "";
        var fieldSize = sizeField[index] || 150; // Default size if not specified
        txtHeight = Math.ceil(doc.heightOfString(text, { width: fieldSize }));

        var calc = txtHeight / rowHeight;

        maior_height = Math.max(maior_height, maior_height * calc);
      });

      fieldsToShow.forEach((field, index) => {
        const text = item[field] || "";
        const fieldSize = sizeField[index] || 150; // Default size if not specified
        txtHeight = Math.ceil(doc.heightOfString(text, { width: fieldSize }));

        if (positionY >= 710 && orientacao_pagina == "portrait") {
          doc.addPage({
            size: "A4",
            margin: 50,
            bufferPages: true,
            layout: orientacao_pagina,
          });
          page = page + 1;
          setHeader(doc, name, orientacao_pagina);
          positionY = 60;
        }

        if (positionY >= 500 && orientacao_pagina == "landscape") {
          doc.addPage({
            size: "A4",
            margin: 50,
            bufferPages: true,
            layout: orientacao_pagina,
          });
          page = page + 1;
          setHeader(doc, name, orientacao_pagina);
          positionY = 60;
        }
        doc.font(fontName).fontSize(fontSize);

        if (positionX + fieldSize + cellMargin <= doc.page.width - 50) {
          doc.text(text, positionX, positionY, {
            width: fieldSize,
            height: txtHeight,
          });
          positionX += fieldSize + cellMargin;
        } else {
          // Se não houver espaço, inicia uma nova linha
          positionX = 25;
          positionY += maior_height + 14;

          doc.text(text, positionX, positionY, {
            width: fieldSize,
            height: txtHeight,
          });
          positionX += fieldSize + cellMargin;
        }
      });

      // Calcula a altura da linha após a geração dos textos

      // Desenha a linha
      // console.log(positionY);

      positionY += maior_height + 1;
      geraHR(doc, positionY - 1, "#000000", limite_hr);
      positionX = 25;
      positionY += 3;
    });
  }

  // doc.end();
  console.log(`PDF gerado com sucesso: ${fileName}`);
}
function generatePDFRankingVendas(
  doc,
  name,
  dados_busca,
  data,
  fieldsToShow,
  fieldsNameToShow,
  fieldsType,
  groupBy,
  orderBy,
  sizeField,
  orientacao_pagina,
  perfil
) {
  const fileName = "output.pdf";
  var page = 1;
  var limite_hr = orientacao_pagina == "landscape" ? "820" : "580";

  //const stream = fs.createWriteStream(fileName);
  //doc.pipe(stream);
  const groupedData = {};
  setHeader(
    doc,
    name,
    orientacao_pagina,
    dados_busca.filtros.dt_ini,
    dados_busca.filtros.dt_fim
  );

  var vl_total = 0;
  var percent_global = 0;
  var total_faturado = 0;
  var total_comissao = 0;
  const headerHeight = 10;
  const rowHeight = 10;
  const cellMargin = 10;
  var positionX = 35;
  var positionY = 60;
  const fontName = "Times-Roman";
  const fontNameBold = "Times-Bold";
  const fontSize = 8;
  /*
  
    data.forEach((invoiceArray, key) => {
      console.log(invoiceArray);
      total_geral = invoiceArray.reduce((sum, invoice) => sum + invoice.invoiceItem_totalValue, 0);
    });
  */

  for (var [key_desagrupados, objetos_desagrupados] of data) {
    var position_ranking = 1;
    if (
      dados_busca.filtros.dados != "product_category_description_1" &&
      dados_busca.filtros.dados != "product_code" &&
      dados_busca.filtros.dados != "productPacking_code" &&
      dados_busca.filtros.dados != "salesperson_name" &&
      dados_busca.filtros.dados != "person_nameCalc" &&
      dados_busca.filtros.dados != "city_name" &&
      dados_busca.filtros.dados != "state_name" &&
      dados_busca.filtros.dados != "personGroup_description"
    ) {
      var Agrupados = groupByItem(objetos_desagrupados, (item) =>
        eval(`item.unit_code`)
      );
      for (var [key, objetos] of Agrupados) {
        for (var [key, objetos] of Agrupados) {
          objetos.sort((a, b) => {
            const valueA = a[orderBy];
            const valueB = b[orderBy];
            if (valueA < valueB) return 1; // Invertido: retorna 1 para indicar maior
            if (valueA > valueB) return -1; // Invertido: retorna -1 para indicar menor
            return 0;
          });
        }
        positionY += 18;
        doc.fillColor("black");

        doc.text(String(key_desagrupados), positionX, positionY);

        positionY += 12;
        doc.text("Unidade: " + String(key), positionX, positionY);

        geraHR(doc, positionY + 8, "#000000", limite_hr);

        positionY += rowHeight;

        fieldsNameToShow.forEach((field, index) => {
          doc.font(fontNameBold).fontSize(fontSize);

          // Verifica se há espaço suficiente na linha atual
          const fieldSize = sizeField[index] || 150; // Default size if not specified
          if (positionX + fieldSize + cellMargin <= doc.page.width - 50) {
            doc.text(field.toUpperCase(), positionX + 25, positionY);
            positionX += fieldSize + cellMargin;
          } else {
            // Se não houver espaço, inicia uma nova linha
            positionX = 35;
            positionY += rowHeight;
            doc.text(field.toUpperCase(), positionX + 25, positionY);
            positionX += fieldSize + cellMargin;
          }
        });
        //console.log('3')
        positionY += rowHeight;

        objetos.map((item) => {
          positionX = 35;
          var maior_height = 10;
          var txtHeight = 0;
          // Find the maximum height among all fields

          fieldsToShow.forEach((field, index) => {
            var text = item[field] || "";

            var fieldSize = sizeField[index] || 150; // Default size if not specified
            txtHeight = Math.ceil(
              doc.heightOfString(text, { width: fieldSize })
            );

            var calc = txtHeight / rowHeight;

            maior_height = Math.max(maior_height, maior_height * calc);
            //console.log('4')
          });
          //console.log('5')
          fieldsToShow.forEach((field, index) => {
            const text = item[field] || "";
            const fieldSize = sizeField[index] || 150; // Default size if not specified
            txtHeight = Math.ceil(
              doc.heightOfString(text, { width: fieldSize })
            );

            if (positionY >= 0 && orientacao_pagina == "portrait") {
              doc.addPage({
                size: "A4",
                margin: 50,
                bufferPages: true,
                layout: orientacao_pagina,
              });
              page = page + 1;
              setHeader(
                doc,
                name,
                orientacao_pagina,
                dados_busca.filtros.dt_ini,
                dados_busca.filtros.dt_fim
              );
                          positionY = 60;
            }

            if (positionY >= 470 && orientacao_pagina == "landscape") {
              doc.addPage({
                size: "A4",
                margin: 50,
                bufferPages: true,
                layout: orientacao_pagina,
              });
              page = page + 1;
              setHeader(doc, name, orientacao_pagina, dados_busca.filtros.dt_ini,
                dados_busca.filtros.dt_fim);
              positionY = 60;
            }
            doc.font(fontName).fontSize(fontSize);

            if (positionX + fieldSize + cellMargin <= doc.page.width - 50) {
              doc.text(text, positionX, positionY, {
                width: fieldSize,
                height: txtHeight,
                align: "right",
              });
              positionX += fieldSize + cellMargin;
            } else {
              // Se não houver espaço, inicia uma nova linha
              positionX = 35;
              positionY += maior_height + 14;

              doc.text(text, positionX, positionY, {
                width: fieldSize,
                height: txtHeight,
                align: "right",
              });
              positionX += fieldSize + cellMargin;
            }
          });
          //console.log('6')

          const margem = (item.sum_totalValue / vl_total) * 100;
          //console.log('7')
          var txtHeight = Math.ceil(doc.heightOfString(margem, { width: 30 }));

          doc.text(margem, positionX, positionY, {
            width: 30,
            height: txtHeight,
          });
          positionX += fieldSize + cellMargin;

          // Calcula a altura da linha após a geração dos textos

          // Desenha a linha
          // //console.log(positionY);

          positionY += maior_height + 1;
          geraHR(doc, positionY - 1, "#000000", limite_hr);
          positionX = 35;
          positionY += 3;
        });
      }
    } else {
      /* for (var [key, objetos] of objetos_desagrupados) {
       */

      vl_total = objetos_desagrupados.reduce(
        (sum, invoice) => sum + invoice.sum_totalValue,
        0
      );

      objetos_desagrupados.sort((a, b) => {
        const valueA = a[orderBy];
        const valueB = b[orderBy];
        if (valueA < valueB) return 1; // Invertido: retorna 1 para indicar maior
        if (valueA > valueB) return -1; // Invertido: retorna -1 para indicar menor
        return 0;
      });

      positionY += 18;
      doc.fillColor("black");

      doc.text(
        String(key_desagrupados ? key_desagrupados : ""),
        positionX,
        positionY
      );

      positionY += 12;

      geraHR(doc, positionY + 8, "#000000", limite_hr);

      positionY += rowHeight;

      fieldsNameToShow.forEach((field, index) => {
        doc.font(fontNameBold).fontSize(fontSize);

        // Verifica se há espaço suficiente na linha atual
        const fieldSize = sizeField[index] || 150; // Default size if not specified
        if (positionX + fieldSize + cellMargin <= doc.page.width - 50) {
          doc.text(field.toUpperCase(), positionX + 25, positionY);
          positionX += fieldSize + cellMargin;
        } else {
          // Se não houver espaço, inicia uma nova linha
          positionX = 35;
          positionY += rowHeight;
          doc.text(field.toUpperCase(), positionX + 25, positionY);
          positionX += fieldSize + cellMargin;
        }
      });
      //console.log('3')
      positionY += rowHeight;

      objetos_desagrupados.map((item) => {
        positionX = 35;
        var maior_height = 10;
        var txtHeight = 0;
        // Find the maximum height among all fields

        fieldsToShow.forEach((field, index) => {
          var text = item[field] || "";
          var fieldSize = sizeField[index] || 150; // Default size if not specified
          txtHeight = Math.ceil(doc.heightOfString(text, { width: fieldSize }));

          var calc = txtHeight / rowHeight;

          maior_height = Math.max(maior_height, maior_height * calc);
          //console.log('4')
        });
        //console.log('55')
        //console.log(fieldsToShow);
        fieldsToShow.forEach((field, index) => {
          //console.log('6')

          var text = item[field] || "";
          if (fieldsType[index] == "moeda") {
            text = text != "" ? formatCurrency(text) : "";
          }
          if (fieldsType[index] == "decimal") {
            text = text != "" ? formatDecimal(text) : "";
          }
          const fieldSize = sizeField[index] || 150; // Default size if not specified
          txtHeight = Math.ceil(doc.heightOfString(text, { width: fieldSize }));

          if (positionY >= 700 && orientacao_pagina == "portrait") {
            doc.addPage({
              size: "A4",
              margin: 50,
              bufferPages: true,
              layout: orientacao_pagina,
            });
            page = page + 1;
            setHeader(
              doc,
              name,
              orientacao_pagina,
              dados_busca.filtros.dt_ini,
              dados_busca.filtros.dt_fim
            );
                      positionY = 60;
          }

          if (positionY >= 470 && orientacao_pagina == "landscape") {
            doc.addPage({
              size: "A4",
              margin: 50,
              bufferPages: true,
              layout: orientacao_pagina,
            });
            page = page + 1;
            setHeader(
              doc,
              name,
              orientacao_pagina,
              dados_busca.filtros.dt_ini,
              dados_busca.filtros.dt_fim
            );
                      positionY = 60;
          }

          doc.font(fontName).fontSize(fontSize);

          if (positionX + fieldSize + cellMargin <= doc.page.width - 50) {
            if (index == 0) {
              doc.text(
                position_ranking ,
                positionX - 20,
                positionY,
                {
                  width: 10,
                  height: 15,
                  align: "left",
                }
              );
              position_ranking++;
            }
            if (index == 1) {
              doc.text(text , positionX, positionY, {
                width: fieldSize,
                height: txtHeight,
                align: "right",
              });
            } else {
              if (index == 0) {
                doc.text(text, positionX, positionY, {
                  width: fieldSize,
                  height: txtHeight,
                  align: "left",
                });
              } else {
                doc.text(text , positionX, positionY, {
                  width: fieldSize,
                  height: txtHeight,
                  align: "right",
                });
              }
            }
            positionX += fieldSize + cellMargin;
          } else {
            // Se não houver espaço, inicia uma nova linha
            positionX = 35;
            positionY += maior_height + 14;
            if (index == 0) {
              doc.text(position_ranking, positionX - 20, positionY, {
                width: 10,
                height: 15,
                align: "left",
              });
              position_ranking++;
            }
            doc.text(text, positionX, positionY, {
              width: fieldSize,
              height: txtHeight,
              align: "right",
            });
            positionX += fieldSize + cellMargin;
          }
        });

        const margem = ((item.sum_totalValue / vl_total) * 100).toFixed(2);

        var txtHeight = doc.heightOfString(margem, { width: 30 });

        doc.text(margem, positionX - 0, positionY, {
          width: 30,
          height: txtHeight,
          align: "right",
        });
        positionX += 30 + cellMargin;

        // Calcula a altura da linha após a geração dos textos

        // Desenha a linha
        // //console.log(positionY);

        positionY += maior_height + 1;
        geraHR(doc, positionY - 1, "#000000", limite_hr);
        positionX = 35;
        positionY += 3;
      });

      positionY += 10;

      geraHR(doc, positionY, "#000000", limite_hr);

      positionY += 3;
      if (dados_busca.filtros.relatorio == "EIR6000COM") {
        const vl_total_comissao = objetos_desagrupados.reduce(
          (sum, invoice) => sum + invoice.salesCommissionValue,
          0
        );
        total_comissao = total_comissao + vl_total_comissao;
        doc.text(
          "Comissão total:    " + formatCurrency(vl_total_comissao),
          positionX + 120,
          positionY,
          {
            width: 100,
            height: 25,
          }
        );
      }
      total_faturado = total_faturado + vl_total;
      doc.text(
        "Valor total:    " + formatCurrency(vl_total),
        positionX,
        positionY,
        {
          width: 100,
          height: 25,
        }
      );
      positionY += 3;
    }
  }
  positionY += 10;
  geraHR(doc, positionY, "#000000", limite_hr);
  positionY += 3;

  if (perfil == "supervisor" || perfil == "admin_global") {
    doc.text(
      "Comissão total geral:    " + formatCurrency(total_comissao),
      positionX + 120,
      positionY,
      {
        width: 160,
        height: 25,
      }
    );

    doc.text(
      "Valor total geral:    " + formatCurrency(total_faturado),
      positionX,
      positionY,
      {
        width: 160,
        height: 25,
      }
    );
  }else{
  doc.text(
      "Valor total geral:    " + formatCurrency(total_faturado),
      positionX,
      positionY,
      {
        width: 160,
        height: 25,
      }
    );

  }
  // doc.end();
  console.log(`PDF gerado com sucesso: ${fileName}`);
}
// Função para calcular a altura da linha
function calculateLineHeight(
  fieldsToShow,
  objetos,
  doc,
  cellMargin,
  maxCellWidth
) {
  let maxHeight = 0;

  fieldsToShow.forEach((field) => {
    let fieldHeight = 0;

    objetos.forEach((item) => {
      const cellDimensions = calculateCellDimensions(
        [item],
        field,
        doc,
        cellMargin,
        maxCellWidth
      );

      // Considera a altura máxima entre as duas linhas
      fieldHeight = Math.max(fieldHeight, cellDimensions.height);
    });

    // Adiciona a altura do campo à altura total
    maxHeight += fieldHeight;
  });

  return maxHeight;
}
function calculateCellDimensions(data, field, doc, cellMargin, maxCellWidth) {
  const columnData = data.map((item) => String(item[field]));

  // Encontre o comprimento máximo do conteúdo na coluna
  const maxLength = Math.max(...columnData.map((content) => content.length));

  // Ajuste o comprimento máximo se for maior que o limite
  const adjustedLength = maxLength > maxCellWidth ? maxCellWidth : maxLength;

  // Calcule a largura e altura necessárias
  const cellWidth = adjustedLength * 3; // Ajuste conforme necessário
  const cellHeight = Math.ceil(columnData.length / (cellWidth / maxCellWidth)); // Ajuste conforme necessário

  return { width: cellWidth, height: cellHeight };
}

function calculateCellWidth(data, field, doc, cellMargin) {
  const maxWidth = 300; // Defina a largura máxima da célula, ajuste conforme necessário
  const columnData = data.map((item) => String(item[field]));

  // Encontre o comprimento máximo do conteúdo na coluna
  const maxLength = Math.max(
    ...columnData.map((content) => doc.widthOfString(content))
  );

  // Adicione a margem e verifique se não excede a largura máxima
  const cellWidth = Math.min(maxLength + cellMargin * 2, maxWidth);

  return cellWidth;
}

function calculateMaxFieldHeight(data, field, doc, cellMargin) {
  const maxHeight = 700; // Defina a altura máxima para as células
  let maxFieldHeight = 700;
  data.forEach((item) => {
    const cellHeight = doc.fontSize(12).heightOfString(String(item[0][field]), {
      width: calculateCellWidth(data, field, doc, cellMargin),
    });
    if (cellHeight > maxFieldHeight) {
      maxFieldHeight = cellHeight;
    }
  });
  return Math.min(maxHeight, maxFieldHeight);
}

function groupByItem(arrayDados, keyGetter) {
  //função para agrupar
  const map = new Map();

  arrayDados.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function generateTableRowGenerica(
  doc,
  y,
  campo0,
  width0,
  campo1,
  width1,
  campo2,
  width2,
  campo3,
  width3,
  campo4,
  width4,
  campo5,
  width5,
  campo6,
  width6,
  campo7,
  width7,
  campo8,
  width8,
  lineTotal
) {
  doc
    .font("Times-Roman")
    .fontSize(6)
    .text(campo0, width0, y)
    .fontSize(6)
    .text(campo1, width1, y)
    .fontSize(6)
    .text(campo2, width2, y, { width: 90, align: "right" })
    .text(campo3, width3, y, { width: 90, align: "right" })
    .text(campo4, width4, y, { width: 90, align: "right" })
    .text(campo5, width5, y, { width: 90, align: "right" })
    .text(campo6, width6, y, { width: 90, align: "right" })
    .text(campo7, width7, y, { width: 90, align: "right" })
    .text(campo8, width8, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateTableRowNew(doc, y, itens, lineTotal) {
  doc.font("Times-Roman").fontSize(6);
  //console.log(itens);

  itens.map((item) => {
    doc
      .text(item.campo, item.posicao, y - 5, {
        width: item.tamanho,
        align: item.alinhamento,
      })
      .fontSize(6);
  });
  doc.text(lineTotal, 0, y);
}

function generateTableTitleGenerica(
  color,
  doc,
  titulo,
  y,
  ytitulo,
  campo0,
  width0,
  campo1,
  width1,
  campo2,
  width2,
  campo3,
  width3,
  campo4,
  width4,
  campo5,
  width5,
  campo6,
  width6,
  campo7,
  width7,
  campo8,
  width8,
  lineTotal
) {
  doc.fontSize(8).fillColor(color).text(titulo, 30, ytitulo);

  geraHR(doc, ytitulo + 8, "#000000");

  doc
    .fontSize(6)
    .fillColor("black")
    .text(campo0, width0, y)
    .fontSize(6)
    .text(campo1, width1, y)
    .fontSize(6)
    .text(campo2, width2, y, { width: 90, align: "right" })
    .text(campo3, width3, y, { width: 90, align: "right" })
    .text(campo4, width4, y, { width: 90, align: "right" })
    .text(campo5, width5, y, { width: 90, align: "right" })
    .text(campo6, width6, y, { width: 90, align: "right" })
    .text(campo7, width7, y, { width: 90, align: "right" })
    .text(campo8, width8, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateTotalFooterGenerico(
  doc,
  contador,
  title,
  position_y,
  campo1,
  width1,
  campo2,
  width2,
  campo3,
  width3,
  campo4,
  width4
) {
  doc
    .fontSize(6)
    .fillColor("blue")
    .text(contador + " " + title, 30, position_y, { align: "left" })
    .fillColor("blue")
    .text(campo1, width1, position_y, { width: 90, align: "right" })
    .text(campo2, width2, position_y, { width: 90, align: "right" })
    .text(campo3, width3, position_y, { width: 90, align: "right" })
    .text(campo4, width4, position_y, { width: 90, align: "right" });
}

function generateSumarioTotalFooterGenerico(
  doc,
  contador,
  title,
  position_y,
  textcampo1,
  campo1,
  width1,
  textcampo2,
  campo2,
  width2,
  textcampo3,
  campo3,
  width3,
  textcampo4,
  campo4,
  width4
) {
  doc
    .font("Times-Bold")
    .fillColor("blue")
    .text(textcampo1, width1, position_y, { width: 90, align: "right" })
    .text(textcampo2, width2, position_y, { width: 90, align: "right" })
    .text(textcampo3, width3, position_y, { width: 90, align: "right" })
    .text(textcampo4, width4, position_y, { width: 90, align: "right" })
    .fontSize(6);

  geraHR(doc, position_y + 8, "#000000");

  doc
    .font("Times-Roman")
    .fillColor("blue")
    .text(contador + " " + title, 30, position_y + 10, { align: "left" })
    .fillColor("blue")
    .text(campo1, width1, position_y + 10, { width: 90, align: "right" })
    .text(campo2, width2, position_y + 10, { width: 90, align: "right" })
    .text(campo3, width3, position_y + 10, { width: 90, align: "right" })
    .text(campo4, width4, position_y + 10, { width: 90, align: "right" });
}

//////////////////////////////////Funções especificas do relatorio EGR1000////////////////////////////////////////////////
function generateTableRowEGR1000(
  doc,
  y,
  documento,
  conta,
  carteira,
  emissao,
  vencimento,
  valor,
  descontos,
  juros,
  saldo,
  lineTotal
) {
  doc
    .font("Times-Roman")
    .fontSize(6)
    .text(documento, 30, y)
    .fontSize(5)
    .text(conta, 85, y)
    .fontSize(6)
    .text(carteira, 150, y, { width: 90, align: "right" })
    .text(emissao, 200, y, { width: 90, align: "right" })
    .text(vencimento, 240, y, { width: 90, align: "right" })
    .text(valor, 280, y, { width: 90, align: "right" })
    .text(descontos, 330, y, { width: 90, align: "right" })
    .text(juros, 380, y, { width: 90, align: "right" })
    .text(saldo, 430, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateTableTitleEGR1000(
  doc,
  titulo,
  y,
  ytitulo,
  documento,
  conta,
  carteira,
  emissao,
  vencimento,
  valor,
  descontos,
  juros,
  saldo,
  lineTotal
) {
  doc.fontSize(8).fillColor("blue").text(titulo, 30, ytitulo);

  geraHR(doc, ytitulo + 8, "#000000");

  doc
    .fontSize(6)
    .fillColor("black")
    .text(documento, 30, y)
    .text(conta, 85, y)
    .text(carteira, 215, y, { width: 90, align: "left" })
    .text(emissao, 200, y, { width: 90, align: "right" })
    .text(vencimento, 230, y, { width: 90, align: "right" })
    .text(valor, 280, y, { width: 90, align: "right" })
    .text(descontos, 330, y, { width: 90, align: "right" })
    .text(juros, 380, y, { width: 90, align: "right" })
    .text(saldo, 430, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateTotalFooter(
  doc,
  contador,
  title,
  position_y,
  VTotal,
  JurosTotal,
  DescTotal,
  SaldoTotal
) {
  doc
    .fontSize(6)
    .fillColor("blue")
    .text(contador + " " + title, 30, position_y, { align: "left" })
    .fillColor("blue")
    .text(VTotal, 280, position_y, { width: 90, align: "right" })
    .text(DescTotal, 330, position_y, { width: 90, align: "right" })
    .text(JurosTotal, 380, position_y, { width: 90, align: "right" })
    .text(SaldoTotal, 430, position_y, { width: 90, align: "right" });
}

function generateSumarioTotalFooter(
  doc,
  contador,
  title,
  position_y,
  VTotal,
  JurosTotal,
  DescTotal,
  SaldoTotal
) {
  doc
    .font("Times-Bold")
    .fillColor("blue")
    .text("Sumário", 30, position_y, { align: "left" })
    .text("Total", 280, position_y, { width: 90, align: "right" })
    .text("Desc Total", 330, position_y, { width: 90, align: "right" })
    .text("Juros Total", 380, position_y, { width: 90, align: "right" })
    .text("Saldo Total", 430, position_y, { width: 90, align: "right" })
    .fontSize(6);

  geraHR(doc, position_y + 8, "#000000");

  doc
    .font("Times-Roman")
    .fillColor("blue")
    .text(contador + " " + title, 30, position_y + 10, { align: "left" })
    .fillColor("blue")
    .text(VTotal, 280, position_y + 10, { width: 90, align: "right" })
    .text(DescTotal, 330, position_y + 10, { width: 90, align: "right" })
    .text(JurosTotal, 380, position_y + 10, { width: 90, align: "right" })
    .text(SaldoTotal, 430, position_y + 10, { width: 90, align: "right" });
}

function generateFooter(doc) {
  const range = doc.bufferedPageRange();

  var j = 0;

  for (let j = 0; j < 0 + range.count; j++) {
    doc.switchToPage(j);

    geraHR(doc, doc.page.height - 17);

    doc
      .fontSize(8)
      .fillColor("black")
      .text(
        `Powered by SalesBreath - breathitsolutions@gmail.com       Página ${
          j + 1
        } de ${range.count}`,
        190,
        doc.page.height - 15,
        { height: 15 }
      );
  }
}

function row(doc, heigth) {
  doc.lineJoin("miter").rect(250, heigth, 100, 10).stroke();
  return doc;
}

function setHeader(doc, nome_relatorio, orientacao_pagina, data_ini, data_fim) {
  var data_ini = moment(`${data_ini}`).format("DD/MM/YYYY");
  var data_fim = moment(`${data_fim}`).format("DD/MM/YYYY");

  geraHR(doc, 15, "#000000", orientacao_pagina == "landscape" ? "820" : "580");
  x = orientacao_pagina == "landscape" ? 100 : 0;
  doc
    //PRIMEIRA LINHA
    .fontSize(14)
    .text(`${nome_relatorio}`, 230 + x, 20);

  //  .fontSize(6)
  //  .text(`Agrupamento: ${agrupamento} `, 30, 59)
  doc.fontSize(8).text(`Período: ${data_ini} a ${data_fim} `, 40, 40);

  doc
    //   .fontSize(6)
    // .image("./imagens/act.jpeg", 395, 18, { width: 150, height: 40, align: "right" })

    .fontSize(8)
    .text("Impresso gerado em " + agora, 395 + x, 38);

  geraHR(doc, 35, "#000000", orientacao_pagina == "landscape" ? "820" : "580");
}

function geraCabecalho(doc, reqData) {
  var liq = "";
  var prev = "";
  reqData.liquidadas == "true" ? (liq = "Sim") : (liq = "Não");
  reqData.previsoes == "true" ? (prev = "Sim") : (prev = "Não");

  var data_ini = moment(`${reqData.dt_ini}`).format("DD/MM/YYYY");
  var data_fim = moment(`${reqData.dt_fim}`).format("DD/MM/YYYY");

  geraHR(doc, 15, "#000000");

  doc
    //PRIMEIRA LINHA
    .fontSize(14)
    .text("Contas a Receber", 230, 20)

    .fontSize(6)
    .text(
      `Filtro de data: ${reqData.filtro_data}, Exibir liquidadas: ${liq}, Exibir previsões: ${prev}, Agrupamento: ${reqData.agrupamento}, Ordenação: ${reqData.ordenacao}`,
      30,
      59
    )

    .fontSize(8)
    .text(`${data_ini} a ${data_fim} `, 240, 35)

    .fontSize(6)
    .image("./imagens/act.jpeg", 395, 18, {
      width: 150,
      height: 40,
      align: "right",
    })

    .fontSize(8)
    .text("Impresso gerado em " + agora, 395, 70);

  geraHR(doc, 65, "#000000");
}

function geraTabeladeDados(doc, DadosAgrupados, reqData) {
  var position = 90;
  var page = 0;
  var VTotal = 0;
  var VTotalSumario = 0;
  var DescTotal = 0;
  var DescTotalSumario = 0;
  var JurosTotal = 0;
  var JurosTotalSumario = 0;
  var SaldoTotal = 0;
  var SaldoTotalSumario = 0;
  var contador = 0;
  var contadorSumario = 0;

  for (var [key, value] of DadosAgrupados) {
    contador = 0;
    VTotal = 0;
    DescTotal = 0;
    JurosTotal = 0;
    SaldoTotal = 0;
    if (
      reqData.agrupamento == "vencimento" ||
      reqData.agrupamento == "data" ||
      reqData.agrupamento == "emissao" ||
      reqData.agrupamento == "entrada"
    ) {
      key = moment(key).format("DD/MM/YYYY");
    }

    generateTableTitleEGR1000(
      doc,
      key,
      position + 10,
      position,
      "Documento",
      "Conta",
      "Carteira",
      "Emissão",
      "Venc.",
      "Valor",
      "Descontos",
      "Juros",
      "Saldo"
    );

    geraHR(doc, position + 20, "#000000");

    doc.font("Helvetica");
    position = position + 30;

    value.map((item) => {
      if (position >= "700") {
        doc.addPage({ size: "A4", margin: 50, bufferPages: true });
        page = page + 1;
        geraCabecalho(doc, reqData);

        position = 100;
      }

      doc.switchToPage(page);

      var itens = [
        {
          campo: item.FINANCA_DOCUMENTO,
          posicao: 30,
          tamanho: 70,
          alinhamento: "left",
        },
        {
          campo: item.CONTA_APELIDO,
          posicao: 80,
          tamanho: 140,
          alinhamento: "left",
        },
        {
          campo: item.CARTEIRA_NOME,
          posicao: 215,
          tamanho: 60,
          alinhamento: "left",
        },
        {
          campo: moment(item.FINANCA_EMISSAO).format("DD/MM/YYYY"),
          posicao: 270,
          tamanho: 30,
          alinhamento: "left",
        },
        {
          campo: moment(item.FINANCA_VENCIMENTO).format("DD/MM/YYYY"),
          posicao: 310,
          tamanho: 30,
          alinhamento: "left",
        },
        {
          campo: formatCurrency(item.VALOR_FINANCA),
          posicao: 320,
          tamanho: 60,
          alinhamento: "right",
        },
        {
          campo: formatCurrency(item.DESCONTOS),
          posicao: 360,
          tamanho: 60,
          alinhamento: "right",
        },
        {
          campo: formatCurrency(item.JUROS),
          posicao: 415,
          tamanho: 60,
          alinhamento: "right",
        },
        {
          campo: formatCurrency(item.SALDO_FINANCA),
          posicao: 470,
          tamanho: 60,
          alinhamento: "right",
        },
      ];

      generateTableRowNew(doc, position, itens);

      //Variaveis de soma Total parcial e sumario
      VTotal = VTotal + item.VALOR_FINANCA;
      VTotalSumario = VTotalSumario + item.VALOR_FINANCA;
      DescTotal = DescTotal + item.DESCONTOS;
      DescTotalSumario = DescTotalSumario + item.DESCONTOS;
      JurosTotal = JurosTotal + item.JUROS;
      JurosTotalSumario = JurosTotalSumario + item.JUROS;
      SaldoTotal = SaldoTotal + item.SALDO_FINANCA;
      SaldoTotalSumario = SaldoTotalSumario + item.SALDO_FINANCA;
      contador = contador + 1;
      contadorSumario = contadorSumario + 1;

      geraHR(doc, position + 8, "#aaaaaa");
      position = position + 20;
    });

    var title = "conta(s)";
    generateTotalFooter(
      doc,
      contador,
      title,
      position,
      formatCurrency(VTotal),
      formatCurrency(JurosTotal),
      formatCurrency(DescTotal),
      formatCurrency(SaldoTotal)
    );
    position = position + 13;
  }

  var title = "conta(s)";
  generateSumarioTotalFooter(
    doc,
    contadorSumario,
    title,
    position,
    formatCurrency(VTotalSumario),
    formatCurrency(JurosTotalSumario),
    formatCurrency(DescTotalSumario),
    formatCurrency(SaldoTotalSumario)
  );
  position = position + 13;
}

////////////////////////////////Funções específicas do relatório EIR4002///////////////////////////////////
function geraCabecalhoEIR4002(doc, reqData) {
  var data_ini = moment(`${reqData.dt_ini}`).format("DD/MM/YYYY");
  var data_fim = moment(`${reqData.dt_fim}`).format("DD/MM/YYYY");

  geraHR(doc, 15, "#000000");
  doc
    //PRIMEIRA LINHA
    .fontSize(14)
    .text("Comissões analítico", 230, 25)

    .fontSize(8)
    .text(`${data_ini} a ${data_fim} `, 248, 40)

    .fontSize(6)
    .image("./imagens/act.jpeg", 395, 18, {
      width: 150,
      height: 40,
      align: "right",
    })
    .fontSize(8)
    .text("Impresso gerado em " + agora, 395, 70);

  geraHR(doc, 65, "#000000");
}

function geraTabeladeDadosEIR4002(doc, DadosAgrupados, reqData) {
  var position = 80;
  var page = 0;
  var VTotal = 0;
  var VTotalSumario = 0;
  var VTotalSumarioGrupo = 0;
  var ContabilTotal = 0;
  var ContabilTotalSumario = 0;
  var ContabilTotalSumarioGrupo = 0;
  var BaseCalculoTotal = 0;
  var BaseCalculoTotalSumario = 0;
  var BaseCalculoTotalSumarioGrupo = 0;
  var contador = 0;
  var contadorSumario = 0;
  var contadorSumarioGrupo = 0;

  for (var [key, value] of DadosAgrupados) {
    //FORAGRUPADOS

    VTotalSumarioGrupo = 0;
    ContabilTotalSumarioGrupo = 0;
    BaseCalculoTotalSumarioGrupo = 0;

    if (
      reqData.agrupamento == "vencimento" ||
      reqData.agrupamento == "data" ||
      reqData.agrupamento == "emissao" ||
      reqData.agrupamento == "entrada"
    ) {
      key = moment(key).format("DD/MM/YYYY");
    }

    position = position + 20;

    generateTableTitleGenerica("blue", doc, key, position + 10, position - 2);

    doc.font("Helvetica");
    position = position + 15;
    const groupBYTipo = groupByItem(value, (item) => eval(`item.TIPO`));

    for (var [keyTipo, valueTipo] of groupBYTipo) {
      contador = 0;
      VTotal = 0;
      ContabilTotal = 0;
      BaseCalculoTotal = 0;

      generateTableTitleGenerica(
        "red",
        doc,
        keyTipo,
        position + 10,
        position - 2,
        "Data",
        30,
        "Tipo",
        80,
        "Conta",
        100,
        "Numero Pedido",
        215,
        "Numero NF.",
        255,
        "Descrição",
        290,
        "Valor contábil",
        340,
        "Base cálculo",
        380,
        "Comissão %",
        420,
        "Valor",
        520
      );

      geraHR(doc, position + 20, "#000000");
      doc.font("Helvetica");
      position = position + 30;

      valueTipo.map((item) => {
        if (position >= "670") {
          doc.addPage({ size: "A4", margin: 50, bufferPages: true });
          page = page + 1;
          geraCabecalhoEIR4002(doc, reqData);

          position = 100;
        }
        //   console.log( item.P);
        var itens = [
          {
            campo: moment(item.DATA).format("DD/MM/YYYY"),
            posicao: 30,
            tamanho: 30,
            alinhamento: "right",
          },
          {
            campo: item.TIPO,
            posicao: 70,
            tamanho: 70,
            alinhamento: "left",
          },
          {
            campo: item.CONTA_APELIDO,
            posicao: 110,
            tamanho: 150,
            alinhamento: "left",
          },
          {
            campo: item.PEDIDO_NUMERO,
            posicao: 280,
            tamanho: 80,
            alinhamento: "left",
          },
          {
            campo: item.NF_NUMERO,
            posicao: 320,
            tamanho: 90,
            alinhamento: "left",
          },
          {
            campo: item.COMISSAO_DESCRICAO,
            posicao: 355,
            tamanho: 50,
            alinhamento: "left",
          },
          {
            campo: formatCurrency(item.VALOR_CONTABIL),
            posicao: 370,
            tamanho: 60,
            alinhamento: "right",
          },
          {
            campo: formatCurrency(item.COMISSAO_BASE_CALC),
            posicao: 410,
            tamanho: 60,
            alinhamento: "right",
          },
          {
            campo: item.COMISSAO_PORC,
            posicao: 470,
            tamanho: 20,
            alinhamento: "right",
          },
          {
            campo: formatCurrency(item.COMISSAO_VALOR),
            posicao: 490,
            tamanho: 60,
            alinhamento: "right",
          },
        ];

        generateTableRowNew(doc, position, itens);

        //Variaveis de soma Total parcial e sumario
        VTotal = parseFloat(VTotal + item.COMISSAO_VALOR);
        VTotalSumario = parseFloat(VTotalSumario + item.COMISSAO_VALOR);
        VTotalSumarioGrupo = parseFloat(
          VTotalSumarioGrupo + item.COMISSAO_VALOR
        );
        ContabilTotal = parseFloat(ContabilTotal + item.VALOR_CONTABIL);
        ContabilTotalSumario = parseFloat(
          ContabilTotalSumario + item.VALOR_CONTABIL
        );
        ContabilTotalSumarioGrupo = parseFloat(
          ContabilTotalSumarioGrupo + item.VALOR_CONTABIL
        );
        BaseCalculoTotal = parseFloat(
          BaseCalculoTotal + item.COMISSAO_BASE_CALC
        );
        BaseCalculoTotalSumario = parseFloat(
          BaseCalculoTotalSumario + item.COMISSAO_BASE_CALC
        );
        BaseCalculoTotalSumarioGrupo = parseFloat(
          BaseCalculoTotalSumarioGrupo + item.COMISSAO_BASE_CALC
        );
        contador = contador + 1;
        contadorSumario = contadorSumario + 1;
        contadorSumarioGrupo = contadorSumarioGrupo + 1;

        geraHR(doc, position + 8, "#aaaaaa");
        position = position + 20;
      });

      var title = "conta(s)";
      generateTotalFooterGenerico(
        doc,
        contador,
        title,
        position,
        formatCurrency(ContabilTotal),
        340,
        formatCurrency(BaseCalculoTotal),
        380,
        formatCurrency(VTotal),
        460
      );
      position = position + 18;
    }

    geraHR(doc, position, "#000000");
    position = position + 3;

    if (ContabilTotalSumarioGrupo == "0,00") {
      ContabilTotalSumarioGrupo = Math.abs(ContabilTotalSumarioGrupo);
    }
    if (BaseCalculoTotalSumarioGrupo == "0,00") {
      BaseCalculoTotalSumarioGrupo = Math.abs(BaseCalculoTotalSumarioGrupo);
    }
    if (parseFloat(VTotalSumarioGrupo).toFixed(2) === "-0.00") {
      VTotalSumarioGrupo = Math.abs(Number(VTotalSumarioGrupo));
    }

    generateTotalFooterGenerico(
      doc,
      "",
      "",
      position,
      formatCurrency(ContabilTotalSumarioGrupo),
      340,
      formatCurrency(BaseCalculoTotalSumarioGrupo),
      380,
      formatCurrency(VTotalSumarioGrupo),
      460
    );
    position = position + 18;
  } //FIM FORAGRUPADOS

  var title = "conta(s)";

  generateSumarioTotalFooterGenerico(
    doc,
    contadorSumario,
    title,
    position,
    "Contábil",
    formatCurrency(ContabilTotalSumario),
    340,
    "B. Cálculo",
    formatCurrency(BaseCalculoTotalSumario),
    380,
    "V. Total",
    formatCurrency(VTotalSumario),
    460
  );

  position = position + 13;
}
///////////////////////////Funções específicas do relatório EIR6000//////////////////////////////////////////

function geraCabecalhoEIR6000(doc) {
  var data_ini = moment(`${reqData.dt_ini}`).format("DD/MM/YYYY");
  var data_fim = moment(`${reqData.dt_fim}`).format("DD/MM/YYYY");

  geraHR(doc, 15, "#000000");

  doc
    //PRIMEIRA LINHA
    .fontSize(14)
    .text("Ranking de vendas", 230, 20)

    .fontSize(6)
    .text(`Agrupamento: ${reqData.agrupamento}`, 30, 59)

    .fontSize(8)
    .text(`${reqData.filtros.data_ini} a ${reqData.filtros.data_fim} `, 240, 35)

    .fontSize(6)
    .image("./imagens/act.jpeg", 395, 18, {
      width: 150,
      height: 40,
      align: "right",
    })
    .fontSize(8)
    .text("Impresso gerado em " + agora, 395, 70);

  geraHR(doc, 65, "#000000");
}

function geraTabeladeDadosEIR6000(doc, DadosAgrupados) {
  var position = 90;
  var page = 0;
  var VTotal = 0;
  var VTotalSumario = 0;
  var QtdTotal = 0;
  var QtdTotalSumario = 0;
  var contador = 0;
  var contadorSumario = 0;

  for (var [key, value] of DadosAgrupados) {
    contador = 0;
    VTotal = 0;
    ContabilTotal = 0;
    BaseCalculoTotal = 0;

    generateTableTitleGenerica(
      "blue",
      doc,
      key,
      position + 10,
      position - 2,
      "Posição",
      30,
      "Nome",
      85,
      "Quantidade",
      140,
      "% Quantidade.",
      210,
      "Valor",
      280,
      "%Valor",
      380
    );
    geraHR(doc, position + 20, "#000000");
    doc.font("Helvetica");
    position = position + 25;

    value.map((item) => {
      if (position >= "700") {
        doc.addPage({ size: "A4", margin: 50, bufferPages: true });
        page = page + 1;
        geraCabecalhoEIR6000(doc, reqData);

        position = 90;
      }
      contador = contador + 1;

      var itens = [
        {
          campo: contador,
          posicao: 30,
          tamanho: 30,
          alinhamento: "right",
        },
        {
          campo: item.DETALHE_DESCRICAO,
          posicao: 85,
          tamanho: 100,
          alinhamento: "right",
        },
        {
          campo: item.QUANTIDADE_TOTAL,
          posicao: 140,
          tamanho: 60,
          alinhamento: "right",
        },
        {
          campo: ((item.QUANTIDADE_TOTAL / qtd_total) * 100).toFixed(2),
          posicao: 210,
          tamanho: 60,
          alinhamento: "right",
        },
        {
          campo: formatCurrency(item.VALOR_TOTAL),
          posicao: 280,
          tamanho: 60,
          alinhamento: "right",
        },
        {
          campo: ((item.VALOR_TOTAL / valor_total) * 100).toFixed(2),
          posicao: 380,
          tamanho: 60,
          alinhamento: "right",
        },
      ];

      generateTableRowNew(doc, position, itens);
      //Variaveis de soma Total parcial e sumario
      VTotal = VTotal + item.VALOR_TOTAL;
      VTotalSumario = VTotalSumario + item.VALOR_TOTAL;
      QtdTotal = QtdTotal + item.QUANTIDADE_TOTAL;
      QtdTotalSumario = QtdTotalSumario + item.QUANTIDADE_TOTAL;

      contadorSumario = contadorSumario + 1;

      geraHR(doc, position + 8, "#aaaaaa");
      position = position + 13;
    });

    //   geraHR(doc,position + 10,"#000000");

    var title = "registro(s)";
    generateTotalFooterGenerico(
      doc,
      contador,
      title,
      position,
      QtdTotal.toFixed(2),
      140,
      "",
      160,
      formatCurrency(VTotal),
      280
    );
    position = position + 13;
  }

  var title = "registro(s)";
  //generateSumarioTotalFooterGenerico(doc,contadorSumario,title,position,formatCurrency(QtdTotalSumario),170,'',formatCurrency(VTotalSumario),380)
  position = position + 13;
}

/////////////////////////////////RELATÓRIO DE LISTAGEM DE CONTAS////////////////////////////

const getListagemContas = async (reqData) => {
  if (reqData) {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    const response = await relatorioModel.getProgramacao(reqData);

    var qtd_total = response.length;
    var valor_total = response.reduce(function (acc, obj) {
      return acc + obj.SALDO;
    }, 0);

    const DadosAgrupados = groupByItem(response, (item) => item.MESTRE_CODIGO);

    // console.log(DadosAgrupados2);
    const gera_arq = () => {
      return new Promise((resolve, reject) => {
        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
        });

        geraCabecalhoProgramacao(doc, reqData);
        geraTabeladeDadosProgramacao(doc, DadosAgrupados, reqData);
        generateFooter(doc);

        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };
    const arquivo_gerado = await gera_arq();

    return successResponse(201, arquivo_gerado, "relatorioCriado");

    function geraCabecalhoProgramacao(doc, reqData) {
      geraHR(doc, 15);
      field(doc, "Helvetica-Bold", 10, "LCN0003", 30, 25, "", "", "left");

      field(
        doc,
        "Helvetica-Bold",
        10,
        "Programação para vendedor",
        30,
        35,
        "",
        "",
        "left"
      );

      field(doc, "Helvetica-Bold", 10, "Filtro:", 30, 45, "", "", "left");
      field(
        doc,
        "Helvetica",
        8,
        `${
          reqData.classe_nome
            ? reqData.classe_nome + "    Parâmetro:  " + reqData.parametro
            : ""
        }`,
        80,
        46,
        "",
        "",
        "left"
      );
      geraHR(doc, 60);
    }

    function geraTabeladeDadosProgramacao(doc, dados, reqData) {
      var position = 70;
      var page = 0;
      var saldoTotal = 0;
      var saldoTotalG = 0;
      var count = 0;
      var countPedido = 0;
      // console.log(DadosAgrupados);
      for (var [key, value] of dados) {
        countPedido = 0;
        saldoTotal = 0;
        position = position + 30;

        field(
          doc,
          "Helvetica",
          12,
          `${value ? value[0].MESTRE_CODIGO + " " + value[0].MESTRE_NOME : ""}`,
          220,
          position,
          "",
          "",
          "left",
          "blue"
        );

        position = position + 10;
        geraHR(doc, position);
        position = position + 10;

        const DadosAgrupados2 = groupByItem(value, (item) => item.PEDIDO);
        for (var [key2, value2] of DadosAgrupados2) {
          countPedido = 0;
          saldoTotal = 0;
          position = position + 10;
          field(
            doc,
            "Helvetica",
            10,
            `${value2 ? "Pedido: " + value2[0].PEDIDO : ""}`,
            80,
            position,
            "",
            "",
            "left"
          );
          field(
            doc,
            "Helvetica",
            10,
            `${
              value2 ? moment(`${value2[0].PREVISAO}`).format("DD/MM/YYYY") : ""
            }`,
            400,
            position,
            "",
            "",
            "left"
          );

          //     position = position + 10;
          //     geraHR(doc, position);
          position = position + 20;

          field(doc, "Helvetica", 9, `Código`, 80, position, "", "", "left");
          field(doc, "Helvetica", 9, `Grade`, 140, position, "", "", "left");
          field(
            doc,
            "Helvetica",
            9,
            `Valor un.`,
            320,
            position,
            "",
            "",
            "left"
          );
          field(
            doc,
            "Helvetica",
            9,
            `Disponibilidade`,
            400,
            position,
            "",
            "",
            "left"
          );
          position = position + 20;

          value2.map((item) => {
            if (position >= "700") {
              doc.addPage({ size: "A4", margin: 50, bufferPages: true });
              page = page + 1;
              geraCabecalhoProgramacao(doc, reqData);
              position = 90;
            }

            //   field(doc,'Helvetica',8,`${response[0]? response[0].ITEM_CODIGO:''}`,80,position,'','','left');
            //  field(doc,'Helvetica',8,`${response[0]? response[0].ITEM_GRADE:''}`,140,position,'','','left');
            // field(doc,'Helvetica',8,`${response[0]? response[0].SALDO + ' ' + response[0].ITEM_UNIDADE:''}`,380,position,'','','left');

            var itens = [
              {
                campo: item.ITEM_CODIGO,
                posicao: 80,
                tamanho: 60,
                alinhamento: "left",
              },
              {
                campo: item.ITEM_GRADE,
                posicao: 140,
                tamanho: 260,
                alinhamento: "left",
              },
              {
                campo: formatDecimal(item.VALOR_UNITARIO),
                posicao: 320,
                tamanho: 260,
                alinhamento: "left",
              },
              {
                campo: formatDecimal(item.SALDO) + " " + item.ITEM_UNIDADE,
                posicao: 390,
                tamanho: 60,
                alinhamento: "right",
              },
            ];

            generateTableRowNew(doc, position, itens);

            //Variaveis de soma Total parcial e sumario
            saldoTotal = saldoTotal + item.SALDO;
            saldoTotalG = saldoTotalG + item.SALDO;

            count = count + 1;
            countPedido = countPedido + 1;

            geraHR(doc, position + 5, "#aaaaaa");
            position = position + 15;
          });

          //   geraHR(doc,position + 10,"#000000");

          var title = "registro(s)";
          doc
            .fontSize(6)
            .fillColor("blue")
            .text(countPedido + " " + title, 80, position, { align: "left" })
            .fillColor("blue")
            .text(formatDecimal(saldoTotal), 360, position, {
              width: 90,
              align: "right",
            });

          position = position + 13;
        }
      }
      var title = "registro(s)";
      //generateSumarioTotalFooterGenerico(doc,countSumario,title,position,formatCurrency(QtdTotalSumario),170,'',formatCurrency(VTotalSumario),380)
      position = position + 13;
    }
  } //fecha if(reqData)
};

//////////////////////////////////////////Relatório EGR1000 Contas a receber///////////////////////////////////////////
const getReportEGR1000 = async (api_dados) => {
  if (api_dados) {
    const dados_usuario = await clientesModel.getUserInformation(
      api_dados.email
    );
    //  if(!reqData.vendedor && dados_usuario[0].USUARIO_PERFIL==='supervisor'){reqData.supervisor=dados_usuario[0].USUARIO_CONTA_ID_ERP}

    const response = await relatorioModel.getEGR1000(api_dados);
    filtros = JSON.parse(api_dados.filtros);

    var agrupamento = filtros.agrupamento;

    const DadosAgrupados = groupByItem(response, (item) =>
      eval(`item.${agrupamento}`)
    );
    //  console.log(DadosAgrupados);

    const gera_arqEGR1000 = (api_dados) => {
      return new Promise((resolve, reject) => {
        // Exemplo de uso:
        const fieldsToShow = api_dados.campos;
        const fieldsNameToShow = api_dados.labels;

        const groupBy = filtros.agrupamento;

        const orderBy = filtros.ordenacao ? filtros.ordenacao : "name"; // Campo pelo qual você deseja ordenar

        const sizeField = api_dados.tamanhos.map((valor) => parseInt(valor));
        // Verifica o limite da pagina com base do size field passado
        const soma = sizeField.reduce((acc, valor) => {
          if (!isNaN(valor)) {
            return acc + valor;
          }
          return acc;
        }, 0);
        const orientacao_pagina = soma > 450 ? "landscape" : "portrait";

        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
          layout: orientacao_pagina,
        });

        generatePDF(
          doc,
          "Listagem de pessoas",
          api_dados,
          DadosAgrupados,
          fieldsToShow,
          fieldsNameToShow,
          groupBy,
          orderBy,
          sizeField,
          orientacao_pagina
        );

        //geraTabeladeDados(doc, DadosAgrupados, reqData);
        //generateFooter(doc);
        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };

    const arquivo_gerado = await gera_arqEGR1000(api_dados);
    return successResponse(201, arquivo_gerado, "relatorioCriado");
  } //fecha if(reqData)
};

//////////////////////////////////////////Relatório EIR4002-Comissões///////////////////////////////////////////
const getReportEIR4002 = async (reqData) => {
  if (reqData) {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    reqData.perfil = dados_usuario[0].USUARIO_PERFIL;
    if (reqData.perfil === "supervisor") {
      reqData.supervisor = dados_usuario[0].USUARIO_CONTA_ID_ERP;
    }
    const empresa = await empresaModel.getEmpresaById(
      dados_usuario[0].USUARIO_EMPRESA_ID
    );
    const response = await relatorioModel.getEIR4002(reqData);
    reqData.empresa_id = empresa[0].EMPRESA_ID_ERP;

    var result = response.filter(function (el) {
      return el.TIPO != "SaldoAnterior";
    });

    var agrupamento =
      reqData.agrupamento == "conta"
        ? "CONTA_NOME"
        : reqData.agrupamento == "tipo"
        ? "TIPO"
        : reqData.agrupamento == "data"
        ? "DATA"
        : reqData.agrupamento == "estado"
        ? "ESTADO"
        : reqData.agrupamento == "vendedor"
        ? "VENDEDOR_NOME"
        : "VENDEDOR_NOME";
    const DadosAgrupados = groupByItem(result, (item) =>
      eval(`item.${agrupamento}`)
    );
    //    console.log(agrupamento);

    const gera_arqEIR4002 = () => {
      return new Promise((resolve, reject) => {
        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
        });

        geraCabecalhoEIR4002(doc, reqData);
        geraTabeladeDadosEIR4002(doc, DadosAgrupados, reqData);
        generateFooter(doc);

        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };
    const arquivo_gerado = await gera_arqEIR4002();

    return successResponse(201, arquivo_gerado, "relatorioCriado");
  } //fecha if(reqData)
};

//////////////////////////////////////////Relatório EIR6000 - Ranking de vendas///////////////////////////////////////////
const getReportEIR6000 = async (api_dados) => {
  if (api_dados) {
    const dados_usuario = await clientesModel.getUserInformation(
      api_dados.email
    );
    //  if(!reqData.vendedor && dados_usuario[0].USUARIO_PERFIL==='supervisor'){reqData.supervisor=dados_usuario[0].USUARIO_CONTA_ID_ERP}
    const perfil = dados_usuario[0].USUARIO_PERFIL;
    filtros = api_dados.filtros;

    if (perfil == "supervisor" && filtros.vendedor == "") {
      ArrayVendedores = await clientesModel.getArrayVendedores(
        Number(dados_usuario[0].USUARIO_ID)
      );
      ArrayVendedores = ArrayVendedores.filter(
        (li, idx, self) =>
          self
            .map((itm) => itm.USUARIO_CONTA_ID_ERP)
            .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
      );
      filtros.vendedor = ArrayVendedores.map(
        (item) => item.USUARIO_CONTA_ID_ERP
      );
    }

    if (
      (perfil == "operador" || perfil == "ti" || perfil == "admin_global") &&
      filtros.supervisor != ""
    ) {
      ArrayVendedores = await clientesModel.getArrayVendedores(
        Number(filtros.supervisor)
      );
      ArrayVendedores = ArrayVendedores.filter(
        (li, idx, self) =>
          self
            .map((itm) => itm.USUARIO_CONTA_ID_ERP)
            .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
      );
      filtros.vendedor = ArrayVendedores.map(
        (item) => item.USUARIO_CONTA_ID_ERP
      );
    }
    const response = await relatorioModel.getEIR6000(api_dados);
    var agrupamento = filtros.agrupamento;
    if (api_dados.filtros.agrupamento == "") {
      agrupamento = "nenhum";
    }
    const DadosAgrupados =
      agrupamento.length > 0
        ? groupByItem(response, (item) => eval(`item.${agrupamento}`))
        : response;

    const gera_arqEIR6000 = (api_dados) => {
      return new Promise((resolve, reject) => {
        // Exemplo de uso:
        const fieldsToShow = api_dados.campos;
        const fieldsNameToShow = api_dados.labels;
        const fieldsType = api_dados.tipos;

        const groupBy = api_dados.filtros.agrupamento
          ? api_dados.filtros.agrupamento
          : "";

        const orderBy = api_dados.filtros.ordenacao
          ? api_dados.filtros.ordenacao
          : "invoiceItem_totalValue"; // Campo pelo qual você deseja ordenar

        const sizeField = api_dados.tamanhos.map((valor) => parseInt(valor));
        // Verifica o limite da pagina com base do size field passado
        const soma = sizeField.reduce((acc, valor) => {
          if (!isNaN(valor)) {
            return acc + valor;
          }
          return acc;
        }, 0);
        const orientacao_pagina = soma > 450 ? "landscape" : "portrait";

        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
          layout: orientacao_pagina,
        });
        //console.log(DadosAgrupados)
        generatePDFRankingVendas(
          doc,
          "Ranking de Vendas",
          api_dados,
          DadosAgrupados,
          fieldsToShow,
          fieldsNameToShow,
          fieldsType,
          groupBy,
          orderBy,
          sizeField,
          orientacao_pagina,
          perfil
        );

        //geraTabeladeDados(doc, DadosAgrupados, reqData);
        //generateFooter(doc);
        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };

    const arquivo_gerado = await gera_arqEIR6000(api_dados);
    return successResponse(201, arquivo_gerado, "relatorioCriado");
  } //fecha if(reqData)
};

//////////////////////////////////////////Relatório Contas a Receber - Contas a receber///////////////////////////////////////////
const getReportCONTASARECEBER = async (where, email) => {
  if (!where.includes("salesperson=")) {
    const vendedores = await getVendedores(email);
    if (vendedores.length > 0) {
      const personSalesperson = `&salesperson=${vendedores.join(",")}`;
      where = where + personSalesperson;
    }
  }
  if (!where.includes("company=")) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();
    const empresasJoin = `&company=${empresasAtivas.join(",")}`;
    where = where + empresasJoin;
  }

  // reqData.where.COMPANY_IDS= empresasAtivas;
  /*  if (reqData.where.SALE_ID) {
       //Pesquisa de um unico pedido
       const apiSyntaxCompany = `(${empresasAtivas.map(id => `company.id==${id}`).join(',')})`;
 
*/

  const url = encodeURIComponent(
    `${ERP_CONF.receivableReport}?${where}&showColumns=code,dueDate,person_id,person_name,person_documentNumber,value,balance,company,installment,issueDate&tenant=${API.tenant}`
  );
     var url_to_show = await  savefile.get_urlPdf(url)
  var arquivo_gerado = await savefile.gera_impresso(url_to_show);

//  var arquivo_gerado = await savefile.gera_impresso(url);
  return successResponse(201, arquivo_gerado, "relatorioCriado");
};
const getReportPEDIDOSVENDA = async (where, email) => {

  console.log('------------------------------------')

  console.log(where)
  if (!where.salesperson) {
    const vendedores = await getVendedores(email);

    if (vendedores.length > 0) {
      where.salesperson = vendedores.join(",");
    }
  }

  if (!where.company) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();

    if (empresasAtivas.length > 0) {
      where.company = empresasAtivas.join(",");
    }
  }

 // const url = encodeURIComponent(
  //  `${ERP_CONF.reportSalesOrder}?${where}&showColumns=sum_totalValue,sale_id,person_name,sale_status,company_code,product_code,sum_quantity,salesperson_name,saleItem_unitValue,product_description,productVariant.description,productPacking_complement&tenant=${API.tenant}`
  //);
 
console.log(where)
  const response = await relatorioModel.getPedidoDeVendas(where);

  const url = encodeURIComponent(response.uri);

    console.log(url)

   var url_to_show = await  savefile.get_urlPdf(url)
  var arquivo_gerado = await savefile.gera_impresso(url_to_show);

 
//  var url_to_show = await savefile.get_urlPdf(url);
 // var arquivo_gerado = await savefile.gera_impresso(url_to_show);

  return successResponse(201, arquivo_gerado, "relatorioCriado");
};





const getReportNOTASFISCAIS = async (where, email) => {
  if (!where.salesperson) {
    const vendedores = await getVendedores(email);

    if (vendedores.length > 0) {
      where.salesperson = vendedores.join(",");
    }
  }

  if (!where.company) {
    const empresasAtivas = await funcoes.getEmpresasAtivas();

    if (empresasAtivas.length > 0) {
      where.company = empresasAtivas.join(",");
    }
  }


  const response = await relatorioModel.getNfs(where);

  const url = encodeURIComponent(response.uri);

    console.log(url)

   var url_to_show = await  savefile.get_urlPdf(url)
  var arquivo_gerado = await savefile.gera_impresso(url_to_show);
 // console.log(arquivo_gerado);
  return successResponse(201, arquivo_gerado, "relatorioCriado");
};

const geraRelatorioALP0001 = async (reqData) => {
  try {
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    //const   validInput = validaRelatorioALP0001(reqData);
    const validInput = reqData;
    if (validInput) {
      //Verifica se a relatorios ja existe "consulta pelo nome".
      var response = await relatorioModel.getDataALP0001(validInput);
      /*   relatorioData  = relatorioData.reduce((obj, item) => {
           
           obj[item.classeCodigo] = obj[item.classeCodigo] || [];
           obj[item.classeCodigo].push(item);
           return obj;
         }, []);

      // console.log(relatorioData);
               const map =   relatorioData.map((item,index)=>{console.log('item'+item)
             
             return item;
             });
   /*   const map = relatorioData.map((x, index) => {
       console.log('indice'+index);
       return x + index;
     });
     console.log('teste map'+map);
     */
      return successResponse(
        201,
        response,
        { nome: validInput.nome },
        "relatorioCriado"
      );
    } else {
      console.log("entrou2");
    }
  } catch (error) {
    console.error("error -> ", logStruct("createrelatorio", error));
    return errorResponse(error.status, error.message);
  }
};

//////////////////////////////////////////Relatório Atividades//////////////////////////////////////////
const getReportALP0008 = async (where) => {
  const url = encodeURIComponent(
    `${ERP_CONF.activityReport}?${where}&showColumns=person_id,person_nameCalc,person_email,person_phone,salesperson_nameCalc,last_date,inactivityDays&tenant=${API.tenant}`
  );
   var url_to_show = await  savefile.get_urlPdf(url)
  var arquivo_gerado = await savefile.gera_impresso(url_to_show);

  //var arquivo_gerado = await savefile.gera_impresso(url);
  return successResponse(201, arquivo_gerado, "relatorioCriado");
};

const getReportProntaEntrega = async (reqData, token_erp) => {
  if (reqData) {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    const response_regras = await regrasModel.getAllListaPrecos();
    var regra = response_regras.find(
      (item) => Number(item.LISTA_PRECOS_ID) === Number(reqData.lista)
    );

    var exibe_valor = regra ? regra.LISTA_PRECOS_EXIBE_VALOR : null;
    var permite_listar = regra ? regra.LISTA_PRECOS_PERMITE_LISTAR_TODOS : null;

    reqData.lista_preco = reqData.lista
      ? Number(regra.LISTA_PRECOS_NOME)
      : null;

    var response = await produtosModel.getProdutos(reqData, token_erp);
    var response_lista = null;

    var response_organized = "";
    if (response) {
      // Agrupamento por productPacking_id, schedule_id e company.id
      const purchaseSet = new Set();
      response.forEach((item) => {
        if (item.subtype === "PURCHASE" && item.schedule_id !== null) {
          purchaseSet.add(item.schedule_id);
        }
      });

    

      // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
      const filteredGroupedResponse = Object.fromEntries(
        Object.entries(response).filter(
          ([key, value]) => value.quantity > 0 && !value.schedule_id
        )
      ); //console.log(filteredGroupedResponse);
      // Convertendo o objeto agrupado de volta para um array
      response_organized = Object.values(filteredGroupedResponse);
      const selectedCompaniesgroup = reqData.empresas
        ? reqData.empresas.split(",").map(Number)
        : null;
      const DadosEmpresa = await empresaModel.getEmpresas();

      const selectedCompanies =
        selectedCompaniesgroup != null
          ? selectedCompaniesgroup.map((company) => {
              return DadosEmpresa.find(
                (item) => Number(item.EMPRESA_ID_ERP) === Number(company)
              ).EMPRESA_CLUSTER;
            })
          : null;
      response_organized = reqData.empresas
        ? response_organized.filter((item) =>
            selectedCompanies.includes(String(item.stockCluster_id))
          )
        : response_organized;
      for (let index = 0; index < response_organized.length; index++) {
        if (exibe_valor == "sim") {
          response_organized[index].VALOR_UNITARIO = response_organized[index]
            .unitValue
            ? response_organized[index].unitValue
            : 0;
        } else {
          response_organized[index].VALOR_UNITARIO = 0;
        }
      }
    }

    const DadosAgrupados = groupByItem(
      response_organized,
      (item) => item.product_id
    );

    //   console.log(DadosAgrupados);
    const gera_arq = () => {
      return new Promise((resolve, reject) => {
        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
        });

        geraCabecalhoProntaEntrega(doc, reqData);
        geraTabeladeDadosProntaEntrega(doc, DadosAgrupados, reqData);
        generateFooter(doc);

        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };
    const arquivo_gerado = await gera_arq();

    return successResponse(201, arquivo_gerado, "relatorioCriado");

    function geraCabecalhoProntaEntrega(doc, reqData) {
      geraHR(doc, 15);
      field(
        doc,
        "Helvetica-Bold",
        10,
        "Pronta entrega para vendedor",
        30,
        35,
        "",
        "",
        "left"
      );
      field(doc, "Helvetica-Bold", 10, "Parâmetro:", 30, 45, "", "", "left");
      field(
        doc,
        "Helvetica",
        8,
        `${reqData.nome ? reqData.nome : ""}`,
        85,
        46,
        "",
        "",
        "left"
      );

      geraHR(doc, 60);
    }

    function geraTabeladeDadosProntaEntrega(doc, DadosAgrupados, reqData) {
      //console.log("acessou essa função");
      var position = 70;
      var page = 0;
      var saldoTotal = 0;
      var saldoTotalG = 0;
      var count = 0;

      for (var [key, value] of DadosAgrupados) {
        count = 0;
        saldoTotal = 0;
        position = position + 20;
        geraHR(doc, position);
        position = position + 10;

        field(
          doc,
          "Helvetica",
          12,
          `${
            value
              ? value[0].product_code + " " + value[0].product_description
              : ""
          }`,
          80,
          position,
          "",
          "",
          "left"
        );

        position = position + 10;
        geraHR(doc, position);
        position = position + 10;

        field(doc, "Helvetica", 9, `Empresa`, 30, position, "", "", "left");
        field(doc, "Helvetica", 9, `Código`, 80, position, "", "", "left");
        field(doc, "Helvetica", 9, `Variante`, 140, position, "", "", "left");
        field(doc, "Helvetica", 9, `Valor`, 320, position, "", "", "left");
        field(
          doc,
          "Helvetica",
          9,
          `Pronta Entrega`,
          400,
          position,
          "",
          "",
          "left"
        );
        position = position + 20;

        value.map((item) => {
          if (position >= "700") {
            doc.addPage({ size: "A4", margin: 50, bufferPages: true });
            page = page + 1;
            geraCabecalhoProntaEntrega(doc, reqData);
            position = 90;
          }

          //   field(doc,'Helvetica',8,`${response[0]? response[0].ITEM_CODIGO:''}`,80,position,'','','left');
          //  field(doc,'Helvetica',8,`${response[0]? response[0].ITEM_GRADE:''}`,140,position,'','','left');
          // field(doc,'Helvetica',8,`${response[0]? response[0].SALDO + ' ' + response[0].ITEM_UNIDADE:''}`,380,position,'','','left');

          var itens = [
            {
              campo: item.stockCluster_code,
              posicao: 30,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: item.productPacking_code,
              posicao: 80,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: item.productPacking_complement
                ? item.productPacking_complement
                : item.productVariant_description,
              posicao: 140,
              tamanho: 260,
              alinhamento: "left",
            },
            {
              campo: formatCurrency(item.VALOR_UNITARIO),
              posicao: 280,
              tamanho: 60,
              alinhamento: "right",
            },
            {
              campo: formatDecimal(item.quantity) + " " + item.unit_code,
              posicao: 390,
              tamanho: 60,
              alinhamento: "right",
            },
          ];

          generateTableRowNew(doc, position, itens);

          //Variaveis de soma Total parcial e sumario
          saldoTotal = saldoTotal + item.quantity;
          saldoTotalG = saldoTotalG + item.quantity;

          count = count + 1;

          geraHR(doc, position + 5, "#aaaaaa");
          position = position + 15;
        });

        //   geraHR(doc,position + 10,"#000000");

        var title = "registro(s)";
        doc
          .fontSize(6)
          .fillColor("blue")
          .text(count + " " + title, 30, position, { align: "left" })
          .fillColor("blue")
          .text(formatDecimal(saldoTotal), 360, position, {
            width: 90,
            align: "right",
          });

        position = position + 13;
      }

      var title = "registro(s)";
      //generateSumarioTotalFooterGenerico(doc,countSumario,title,position,formatCurrency(QtdTotalSumario),170,'',formatCurrency(VTotalSumario),380)
      position = position + 13;
    }
  } //fecha if(reqData)
};

const getReportProgramacao = async (reqData, token_erp) => {
  if (reqData) {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);
    const response_regras = await regrasModel.getAllListaPrecos();
    var regra = response_regras.find(
      (item) => Number(item.LISTA_PRECOS_ID) === Number(reqData.lista)
    );

    var exibe_valor = regra ? regra.LISTA_PRECOS_EXIBE_VALOR : null;
    var permite_listar = regra ? regra.LISTA_PRECOS_PERMITE_LISTAR_TODOS : null;

    reqData.lista_preco = reqData.lista
      ? Number(regra.LISTA_PRECOS_NOME)
      : null;

    // const response = await relatorioModel.getProgramacao(reqData);
    var response = await produtosModel.getProdutos(reqData, token_erp);
    var response_lista = null;
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

   
      const exibeQuantidade = reqData.exibe_sem_disponibilidade == "Sim";

      // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
      const filteredGroupedResponse = Object.fromEntries(
        Object.entries(response).filter(
          ([key, value]) =>
            (exibeQuantidade || value.quantity > 0) && value.schedule_id != null
        )
      );

      // Convertendo o objeto agrupado de volta para um array
      response_organized = Object.values(filteredGroupedResponse);
      // Receber empresas selecionadas do frontend
      // Filtrar response_organized com base nas empresas selecionadas
      const selectedCompaniesgroup = reqData.empresas
        ? reqData.empresas.split(",").map(Number)
        : null;
      const DadosEmpresa = await empresaModel.getEmpresas();

      const selectedCompanies =
        selectedCompaniesgroup != null
          ? selectedCompaniesgroup.map((company) => {
              return DadosEmpresa.find(
                (item) => Number(item.EMPRESA_ID_ERP) === Number(company)
              ).EMPRESA_CLUSTER;
            })
          : null;
      response_organized = reqData.empresas
        ? response_organized.filter((item) =>
            selectedCompanies.includes(String(item.stockCluster_id))
          )
        : response_organized;

      for (let index = 0; index < response_organized.length; index++) {
        if (exibe_valor == "sim") {
          response_organized[index].VALOR_UNITARIO = response_organized[index]
            .unit_value_retail
            ? response_organized[index].unit_value_retail
            : 0;
          //console.log(response_organized[index]);
        } else {
          response_organized[index].VALOR_UNITARIO = 0;
        }
      }
    }

    const DadosAgrupados = groupByItem(
      response_organized,
      (item) => item.product_code
    );

    const gera_arq = () => {
      return new Promise((resolve, reject) => {
        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
        });

        geraCabecalhoProgramacao(doc, reqData);
        //console.log("1");
        geraTabeladeDadosProgramacao(doc, DadosAgrupados, reqData);
        //console.log("2");
        generateFooter(doc);
        //console.log("3");

        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };
    const arquivo_gerado = await gera_arq();

    return successResponse(201, arquivo_gerado, "relatorioCriado");

    function geraCabecalhoProgramacao(doc, reqData) {
      geraHR(doc, 15);

      field(
        doc,
        "Helvetica-Bold",
        10,
        "Programação para vendedor",
        30,
        35,
        "",
        "",
        "left"
      );
      field(doc, "Helvetica-Bold", 10, "Parâmetro:", 30, 45, "", "", "left");
      field(
        doc,
        "Helvetica",
        8,
        `${reqData.nome ? reqData.nome : ""}`,
        85,
        46,
        "",
        "",
        "left"
      );

      geraHR(doc, 60);
    }

    function geraTabeladeDadosProgramacao(doc, dados, reqData) {
      //console.log("acessou essa função");
      var position = 70;
      var page = 0;
      var saldoTotal = 0;
      var saldoTotalG = 0;
      var count = 0;
      var countPedido = 0;
      //console.log(DadosAgrupados);
      for (var [key, value] of dados) {
        countPedido = 0;
        saldoTotal = 0;
        position = position + 30;
        //  //console.log(value)
        field(
          doc,
          "Helvetica",
          12,
          `${
            value
              ? value[0].product_code +
                " - " +
                value[0].product_description +
                "-" +
                moment(`${value[0].schedule_availabilityDate}`).format(
                  "DD/MM/YYYY"
                )
              : ""
          }`,
          100,
          position,
          "",
          "",
          "left",
          "blue"
        );

        position = position + 10;
        geraHR(doc, position);
        position = position + 10;

        //      console.log(value[0]
        //    )

        const DadosAgrupados2 = groupByItem(
          value,
          (item) => item.schedule_code
        );
        //  console.log(DadosAgrupados2)
        for (var [key2, value2] of DadosAgrupados2) {
          countPedido = 0;
          saldoTotal = 0;
          position = position + 10;
          field(
            doc,
            "Helvetica",
            10,
            `${
              value2
                ? "Programação: " +
                  value2[0].schedule_code +
                  "  " +
                  moment(`${value2[0].schedule_availabilityDate}`).format(
                    "DD/MM/YYYY"
                  ) +
                  " - " +
                  value2[0].stockCluster_code
                : ""
            }`,
            50,
            position,
            "",
            "",
            "left"
          );
          /*  field(
              doc,
              "Helvetica",
              10,
              `${value2 ? moment(`${value2[0].date}`).format("DD/MM/YYYY") : ""
              }`,
              400,
              position,
              "",
              "",
              "left"
            );
  */
          //     position = position + 10;
          //     geraHR(doc, position);
          position = position + 20;

          field(doc, "Helvetica", 9, `Código`, 50, position, "", "", "left");
          field(doc, "Helvetica", 9, `Variante`, 140, position, "", "", "left");
          field(doc, "Helvetica", 9, `Valor`, 320, position, "", "", "left");
          field(
            doc,
            "Helvetica",
            9,
            `Disponibilidade`,
            400,
            position,
            "",
            "",
            "left"
          );
          position = position + 20;

          value2.map((item) => {
            if (position >= "700") {
              doc.addPage({ size: "A4", margin: 50, bufferPages: true });
              page = page + 1;
              geraCabecalhoProgramacao(doc, reqData);
              position = 90;
            }

            //   field(doc,'Helvetica',8,`${response[0]? response[0].ITEM_CODIGO:''}`,80,position,'','','left');
            //  field(doc,'Helvetica',8,`${response[0]? response[0].ITEM_GRADE:''}`,140,position,'','','left');
            // field(doc,'Helvetica',8,`${response[0]? response[0].SALDO + ' ' + response[0].ITEM_UNIDADE:''}`,380,position,'','','left');

            var itens = [
              {
                campo: item.productPacking_code,
                posicao: 50,
                tamanho: 60,
                alinhamento: "left",
              },
              {
                campo: item.productPacking_complement
                  ? item.productPacking_complement
                  : item.productVariant_description,
                posicao: 140,
                tamanho: 260,
                alinhamento: "left",
              },
              {
                campo: formatCurrency(item.VALOR_UNITARIO),
                posicao: 280,
                tamanho: 60,
                alinhamento: "right",
              },
              {
                campo: formatDecimal(item.quantity) + " " + item.unit_code,
                posicao: 390,
                tamanho: 60,
                alinhamento: "right",
              },
            ];

            generateTableRowNew(doc, position, itens);

            //Variaveis de soma Total parcial e sumario
            saldoTotal = saldoTotal + item.quantity;
            saldoTotalG = saldoTotalG + item.quantity;

            count = count + 1;
            countPedido = countPedido + 1;

            geraHR(doc, position + 5, "#aaaaaa");
            position = position + 15;
          });

          //   geraHR(doc,position + 10,"#000000");

          var title = "registro(s)";
          doc
            .fontSize(6)
            .fillColor("blue")
            .text(countPedido + " " + title, 50, position, { align: "left" })
            .fillColor("blue")
            .text(formatDecimal(saldoTotal), 360, position, {
              width: 90,
              align: "right",
            });

          position = position + 13;
        }
      }
      var title = "registro(s)";
      //generateSumarioTotalFooterGenerico(doc,countPedido,title,position,formatCurrency(QtdTotalSumario),170,'','',380)
      position = position + 13;
    }
  } //fecha if(reqData)
};

const getReportVendaSintetico = async (reqData) => {
  if (reqData) {
    //console.log(reqData);
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);
    if (dados_usuario[0].USUARIO_PERFIL === "supervisor") {
      reqData.supervisor = dados_usuario[0].USUARIO_CONTA_ID_ERP;
    }

    const response = await relatorioModel.getVendaSintetico(reqData);
    //console.log(response);

    var qtd_total = response.length;
    ////console.log(qtd_total);
    var valor_total = response.reduce(function (acc, obj) {
      return acc + obj.VALOR_TOTAL;
    }, 0);
    //console.log(valor_total);

    var agrupamento =
      reqData.agrupamento == "'EMISSAO'"
        ? "EMISSAO"
        : reqData.agrupamento == "'CLIENTE'"
        ? "CLIENTE"
        : reqData.agrupamento == "'VENDEDOR'"
        ? "VENDEDOR"
        : reqData.agrupamento == "'STATUS'"
        ? "STATUS"
        : reqData.agrupamento == "'PREVISAO'"
        ? "PREVISAO"
        : "EMISSAO";

    const DadosAgrupados = groupByItem(response, (item) =>
      eval(`item.${agrupamento}`)
    );
    ////console.log(DadosAgrupados);
    // //console.log(DadosAgrupados2);
    const gera_arq = () => {
      return new Promise((resolve, reject) => {
        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
        });

        geraCabecalhoSintetico(doc, reqData);
        //console.log("1");
        geraTabeladeDadosSintetico(doc, DadosAgrupados, reqData);
        //console.log("2");
        generateFooter(doc);
        //console.log("3");

        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };
    const arquivo_gerado = await gera_arq();

    return successResponse(201, arquivo_gerado, "relatorioCriado");

    function geraCabecalhoSintetico(doc, reqData) {
      var data_ini = moment(`${reqData.dt_inicial}`).format("DD/MM/YYYY");
      var data_fim = moment(`${reqData.dt_final}`).format("DD/MM/YYYY");
      // //console.log("ddddd" + data_ini);
      geraHR(doc, 15, "#000000");
      doc
        //PRIMEIRA LINHA
        .fontSize(14)
        .text("Relatório Sintético", 230, 20)

        .fontSize(6)
        .text(`Agrupamento: ${reqData.agrupamento}`, 30, 59)

        .fontSize(8)
        .text(`${data_ini} a ${data_fim} `, 240, 35)

        .fontSize(6)
        .image("./imagens/act.jpeg", 395, 18, {
          width: 150,
          height: 40,
          align: "right",
        })
        .fontSize(8)
        .text("Impresso gerado em " + agora, 395, 70);

      geraHR(doc, 65, "#000000");
    }

    function geraTabeladeDadosSintetico(doc, DadosAgrupados, reqData) {
      //console.log("acessou essa função");
      var position = 90;
      var page = 0;
      var VTotal = 0;
      var VTotalSumario = 0;
      var QtdTotal = 0;
      var QtdTotalSumario = 0;
      var count = 0;
      var countSumario = 0;

      for (var [key, value] of DadosAgrupados) {
        count = 0;
        VTotal = 0;
        ContabilTotal = 0;
        BaseCalculoTotal = 0;

        field(
          doc,
          "Helvetica-Bold",
          9,
          `Nº do sistema`,
          30,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Nº do pedido`,
          95,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Cliente`,
          170,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Vendedor`,
          280,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Status`,
          370,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Emissão`,
          425,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Previsão`,
          465,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Valor Total`,
          520,
          position,
          "",
          "",
          "left"
        );

        geraHR(doc, position + 20, "#000000");
        doc.font("Helvetica");
        position = position + 30;

        value.map((item) => {
          //console.log(item);
          if (position >= "700") {
            doc.addPage({ size: "A4", margin: 50, bufferPages: true });
            page = page + 1;
            geraCabecalhoSintetico(doc, reqData);

            position = 100;
          }
          count = count + 1;

          var itens = [
            {
              campo: count,
              posicao: 8,
              tamanho: 25,
              alinhamento: "right",
            },
            {
              campo: item.NUMERO_SISTEMA,
              posicao: 48,
              tamanho: 250,
              alinhamento: "left",
            },
            {
              campo: item.PEDIDO_NUMERO,
              posicao: 65,
              tamanho: 60,
              alinhamento: "right",
            },
            {
              campo: item.CLIENTE,
              posicao: 140,
              tamanho: 120,
              alinhamento: "left",
            },
            {
              campo: item.VENDEDOR,
              posicao: 265,
              tamanho: 100,
              alinhamento: "left",
            },
            {
              campo: item.STATUS,
              posicao: 370,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: moment(item.EMISSAO).format("DD/MM/YYYY"),
              posicao: 430,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: moment(item.PREVISAO).format("DD/MM/YYYY"),
              posicao: 470,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: formatCurrency(item.VALOR_TOTAL),
              posicao: 500,
              tamanho: 60,
              alinhamento: "right",
            },
          ];
          //console.log("epa");
          generateTableRowNew(doc, position, itens);

          //Variaveis de soma Total parcial e sumario
          VTotal = VTotal + item.VALOR_TOTAL;
          VTotalSumario = VTotalSumario + item.VALOR_TOTAL;
          QtdTotal = QtdTotal + item.QUANTIDADE_TOTAL;
          QtdTotalSumario = QtdTotalSumario + item.QUANTIDADE_TOTAL;

          countSumario = countSumario + 1;

          geraHR(doc, position + 8, "#aaaaaa");
          position = position + 15;
        });

        //   geraHR(doc,position + 10,"#000000");

        var title = "registro(s)";
        generateTotalFooterGenerico(
          doc,
          count,
          title,
          position,
          "",
          240,
          "",
          260,
          formatCurrency(VTotal),
          470
        );
        position = position + 13;
      }

      var title = "registro(s)";
      geraHR(doc, position, "#000000", 830);
      position = position + 10;
      var qtd_total_itens = response.length;
      //console.log(qtd_total);
      var valor_total = response.reduce(function (acc, obj) {
        return acc + obj.VALOR_TOTAL;
      }, 0);

      var title = "registro(s)";
      doc
        .fontSize(6)
        .fillColor("blue")
        .text(qtd_total_itens + " " + title, 30, position, { align: "left" })
        .fillColor("blue")
        .text(formatCurrency(valor_total), 470, position, {
          width: 90,
          align: "right",
        });

      position = position + 13;
    }
  } //fecha if(reqData)
};

const getReportVendaAnalitico = async (reqData) => {
  if (reqData) {
    //console.log("entrou na venda analitica");
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    if (dados_usuario[0].USUARIO_PERFIL === "supervisor") {
      reqData.supervisor = dados_usuario[0].USUARIO_CONTA_ID_ERP;
    }

    const response = await relatorioModel.getVendaAnalitico(reqData);
    // //console.log(response);
    ////console.log(reqData);

    var agrupamento =
      reqData.agrupamento == "'EMISSAO'"
        ? "EMISSAO"
        : reqData.agrupamento == "'CLIENTE'"
        ? "CLIENTE"
        : reqData.agrupamento == "'VENDEDOR'"
        ? "VENDEDOR"
        : reqData.agrupamento == "'STATUS'"
        ? "STATUS"
        : reqData.agrupamento == "'PREVISAO'"
        ? "PREVISAO"
        : reqData.agrupamento == "'MESTRE'"
        ? "MESTRE_NOME"
        : reqData.agrupamento == "'ITEM'"
        ? "ITEM_NOME "
        : "EMISSAO";

    const DadosAgrupados = groupByItem(response, (item) =>
      eval(`item.${agrupamento}`)
    );
    const gera_arq = () => {
      return new Promise((resolve, reject) => {
        let doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true,
          layout: "landscape",
        });

        geraCabecalhoVendaAnalitico(doc, reqData, response);
        //console.log("12");
        geraTabeladeDadosVendaAnalitico(doc, DadosAgrupados, reqData);
        //console.log("2");
        generateFooter(doc, 830);
        //console.log("3");

        doc.flushPages();
        url = `./pdf/${
          dados_usuario[0] ? dados_usuario[0].USUARIO_ID + "relatorio" : "user"
        }.pdf`;
        const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
        doc.end();

        writeStream.on("finish", () => {
          writeStream.end();
          resolve(url);
        });
      });
    };
    const arquivo_gerado = await gera_arq();

    return successResponse(201, arquivo_gerado, "relatorioCriado");

    function geraCabecalhoVendaAnalitico(doc, reqData, dados) {
      var data_ini = moment(`${reqData.dt_inicial}`).format("DD/MM/YYYY");
      var data_fim = moment(`${reqData.dt_final}`).format("DD/MM/YYYY");
      //console.log("ddddd" + data_ini);
      geraHR(doc, 15, "#000000", 830);
      doc
        //PRIMEIRA LINHA
        .fontSize(14)
        .text("Relatório Analítico", 280, 20, {
          width: 250,
          align: "center",
        })

        .fontSize(6)
        .text(`Agrupamento: ${reqData.agrupamento}`, 30, 59)

        .fontSize(8)
        .text(`${data_ini} a ${data_fim} `, 360, 35)

        .fontSize(8)
        .text("Impresso gerado em " + agora, 625, 70);

      geraHR(doc, 65, "#000000", 830);
    }

    function geraTabeladeDadosVendaAnalitico(doc, dados, reqData) {
      var position = 70;
      var page = 0;
      var saldoTotal = 0;
      var saldoTotalG = 0;
      var count = 0;
      var countPedido = 0;

      for (var [key, value] of dados) {
        position = position + 40;
        saldoTotal = 0;
        count = 0;
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Nº do sistema`,
          14,
          position,
          "",
          "",
          "left"
        );
        //console.log('22211');

        field(
          doc,
          "Helvetica-Bold",
          9,
          `Nº do pedido`,
          75,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Cliente`,
          160,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Vendedor`,
          280,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Status`,
          370,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Emissão`,
          425,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Previsão`,
          465,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Item código`,
          505,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Item nome`,
          560,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Item grade`,
          620,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Quantidade`,
          690,
          position,
          "",
          "",
          "left"
        );

        field(
          doc,
          "Helvetica-Bold",
          9,
          `VL Unitário`,
          740,
          position,
          "",
          "",
          "left"
        );
        field(
          doc,
          "Helvetica-Bold",
          9,
          `Valor Total`,
          790,
          position,
          "",
          "",
          "left"
        );
        //  geraCabecalhoVendaAnalitico(doc, reqData, dados);

        geraHR(doc, position + 20, "#000000", 830);
        doc.font("Helvetica");
        position = position + 50;

        value.map((item) => {
          // //console.log(item);
          if (position >= "490") {
            doc.addPage({
              size: "A4",
              margin: 50,
              bufferPages: true,
              layout: "landscape",
            });
            page = page + 1;
            geraCabecalhoVendaAnalitico(doc, reqData, dados);

            position = 100;
          }

          var itens = [
            {
              campo: item.NUMERO_SISTEMA,
              posicao: 30,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: item.PEDIDO_NUMERO,
              posicao: 75,
              tamanho: 40,
              alinhamento: "left",
            },
            {
              campo: item.CLIENTE,
              posicao: 130,
              tamanho: 140,
              alinhamento: "left",
            },
            {
              campo: item.VENDEDOR,
              posicao: 270,
              tamanho: 100,
              alinhamento: "left",
            },
            {
              campo: item.STATUS,
              posicao: 370,
              tamanho: 260,
              alinhamento: "left",
            },
            {
              campo: moment(`${item.EMISSAO}`).format("DD/MM/YYYY"),
              posicao: 430,
              tamanho: 260,
              alinhamento: "left",
            },
            {
              campo: moment(`${item.PREVISAO}`).format("DD/MM/YYYY"),
              posicao: 470,
              tamanho: 260,
              alinhamento: "left",
            },
            {
              campo: item.ITEM_CODIGO,
              posicao: 490,
              tamanho: 60,
              alinhamento: "right",
            },
            {
              campo: item.ITEM_NOME,
              posicao: 560,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: item.ITEM_GRADE,
              posicao: 630,
              tamanho: 60,
              alinhamento: "left",
            },
            {
              campo: formatDecimal(item.QUANTIDADE) + " " + item.UNIDADE,
              posicao: 660,
              tamanho: 60,
              alinhamento: "right",
            },

            {
              campo: formatCurrency(item.VALOR_UNITARIO),
              posicao: 710,
              tamanho: 60,
              alinhamento: "right",
            },

            {
              campo: formatCurrency(item.VALOR_TOTAL),
              posicao: 760,
              tamanho: 60,
              alinhamento: "right",
            },
          ];

          generateTableRowNew(doc, position, itens);

          //Variaveis de soma Total parcial e sumario
          saldoTotal = saldoTotal + item.VALOR_TOTAL;
          saldoTotalG = saldoTotalG + item.VALOR_TOTAL;

          count = count + 1;
          countPedido = countPedido + 1;

          geraHR(doc, position + 8, "#aaaaaa", 830);
          position = position + 20;
        });
        var valor_tot_parcial = value.reduce(function (acc, obj) {
          return acc + obj.VALOR_TOTAL;
        }, 0);
        var qtd_parcial = value.reduce(function (acc, obj) {
          return acc + obj.QUANTIDADE;
        }, 0);

        //   geraHR(doc,position + 10,"#000000");

        var title = "registro(s)";
        doc
          .fontSize(6)
          .fillColor("blue")
          .text(count + " " + title, 80, position, { align: "left" })
          .fillColor("blue")
          .text(formatDecimal(qtd_parcial), 630, position, {
            width: 90,
            align: "right",
          })
          .text(formatCurrency(valor_tot_parcial), 730, position, {
            width: 90,
            align: "right",
          });

        /*     generateTotalFooterGenerico(
          doc,
          count,
          title,
          position,
          '',
          240,
          "",
          260,
          SaldoTotal,
          470
        );
     */

        position = position + 13;
      }

      /*
      dados.map((item) => {
        if (position >= "510") {
          doc.addPage({
            size: "A4",
            margin: 50,
            bufferPages: true,
            layout: "landscape",
          });
          page = page + 1;
          geraCabecalhoVendaAnalitico(doc, reqData, dados);
          position = 110;
        }

        var itens = [
          {
            campo: item.NUMERO_SISTEMA,
            posicao: 30,
            tamanho: 60,
            alinhamento: "left",
          },
          {
            campo: item.PEDIDO_NUMERO,
            posicao: 75,
            tamanho: 40,
            alinhamento: "left",
          },
          {
            campo: item.CLIENTE,
            posicao: 130,
            tamanho: 140,
            alinhamento: "left",
          },
          {
            campo: item.VENDEDOR,
            posicao: 275,
            tamanho: 100,
            alinhamento: "left",
          },
          {
            campo: item.STATUS,
            posicao: 370,
            tamanho: 260,
            alinhamento: "left",
          },
          {
            campo: moment(`${item.EMISSAO}`).format("DD/MM/YYYY"),
            posicao: 430,
            tamanho: 260,
            alinhamento: "left",
          },
          {
            campo: moment(`${item.PREVISAO}`).format("DD/MM/YYYY"),
            posicao: 470,
            tamanho: 260,
            alinhamento: "left",
          },
          {
            campo: item.ITEM_CODIGO,
            posicao: 490,
            tamanho: 60,
            alinhamento: "right",
          },
          {
            campo: item.ITEM_NOME,
            posicao: 560,
            tamanho: 60,
            alinhamento: "left",
          },
          {
            campo: item.ITEM_GRADE,
            posicao: 630,
            tamanho: 60,
            alinhamento: "left",
          },
          {
            campo: formatDecimal(item.QUANTIDADE) + " " + item.UNIDADE,
            posicao: 660,
            tamanho: 60,
            alinhamento: "right",
          },

          {
            campo: formatCurrency(item.VALOR_UNITARIO),
            posicao: 710,
            tamanho: 60,
            alinhamento: "right",
          },

          {
            campo: formatCurrency(item.VALOR_TOTAL),
            posicao: 760,
            tamanho: 60,
            alinhamento: "right",
          },
        ];

        generateTableRowNew(doc, position, itens);

        //Variaveis de soma Total parcial e sumario
        saldoTotal = saldoTotal + item.SALDO;
        saldoTotalG = saldoTotalG + item.SALDO;

        count = count + 1;
        countPedido = countPedido + 1;

        geraHR(doc, position + 8, "#aaaaaa", 830);
        position = position + 20;
      });
*/
      geraHR(doc, position, "#000000", 830);
      position = position + 10;
      var qtd_total_itens = response.length;
      //console.log(qtd_total);
      var valor_total = response.reduce(function (acc, obj) {
        return acc + obj.VALOR_TOTAL;
      }, 0);
      var qtd_total = response.reduce(function (acc, obj) {
        return acc + obj.QUANTIDADE;
      }, 0);
      var valor_total_unitario = response.reduce(function (acc, obj) {
        return acc + obj.VALOR_UNITARIO;
      }, 0);
      //console.log(qtd_total_itens);

      var title = "registro(s)";
      doc
        .fontSize(6)
        .fillColor("blue")
        .text(countPedido + " " + title, 80, position, { align: "left" })
        .fillColor("blue")
        .text(formatDecimal(qtd_total), 630, position, {
          width: 90,
          align: "right",
        })
        .text(formatCurrency(valor_total), 730, position, {
          width: 90,
          align: "right",
        });

      position = position + 13;
    }
  } //fecha if(reqData)
};
const getReportEstoqueImagem = async (reqData, token) => {
  try {
    const produtos = JSON.parse(reqData.nome);
    if (reqData.nome.length === 0) {
      return errorResponse(400, "Nenhum produto fornecido para o relatório");
    }
    const new_response = [];
    var response_lista = null;
    var response_regras = null;
    if (reqData.lista) {
      response_regras = await regrasModel.getAllListaPrecos();
    }

    for (const produto of produtos) {
      const dados = { ids: produto }; // Monta o objeto reqData a partir do produto
      //const dados_usuario = await clientesModel.getUserInformation(reqData.email);
      const response = await produtosModel.getProdutos(dados, token);
      //var exibe_valor = regra ? regra.LISTA_PRECOS_EXIBE_VALOR : null;
      if (reqData.lista) {
        var regra = response_regras.find(
          (item) => Number(item.LISTA_PRECOS_ID) === Number(reqData.lista)
        );

        response_lista = await produtosModel.getListaPreco(
          Number(regra.LISTA_PRECOS_NOME),
          token
        );
      }
      //calcula o saldo do produto somando entradas e subtraindo as vendas (ou seja, somo saldos positivos e subtraio saldos negativos para elementos com o mesmo id)
      var response_organized = "";
      var filteredGroupedResponse = "";
      if (response) {
        // Agrupamento por productPacking_id, schedule_id e company.id
        const purchaseSet = new Set();
        response.forEach((item) => {
          if (item.subtype === "PURCHASE" && item.schedule_id !== null) {
            purchaseSet.add(item.schedule_id);
          }
        });

      

        if (reqData.programacao === "PRONTA_ENTREGA") {
          // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
          filteredGroupedResponse = Object.fromEntries(
            Object.entries(response).filter(
              ([key, value]) => value.quantity > 0 && !value.schedule_id
            )
          );
        } else if (reqData.programacao === "PROGRAMACAO") {
          // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
          filteredGroupedResponse = Object.fromEntries(
            Object.entries(response).filter(
              ([key, value]) => value.quantity > 0 && value.schedule_id
            )
          );
        } else {
          // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
          filteredGroupedResponse = Object.fromEntries(
            Object.entries(response).filter(
              ([key, value]) => value.quantity > 0
            )
          );
        }
        //console.log(filteredGroupedResponse)
        //filtro pelo tipo de venda(pronta entrega ou programação), e devolvo o saldo do produto do erp
        //    const saldoERP = filteredGroupedResponse[0].quantity
        // //console.log(filteredGroupedResponse);
        // Convertendo o objeto agrupado de volta para um array
        response_organized = Object.values(filteredGroupedResponse);
        const selectedCompaniesgroup = reqData.empresas
          ? reqData.empresas.split(",").map(Number)
          : null;
        const DadosEmpresa = await empresaModel.getEmpresas();
        const selectedCompanies =
          reqData.empresas != null
            ? selectedCompaniesgroup.map((company) => {
                return DadosEmpresa.find(
                  (item) => Number(item.EMPRESA_ID_ERP) === Number(company)
                ).EMPRESA_CLUSTER;
              })
            : null;

        response_organized =
          reqData.empresas != null
            ? response_organized.filter((item) =>
                selectedCompanies.includes(String(item.stockCluster_id))
              )
            : response_organized;
        for (let index = 0; index < response_organized.length; index++) {
          const vl_produto =
            response_lista != null
              ? response_lista.filter(
                  (item) =>
                    item.product?.code == response_organized[index].product_code
                )
              : 0;

          response_organized[index].VALOR_UNITARIO = vl_produto[0]
            ? vl_produto[0].unitValue
            : 0; //obtenho o preço do produto
        }
      }

      for (const element of response_organized) {
        // var correcao_path = element.productPacking_code.replace(/[./]/g, "/");
        var correcao_path = element.productPacking_code.includes(".")
          ? element.productPacking_code.replace(/\./g, "/")
          : element.productPacking_code.replace(/-/g, "/");
       // console.log(element);
        if (API.tenant == "lucin") {
          //ajuste exclusivo para lucin
          correcao_path = correcao_path.split("/");
        //  console.log(correcao_path);
          correcao_path =
            element.product_code + "/" + correcao_path[1].slice(-4);
        }
        if (API.tenant == "emilliaromana") {
          console.log(element)
          //ajuste exclusivo para emilliaromana
          correcao_path = correcao_path.split(".");
        //  console.log(correcao_path);
          correcao_path =
            element.product_code + "/" + element.productVariant_code;
        }
       // console.log(correcao_path);

        var files = await reads3files(`imagens/${correcao_path}/`);

        element.URL = files && files[0] ? files[0].url : "no_image";
        new_response.push(element);
      }
    }
    return successResponse(201, new_response, "relatorioCriado");
  } catch (error) {
    console.error("Erro:", error);
    return errorResponse(500, "Erro interno do servidor");
  }
};
const getReportFICHATECNICA = async (reqData) => {
  try {
   // console.log(reqData);
    //se receber o id com . troco por /
    var correcao_path = reqData.id.replace(/[.\-]/g, "/");
    if (reqData.type == "catalogo") {
      correcao_path = correcao_path.split("/"); //retiro oque estiver a frente do /
    } else {
      if (
        reqData.mestre_codigo != "undefined" &&
        reqData.grade != "undefined"
      ) {
        correcao_path = reqData.mestre_codigo + "/" + reqData.grade;
      } else {
        const resultado = separarIdGrade(reqData.id);
        correcao_path = resultado.id + "/" + resultado.grade;
      }
    }
    const files = await reads3files(`imagens/${correcao_path}`);
    var response_conv = files && files[0] ? files : [];

    if (reqData.type == "catalogo") {
      let catalogo = response_conv.find((arquivo) =>
        arquivo.name.endsWith(".pdf")
      );
      //    console.log(catalogo);
      response_conv = catalogo;
    }

    //console.log(convertString);
    //console.log(convertString);

    // new_response.push(element);

    /*   const getScript = (url) => {
         return new Promise((resolve, reject) => {
           const http = require('http'),
             https = require('https')
   
           let client = http
   
           if (url.toString().indexOf('https') === 0) {
             client = https
           }
   
           client
             .get(url, (resp) => {
               let data = ''
               // coleta item por item
               resp.on('data', (chunk) => {
                 data += chunk
               })
               //  Quando todos os itens forem coletados resolve passando o data.
               resp.on('end', () => {
                 resolve(data)
               })
             })
             .on('error', (err) => {
               reject(err)
             })
         })
       }
   
       if (/[/]+/g.test(reqData.id)) {
         //Tratamento para verificar se o id possui / na string , se sim pegaremos a posição 1 do split
         reqData.id = reqData.id.split('/')[1]
       }
       //console.log(`${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/`);
       const response = await getScript(
         `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/`,
       )
   
       console.log('retonro')
       console.log(response)
   //    const convertString = response.match(/\.(.*?)\.jp\w*)
       //console.log(convertString);
   
   /*
       var download = function (uri, filename, callback) {
         request.head(uri, function (err, res, body) {
           console.log('content-type:', res.headers['content-type'])
           console.log('content-length:', res.headers['content-length'])
   
           request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
         })
         
       }
   
       var response_conv = convertString.map((item) => {
         return {
           url:
             `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` +
             item.split(' ')[1],
           nome: item.split(' ')[1],
           blob: request(
             `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` +
             item.split(' ')[1],
           )
             .pipe(fs.createWriteStream(item.split(' ')[1]))
             .on('close', callback),
         }
       })
   
       console.log(response_conv[1])
       //  const response = await utilitiesModel.getEstadosERP();
     */
    return successResponse(200, response_conv);
  } catch (error) {
    console.error("error -> ", logStruct("fetchEstadosERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  geraRelatorioALP0001,
  getReportEGR1000,
  getReportEIR4002,
  getReportEIR6000,
  getReportALP0008,
  getReportProntaEntrega,
  getReportProgramacao,
  getReportVendaSintetico,
  getReportVendaAnalitico,
  getListagemContas,
  getReportALP0008,
  getReportEstoqueImagem,
  getReportCONTASARECEBER,
  getReportPEDIDOSVENDA,
  getReportNOTASFISCAIS,
  getReportFICHATECNICA,
};
