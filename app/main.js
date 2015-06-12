require('./main.css');
require('./fixed-data-table.css');

import React from 'react';
import OrderTable from './components/OrderTable.js';

console.log('Application is loaded!');

React.render(<OrderTable/>, document.body);
