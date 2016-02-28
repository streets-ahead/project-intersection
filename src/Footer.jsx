import React from 'react';
import footerStyles from '../styles/footer.css';

export default function(props) {
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
        <div className={footerStyles['in-touch']}>
          <h2>Keep In Touch</h2>
          <p></p>
        </div>
      </div>
    </footer>
  )
}
