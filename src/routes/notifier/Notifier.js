/**
 * Created by leehyeon on 8/23/16.
 */

import React from 'react';

import NotifierForm from './NotifierForm';

class Notifier extends React.Component {
  constructor(props, context) {
    super(props, context);
    const title = 'Manage notifiers';

    if (context.setTitle) {
      context.setTitle(title);
    }
  }

  render() {
    return (
      <div>
        <NotifierForm />
      </div>
    );
  }
}

export default Notifier;
