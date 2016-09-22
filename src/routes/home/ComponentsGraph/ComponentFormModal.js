import React from 'react';
import Modal from 'react-modal';
import Form from 'react-jsonschema-form';
import moment from 'moment';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentFormModal.css';

import componentSchema from '../../../server/models/component_schema.json';
import ComponentStatus from '../ComponentsList/ComponentStatus';

import $ from 'jquery';

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    position: 'absolute',
    top: '200px',
    left: '20%',
    right: '20%',
    bottom: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
};

const uiSchema = {
  status: { 'ui:widget': 'hidden' },
  description: {
    'ui:widget': 'textarea',
  },
};

const formatCreatedAt = (createdAt) => moment(createdAt).fromNow();

class ComponentFormModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'SHOW',
    };
  }

  __submit(data) {
    $.post('/api/cypher/save', {
      node: {
        label: componentSchema.title,
        data: data.formData,
      },
    }, (/* result */) => {
      this.setState({ mode: 'SHOW' });
    });
  }

  __delete() {
    $.post('/api/cypher/delete', {
      node: {
        id: this.props.component.id,
      },
    }, () => {
      this.props.close();
    });
  }

  __close() {
    this.props.close();
  }

  render() {
    const { component } = this.props;

    let form = null;

    if (component) {
      if (this.state.mode === 'SHOW') {
        form = (
          <div>
            <h1>
              {component.data.name}
              &nbsp;
              <button
                className="btn btn-xs btn-default"
                onClick={() => this.setState({ mode: 'EDIT' })}
              >
                <span className="glyphicon glyphicon-edit" />
              </button>
            </h1>
            <p
              dangerouslySetInnerHTML={{
                __html: component.data.description || '<small>Need Description</small>',
              }}
            />
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className={s.tableTh}>
                    Watcher
                  </th>
                  <th className={s.tableTh}>
                    Status
                  </th>
                  <th className={s.tableTh}>
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {component.data.watchers.map(w => (
                  <tr key={w.name}>
                    <td className={s.tableTd}>
                      <b>{w.name}</b>
                    </td>
                    <td className={s.tableTd}>
                      <ComponentStatus status={w.result.status} />
                      <small>{w.result.description}</small>
                    </td>
                    <td className={s.tableTd}>
                      {formatCreatedAt(w.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (this.state.mode === 'EDIT') {
        form = (
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
              onClick={() => this.setState({ mode: 'SHOW' })}
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

    return (
      <Modal
        isOpen={!!component}
        onAfterOpen={() => this.setState({ mode: 'SHOW' })}
        style={modalStyle}
        onRequestClose={() => this.props.close()}
      >
        {form}
      </Modal>
    );
  }
}


ComponentFormModal.propTypes = {
  component: React.PropTypes.object,
  close: React.PropTypes.func.isRequired,
};

export default withStyles(s)(ComponentFormModal);
