import React, {Component} from 'react';
import api from './api';
import merge from 'lodash/merge';
import {Link} from 'react-router';
import style from '../styles/home.css';
import Preview from './Preview';
import chunk from 'lodash/chunk';
import classNames from 'classnames';
import Footer from './Footer';
import {spring, TransitionMotion} from 'react-motion';

export default function Home({appState: {index}}) {
  return (
    <div>
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
