import React from 'react';
import api from './api';

export default function(Component, type) {
  class FetchContainer extends React.Component {
    componentWillMount() {
      this.update(this.props);
    }
    
    componentWillUpdate(nextProps, nextState) {
      if(this.props.params.path !== nextProps.params.path) {
        this.update(nextProps);
      }
    }
    
    update(props) {
      const fullPath = type + '/' + props.params.path;
      const content = this.props.appState[fullPath];
      if(!content) {
        api.getContent(fullPath)
          .then((d) => this.props.updateAppState({[fullPath]: d}));
      }
    }
    
    render() {
      const content = this.props.appState[type + '/' + this.props.params.path];
      
      if(!content) return <span></span>;
        
      return <Component content={content} {...this.props} />;
    }
  }
  
  return FetchContainer;  
}
