import React from 'react';
import {Link} from 'react-router';
import style from '../styles/preview.css';

export default ({post}) => {
  return (
    <li className={style['preview-block']}>
      <Link to={`/${post.slug}.html`}>
        <h1>{post.title}</h1>
      </Link>
      <p className={style['author']}>Posted By {post.author}<br/> </p>
      <p className={style['preview-content']}>{post.preview}</p>
      <ul className={style['tags-box']}>
        {post.tags.map(d => <li key={d}>{d}</li>)}
      </ul>
    </li>
  );
};
