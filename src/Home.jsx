import React, {Component} from 'react';
import api from './api';
import merge from 'lodash/merge';
import Preview from './Preview';

import style from '../styles/home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {appState: props.initialAppState};    
  }
  
  componentWillMount() {
    const {appState} = this.state;
    if(!appState.index.posts.length) {
      api.getIndex().then((index) => this.updateAppState({index}));
    }
    
    if(typeof window !== 'undefined' && window.DEV_MODE) {
      this.initLiveLoad();
    }
  }
  
  initLiveLoad() {
    const host = window.document.location.host;
    const ws = new WebSocket('ws://' + host);
    ws.onmessage = (event) => {
      console.log('message!!', event.data);
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "change":
          api.getIndex().then((index) => this.updateAppState({index}));
          api.getContent(data.path).then((d) => this.updateAppState({[data.path]: d}));
          break;
        case "add":
          api.getIndex().then((index) => this.updateAppState({index}));
          api.getContent(data.path).then((d) => this.updateAppState({[data.path]: d}));
          break;
        case "remove":
          api.getIndex().then((index) => this.updateAppState({index}));
          break;  
      }
    };
  }
  
  updateAppState = (newState) => {
    this.setState({appState: merge(this.state.appState, newState)});
  };
  
  render() {
    const {children} = this.props;
    const {index} = this.state.appState;
    const childrenWithProps = children ? React.cloneElement(children, {
      updateAppState: this.updateAppState, 
      appState: this.state.appState
    }) : '';

    return (
      <div className={style.home}>
        <div className={style.navBar}><h1>SA Labs</h1></div>
        <div className={style.container}>
          <ul>
            {index.posts
                .sort((a, b) => new Date(b.published) - new Date(a.published))
                .map(p => <Preview key={p.slug} post={p} />)}
          </ul>
          {childrenWithProps}
        </div>
      </div>
    )
  }
}
