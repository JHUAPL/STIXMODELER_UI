import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';
import Text from '../inputs/Text';

import './genericobject.scss';

class GenericObject extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeSelectHandler = this.onChangeSelectHandler.bind(this);
    this.onChangeInputHandler = this.onChangeInputHandler.bind(this);
    this.onClickAddObjectHandler = this.onClickAddObjectHandler.bind(this);
    this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this);
    this.onClickCreateBlankHandler = this.onClickCreateBlankHandler.bind(this);

    this.state = {
      key: this.props.vocab? this.props.vocab[0] : '',
      value: '',
    };
  }

  onChangeInputHandler(event) {
    event.preventDefault();

    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  onChangeSelectHandler(event) {
    event.preventDefault();
    const key = document.getElementById(`select-${this.props.field}`).value;
    this.setState({
      "key": key
    });
  }

  onClickDeleteHandler(select, idx) {
    this.props.onClickDeleteObjectHandler(select, idx);
  }

  onClickCreateBlankHandler() {
    this.setState({
      key: '',
      value: '',
    });
  }

  onClickAddObjectHandler() {
    const o = {};

    o[this.state.key] = this.state.value;

    this.props.onClickAddObjectHandler(this.props.field, o);
  }

  render() {
    const { field, } = this.props;
    const { vocab, } = this.props;
    const value = this.props.value ?? {};
    const { description, } = this.props;
    const {required, } = this.props;
    const rows = [];
    const invalid = required && !Object.keys(value).length;
    const warning = invalid? (<div className='required-warning'>This field is required</div>) : "";

    for (const key in value) {
      rows.push(
        <ExtBlocks
          key={uuid()}
          v={value[key]}
          k={key}
          field={field}
          onClickDeleteHandler={this.onClickDeleteHandler}
        />
      );
    }

    let selector;
    if (vocab && vocab.length) {
      selector = (
        <select id={`select-${field}`} defaultValue={vocab[0]} onChange={this.onChangeSelectHandler}>
        {vocab.map((key) => (
          <option id={key} value={key}>
            {key}
          </option>
        ))}
       </select>
      );
    } else {
      selector = (
        <Text name="key" value={this.state.key} onChange={this.onChangeInputHandler} />
      );
    }



    return (
      <div className="go-container">
        <div className="go-header">
          {field}
          <span
            data-tooltip-id={`${field}-tooltip`}
            className="material-icons"
            data-tooltip-content={description}
          >
            info
          </span>
          <Tooltip id={`${field}-tooltip`} />
        </div>
        <div className={classNames({
          "go-body": true,
          "invalid":  invalid
        })}>

          <div className="go-block-input">
            <div className="input">
              {selector}
            </div>
            <div className="input">
              <Text name="value" value={this.state.value} onChange={this.onChangeInputHandler} />
            </div>
            <div className="add-container">
              <span onClick={this.onClickAddObjectHandler} className="add material-icons">control_point</span>
            </div>
          </div>

          {rows}
        </div>
        {warning}
      </div>
    );
  }
} export default observer(GenericObject);

function ExtBlocks(props) {
  let { v, } = props;

  if (typeof props.v === 'object') {
    v = JSON.stringify(props.v);
  }

  return (
    <div className="go-block">
      <div className="go-block-row">
        {props.k}
        :
        {' '}
        {v}
        {' '}
        <span onClick={() => props.onClickDeleteHandler(props.field, props.k)} className="remove material-icons">highlight_off</span>
      </div>
    </div>
  );
}
