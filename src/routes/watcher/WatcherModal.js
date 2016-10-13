import React from 'react';
import Modal from 'react-modal';
import Form from 'react-jsonschema-form';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WatcherModal.css';

const WATCHER_SCHEMAS = {
  HttpWatcher: require('../../server/models/watcher/polymorphs/http_watcher_schema.json'), // eslint-disable-line
  CloudwatchAlarmWatcher: require('../../server/models/watcher/polymorphs/cloudwatch_alarm_watcher_schema.json'), // eslint-disable-line
  DummyWatcher: require('../../server/models/watcher/polymorphs/dummy_watcher_schema.json'), // eslint-disable-line
};
const WATCHER_TYPES = Object.keys(WATCHER_SCHEMAS);

import $ from 'jquery';

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    position: 'static',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '90%',
    width: '600px',
    WebkitOverflowScrolling: 'touch',
  },
};

const uiSchema = {
  // type: {
  //   'ui:widget': 'hidden',
  // },
};

class WatcherModal extends React.Component {
  static propTypes = {
    component: React.PropTypes.object,
    watcher: React.PropTypes.object,
    close: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.__updateSchema(props.watcher.data.type);
  }

  __onAfterOpen() {}

  __submit(data) {
    // Since Watcher is depend on component, when saving putting those to component

    const { component } = this.props;
    component.data.watchers.push(data.formData);

    $.post('/api/cypher/save', {
      node: {
        label: 'Component',
        data: component.data,
      },
    }, (result) => {
      this.props.watcher.data = result.watchers[result.watchers.length - 1];
      window.alert('Change Saved!');
    });
  }

  __delete() {
    $.post('/api/cypher/delete', {
      node: {
        id: this.props.watcher.data.id,
      },
    }, () => {
      this.props.close();
    });
  }

  __updateSchema(type) {
    if (!this.state || type !== this.state.schema.properties.type.default) {
      const schema = WATCHER_SCHEMAS[type];
      Object.assign(
        schema.properties.type,
        {
          enum: WATCHER_TYPES,
          enumNames: WATCHER_TYPES,
        }
      );
      const newState = { schema };
      if (!this.state) this.state = newState;
      else this.setState(newState);
    }
  }

  render() {
    const { watcher } = this.props;

    let form = null;

    if (watcher) {
      form = (
        <Form
          schema={this.state.schema}
          uiSchema={uiSchema}
          formData={watcher.data}
          onChange={(data) => {
            // Since this 'could' change the watcher type..
            watcher.data = data.formData;
            this.__updateSchema(watcher.data.type);
          }}
          onSubmit={(data) => this.__submit(data)}
        >
          <button
            className="btn btn-primary"
            type="submit"
          >
            Save
          </button>
          <button
            className="btn btn-default"
            type="button"
            onClick={() => this.props.close()}
          >
            Close
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => this.__delete()}
          >
            Delete
          </button>
        </Form>
      );
    }

    return (
      <Modal
        isOpen={!!watcher}
        onAfterOpen={() => this.__onAfterOpen()}
        style={modalStyle}
        onRequestClose={() => this.props.close()}
      >
        {form}
      </Modal>
    );
  }
}

export default withStyles(s)(WatcherModal);
