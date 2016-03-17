import React from 'react';
import api from './api';
import DocumentMeta from './DocumentMeta';

let isIOS = false;
let isBrowser = false;

if(typeof window !== "undefined") {
  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  isBrowser = true;
}

export default function(Component, type) {
  class FetchContainer extends React.Component {
    componentWillMount() {
      this.updateSize = () => {
        const forceUpdate = !isIOS || (isIOS && this.__width !== window.innerWidth);
        if(forceUpdate) this.forceUpdate();
        this.__width = window.innerWidth;
      }
      
      if(isBrowser) {
        this.__width = window.innerWidth;
        window.addEventListener('resize', this.updateSize);
      }
      this.update(this.props);
    }
    
    componentWillUnmount() {
      if(isBrowser) {
        window.removeEventListener('resize', this.updateSize);  
      }
    }
    
    componentWillUpdate(nextProps, nextState) {
      if(this.props.params.path !== nextProps.params.path) {
        this.update(nextProps);
      }
    }
    
    getWinHeight() {
      return isBrowser ? window.innerHeight : 1200;
    }
    
    fullPath({params}) {
      return `${type}/${params.path}`;
    }
    
    update(props) {
      const fullPath = this.fullPath(props);
      const content = this.props.appState[fullPath];
      if(!content) {
        api.getContent(fullPath)
          .then((d) => this.props.updateAppState({[fullPath]: d}));
      }
    }
    
    render() {
      const content = this.props.appState[this.fullPath(this.props)];
      
      if(!content) return <div className="loading"></div>;
        
      return (
        <span>
          <DocumentMeta title={`SA Labs | ${content.title}`} />
          <Component content={content} 
                    winHeight={this.getWinHeight()} 
                    {...this.props} />
        </span>
      );
    }
  }
  
  return FetchContainer;  
}
