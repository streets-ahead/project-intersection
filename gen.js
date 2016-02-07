require("babel-register");
var glob = require('glob');
var fs = require('fs-extra');
var axios = require('axios');
var routes = require('./src/routeConfig').routes;
var endsWith = require('lodash/endsWith');

var URL = "http://localhost:3000";

axios.head(URL).then(generate, (e) => console.error("[ERROR] The server must be running when using the generator"));

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
    console.info('SAVING: ', file);
    axios.get(URL + '/' + file).then((result) => {
      fs.writeFile('dist/' + (output || file), 
                  endsWith(file, '.json') ? JSON.stringify(result.data) : result.data, 
                  () => {});
    });  
  }
}
