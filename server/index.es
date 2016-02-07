import config from '../webpack.config';
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHot from "webpack-hot-middleware";
import webpack from "webpack";
import express from 'express';
import {routes} from '../src/routeConfig';
import html5Index from './html5Index';
import serverRender from './serverRender';
import indexer from './indexer';

require('babel-polyfill');
      
const app = express();

const compiler = webpack(config);

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

app.listen(3000);
