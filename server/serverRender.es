import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router'
import React from 'react';
import routeConfig from '../src/routeConfig';
import cheerio from 'cheerio';
import api from '../src/api';

const INDEX_HTML = fs.readFileSync(path.join(__dirname, '../index.html'));

export default (req, res, next) => { 
  if(req.query.noRender) {
    next();
    return;
  }
  
  match({routes: routeConfig, location: req.path}, async (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
      return;
    }

    console.log('[TOY-SERVER]  ', `Matched route: ${renderProps.location.pathname}`);
    
    const posts = await api.getPosts("http://localhost:3000");
    const appState = {posts};

    if(renderProps.params.path) {
      let {pathname} = renderProps.location;
      pathname = pathname.split('/')[1] + '/' + renderProps.params.path;
      appState[pathname] = await await api.getContent(pathname, "http://localhost:3000");
    }
    
    if(renderProps) {
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
    next();
  });
};
