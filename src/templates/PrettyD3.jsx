import React from 'react';
import charts from './utils/charts';
import styles from '../../styles/custom.css';

export default class PrettyD3 extends React.Component {
  componentDidMount() {
    charts.bounce(this.refs.body.querySelector('.bounce div'));
    charts.siri(this.refs.body.querySelector('.siri div'));
    charts.sinChart(this.refs.body.querySelector('.wave div'));
  }
  
  render() {
    return (
      <div ref="body" dangerouslySetInnerHTML={{__html: this.props.content.body}}></div>
    );
  }  
}
