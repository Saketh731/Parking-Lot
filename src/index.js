import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CoreLayout from './layouts/CoreLayout';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <CoreLayout />, document.getElementById('root'));
registerServiceWorker();
