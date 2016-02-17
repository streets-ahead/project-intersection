import React, {Component} from 'react';
import api from './api';
import merge from 'lodash/merge';
import Preview from './Preview';
import {Link} from 'react-router';
import prettyDate from 'pretty-date';
import style from '../styles/home.css';
import previewStyle from '../styles/preview.css';

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
    
    if(!index.posts.length) return <span/>;
    
    const [firstPost, ...rest] = index.posts.sort((a, b) => new Date(b.published) - new Date(a.published));

    return (
      <div className={style.home}>
        <div className={style.navBar}><h1>SA Labs</h1></div>
        <div className={style.container}>
          <div>
            <div className={style['first-post']}>
              <Link to={`/${firstPost.slug}.html`}>
                <h1>{firstPost.title}</h1>
              </Link>
              <p className={previewStyle['author']}>
                Posted By {firstPost.author} {prettyDate.format(new Date(firstPost.published))}
              </p>
              <p className={previewStyle['preview-content']}>{firstPost.preview}</p>
              <ul className={previewStyle['tags-box']}>
                {firstPost.tags.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
          </div>
          <ul>
            {rest.map(p => <Preview key={p.slug} post={p} />)}
          </ul>
          {childrenWithProps}
        </div>
      </div>
    )
  }
}
