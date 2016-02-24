import React, {Component} from 'react';
import api from './api';
import merge from 'lodash/merge';
import {Link} from 'react-router';
import prettyDate from 'pretty-date';
import style from '../styles/home.css';
import previewStyle from '../styles/preview.css';
import chunk from 'lodash/chunk';
import classNames from 'classnames';

const Preview = function({post, showPreview = false}) {
  return (
    <div  className={classNames(previewStyle['preview-block'], {[previewStyle.expanded]: showPreview})}>
      <div className={previewStyle['title']}>
        <Link to={`/${post.slug}.html`}>
          <h1>{post.title}</h1>
        </Link>
        <p className={previewStyle['subhead']}>{showPreview ? post.subHead : ''}</p>
      </div>
      <div style={{flex: 1}}></div>
      <div>
        <ul className={previewStyle['tags-box']}>
          {post.tags.map(d => <li key={d}>{d}</li>)}
        </ul>
        <p className={previewStyle['author']}>
          Posted By {post.author}<br/> {prettyDate.format(new Date(post.published))}
        </p>
      </div>
    </div>
  );
}


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
    const childrenWithProps = '';
    // if(children) {
    //   childrenWithProps = (
    //     React.cloneElement(children, {
    //       updateAppState: this.updateAppState, 
    //       appState: this.state.appState
    //     });
    //   );
    // }
    
    if(!index.posts.length) return <span/>;
    
    const firstRow = index.posts.slice(0, 2),
          rest = index.posts.slice(2, index.posts.length);

    return (
      <div className={style.home}>
        <div className={style.navBar}>
          <h1>SA <img src="/images/sa-logo.svg" width="58" height="37" /> LABS</h1>
        </div>
        
        <div className={style.container}>
          <div style={{display: "flex"}}>
            {firstRow.map((p, i) => <Preview post={p} showPreview={i === 0} />)}
          </div>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            {rest.map(p => <Preview post={p} />)}
          </div>
        </div>
      </div>
    )
  }
}
