import React from 'react';
import Home from './Home';
import FetchContainer from './FetchContainer';
import cloneDeep from 'lodash/cloneDeep';
// import About from './About';
import Post from './Post';

const About = (props) => <span/>;
// const Post = (props) => <div>Hello world</div>;

const Noop = () => <span/>;

const track = (nextState) => {
  ga('send', 'pageview', nextState.location.pathname);
};

const routes = [{ 
  path: '/',
  component: Home,
  childRoutes: [
    {path: 'pages', component: About, onEnter: track},
    {path: 'posts', component: Post, onEnter: track}
  ]
}];

export { routes };

const enhancedRoutes = cloneDeep(routes);
enhancedRoutes[0].childRoutes.forEach((p) => {
  p.component = FetchContainer(p.component, p.path.split('/')[0]);
  p.path += '/(:path).html';
});

export default enhancedRoutes;
