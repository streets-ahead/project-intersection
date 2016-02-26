import React from 'react';
import {Link} from 'react-router';
import previewStyle from '../styles/preview.css';
import dateFormat from 'dateformat';
import classNames from 'classnames';

const Preview = ({post, showPreview = false}) => {
  return (
    <div  className={classNames(previewStyle['preview-block'], {[previewStyle.expanded]: showPreview})}>
      <div className={previewStyle['title']}>
        <ul className={previewStyle['tags-box']}>
          {post.tags.map(d => <li key={d}>{d}</li>)}
        </ul>
        <Link to={`/${post.slug}.html`}>
          <h1>{post.title}</h1>
        </Link>
      </div>
      <div style={{flex: 1}}></div>
      <div style={{height: 120}}>
        <div className={previewStyle['date']}>
          {dateFormat(new Date(post.published), "mmm dd, yyyy")} / {post.author}
        </div>
        <p className={previewStyle['subhead']}>{post.subHead}</p>
      </div>
    </div>
  );
};

export default Preview;
