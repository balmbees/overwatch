import React from 'react';
import Form from 'react-jsonschema-form';
// import componentSchema from '../../server/models/component_schema.json';
const schemas = {
  CloudwatchAlarmWatcher: require('../../server/models/watcher/polymorphs/cloudwatch_alarm_watcher_schema') // eslint-disable-line
};

const uiSchema = {
  status: { 'ui:widget': 'hidden' },
  description: {
    'ui:widget': 'textarea',
  },
};


class WatcherForm extends React.Component {
  render() {
    return (
      <Form
        schema={componentSchema}
        uiSchema={uiSchema}
        formData={component.data}
        onChange={(data) => (component.data = data.formData)}
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
          onClick={() => this.setState({ mode: MODES.SHOW })}
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
}

export default WatcherForm;
