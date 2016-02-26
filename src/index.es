import React from 'react';
import ReactDOM from 'react-dom';
import routeConfig from './routeConfig';
import {Router, browserHistory} from 'react-router';
import indexStyle from '../styles/index.css';
const defaultState = window._AppState_ || {index: {posts: [], pages: []}};
ReactDOM.render(
  <Router routes={routeConfig} 
          history={browserHistory} 
          createElement={function(El, props) {
          return  <El initialAppState={defaultState} {...props} />
          }} />
, document.getElementById('root'));
