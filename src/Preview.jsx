import React from 'react';
import {Link} from 'react-router';
import style from '../styles/preview.css';

export default ({post}) => {
  return (
    <div>
      <Link className={style['preview-block']} to={`/${post.slug}.html`}>
        <h1>{post.title}</h1>
      </Link>
      <ul className={style['tags-box']}>
        {post.tags.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p className={style['author']}>Posted By {post.author}<br/> </p>
    </div>
  );
};
