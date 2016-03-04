import React from 'react';
import dateFormat from 'dateformat';
import styles from '../styles/post.css';
import previewStyle from '../styles/preview.css';
import homeStyle from '../styles/home.css';
import {Link} from 'react-router';
import range from 'lodash/range';
import {spring, StaggeredMotion} from 'react-motion';
import Footer from './Footer';

const randomBetween = (from, to) => Math.floor(Math.random() * (to - from + 1) + from);

const colorMap = {
  "mobile": "#EA6045", 
  "react.js": "#3F5666", 
  "data viz": "#61B9D0", 
  "swift": "#F8CA4D",
  "android": "#7EC1A2"
};

export default class Post extends React.Component {
  getWinHeight() {
    return typeof window !== 'undefined' ? window.innerHeight : 1200;
  }
  
  componentDidMount() {
    this.update = () => this.forceUpdate();
    window.addEventListener('resize', this.update);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
  }
  
  render() {
    const {body, title, published, author, tags, subHead} = this.props.content;
    const config = {stiffness: 145, damping: 17};
    const color = colorMap[tags[0].toLowerCase()] || "#2F3440";

    return (
      <div className={styles['post']} style={this.props.style}>
        <div className={styles['nav-bar']}>
          <h1>
            <Link to="/"><img src="/images/sa-logo.svg" width="29" height="18.5" /> SA LABS</Link>
          </h1>
        </div>
        <div className={styles['header']} style={{height: this.getWinHeight(), backgroundColor: color}}>
          <div className={styles['spacer']}></div>
          <StaggeredMotion defaultStyles={range(4).map((i) => ({t: 300}))}
                          styles={prev => prev.map((_, i) => (
                            i === 0 ? {t: spring(0, config)} : {t: spring(prev[i - 1].t, config)}
                          ))}>
            {values => (
              <div className={styles['header-content']}>
                <ul style={{transform: `translateZ(${values[3].t}px)`}} className={styles['tags-box']}>
                  {tags.map(d => <li key={d}>{d}</li>)}
                </ul>
                <h1 style={{transform: `translateZ(${values[1].t}px)`}}>{title}</h1>
                <p style={{transform: `translateZ(${values[2].t}px)`}} className={styles['subhead']}>{subHead}</p>
                <p style={{transform: `translateZ(${values[3].t}px)`}} className={styles['date']}>
                  {dateFormat(new Date(published), "mmm dd, yyyy")} / {author}
                </p>
              </div>
            )}
          </StaggeredMotion>  
        </div>
        <div className={styles['post-container']}>
          <div className={styles['post-body']} dangerouslySetInnerHTML={{__html: body}} /> 
        </div>
        <footer className="footer">
          <Footer index={this.props.appState.index} />
        </footer>
      </div>
    )
  }
}
