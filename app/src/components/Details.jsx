import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';
import Panel from './ui/panel/Panel';
import Slider from './ui/inputs/Slider';
import Text from './ui/inputs/Text';
import TextArea from './ui/inputs/TextArea';
import DateTime from './ui/inputs/DateTime';
import ArraySelector from './ui/inputs/ArraySelector';
import KillChain from './ui/complex/KillChain';
import ExternalReferences from './ui/complex/ExternalReferences';
import CSVInput from './ui/inputs/CSVInput';
import Boolean from './ui/inputs/Boolean';
import GenericObject from './ui/complex/GenericObject';
import ConfirmTextarea from './ui/complex/ConfirmTextarea';
import ObjectArray from './ui/complex/ObjectArray';

import Images from '../imgs/Images';

import './details.scss';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onChangeDateHandler = this.onChangeDateHandler.bind(this);
  }

  onChangeHandler(event) {
    this.props.onChangeNodeHandler(event);
  }

  onChangeDateHandler(property, datetime) {
    this.props.onChangeDateHandler(property, datetime);
  }

  render() {
    const node = toJS(this.props.node);
    let props = {};
    let img;
    const details = [];

    const deleteIcon = <span className="material-icons">delete_forever</span>;

    if (node.properties) {
      props = node.properties;
      img = (
        <img
          src={node.customImg ? node.customImg : Images.getImage(node.img)}
          alt={node.id}
          width="30"
        />
      );
    }

    for (const prop in props) {
      const header = (
        <div className="item-header">
          {prop}
          <span
            data-tooltip-id={`${prop}-tooltip`}
            className="material-icons"
            data-tooltip-content={props[prop].description}
          >
            info
          </span>
          <Tooltip id={`${prop}-tooltip`} />
        </div>
      );

      let control = (
        <div className="item" key={prop}>
          {header}
          <div className="item-value">{props[prop].value}</div>
        </div>
      );
      // If there is no type, we do not want to process. If a "control"
      // is defined, that indicates special handling of the value.
      if (props[prop].type && !props[prop].control) {
        switch (props[prop].type) {
          case 'number':
          case 'string':
            control = (
              <div className="item" key={prop}>
                {header}
                <div className="item-value">
                  <Text
                    name={prop}
                    value={props[prop].value}
                    onChange={this.onChangeHandler}
                  />
                </div>
              </div>
            );
            break;
          case 'dts':
            control = (
              <div className="item" key={prop}>
                {header}
                <div className="item-value">
                  <DateTime
                    name={prop}
                    selected={props[prop].value}
                    onChange={this.onChangeDateHandler}
                  />
                </div>
              </div>
            );
            break;
          case 'array':
            if (props[prop].vocab) {
              control = (
                <ArraySelector
                  vocab={props[prop].vocab}
                  key={prop}
                  field={prop}
                  value={props[prop].value}
                  description={props[prop].description}
                  onClickHandler={this.props.onClickArrayHandler}
                />
              );
            } else {
              // Get array subtype, possibly nested
              let refField = props[prop].items;
              if (Array.isArray(refField)) {
                refField = refField[0];
              }
              const ref = refField.$ref ? refField.$ref : refField.type;

              if (ref === '../common/dictionary.json' || ref === 'object') {
                control = (
                  <ObjectArray
                    node={node}
                    key={prop}
                    field={prop}
                    value={props[prop].value}
                    description={props[prop].description}
                    onClickAddObjectHandler={this.props.onClickAddObjectHandler}
                    onChangeObjectHandler={this.props.onChangeArrayObjectHandler}
                    onClickDeleteArrayObjectHandler={this.props.onClickDeleteArrayObjectHandler}
                    onClickDeleteArrayObjectPropertyHandler={
                    this.props.onClickDeleteArrayObjectPropertyHandler
                  }
                  />
                );
              } else {
                props[prop].control = 'listtextarea';
              }
            }
            break;
          case 'boolean':
            control = (
              <div className="item" key={prop}>
                {header}
                <div className="item-value">
                  <Boolean
                    name={prop}
                    selected={props[prop].value}
                    onClick={this.props.onClickBooleanHandler}
                  />
                </div>
              </div>
            );
            break;
          case '../common/dictionary.json':
          case 'object':
            control = (
              <GenericObject
                name={prop}
                value={props[prop].value}
                description={props[prop].description}
                key={uuid()}
                field={prop}
                onClickAddObjectHandler={
                  this.props.onClickAddGenericObjectHandler
                }
                onClickDeleteObjectHandler={
                  this.props.onClickDeleteGenericObjectHandler
                }
                onChangeHandler={this.props.onChangeGenericObjectHandler}
              />
            );
            break;
        }
      }

      if (props[prop].$ref && !props[prop].control) {
        switch (props[prop].$ref) {
          case '../common/identifier.json':
            control = (
              <div className="item" key={prop}>
                {header}
                <div className="item-value">
                  <Text
                    name={prop}
                    value={props[prop].value}
                    onChange={this.onChangeHandler}
                  />
                </div>
              </div>
            );
            break;
        }
      }

      switch (props[prop].control) {
        case 'hidden':
          control = '';
          break;
        case 'slider':
          control = (
            <div className="item slider" key={prop}>
              {header}
              <div className="item-value">
                <Slider
                  value={props[prop].value}
                  field={prop}
                  onChangeHandler={this.props.onChangeSliderHandler}
                />
              </div>
            </div>
          );
          break;
        case 'csv':
          control = (
            <div className="item" key={prop}>
              {header}
              <div className="item-value">
                <CSVInput
                  key={prop}
                  name={prop}
                  value={props[prop].value}
                  onChangeHandler={this.props.onChangeCSVHandler}
                />
              </div>
            </div>
          );
          break;
        case 'killchain':
          control = (
            <KillChain
              vocab={props[prop].vocab}
              node={node}
              key={prop}
              field={prop}
              value={props[prop].value}
              description={props[prop].description}
              onChangeHandler={this.props.onChangePhaseHandler}
              onClickRemoveHandler={this.props.onClickRemovePhaseHander}
            />
          );
          break;
        case 'externalrefs':
          control = (
            <ExternalReferences
              node={node}
              key={prop}
              field={prop}
              value={props[prop].value}
              description={props[prop].description}
              onClickAddObjectHandler={this.props.onClickAddObjectHandler}
              onChangeERHandler={this.props.onChangeERHandler}
              onClickDeleteERHandler={this.props.onClickDeleteERHandler}
              onClickDeletePropertyHandler={
                this.props.onClickDeletePropertyHandler
              }
            />
          );
          break;
        case 'stringselector':
          control = (
            <ArraySelector
              vocab={props[prop].vocab}
              key={prop}
              field={prop}
              value={props[prop].value}
              description={props[prop].description}
              onClickHandler={this.props.onClickArrayHandler}
            />
          );
          break;
        case 'textarea':
          control = (
            <div className="item" key={prop}>
              {header}
              <div className="item-value">
                <TextArea
                  name={prop}
                  value={props[prop].value}
                  onChange={this.onChangeHandler}
                />
              </div>
            </div>
          );
          break;
        case 'listtextarea':
          control = (
            <div className="item" key={prop}>
              {header}
              <div className="item-value">
                <CSVInput
                  key={prop}
                  name={prop}
                  value={props[prop].value}
                  onChangeHandler={this.props.onChangeCSVHandler}
                />
              </div>
            </div>
          );
          break;
        case 'genericobject':
          control = (
            <GenericObject
              name={prop}
              value={props[prop].value}
              description={props[prop].description}
              key={uuid()}
              field={prop}
              onClickAddObjectHandler={
                this.props.onClickAddGenericObjectHandler
              }
              onClickDeleteArrayObjectHandler={
                this.props.onClickDeleteGenericObjectHandler
              }
              onChangeHandler={this.props.onChangeGenericObjectHandler}
            />
          );
          break;
        case 'confirmtextarea':
          control = (
            <ConfirmTextarea
              name={prop}
              value={props[prop].value}
              description={props[prop].description}
              key={uuid()}
              field={prop}
              onClickAddTextHandler={this.props.onClickAddTextHandler}
            />
          );
          break;
      }

      details.push(control);
    }

    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="details">
          <div className="header">
            <div className="title">
              {img}
              {' '}
              {node.id}
            </div>
            <div className="delete" onClick={this.props.onClickDeleteHandler}>
              {deleteIcon}
              {' '}
              <span className="text">Delete</span>
            </div>
          </div>
          <div className="body">{details}</div>

          <div className="footer" />
        </div>
      </Panel>
    );
  }
} export default (observer(Details));
