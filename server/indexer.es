import chokidar from 'chokidar';
import glob from 'glob';
import frontMatter from 'yaml-front-matter';
import marked from 'marked';
import {routes} from '../src/routeConfig';
import omit from 'lodash/omit';
import values from 'lodash/values';
import hljs from 'highlight.js';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  sanitize: false,
  highlight: (code) => {
    return hljs.highlightAuto(code).value;
  }
});

const dirs = routes[0].childRoutes.map(d => d.path);

function parseFile(file) {
  const content = frontMatter.loadFront(file);
  content.body = content.__content.replace(/^\s+/, '');
  content.slug = cleanFileName(file);
  content.published = new Date(content.published);
  delete content.__content;
  return content;
}

function cleanFileName(f) {
  return f.replace(/(^\.\/)|(\.md$)/ig, '');
}

const files = glob.sync(`./@(${dirs.join('|')})/*.md`);
const contentFiles = files.reduce((acc, file) => {
  return {
    [cleanFileName(file)]: parseFile(file),
    ...acc
  };
}, {});

const watcher = chokidar.watch(`./@(${dirs.join('|')})/*.md`, {
  persistent: true
});

export default function(sessions) {
  function broadcastValue({path, type}) {
    values(sessions).forEach((s) => s.send(JSON.stringify({
      type,
      path: path.replace('.md', '')
    }), () => {}));
  }
  
  watcher.on('ready', () => {
    watcher.on('add', path => {
        console.log('[TOY-SERVER]  ', `File Added: ${path}`);
        broadcastValue({
          type: "add",
          path
        });
        contentFiles[cleanFileName(path)] = parseFile(path);
      })
      .on('change', path => {
        console.log('[TOY-SERVER]  ', `File Changed: ${path}`);
        broadcastValue({
          type: "change",
          path
        });
        contentFiles[cleanFileName(path)] = parseFile(path);
      })
      .on('unlink', path => {
        console.log('[TOY-SERVER]  ', `Removed File: ${path}`);
        broadcastValue({
          type: "remove",
          path
        });
        delete contentFiles[cleanFileName(path)];
      });
  });

  return {
    index() {
      const ind = {};
      dirs.forEach(dir => {
        ind[dir] = values(contentFiles)
          .filter(p => p.slug.split('/')[0] === dir)
          .filter(p => new Date(p.published).getTime() - new Date().getTime() < 0)
          .map(p => omit(p, ['body']))
          .sort((a, b) => {
            return (b.published ? new Date(b.published).getTime() : 0) - (a.published ? new Date(a.published).getTime() : 0)
          });
      });
      return ind;
    },
    
    detail(path) {
      const content = contentFiles[path];
      return {...content, body: marked(content.body)};
    }
  };
};
