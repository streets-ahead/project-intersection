import React from 'react';
import {Link} from 'react-router';
import prettyDate from 'pretty-date';
import style from '../styles/preview.css';

export default ({post}) => {
  return (
    <li className={style['preview-block']}>
      <Link to={`/${post.slug}.html`}>
        <h1>{post.title}</h1>
      </Link>
      <p className={style['author']}>Posted By {post.author} {prettyDate.format(new Date(post.published))}</p>
      <ul className={style['tags-box']}>
        {post.tags.map(d => <li key={d}>{d}</li>)}
      </ul>
    </li>
  );
};
//   <p className={classNames(style['preview-content'], {"hidden": !enablePreview})}>{post.preview}</p>
