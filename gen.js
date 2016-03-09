#!/usr/local/bin/node
"use strict";
require('./serverSetup');
const glob = require('glob');
const fs = require('fs-extra');
const axios = require('axios');
const endsWith = require('lodash/endsWith');

const PORT = 7777;
const URL = `http://localhost:${PORT}`;

const app = require('./server').app.listen(PORT, () => {
  axios.get(`${URL}/index.json`).then((res) => generate(res.data));
});

const promises = [];

function generate(index) {    
  Object.keys(index).forEach((type) => {
    fs.mkdirsSync(__dirname + '/dist/' + type);
    index[type].forEach((obj) => {
      saveFile(obj.slug + '.html');
      saveFile(obj.slug + '.json');
    });
  });

  saveFile('index.json');
  saveFile('', 'index.html');

  function saveFile(file, output) {
    console.info('[GENERATOR] SAVING: ', file);
    promises.push(axios.get(`${URL}/${file}`).then((result) => {
      const dest = (output || file);
      if(endsWith(dest, '.html')) {
        result.data = result.data.replace('<script id="devMode">window.DEV_MODE = true;</script>', '');
        result.data = result.data.replace('/node_modules/normalize.css/normalize.css', '/static/normalize.css');
        result.data = result.data.replace('<!-- stylesheet -->', '<link rel="stylesheet" href="/static/styles.css">');
      } else {
        result.data = JSON.stringify(result.data);
      }
      return new Promise((resolve, reject) => {
        fs.writeFile('dist/' + dest, result.data, resolve);
      });
    }));
  }
  
  Promise.all(promises).then(() => {
    app.close(() => process.exit());
  });
}
