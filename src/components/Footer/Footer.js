import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';

function Footer() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <span className={s.text}>© Vingle Inc</span>
      </div>
    </div>
  );
}

export default withStyles(s)(Footer);
