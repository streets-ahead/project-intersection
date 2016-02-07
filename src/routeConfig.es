import React from 'react';
import Home from './Home';
import FetchContainer from './FetchContainer';
// import About from './About';
import Post from './Post';

const About = (props) => <span/>;
// const Post = (props) => <div>Hello world</div>;

const Noop = () => <span/>;

const routes = [{ 
  path: '/',
  component: Home,
  childRoutes: [
    {path: 'pages/:path', component: About},
    {path: 'posts/:path', component: Post}
  ]
}];

routes[0].childRoutes.forEach((p) => {
  p.component = FetchContainer(p.component, p.path.split('/')[0]);
});

export default routes;
