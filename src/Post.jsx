import React from 'react';
import dateFormat from 'dateformat';
import styles from '../styles/post.css';
import previewStyle from '../styles/preview.css';
import homeStyle from '../styles/home.css';
import {Link} from 'react-router';
import {Motion, spring} from 'react-motion';

export default class Post extends React.Component {
  getWinHeight() {
    return window ? window.innerHeight : 1200;
  }
  
  render() {
    const {body, title, published, author, tags, subHead} = this.props.content;
    const config = {stiffness: 160, damping: 23};

    return (
      <Motion defaultStyle={{top: -100, opac: 0, title: -70}} 
              style={{top: spring(0, config), 
                      opac: spring(1), 
                      title: spring(0, {stiffness: 120, damping: 26})}}>
        {value => (
          <div className={styles['post']} style={{opacity: value.opac+0.4}}>
            <div className={styles['header']} style={{height: this.getWinHeight(), backgroundColor: "#3CB5F5"}}>
              
              <div className={homeStyle.navBar} style={{marginTop: 0, paddingTop: 40}}>
                <p><img src="/images/sa-logo.svg" width="58" height="37" /></p>
                <h1>
                  SA LABS 
                  <span className={homeStyle.separator}>|</span> 
                  <span style={{color: 'white'}} className={homeStyle.light}>Experiments and stuff</span>  
                </h1>
              </div>
              
              <div className={styles['header-content']}>
                <ul style={{transform: `translateY(${Math.min(value.title + 5, 0)}px)`}} className={styles['tags-box']}>
                  {tags.map(d => <li key={d}>{d}</li>)}
                </ul>
                <h1 style={{transform: `translateY(${Math.min(value.title + 10, 0)}px)`}}>{title}</h1>
                <p style={{transform: `translateY(${Math.min(value.title + 15, 0)}px)`}} className={styles['subhead']}>{subHead}</p>
                <p style={{transform: `translateY(${Math.min(value.title + 20, 0)}px)`}} className={styles['date']}>
                  {dateFormat(new Date(published), "mmm dd, yyyy")} / {author}
                </p>
              </div>
            </div>
            
            <div className={styles['post-container']} style={{ opacity: value.opac}}>
              <div className={styles['post-body']} dangerouslySetInnerHTML={{__html: body}} /> 
            </div>
          </div>
        )}
      </Motion>  
    )
  }
}
