# Project Intersection

Basic idea is that a static site generator could just be a cache of a very simple isomorphic app.

Different content types can be configured as react-router routes.  The following example defines two content types, pages and posts.

```
const routes = [{ 
  path: '/',
  component: Root,
  childRoutes: [
    {path: 'pages', component: Page},
    {path: 'posts', component: Post}
  ]
}];
```

The component specified will act like a template for the configured type, a content prop will be passed to the component instance.  The content prop has a body property containing the parsed markdown, it will also contain any metadata specified in the JSON front-matter in that file.

Start the server by running 

```
make serve
```

Pages are loaded "isomorphically" by default, but you can pass the ?noRender=true to avoid server rendering, this is good for debugging.

## Generate Site

To generate the cache use the following, *note: the server must be running*.

```
make gen
```

This will create a dist folder with the static site.

## Adding posts

There is a command line tool to create new content.  

```
make create
```
