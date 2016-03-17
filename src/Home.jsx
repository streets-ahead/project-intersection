import React, {Component} from 'react';
import Preview from './Preview';
import DocumentMeta from './DocumentMeta';

import style from '../styles/home.css';

export default function Home({appState: {index}}) {
  return (
    <div>
      <DocumentMeta title="SA Labs | Experiments with React.js, Clojure Mobile and More..."/>
      <div className={style.navBar}>
        <p><img src="/images/sa-logo.svg" /></p>
        <h1>
          SA LABS 
          <span className={style.separator}>|</span> 
          <span className={style.light}>Experiments and stuff</span>  
        </h1>
      </div>
      <div className={style.container}>
        <div style={{display: "flex", flexWrap: "wrap"}}>
          {index.posts.map(p => <Preview post={p} key={p.slug} />)}
        </div>
      </div>
    </div>
  )
};
