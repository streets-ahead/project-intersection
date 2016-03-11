import React from 'react';
import FetchContainer from './FetchContainer';
import cloneDeep from 'lodash/cloneDeep';
import Root from './Root';
import Home from './Home';

import templates from './templates';

const Page = (props) => <span/>;

/**
 * Configure the following routes to add more content types
 */
const routes = [{ 
  path: '/',
  component: Root,
  indexRoute: {key: "home", component: Home},
  childRoutes: [
    {path: 'posts', key: "post", component: componentForType("Post")}
  ]
}];

function componentForType(defaultTemplate) {
  return (props) => {
    const Template = templates[props.content.template || defaultTemplate];
    return <Template {...props} />;
  }
}

const track = (nextState) => {
  if(typeof ga !== "undefined") {
    ga('send', 'pageview', nextState.location.pathname);
  }
};

const enhancedRoutes = cloneDeep(routes);
enhancedRoutes[0].childRoutes.forEach((p) => {
  p.component = FetchContainer(p.component, p.path.split('/')[0]);
  p.onEnter = track;
  p.path += '/(:path).html';
});

export { routes };
export default enhancedRoutes;
