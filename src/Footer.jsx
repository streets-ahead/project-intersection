import React from 'react';
import {Link} from 'react-router';
import footerStyles from '../styles/footer.css';

export default function({index}) {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles['container']}>
        <div className={footerStyles['about']}>
          <h2>About SA Labs</h2>
          <p>Welcome to SA Labs, our small little corner of the internet.
            We are a small group of people with a passion for technology, and
            we wanted to create a space where we can share our various ideas
            and experiments with the world.  Please enjoy.</p>
        </div>
        <div className={footerStyles['recent']}>
          <h2>Recent Posts</h2>
          <ul>
            {index.posts.slice(0, 3).map(p => (
              <li key={`/${p.slug}.html`}><Link to={`/${p.slug}.html`}>{p.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className={footerStyles['in-touch']}>
        <ul>
          <li><a href="https://twitter.com/smussell"><img src="/images/twitter-logo.svg" /> @smussell</a></li>
          <li><a href="https://twitter.com/tkeeney"><img src="/images/twitter-logo.svg" /> @tkeeney</a></li>
          <li><a href="mailto:devs@salabs.io"><img src="/images/mail-icon.svg" /> devs@salabs.io</a></li>
          <li><a href="https://github.com/streets-ahead/"><img src="/images/github-logo.svg" /> streets-head</a></li>
        </ul>
      </div>
    </footer>
  )
}
