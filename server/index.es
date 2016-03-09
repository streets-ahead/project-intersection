import config from '../webpack.config';
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHot from "webpack-hot-middleware";
import webpack from "webpack";
import express from 'express';
import {routes} from '../src/routeConfig';
import html5Index from './html5Index';
import serverRender from './serverRender';
import Indexer from './indexer';
import http from 'http';
import {Server as WebSocketServer} from 'ws';

require('babel-polyfill');

const app = express();
const compiler = webpack(config);
const sessions = {};
const indexer = Indexer(sessions);

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  quiet: false,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}));
  
app.get('/(:root).json', (req, resp) => {
  resp.send(indexer.index(req.params.root));
});

app.get('/:root/(:path).json', (req, resp) => {
  resp.send(indexer.detail(req.params.root + '/' + req.params.path));
});

app.use(webpackHot(compiler));

app.use(serverRender);
app.use(html5Index(routes[0].childRoutes.map(d => d.path)));

app.use(express.static("."));

export {app};

export default function() {
  const server = http.createServer(app);

  server.listen(3000);

  const wss = new WebSocketServer({server});

  let id = 1;
  wss.on('connection', (ws) => {
    console.log('[TOY SERVER] ', 'client connected');
    let wsId = id++;
    sessions[wsId] = ws;
    ws.on('close', () => {
      delete sessions[wsId]
    });
  });
};
