import React from 'react';
import charts from './utils/charts';
import styles from '../../styles/custom.css';

export default class PrettyD3 extends React.Component {
  componentDidMount() {
    console.log(this.refs.body.querySelector('.bounce'))
    charts.bounce(this.refs.body.querySelector('.bounce div'));
    // charts.siri(this.refs.body.querySelector('siri'));
    // charts.sinChart(this.refs.body.querySelector('wave'));
  }
  
  render() {
    const {content} = this.props;
    
    return (
      <div ref="body" dangerouslySetInnerHTML={{__html: content.body}}></div>
    );
  }  
}
