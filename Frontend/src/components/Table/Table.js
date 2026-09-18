// --- DataTable.js (arquivo completo corrigido) ---

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

export default function DataTable({
  rows = [],
  rowHead = [],
  title = '',
  rowClick = null,
  titleNoData,
  addAction,
  pagination = true,
  searchInput = true,
  load,
  sort,
  components,
  maxHeight,
  pageSizeOptions = [5, 10, 50, 100],
  onOrderChange, // novo
}) {
  const [pageSize, setPageSize] = useState(100);

  const tableHeight =
    ((window.innerHeight - 181) / window.innerHeight) * (maxHeight || 75);

  return (
    <MaterialTable
      style={{ maxHeight: '100%' }}
      isLoading={load || false}
      actions={addAction}
      onRowClick={rowClick}
      onChangeRowsPerPage={setPageSize}
      columns={rowHead}
      data={rows}
      title={title}
      components={components}
      onOrderChange={onOrderChange} // repassa
      options={{
        detailPanelColumnAlignment: 'left',
        searchFieldAlignment: 'right',
        showTitle: false,
        thirdSortClick: false,
        headerStyle: {
          backgroundColor: '#1658af',
          color: '#fff',
          textAlign: 'left',
          position: 'sticky',
          top: 0,
        },
        maxBodyHeight: `${tableHeight}vh`,
        minBodyHeight: `${tableHeight}vh`,
        overflowY: 'auto',
        sorting: sort || false,
        paging: pagination,
        pageSize,
        pageSizeOptions,
        emptyRowsWhenPaging: false,
        padding: 'dense',
        search: searchInput,
        rowStyle: {
          padding: '2px',
          fontWeight: 'normal',
          fontSize: 14,
        },
      }}
      localization={{
        pagination: {
          labelRowsPerPage: 'Linhas por página:',
          labelRowsSelect: 'linhas',
          labelDisplayedRows: '{from}-{to} de {count}',
          firstAriaLabel: 'Primeira Página',
          firstTooltip: 'Primeira Página',
          previousAriaLabel: 'Página Anterior',
          previousTooltip: 'Página Anterior',
          nextAriaLabel: 'Próxima Página',
          nextTooltip: 'Próxima Página',
          lastAriaLabel: 'Última Página',
          lastTooltip: 'Última Página',
        },
        toolbar: {
          searchPlaceholder: 'Filtrar',
          searchTooltip: 'Filtrar',
        },
        body: {
          emptyDataSourceMessage: titleNoData || 'Nenhum registro encontrado',
          filterRow: {
            filterTooltip: 'Filtrar',
          },
        },
      }}
    />
  );
}

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowHead: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  rowClick: PropTypes.func,
  titleNoData: PropTypes.string,
  pagination: PropTypes.bool,
  searchInput: PropTypes.bool,
  load: PropTypes.bool,
  sort: PropTypes.bool,
  components: PropTypes.object,
  maxHeight: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onOrderChange: PropTypes.func, // novo
};

DataTable.defaultProps = {
  rowClick: null,
  titleNoData: 'Nenhum registro encontrado',
  pagination: true,
  searchInput: true,
  load: false,
  sort: false,
  components: {},
  maxHeight: 75,
  pageSizeOptions: [5, 10, 50, 100],
  onOrderChange: () => {}, // novo
};
