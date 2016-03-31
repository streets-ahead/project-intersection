import React from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat';

import previewStyle from '../styles/preview.css';

const Preview = ({post, showPreview = false}) => {
  return (
    <div  className={previewStyle['preview-block']}>
      <div className={previewStyle['title']}>
        <ul className={previewStyle['tags-box']}>
          {post.tags.map(d => <li key={d}>{d}</li>)}
        </ul>
        <Link to={`/${post.slug}.html`}>
          <h1>{post.title}</h1>
        </Link>
      </div>
      <div>
        <div className={previewStyle['date']}>
          <span className={previewStyle['date-value']}>
            <time>{dateFormat(new Date(post.published), "mmm dd, yyyy")}</time>
          </span> / <span className="author">{post.author}</span>
        </div>
        <p className={previewStyle['subhead']}>{post.subHead}</p>
      </div>
    </div>
  );
};

export default Preview;
