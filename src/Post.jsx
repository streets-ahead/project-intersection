import React from 'react';
import prettyDate from 'pretty-date';
import styles from '../styles/post.css';
import previewStyle from '../styles/preview.css';
import {Link} from 'react-router';
import {Motion, spring} from 'react-motion';

export default class Post extends React.Component {
  render() {
    const {body, title, published, author, tags} = this.props.content;
    const config = {stiffness: 160, damping: 23};
    return (
      <Motion defaultStyle={{top: -400, opac: 0, title: -500}} 
              style={{top: spring(0, config), 
                      opac: spring(1), 
                      title: spring(0, {stiffness: 120, damping: 26})}}>
        {value => (
          <div className={styles['post']} style={{opacity: value.opac+0.2}}>
            <div className={styles['post-container']} style={{ opacity: value.opac}}>
              <Link to="/">x</Link>
              <h1 style={{transform: `translateY(${Math.min(value.title + 10, 0)}px)`}}>{title}</h1>
              <p style={{transform: `translateY(${Math.min(value.title + 20, 0)}px)`}} className={previewStyle['author']}>
                Posted By {author} {prettyDate.format(new Date(published))}
              </p>
              <ul style={{transform: `translateY(${Math.min(value.title + 30, 0)}px)`}} className={previewStyle['tags-box']}>
                {tags.map(d => <li key={d}>{d}</li>)}
              </ul>
              <div className={styles['post-body']} style={{transform: `translateY(${Math.min(value.title + 40, 0)}px)`}} dangerouslySetInnerHTML={{__html: body}} />  
            </div>
          </div>
        )}
      </Motion>  
    )
  }
}
