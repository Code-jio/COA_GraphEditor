import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexView from './view/GraphView/index';
import socketApi from './service/websocket/websocket';
import "@/style/common.css"

import store from './store/index';
import { Provider } from 'react-redux';

Window.prototype.socketMgr = socketApi;


const root = ReactDOM.createRoot(document.getElementById('App'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* <App /> */}
    <IndexView></IndexView>
  </Provider>
  // </React.StrictMode>
);

