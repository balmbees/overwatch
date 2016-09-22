import React from 'react';
import Modal from 'react-modal';
import Form from 'react-jsonschema-form';
import componentSchema from '../../../server/models/component_schema.json';

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

class ComponentFormModal extends React.Component {
  __submit(data) {
    $.post('/api/cypher/save', {
      node: {
        label: componentSchema.title,
        data: data.formData,
      },
    }, (/* result */) => {
      this.props.close();
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
            onClick={() => this.__close()}
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
        isOpen={!!component}
        style={modalStyle}
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

export default ComponentFormModal;
