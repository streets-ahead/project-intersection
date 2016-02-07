import React from 'react';
import ReactDOM from 'react-dom';
import routeConfig from './routeConfig';
import {Router, browserHistory} from 'react-router';

const defaultState = window._AppState_ || {posts: []};
ReactDOM.render(
  <Router routes={routeConfig} 
          history={browserHistory} 
          createElement={function(El, props) {
          return  <El initialAppState={defaultState} {...props} />
          }} />
, document.getElementById('root'));
