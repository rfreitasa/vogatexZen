// utils.js

export const transformDataForTable = (dataGroups) => {
    const tableData = [];
  
    Object.keys(dataGroups).forEach((key) => {
      const statusData = dataGroups[key];
  
      Object.keys(statusData).forEach((status) => {
        const { valor, pedidos } = statusData[status];
        tableData.push({ cliente: key, status, valor, pedidos });
      });
    });
  
    return tableData;
  };
  

  