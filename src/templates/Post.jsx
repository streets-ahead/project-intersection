import React from 'react';
import dateFormat from 'dateformat';
import {Link} from 'react-router';
import range from 'lodash/range';
import {spring, StaggeredMotion} from 'react-motion';
import templates from './index';

import styles from '../../styles/post.css';

const colorMap = {
  "javascript": "#F8CA4D", 
  "clojure": "#3F5666", 
  "data viz": "#61B9D0", 
  "swift": "#EA6045",
    "ios": "#EA6045",
  "android": "#7EC1A2"
};

const config = {stiffness: 120, damping: 17};

export default function Post(props) {
  const {content, style, winHeight} = props;
  const {body, title, published, author, tags, subHead, innerTemplate} = content;
  
  const color = colorMap[tags[0].toLowerCase()] || "#2F3440";
  
  const InnerComp = templates[innerTemplate];
  const bodyContent = InnerComp ? <div className={styles['post-body']}><InnerComp {...props} /></div> :
                <div className={styles['post-body']} dangerouslySetInnerHTML={{__html: body}} />;
  
  return (
    <article className={styles['post']} style={style}>
      <div className={styles['nav-bar']}>
        <h1>
          <Link to="/"><img src="/images/sa-logo.svg" width="29" height="18.5" /> SA LABS</Link>
        </h1>
      </div>
      <div className={styles['header']} style={{height: winHeight, backgroundColor: color}}>
        <div className={styles['spacer']}></div>
        <StaggeredMotion defaultStyles={range(4).map((i) => ({t: 300}))}
                        styles={prev => prev.map((_, i) => (
                          i === 0 ? {t: spring(0, config)} : {t: spring(prev[i - 1].t, config)}
                        ))}>
          {values => (
            <div className={styles['header-content']}>
              <ul style={{transform: `translateZ(${values[2].t}px)`}} className={styles['tags-box']}>
                {tags.map(d => <li key={d}>{d}</li>)}
              </ul>
              <h1 style={{transform: `translateZ(${values[1].t}px)`}}>{title}</h1>
              <p style={{transform: `translateZ(${values[3].t}px)`}} className={styles['subhead']}>{subHead}</p>
              <p style={{transform: `translateZ(${values[0].t}px)`}} className={styles['date']}>
                {dateFormat(new Date(published), "mmm dd, yyyy")} / {author}
              </p>
            </div>
          )}
        </StaggeredMotion>  
      </div>
      <div className={styles['post-container']}>
        {bodyContent}
      </div>
    </article>
  )
};
