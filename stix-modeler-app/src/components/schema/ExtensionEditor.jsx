import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Tooltip } from 'react-tooltip';
import Panel from '../ui/panel/Panel';
import Images from '../../util/Images';

import ArraySelector from '../ui/inputs/ArraySelector';
import Boolean from '../ui/inputs/Boolean';
import CSVInput from '../ui/inputs/CSVInput';
import DateTime from '../ui/inputs/DateTime';
import ExternalReferences from '../ui/complex/ExternalReferences';
import FileSelector from '../ui/inputs/FileSelector';
import ObjectArray from '../ui/complex/ObjectArray';
import Slider from '../ui/inputs/Slider';
import Text from '../ui/inputs/Text';
import TextArea from '../ui/inputs/TextArea';


import '../details.scss';

class ExtensionEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeExtHandler = this.onChangeExtHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChangeDateHandler = this.onChangeDateHandler.bind(this);
  }

  onChangeExtHandler(event) {
    if (event.target.files && event.target.files[0]) {
      const value = URL.createObjectURL(event.target.files[0]);

      const mutatedEvent = {
        currentTarget: {
          name: 'customImg',
          value: value
        },
      };
      this.props.onChangeExtHandler(mutatedEvent);
      this.forceUpdate();
    }
  }

  onChangeHandler(event) {
    this.props.onChangeNodeHandler(event);
  }

  onChangeDateHandler(property, datetime) {
    this.props.onChangeDateHandler(property, datetime);
  }

  render() {
    const extension = toJS(this.props.extension);
    let props = {};
    let img;
    const details = [];

    const deleteIcon = <span className="material-icons">delete_forever</span>;

    if (!extension) return;

    props = extension.properties;
    if (extension.customImg !== undefined) {
      img = <img src={extension.customImg} alt="Custom" width="30" />;
    } else {
      img = <img src={Images.getImage(extension.img)} alt="Custom" width="30" />;
    }

    let header = (
      <div className="item-header">
        Update Icon
        <span
          data-tooltip-id="icon-tooltip"
          className="material-icons"
          data-tooltip-content="Set SDO icon to a local image"
        >
          info
        </span>
        <Tooltip id="icon-tooltip" />
      </div>
    );

    let control = (
      <div className="item" key="icon">
        {header}
        <FileSelector
          name="image"
          type="image/*"
          key="icon"
          multiple={false}
          onChange={this.onChangeExtHandler}
        />
      </div>
    );

    details.push(control);

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
                    required={props[prop].required}
                    onChange={this.onChangeHandler}
                  />
                </div>
              </div>
            );
            break;
          case 'timestamp':
            control = (
              <div className="item" key={prop}>
                {header}
                <div className="item-value">
                  <DateTime
                    name={prop}
                    selected={props[prop].value}
                    required={props[prop].required}
                    onTextChange={this.onChangeHandler}
                    onDateChange={this.onChangeDateHandler}
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
                  required={props[prop].required}
                  onClickHandler={this.props.onClickArrayHandler}
                />
              );
            } else {
              // Get array subtype, possibly nested
              let refField = props[prop].items;
              if (Array.isArray(refField)) {
                refField = refField[0];
              }
              const ref = refField.$ref ?? refField.type;

              if (ref.includes('dictionary.json') || ref === 'object') {
                control = (
                  <ObjectArray
                    node={extension}
                    key={prop}
                    field={prop}
                    value={props[prop].value}
                    description={props[prop].description}
                    required={props[prop].required}
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
                    required={props[prop].required}
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
                  required={props[prop].required}
                  onChangeHandler={this.props.onChangeSliderHandler}
                />
              </div>
            </div>
          );
          break;
        case 'externalrefs':
          control = (
            <ExternalReferences
              node={extension}
              key={prop}
              field={prop}
              value={props[prop].value}
              prefix="extension"
              description={props[prop].description}
              required={props[prop].required}
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
              required={props[prop].required}
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
                  required={props[prop].required}
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
                  required={props[prop].required}
                  onChangeHandler={this.props.onChangeCSVHandler}
                />
              </div>
            </div>
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
              {extension.id}
            </div>
            <div className="delete" onClick={this.props.onClickDeleteHandler}>
              {deleteIcon}
              {' '}
              <span className="text">Delete</span>
            </div>
          </div>
          <div className="body">
            {details}
          </div>

          <div className="footer" />
        </div>
      </Panel>
    );
  }
} export default (observer(ExtensionEditor));
