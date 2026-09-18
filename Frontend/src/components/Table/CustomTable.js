import React, { useState, useEffect,useRef } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { FixedSizeList as List } from 'react-window';

// Estilos para a tabela
const useStyles = makeStyles({
  tableHeader: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '8px 16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textField: {
    width: '100%',
  },
  searchField: {
    margin: '10px 0',
  },
});

function CustomTable({
  columns,
  data,
  onRowClick,
  globalFilter,
  onGlobalFilterChange,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState(data);
  const inputRefs = useRef({}); // Usando um objeto para armazenar as referências dinamicamente


  useEffect(() => {
    if (globalFilter) {
      setFilteredData(
        data.filter(row =>
          columns.some(column =>
            row[column.accessor]
              ?.toString()
              .toLowerCase()
              .includes(globalFilter.toLowerCase()),
          ),
        ),
      );
    } else {
      setFilteredData(data);
    }
  }, [globalFilter, data, columns]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const Row = ({ index, style }) => {
    const realIndex = page * rowsPerPage + index;
    const row = { ...filteredData[realIndex], realIndex }; // Adiciona realIndex ao row
  
    return (
      <TableRow style={style} key={`row-${realIndex}`}>
        {columns.map((column, colIndex) => (
          <TableCell
            id={realIndex}
            key={`cell-${realIndex}-${colIndex}`} // Chave única para cada célula

            className={classes.tableCell}
            style={{
              width: column.width || 'auto',
              textAlign: column.align || 'left',
            }}
          >
            {column.Cell
              ? column.Cell({ 
                  value: row[column.accessor], 
                  row,
                  columnIndex: colIndex, // Passa colIndex 
                  rowIndex: realIndex   // Passa realIndex
                }) 
              : row[column.accessor]}
          </TableCell>
        ))}
      </TableRow>
    );
  };
  

  return (
    <TableContainer>
      <TextField
        label="Buscar..."
        variant="outlined"
        size="small"
        onChange={e => onGlobalFilterChange(e.target.value)}
        className={classes.searchField}
      />
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, colIndex) => (
              <TableCell
                key={`header-${colIndex}`} // Índice único para o cabeçalho de cada coluna
                className={classes.tableHeader}
                style={{
                  width: column.width || 'auto',
                  textAlign: column.align || 'left',
                }}
              >
                {column.Header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
      <List
        height={400} // Altura do contêiner de rolagem
        itemCount={filteredData.length}
        itemSize={50} // Altura de cada linha
        width="100%"
      >
        {Row}
      </List>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default CustomTable;
