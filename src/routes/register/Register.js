import React from 'react';
import Form from 'react-jsonschema-form';
import $ from 'jquery';

import ComponentSchema from '../../server/models/component_schema.json';

function ComponentForm() {
  return (
    <Form
      schema={ComponentSchema}
      onSubmit={
        (data) => $.post('/api/cypher', {
          node: {
            label: ComponentSchema.title,
            data: data.formData,
          },
        }, (res) => {
          console.log(res);
        })
      }
    />
  );
}

function watcherFormFactory(schema) {
  return function WatcherForm() {
    const uiSchema = { type: { 'ui:widget': 'hidden' } };
    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={
          (data) => $.post('/api/cypher', {
            node: {
              label: schema.title,
              data: data.formData,
            },
          }, (res) => {
            console.log(res);
          })
        }
      />
    );
  };
}

import CloudwatchAlarmWatcherSchema from
'../../server/models/watcher/polymorphs/cloudwatch_alarm_watcher_schema';
import DummyWatcherSchema from
'../../server/models/watcher/polymorphs/dummy_watcher_schema';
import HttpWatcherSchema from
'../../server/models/watcher/polymorphs/http_watcher_schema';

const CloudwatchAlarmWatcherForm =
  watcherFormFactory(CloudwatchAlarmWatcherSchema);
const DummyWatcherForm =
  watcherFormFactory(DummyWatcherSchema);
const HttpWatcherForm =
  watcherFormFactory(HttpWatcherSchema);

export default function register() {
  return (
    <div>
      <ComponentForm />
      <CloudwatchAlarmWatcherForm />
    </div>
  );
}
