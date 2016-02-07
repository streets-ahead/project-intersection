import chokidar from 'chokidar';
import glob from 'glob';
import frontMatter from 'yaml-front-matter';
import marked from 'marked';
import routeConfig from '../src/routeConfig';
import omit from 'lodash/omit';
import values from 'lodash/values';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  sanitize: false
});

const dirs = routeConfig[0].childRoutes.map(d => d.path.split('/')[0]);

function parseFile(file) {
  const content = frontMatter.loadFront(file);
  content.body = marked(content.__content);
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

watcher.on('ready', () => {
  watcher.on('add', path => {
      console.log('[TOY-SERVER]  ', `File Added: ${path}`);
      contentFiles[cleanFileName(path)] = parseFile(path);
    })
    .on('change', path => {
      console.log('[TOY-SERVER]  ', `File Changed: ${path}`);
      contentFiles[cleanFileName(path)] = parseFile(path);
    })
    .on('unlink', path => {
      console.log('[TOY-SERVER]  ', `Removed File: ${path}`);
      delete contentFiles[cleanFileName(path)];
    });
});

export default {
  index(type) {
    return values(contentFiles)
      .filter(p => p.slug.split('/')[0] === type)
      .map(p => omit(p, ['body']))
      .sort((a, b) => a.published - b.published);
  },
  
  detail(path) {
    return contentFiles[path];
  }
}
