---
{
  "title": "Welcome to the New SA Labs",
  "author": "Sam Mussell",
  "tags": ["javascript", "react.js"],
  "subHead": "We're back and better than ever... Find out how we built our brand new React.js based blog.",
  "published": "Mar 11 2016 5:00:06 GMT-0800 (PST)"
}
---

Welcome to our new SA Labs website.  We started Streets Ahead around four or five years ago as an outlet for side projects and pretty much anything that we found exciting or interesting.  During that time we've had several websites, we've moved around from Wordpress to Jekyll to custom built Node.js to Ghost and probably a couple more in between.  At the beginning of 2016 we set a goal to write more posts to this blog and in order to serve that goal we proudly present our newest website architecture.  In this article I'll go through some of the ideas behind the way we built this site and how we used React.js to do so.

## Decisions, Decisions

Before we wrote any code we needed to figure out what technologies, tools, and languages we were going to use to build the site.  Obviously this decision would also impact how we would serve and host the site.  Our previous site was powered by [Ghost](https://ghost.org) and hosted on an EC2 instance.  We used nginx as a reverse proxy to serve static files and provide some cacheing.  This setup was fine, but we wanted to move way from having to administer an EC2 server, we didn't want to worry about having to apply updates and patches or worry if it went down.  We decided that the best option would be a static site generator tool along with S3.  That way we'd have no server admin duties, very minimal costs, and great scalability.  

Now that we decided to go with a static site generator, which one should we go with?  There's certainly no shortage of options, if you checkout [StaticGen](https://www.staticgen.com) you'll see there are many options that span practically every language.  We looked at Jekyll as the classic choice.  We have had some experience with it, its heavily used, and would have been a great choice overall, but we decided we wanted something new.  We kept looking, we considered some Clojure based options, some JavaScript based ones, even a [Go option](http://gohugo.io).  Then we started thinking, we love working with React.js, so having to build out our sites with some specific template language made us feel like we were giving up a lot of power and control.  

We made the decision to try and just use React.js as our quasi template engine.  Once we made this decision we found a cool project called [Gatsby](https://github.com/gatsbyjs/gatsby), it is basically a React.js based static site generator.  We considered using Gatsby, but ultimately decided that we'd like a little more control.  Additionally the reason we like to work on side projects is to learn, so why not use this as a learning opportunity.  

We started thinking, a static site could be generated by crawling an isomorph... um...  [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.pa5z58uuh) React.js app.  This seemed like a great idea. First it allows us to play with making universal apps, something we hadn't really done before. Second we were able strive for simplicity and have full control and understanding of everything.  Third if we want something more dynamic someday we'll already have the sever ready to go.  


## Implementation

With the decision made to go with a universal React.js app it was time to start building.  We created a [starter template](https://github.com/streets-ahead/Malcolm) in case you're interested in following along.  The first step is adding all the standard React.js boilerplate, babel 6, webpack, eslint, etc, etc.  Pretty sure you're not a real Javascript develpoer until your `package.json` file has at least twenty dependencies ;).  One rather interesting thing we decided to try was [CSS modules](https://github.com/css-modules/css-modules), they probably aren't strictly necessary on a smaller project like this, but we wanted to try them out.  CSS modules allow you to solve some of the [issues](http://glenmaddern.com/articles/css-modules) that arise from the global nature of CSS classes.  They also allow you to follow similar patterns to [OO-CSS](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/) without cluttering your HTML with all those classes. We also added PostCSS to enable some of the more advanced CSS features like nesting, auto-prefixing, and variables.

### Server

We started by putting together a small development server using express.  The following files make up our simple server.

 * `index.es` - This is the main server file, it sets up the middleware and starts the server.
 * `indexer.es` - This file creates an index of the site content, we based the site structure off of our `react-router` config, `src/routeConfig.es`.  The indexer reads that config, crawls the specified directories, parses the content, and finally generates the JSON responses.
 * `serverRender.es` - This file does the server side rendering, it also relies on our route configs to match the current route.  We use the route to determine what data needs to be pre-loaded.  We can then use that data to render the requested page server side, we use cheerio to inject the data and render output into a our index.html file.  One thing to note, even though we pre-render the React components on the server, we still need to be able to re-hydrate the state on the client when our React code runs.  In order to do that we took the simple approach of injecting the JSON data as a global variable in a script tag.  We also included the option to pass `?noRender=true`, this options tells the server not to pre-render.
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

First thing to notice is that we're using the [plain JS version](https://github.com/reactjs/react-router/blob/master/docs/guides/RouteConfiguration.md#configuration-with-plain-routes) of the configuration.  The main reason for this is that it makes it easer to reuse this data in our server components.  There is a bit of a side benefit for me, which is that I really don't love the idea of embedding my routing configuration in JSX, it seems JSX is meant for UI components not configuration, but that may just be me.  
We set the outside component to `Root`, we'll look at that shortly.  We setup the indexRoute to redirect to our home page.  The `childRoutes` lists each page type, basically each template.  The `componentForType` returns a function which acts as a React stateless component, this ensures the correct template is used.  We've added a hook to specify a custom template inside the front matter of the content file.  If you look in the routeConfig.es file you'll see we also added a route decorator function, this simply allowed us to keep from duplicating the same settings for every child route.

#### Root

The next item of interest is the Root component.  We use the Root component to manage the entire app state.  This topic deserves its own article, but I'm a huge proponent of the single source of truth model for React apps. Basically I want to have a single atom at the top level of my apps that contain most all of the state instead of using a bunch of stateful components.  This will allow you to use more pure, stateless, components throughout your app.  These components are easier to build, reason about, and test.  This approach has been long favored by [om](https://github.com/omcljs/om) in the Clojure community, if you haven't watched the talks by [David Nolan](https://www.youtube.com/watch?v=DMtwq3QtddY) you're missing out.  This approach has recently become much more popular in the React world thanks to Redux.  Anyway, all that aside, for the sake of simplicity in this case we're not using Redux or any larger framework, instead we just keep the state in the Root component.  We pass down an `updateAppState` method to allow components to update the global state.

```
updateAppState = (newState) => {
  this.setState({appState: merge(this.state.appState, newState)});
};
``` 

The webpack-middleware will live-reload any script or CSS changes, however we wanted a way to also live-reload content changes.  This was accomplished using a simple websocket, hooked up in the Root component.  The server uses [chokidar](https://github.com/paulmillr/chokidar) to watch the content folders for changes, then it sends those to the client via websocket.  We added following to Root to handle the updates.  This method is only called if the `DEV_MODE` flag is true.

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

We created a container component for fetching content at a given path.  This component wraps all the content pages and ensures the proper data is available in the appState, if not it loads it from the server.  This is a [common pattern](https://medium.com/@learnreact/container-components-c0e67432e005#.fqqv3zfm0) I've found very useful in React. Create your components to assume the data exists and then you can wrap them in a container component that ensures the data is available.  In a larger app the component will probably call some flux action creators or something, but in this case we do the data fetching inside the container component.

#### Templates

Templates go in the templates folder, shocking I know, and then get registered in the `templates/index.es` file shown below.  Each template is a simple React component which receives a content prop.   The content prop contains any properties that were set in the front matter as well as a `body` property that contains the html version of the markdown content.

```
// list all tempaltes
import Home from './Home';
import Page from './Page';
import Post from './Post';

export default {Home, Page, Post};
```

### Static Generator

That's pretty much everything that makes up the React site.  The next piece of the puzzle was creating a simple crawler to generate the static site.  We created the `gen.js` script.  Below is the bulk of the script.

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

You can see its relatively simple.  The basic idea is that the server is already able to serve a JSON index, so we just need to fetch which will tell us exactly what to crawl.  First the script starts the server.  Once its started we make a request to get the index JSON.  Then we iterate over the index and make requests for each file.  We make two requests per file, one to get the JSON version and another to get the rendered HTML.  If the file is HTML we make a few replacements needed for the production site.  Then we write all the files out to the `dist` folder.

### Creator

The last item we wanted to solve is to provide a simple way to create new content, so we wrote the `create.js` script.  This allows you to call `make create` or `npm run create` and you'll get an interactive prompt to create a new post/page/whatever.

##### Brief Aside

*Why do we have a Makefile?  We've found `make` to be the most dead simple way of adding little scripted tasks on projects.  I definitely like using Gulp and on occasion I'll use the npm script feature, but make is just so simple and can abstract over any differences between projects.  Maybe one project uses bower and another uses npm, well if you have a simple make task called `make install` you're covered either way, in fact the same make task could trigger both.  Its also nice because I really hate installing npm packages globally, I've been bitten enough times by upgrades to know that its not a good idea.  Inside the Makefile its easy to add the node tasks like `babel` and include the relative path to the local `node_modules/.bin` so that they invoke the locally installed  version. I know you can do most of these things with npm run scripts, but then you're stuck embedding shell scripts inside strings in JSON, which doesn't seem very nice, especially if your scripts grow beyond one or two tasks.  Make does have its complexities, so I wouldn't recommend doing a lot of "coding" in your Makefile, if you need more power use Gulp, but for simple tasks make is great.  One other minor downside is that make doesn't come standard on Windows, but I don't know many JS developers who don't use Mac or Linux, and its not that hard to install make on Windows.*


## Conclusion

That's pretty much all there is to it, all that's left if to throw the contents of the dist folder up on S3 for some very simple hosting.  Our next step is to setup CloudFront and use [Let's Encrypt](https://letsencrypt.org) to add SSL.  

Hopefully this can prove at least somewhat useful, there definitely isn't a lot here that's completely novel, but I've yet to see someone else do static site generation exactly like this.  You can checkout the source for this site itself on [github](https://github.com/streets-ahead/project-intersection), or you can clone the simplified [starter version](https://github.com/streets-ahead/Malcolm) version if you'd like to try this yourself.  What I really like about it overall is that its simple enough to be very hackable, adding new features is as simple as creating a new React.js component, since after all its just a React single page app.  We don't yet have comments, but we'll may add disqus at some point.  In the mean time if you'd like to reach out you can do so via twitter, our handles are listed below.  Thanks for reading!

## Links

 * [The Fuctional Frontier - David Nolan](https://www.youtube.com/watch?v=DMtwq3QtddY)
 * [malcolm](https://github.com/streets-ahead/Malcolm)


 
 
