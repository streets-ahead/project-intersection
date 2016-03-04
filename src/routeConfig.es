import React from 'react';
import Home from './Home';
import FetchContainer from './FetchContainer';
import cloneDeep from 'lodash/cloneDeep';
// import About from './About';
import Post from './Post';

const Page = (props) => <span/>;

const Noop = () => <span/>;

const track = (nextState) => {
  if(typeof ga !== "undefined") {
    ga('send', 'pageview', nextState.location.pathname);
  }
};

const componentForType = (DefaultTemplate) => {
  return ({template, ...props}) => {
    return (template ? React.createElement(template, props) : <DefaultTemplate {...props} />);
  }
}

const routes = [{ 
  path: '/',
  component: Home,
  childRoutes: [
    {path: 'pages', component: componentForType(Page), onEnter: track},
    {path: 'posts', component: componentForType(Post), onEnter: track}
  ]
}];

export { routes };

const enhancedRoutes = cloneDeep(routes);
enhancedRoutes[0].childRoutes.forEach((p) => {
  p.component = FetchContainer(p.component, p.path.split('/')[0]);
  p.path += '/(:path).html';
});

export default enhancedRoutes;
