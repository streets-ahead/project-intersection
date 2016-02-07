import React, {Component} from 'react';
import api from './api';
import merge from 'lodash/merge';
import {Link} from 'react-router';

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
  }
  
  updateAppState = (newState) => {
    this.setState({appState: merge(this.state.appState, newState)});
  };
  
  render() {
    const {index} = this.state.appState;

    return (
      <div>
        <div className="home">
          <ul>
            {index.posts.map(p => <li key={p.title}><Link to={`/${p.slug}.html`}>{p.title}</Link></li>)}
          </ul>
        </div>
        {this.props.children ? React.cloneElement(this.props.children, 
            {updateAppState: this.updateAppState, appState: this.state.appState}) : ''}
      </div>
    )
  }
}
