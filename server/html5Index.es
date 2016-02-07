import startsWith from 'lodash/startsWith';

export default function(routes) {
  return (req, resp, next) => {
    if(routes.some(r => startsWith(req.url, '/' + r))) {
      req.url = '/';
    }
    next();
  };
};
