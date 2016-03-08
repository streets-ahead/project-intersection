import React from 'react';
import api from './api';

export default function(Component, type) {
  class FetchContainer extends React.Component {
    componentWillMount() {
      this.updateSize = () => this.forceUpdate();
      if(typeof window !== undefined) {
        window.addEventListener('resize', this.updateSize);
      }
      this.update(this.props);
    }
    
    componentWillUnmount() {
      if(typeof window !== undefined) {
        window.removeEventListener('resize', this.updateSize);  
      }
    }
    
    componentWillUpdate(nextProps, nextState) {
      if(this.props.params.path !== nextProps.params.path) {
        this.update(nextProps);
      }
    }
    
    getWinHeight() {
      return typeof window !== 'undefined' ? window.innerHeight : 1200;
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
      
      if(!content) return (
        <div style={{height: "100%", position: "fixed", backgroundColor: "white", width: "100%"}}></div>  
      );
        
      return <Component content={content} winHeight={this.getWinHeight()} {...this.props} />;
    }
  }
  
  return FetchContainer;  
}
