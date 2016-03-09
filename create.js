#!/usr/local/bin/node
require('./serverSetup');
var fs = require('fs-extra');
var routes = require('./src/routeConfig').routes;

const dirs = routes[0].childRoutes.map(r => r.path);

var prompt = require('prompt');

prompt.start();

const authors = [
  "Sam Mussell",
  "Terry Keeney",
  "Dana Reynolds"
];

function toChoices(list) {
  return '\n' + list.map((r, i) => `${i+1}) ${r}`).join('\n');
}

prompt.get({
    properties: {
      author: {
        description: toChoices(authors),
        type: "integer",
        required: true
      },
      title: {
        required: true
      },
      tags: {
        description: "tags (keep 'em separated...by commas')",
        required: true
      },
      type: {
        description: toChoices(dirs),
        type: "integer",
        required: true
      }
    }
  }, (err, result) => {
    if(err) process.exit(1);
    
    var slug = result.title.toLowerCase()
        .replace(/(^\s+)|(\s+$)/, '')
        .replace(/[^a-z0-9\s]/g, '-')
        .replace(/(\s|-)+/g, '-');
    
    const fileName = `./${dirs[result.type-1]}/${slug}.md`;
    fs.ensureFileSync(fileName);
    fs.writeFileSync(fileName, 
`---
{
  "title": "${result.title}",
  "author": "${authors[result.author-1]}",
  "tags": ${JSON.stringify(result.tags.split(',').map(d => d.trim()))},
  "published": "${new Date()}"
}
---

Check yourself before you reck yo-self.
`);
  });
