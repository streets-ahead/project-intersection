import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router'
import React from 'react';
import routeConfig from '../src/routeConfig';
import cheerio from 'cheerio';
import api from '../src/api';
import reqReload from 'require-reload';
import url from 'url';

const reload = reqReload(require);

const INDEX_HTML = fs.readFileSync(path.join(__dirname, '../index.html'));

export default (req, res, next) => { 
  let routeConfig, api;
  try {
    reload.emptyCache();
    routeConfig = reload('../src/routeConfig').default;
    api = reload('../src/api').default;
  } catch(e) {
    console.error('could not reload', e);
  }
  
  if(req.query.noRender) {
    next();
    return;
  }
  
  let port = 80;
  const matches = req.headers.host.match(/:(.+)$/);
  if(matches) {
    port = matches[1];
  }
  match({routes: routeConfig, location: req.path}, async (error, redirectLocation, renderProps) => {
    try {
      if (error) {
        res.status(500).send(error.message);
        return;
      }
      
      if(renderProps) {
        console.log('[TOY-SERVER]  ', `Matched route: ${renderProps.location.pathname}`);
        
        const index = await api.getIndex(`http://localhost:${port}`);
        const appState = {index};
      
        if(renderProps.params.path) {
          let {pathname} = renderProps.location;
          pathname = pathname.split('/')[1] + '/' + renderProps.params.path;
          appState[pathname] = await api.getContent(pathname, `http://localhost:${port}`);
        }
        
        const $ = cheerio.load(INDEX_HTML);
        const createElement = (El, props) => <El initialAppState={appState} {...props}/>; 
        const content = ReactDOMServer.renderToString( 
          <RouterContext createElement={createElement} initialAppState={appState} {...renderProps} />   
        );
        $('head').append(`<script>window._AppState_ = ${JSON.stringify(appState)}</script>`);
        $('#root').html(content);
        res.send($.html());
        return;
      }
    } catch(e) {
      console.error(e);
    } 
    next();
  });
};
