import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { FileNavigator } from '@opuscapita/react-filemanager';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';
import { API } from '../../config/api';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '2px',
  },
}));

export default function Galeria() {

  return (
    <div>
      {/*NODE_JS_EXAMPLE*/}

      <div
        style={{
          height: '70vh',
          minWidth: '320px',
          flex: '1',
          marginBottom: '15px',
        }}
      >
        <FileNavigator
          api={connectorNodeV1.api}
          apiOptions={{
            ...connectorNodeV1.apiOptions,
            apiRoot: `${API.galeria}`,           }}
          capabilities={(apiOptions, actions) => [
            ...connectorNodeV1.capabilities(apiOptions, actions),
          
          ]}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </div>
    </div>
  );
}
