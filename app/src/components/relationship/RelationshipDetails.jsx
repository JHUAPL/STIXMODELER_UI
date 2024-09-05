import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';
import Panel from '../ui/panel/Panel';
import Text from '../ui/inputs/Text';
import Boolean from '../ui/inputs/Boolean';
import Images from '../../imgs/Images';

import './RelationshipDetails.scss';

class RelationshipDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'relates to',
      x_exclusive: false,
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.reset = this.reset.bind(this);
    this.close = this.close.bind(this);
  }

  onSubmitHandler() {
    const relationship = this.props.relationships[0];
    const rel = {
      type: this.state.type,
      targetObjectType: relationship.target,
      x_exclusive: this.state.x_exclusive,
    };
    const src = relationship.source_ref;
    const target = relationship.target_ref;
    this.props.onClickCreateRelHandler(src, target, rel);
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

  reset() {
    this.setState({
      type: 'relates to',
      x_exclusive: false,
    });
  }

  close() {
    this.reset();
    this.props.onClickHideHandler();
  }

  render() {
    const deleteIcon = <span className="material-icons">delete_forever</span>;
    let preview;
    const details = [];
    if (this.props.relationships.length) {
      const relationship = this.props.relationships[0];
      const src = relationship.source_ref.split('--')[0];
      let target = relationship.target_ref.split('--')[0];

      const srcImg = Images.getImage(`${src}.png`);
      const targetImg = Images.getImage(`${target}.png`);

      if (relationship.subTarget) {
        target = relationship.subTarget;
      }

      preview = (
        <div className="item" key="preview">
          <div className="item-header">
            Preview
          </div>
          <div className="preview item-value" key="preview-item">
            <img className="src-image" alt={src} src={srcImg} width="20" />
            {' '}
            {src}
            <span className="rel-type">
              {' '}
              {this.state.type}
              {' '}
            </span>
            {target}
            {' '}
            <img className="target-image" alt={target} src={targetImg} width="20" />
          </div>
        </div>
      );

      const descriptions = {
        type: 'Name of relationship',
        x_exclusive: 'Relationship exclusive?',

      };

      for (const field in this.state) {
        const header = (
          <div className="item-header">
            {field}
            <span
              data-tooltip-id={`${field}-tooltip`}
              className="material-icons"
              data-tooltip-content={descriptions[field]}
            >
              info
            </span>
            <Tooltip id={`${field}-tooltip`} />
          </div>
        );

        let control;
        switch (field) {
          case 'type':
            control = (
              <div className="item" key={field}>
                {header}
                <div className="item-value">
                  <Text
                    name={field}
                    value={this.state.type}
                    onChange={this.onChangeHandler}
                  />
                </div>
              </div>
            );
            break;
          default:
            control = (
              <div className="item" key={field}>
                {header}
                <div className="item-value">
                  <Boolean
                    name={field}
                    selected={this.state[field]}
                    onClick={this.onChangeHandler}
                  />
                </div>
              </div>
            );
            break;
        }
        details.push(control);
      }
    }
    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.close}
      >
        <div className="details">
          <div className="header">
            <div className="title">
              New Relationship
            </div>
            <div className="delete" onClick={this.close}>
              {deleteIcon}
              {' '}
              <span className="text">Discard</span>
            </div>
          </div>
          <div className="body">
            {preview}
            {details}
            <div
              className="submit-btn"
              onClick={this.onSubmitHandler}
            >
              <span className="i material-icons">add</span>
              {' '}
              Submit
            </div>
          </div>
          <div className="footer" />
        </div>
      </Panel>
    );
  }
} export default (observer(RelationshipDetails));
