#!/usr/local/bin/node
"use strict";
require('./serverSetup');
const glob = require('glob');
const fs = require('fs-extra');
const axios = require('axios');
const routes = require('./src/routeConfig').routes;
const endsWith = require('lodash/endsWith');

const PORT = 7777;
const URL = `http://localhost:${PORT}`;

const app = require('./server').app.listen(PORT, generate);

const promises = [];

function generate() {
  const dirs = routes[0].childRoutes.map(r => r.path);
  dirs.forEach((d) => fs.mkdirsSync(__dirname + '/dist/' + d));

  const files = glob.sync(`./@(${dirs.join('|')})/*.md`);
  files.forEach((f) => {
    const file = f.replace(/(^\.\/)|(\.md$)/ig, '');
    saveFile(file + '.html');
    saveFile(file + '.json');
  });

  saveFile('index.json');
  saveFile('', 'index.html');

  function saveFile(file, output) {
    console.info('[GENERATOR] SAVING: ', file);
    promises.push(axios.get(URL + '/' + file).then((result) => {
      const dest = (output || file);
      if(dest.match(/.html$/i) !== null) {
        result.data = result.data.replace('<script id="devMode">window.DEV_MODE = true;</script>', '');
        result.data = result.data.replace('/node_modules/normalize.css/normalize.css', '/static/normalize.css');
        result.data = result.data.replace('<!-- stylesheet -->', '<link rel="stylesheet" href="/static/styles.css">');
      }
      return new Promise((resolve, reject) => {
        fs.writeFile('dist/' + dest, 
                    endsWith(file, '.json') ? JSON.stringify(result.data) : result.data, 
                    resolve);
      });
    }));
  }
  
  Promise.all(promises).then(() => {
    app.close(function(){
      process.exit();
    });
  });
}
