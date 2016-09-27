import React from 'react';
import Modal from 'react-modal';
import Form from 'react-jsonschema-form';
import moment from 'moment';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentModal.css';

import componentSchema from '../../server/models/component_schema.json';
import ComponentStatus from '../home/ComponentsList/ComponentStatus';

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
  status: { 'ui:widget': 'hidden' },
  description: {
    'ui:widget': 'textarea',
  },
};

const formatCreatedAt = (createdAt) => moment(createdAt).fromNow();

export const MODES = {
  SHOW: 'SHOW',
  EDIT: 'EDIT',
};

class ComponentModal extends React.Component {
  static propTypes = {
    component: React.PropTypes.object,
    close: React.PropTypes.func.isRequired,
    initialMode: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  __onAfterOpen() {
    this.setState({
      mode: this.props.initialMode || MODES.SHOW,
    });
  }

  __submit(data) {
    $.post('/api/cypher/save', {
      node: {
        label: componentSchema.title,
        data: data.formData,
      },
    }, (result) => {
      this.props.component.data = result;
      this.setState({ mode: MODES.SHOW });
    });
  }

  __delete() {
    $.post('/api/cypher/delete', {
      node: {
        id: this.props.component.data.id,
      },
    }, () => {
      this.props.close();
    });
  }

  render() {
    const { component } = this.props;

    let form = null;

    if (component) {
      if (this.state.mode === MODES.SHOW) {
        form = (
          <div>
            <h1>
              {component.data.name}
              &nbsp;
              <button
                className="btn btn-xs btn-default"
                onClick={() => this.setState({ mode: MODES.EDIT })}
              >
                <span className="glyphicon glyphicon-edit" />
              </button>
            </h1>
            <div>
              {(() => {
                if (component.data.description) {
                  return (
                    <p
                      className="lead"
                      dangerouslySetInnerHTML={{
                        __html: component.data.description,
                      }}
                    />
                  );
                }
                return (
                  <small>Need Description</small>
                );
              })()}
            </div>
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
                  <th className={s.tableTh}>
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
                      <ComponentStatus status={(w.result || {}).status} />
                      <small>{(w.result || {}).description}</small>
                    </td>
                    <td className={s.tableTd}>
                      {formatCreatedAt(w.status)}
                    </td>
                    <td className={s.tableTd}>
                      <button
                        className="btn btn-sm btn-default"
                        onClick={() => alert(JSON.stringify(w))}
                      >
                        <span className="glyphicon glyphicon-edit" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (this.state.mode === MODES.EDIT) {
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

    return (
      <Modal
        isOpen={!!component}
        onAfterOpen={() => this.__onAfterOpen()}
        style={modalStyle}
        onRequestClose={() => this.props.close()}
      >
        {form}
      </Modal>
    );
  }
}

export default withStyles(s)(ComponentModal);
