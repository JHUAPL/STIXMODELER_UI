import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Tooltip } from 'react-tooltip';
import Panel from '../ui/panel/Panel';
import Text from '../ui/inputs/Text';
import Images from '../../imgs/Images';

import './RelationshipDetails.scss';

class RelationshipEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.relationship.relationship_type,
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.reset = this.reset.bind(this);
    this.close = this.close.bind(this);
  }

  reset() {
    this.setState({
      type: this.props.relationship.relationship_type,
    });
  }

  close() {
    this.reset();
    this.props.onClickHideHandler();
  }

  onSubmitHandler() {
    const rel = {
      type: this.state.type,
    };

    this.props.onClickEditRelHandler(rel);
    this.reset();
  }

  onChangeHandler(event) {
    if (event in this.state) {
      this.setState({ [event]: !this.state[event], });
    } else {
      const { value, } = event.target;
      this.setState({ type: value, });
    }
  }

  render() {
    const deleteIcon = <span className="material-icons">delete_forever</span>;
    let preview;
    let details;
    const relationship = toJS(this.props.relationship);
    let type;
    if (relationship.type) {
      let src = relationship.source_ref.split('--')[0];
      let target = relationship.target_ref.split('--')[0];
      type = this.state.type;

      if (relationship.x_reverse) {
        const tmp = src;
        src = target;
        target = tmp;
      }

      const srcImg = Images.getImage(`${src}.png`);
      const targetImg = Images.getImage(`${target}.png`);

      if (relationship.subTarget) {
        target = relationship.subTarget;
      }
      preview = (
        <div className="item" key="preview">
          <div className="item-header">Preview</div>
          <div className="preview item-value" key="preview-item">
            <img
              className="src-image"
              src={srcImg}
              width="20"
            />
            {' '}
            {src}
            <span className="rel-type">
              {' '}
              {type}
              {' '}
            </span>
            {target}
            {' '}
            <img
              className="target-image"
              src={targetImg}
              width="20"
            />
          </div>
        </div>
      );
      details = (
        <div className="item" key="type">
          <div className="item-header">
            Type
            <span
              data-tooltip-id="name-tooltip"
              className="material-icons"
              data-tooltip-content="Name of relationship"
            >
              info
            </span>
            <Tooltip id="name-tooltip" />
          </div>
          <div className="item-value">
            <Text name="type" value={type} onChange={this.onChangeHandler} />
          </div>
        </div>
      );
    }
    return (
      <Panel show={this.props.show} onClickHideHandler={this.close}>
        <div className="details">
          <div className="header">
            <div className="title">Edit Relationship</div>
            <div
              className="delete"
              onClick={this.props.onClickDeleteRelHandler}
            >
              {deleteIcon}
              {' '}
              <span className="text">Delete</span>
            </div>
          </div>
          <div className="body">
            {preview}
            {details}
            <div className="submit-btn" onClick={this.onSubmitHandler}>
              <span className="i material-icons">add</span>
              {' '}
              Update
            </div>
          </div>
          <div className="footer" />
        </div>
      </Panel>
    );
  }
} export default (observer(RelationshipEditor));
