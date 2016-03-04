import React, {Component} from 'react';
import api from './api';
import merge from 'lodash/merge';
import {Link} from 'react-router';
import style from '../styles/home.css';
import Preview from './Preview';
import chunk from 'lodash/chunk';
import classNames from 'classnames';
import Footer from './Footer';
import {spring, TransitionMotion} from 'react-motion';

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
      if(this.props.children) {
        document.body.className = "post-open";
      }
    }
  }
  
  componentWillUpdate(nextProps, nextState) {
    if(nextProps.children) {
      if(typeof document !== "undefined") document.body.className = "post-open";
    } else {
      if(typeof document !== "undefined") document.body.className = "";
    }
  }
  
  initLiveLoad() {
    const host = window.document.location.host;
    const ws = new WebSocket('ws://' + host);
    ws.onmessage = (event) => {
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
    
    let childrenWithProps = null;
    
    if(children) {
      childrenWithProps = React.cloneElement(children, {
        key: "1",
        updateAppState: this.updateAppState, 
        appState: this.state.appState
      });
    }
    
    if(!index.posts.length) return <span/>;
    
    const firstRow = index.posts.slice(0, 1),
          rest = index.posts.slice(1, index.posts.length);

    return (
      <div className={style.home}>
        <div className={style.navBar}>
          <p><img src="/images/sa-logo.svg" /></p>
          <h1>
            SA LABS 
            <span className={style.separator}>|</span> 
            <span className={style.light}>Experiments and stuff</span>  
          </h1>
        </div>
        <div className={style.container}>
          <div style={{display: "flex"}}>
            {firstRow.map((p, i) => <Preview key={p.slug} post={p} showPreview={i === 0} />)}
          </div>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            {rest.map(p => <Preview post={p} key={p.slug} />)}
          </div>
        </div>
        <TransitionMotion defaultStyles={[{style: {opacity: 0}, key: "1"}]}
                          willEnter={() => ({opacity: 0})}
                          willLeave={() => ({opacity: spring(0, {stiffness: 140, damping: 23})})}
                          styles={!childrenWithProps ? [] : ["1"].map(item => ({
                            key: item,
                            data: childrenWithProps,
                            style: {opacity: spring(1, {stiffness: 90, damping: 26})},
                          }))}>
          {interpolatedStyles => (
            <div>
              {interpolatedStyles.map(config => (
                <div key={config.key}>
                  {React.cloneElement(config.data, {style: config.style})}
                </div>
              ))}
            </div>
          )}
        </TransitionMotion>
        <Footer  index={index} />
      </div>
    )
  }
}
