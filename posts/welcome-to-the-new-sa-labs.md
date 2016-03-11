---
{
  "title": "Welcome to the New SA Labs",
  "author": "Sam Mussell",
  "tags": ["react.js","javascript"],
  "subHead": "We're back and better than ever... Find out how we built our brand new React.js based blog.",
  "published": "Mar 20 2016 22:17:06 GMT-0800 (PST)"
}
---

Welcome to our new SA Labs website.  We started Streets Ahead around four or five years ago as an outlet for side projects and pretty much anything that we found exciting or interesting.  During that time we've had several websites, we've moved around from Wordpress to Jekyll to custom built Node.js backend to Ghost and probably a couple more in between.  At the beginning of 2016 we set a goal to write more posts to this blog and in order to serve that goal we proudly present our newest website architecture.  In this article I'll go through some of the ideas behind the way we built this site and how we used React.js to do so.

## Decisions, Decisions

Before we wrote any code we needed to figure out what technologies/tools/languages we were goint to use to build the site.  Obviously this decision would also impact how we would serve and host the site.  Our previous site was powered by [Ghost](https://ghost.org) and hosted on an EC2 instance.  We used nginx as a reverse proxy to serve static files and provide some cacheing.  This setup was fine, but we wanted to move way from having to admin an EC2 server, we didn't want to worry about having to apply updates and patches or worry if it went down.  We decided that the best option would be a static site generator tool along with S3.  That way we have essentially no server admin duties, very minimal costs, and great scalability.  

So, now that we decided to go with a static site generator, which one should we go with?  There's certainly no shortage of options, if you checkout [StaticGen](https://www.staticgen.com) you'll see there are many, many options that span practically every language.  We looked at Jekyll as the classic choice, we had some experience with it, its heavily used, and would have been a great choice overall, but we decided we wanted something new since we've already had experience with Jekyll in the past we might as well branch out.  We kept looking, we considered some Clojure based options, some JavaScript based ones, even a [Go option](http://gohugo.io).  Then we started thinking, we love working with React.js, so having to build out our sites with some specific template language made us feel like we were giving up a lot of power and control.  

We made the decision to try and just use React.js as our sort of template engine.  Once we made this decision we found a cool project called [Gatsby](https://github.com/gatsbyjs/gatsby), it is basically a React.js based static site generator.  We considered using Gatsby, but then we started thinking, a static version of a React site could just be a crawl of a isomorph... um...  [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.pa5z58uuh) React.js app.  
This seemed like a great idea. First it allows us to play with making universal apps, something we hadn't really done before. Second we were able strive for ultimate simplicity and have full control and understanding of everything.  Third if we want something more dynamic someday we'll already have the sever ready to go.  


## Implementation

With the decision made to go with a universal React.js app it was time to start building.  I've created a [starter template](https://github.com/streets-ahead/Malcolm) in case you're interested in following along.  We start out with all the standard React.js boilerplate, babel 6, webpack, eslint, etc, etc.  Pretty sure you're not a real Javascript dev until your package.json file has at least twenty dependencies ;).  One rather interesting thing we decided to try was [CSS modules](https://github.com/css-modules/css-modules), they probably aren't strictly necessary on a smaller project like this, but we wanted to try them out.  CSS modules allow you to solve some of the [issues](http://glenmaddern.com/articles/css-modules) that arise from the global nature of CSS classes.  They also allow you to follow similar patterns to [OO-CSS](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/) without cluttering your HTML with all those classes.

### Server

We started by putting together a small development server using express.  The following files make up our simple server.

 * `index.es` - This is the main server file, we setup the middleware and start the server.
 * `indexer.es` - This file will create an index of the site content, we base the site structure off of our react-router config, `src/routeConfig.es`.  The indexer reads that config, crawls the specified directories, parses the content, and finally generates the json responses.
 * `serverRender.es` - This file does the server side rendering, it also relies on our route configs to match the current route.  We use the route to determine what data needs to be pre-loaded.  We can then use that data to render the requested page server side, we use cheerio to inject the data and rendered output into a our index.html file.  One thing to note, even though we pre-render the React components on the server, we still need to be able to re-hydrate the state on the client when our React code runs.  In order to do that we took the simple approach of injecting the JSON data as a global variable in a script tag.  We also included the option to pass `?noRender=true`, this options tells the server not to pre-render.
 * `html5Index.es` - This is a simple middleware which helps us support HTML5 history apis, it essentially checks if the incoming request matches one of you routes, if so it sets the path to `/`, which will serve the index.html file. (This feature is included in the webpack-dev-server, but I couldn't find it in the webpack middleware)
 
### React
 
Next came the actual React code.  As mentioned earlier the whole configuration for this project is based on [react-router](https://github.com/reactjs/react-router).  Below is the relevant portion of the configuration.

```
const routes = [{ 
  path: '/',
  component: Root,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/pages/home.html')
  },
  childRoutes: [
    {path: 'pages', key: "page", component: componentForType("Page")},
    {path: 'posts', key: "post", component: componentForType("Post")}
  ]
}];
```

First thing to notice is that we're using the plain JS version of the configuration.  The main reason for this is that it makes it easer to reuse this data in our server components.  There is a bit of a side benefit for me, which is that I really don't love the idea of embedding my routing configuration in JSX, it seems JSX is meant for UI components not configuration, but that may just be me.  

We set the outside component to `Root`, we'll look at that shortly.  We setup the indexRoute to redirect to our home page.  The `childRoutes` lists each page type, basically each template.  The `componentForType` returns a function which acts as a React stateless component, this ensures the correct template is used.  We've added a hook to specify a custom template inside the front matter of the content file.  If you look in the routeConfig.es file you'll see we also added a route decorator function, this simply allowed us to keep from duplicating the same settings for every child route.

#### Root

The next item of interest is the Root component.  We use the Root component to manage the entire app state.  It deserves its own article, but I'm a huge proponent of the single source of truth model for React apps. Basically I want to have a single atom at the top level of my apps that contain most all of the state instead of using a bunch of stateful components.  This will allow you to use more pure, stateless components throughout your app.  These components are easier to build, reason about, and test.  This approach has been long favored by om in the Clojure community, if you haven't watched the talks by [David Nolan](https://www.youtube.com/watch?v=DMtwq3QtddY) you're missing out.  This approach has become much more popular in the React world thanks to Redux.  Anyway, all that aside for the sake of simplicity here we're not using Redux or any larger framework, instead we just keep the state in the Root component.  We pass down an `updateAppState` method to allow components to update the state.

```
updateAppState = (newState) => {
  this.setState({appState: merge(this.state.appState, newState)});
};
``` 

We also added a feature to the Root component to allow live updates when content changes.  This is accomplished using a simple websocket.  The server uses chokidar to watch the content folders for changes, then send those to the client via websocket.  We added following to Root to handle the updates.  This method is only called if the `DEV_MODE` flag is true.

```
initLiveLoad() {
  const host = window.document.location.host;
  const ws = new WebSocket('ws://' + host);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    api.getIndex().then((index) => this.updateAppState({index}));
    if(data.type === "change" || data.type === "add") {
      api.getContent(data.path).then((d) => this.updateAppState({[data.path]: d}));
      api.getContent(data.path).then((d) => this.updateAppState({[data.path]: d}));
    }
  };
}
```

#### FetchContainer

We created a container component for fetching content at a given path.  This component wraps all the content pages and ensures the proper data is available in the appState, if not it loads it from the server.

#### Templates

Templates go in the templates folder and then get registered in the `templates/index.es` file.  Each template is a simple React component which receives a content prop.   The content prop contains any properties that were set in the content files front matter as well as a `body` property that contains the html version of the content.

```
import Home from './Home';
import Page from './Page';
import Post from './Post';

export default {Home, Page, Post};
```

### Static Generator

That's pretty much everything that makes up the React site.  The next piece of the puzzle to making this a static site was creating a simple crawler to generate the site.  We created the `gen.js` script.  Below is the bulk of the script.

```
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
```

You can see its relatively simple.  The basic idea is that the server is already serving a JSON index so first we start the dev server.  Once started we make a request to get the index JSON.  Then we iterate over the index and make requests for each file in the site.  We make two requests per file, one to get the JSON version and another to get the rendered HTML.  If the file is HTML we make a few replacements needed for the production site.  Then we write all the files out to the `dist` folder.

### Creator

The last thing of interest is that we wanted a simple way to start new posts, so we made the `create.js` script.  This allows you to call `make create` or `npm run create` and you'll get an interactive prompt to create a new post/page/whatever.


## Conclusion

That's pretty much all there is to it, we took the contents of the dist folder and threw them up on S3 for some very simple, bulletproof hosting.  So if you're interested in universal React or you're thinking of setting up a blog or personal site hopefully this was at least somewhat helpful.  You can checkout the source for this site over on [github](https://github.com/streets-ahead/project-intersection), or you can clone the simplified [malcolm](https://github.com/streets-ahead/Malcolm) version.  

## Links

 * [The Fuctional Frontier - David Nolan](https://www.youtube.com/watch?v=DMtwq3QtddY)
 * [malcolm](https://github.com/streets-ahead/Malcolm)


 
 
