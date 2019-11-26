import React from 'react';
import ReactDOM from 'react-dom';
import BigScreen from './pages/bigScreen'
import registerServiceWorker from './registerServiceWorker';
import './css/index.css'
import request from './js/_x/util/request'
import G from './js/g'
const setConfig = request.setConfig;

const search = window.location.search;

var buildingId = search.slice(search.indexOf("=") + 1);

console.log("buildingId:", buildingId);

G.buildingId = buildingId;
sessionStorage.buildingId = buildingId;

setConfig(G.service);

ReactDOM.render(< BigScreen />,
  document.getElementById('root')
);
registerServiceWorker();