import React, { PropTypes } from 'react';
import { analytics } from '../config';
import htmlStyleFile from './Html.css';

const htmlStyle = htmlStyleFile._getCss(); // eslint-disable-line

function Html({ title, description, style, script, children, state }) {
  return (
    <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <style id="global_css" dangerouslySetInnerHTML={{ __html: htmlStyle }} />
        <style id="css" dangerouslySetInnerHTML={{ __html: style }} />
      </head>
      <body>
        <div
          id="app"
          className={htmlStyleFile.app}
          dangerouslySetInnerHTML={{ __html: children }}
        />
        {script && (
          <script
            id="source"
            src={script}
            data-initial-state={JSON.stringify(state)}
          />
        )}
        {analytics.google.trackingId &&
          <script
            dangerouslySetInnerHTML={{ __html:
            'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
            `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
          />
        }
        {analytics.google.trackingId &&
          <script src="https://www.google-analytics.com/analytics.js" async defer />
        }
      </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  script: PropTypes.string,
  children: PropTypes.string,
  state: PropTypes.object.isRequired,
};

export default Html;
