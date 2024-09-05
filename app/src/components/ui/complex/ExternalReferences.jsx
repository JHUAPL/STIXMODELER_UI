import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';
import Text from '../inputs/Text';

import './externalreferences.scss';

class ExternalReferences extends React.Component {
  constructor(props) {
    super(props);

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onChangeERHandler = this.onChangeERHandler.bind(this);
    this.onClickDeleteERHandler = this.onClickDeleteERHandler.bind(this);
    this.onClickAddHandler = this.onClickAddHandler.bind(this);
    this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this);
  }

  componentDidMount() {}

  onChangeERHandler(event, value) {
    return undefined;
  }

  onClickAddHandler(input, select, idx) {
    this.props.onChangeERHandler(
      input.value,
      select.options[select.selectedIndex].value,
      idx
    );
    input.value = '';
  }

  onClickHandler() {
    return undefined;
  }

  onClickDeleteHandler(select, idx) {
    this.props.onClickDeletePropertyHandler(select, idx);
  }

  onClickDeleteERHandler(idx) {
    this.props.onClickDeleteERHandler(idx);
  }

  render() {
    const { field, } = this.props;
    const value = this.props.value ? this.props.value : [];
    const { description, } = this.props;

    return (
      <div className="er-container">
        <div className="er-header">
          {field}
          <span
            data-tooltip-id={`${field}-tooltip`}
            data-tooltip-content={description}
            className="material-icons"
          >
            info
          </span>
          <span
            data-tooltip-id={`${field}-control-tooltip`}
            data-tooltip-content="Add an External Reference"
            onClick={() => this.props.onClickAddObjectHandler(field, ['source_name'])}
            className="add material-icons"
          >
            control_point
          </span>
          <Tooltip id={`${field}-tooltip`} />
          <Tooltip id={`${field}-control-tooltip`} />
        </div>
        <div className="er-body">
          {value.map((p, i) => (
            <ReferenceBlock
              key={i}
              i={i}
              kv={p}
              onChangeERHandler={this.onChangeERHandler}
              onClickDeleteERHandler={this.onClickDeleteERHandler}
              onClickAddHandler={this.onClickAddHandler}
              onClickDeleteHandler={this.onClickDeleteHandler}
            />
          ))}
        </div>
      </div>
    );
  }
} export default observer(ExternalReferences);

function ReferenceBlock(props) {
  const blocks = [];
  const idx = props.i;
  const selectID = `select-${props.i}`;
  const inputID = `input-${props.i}`;

  const propValues = [
    'source_name',
    'description',
    'url',
    'hashes',
    'external_id'
  ];

  for (const item in props.kv) {
    let remove = (
      <span
        onClick={() => props.onClickDeleteHandler(item, props.i)}
        className="remove material-icons"
      >
        highlight_off
      </span>
    );

    if (item === 'source_name') {
      remove = undefined;
    }

    blocks.push(
      <div key={uuid()} className="er-block-row">
        <div>
          {item}
          :
          {JSON.stringify(props.kv[item])}
          {' '}
          {remove}
        </div>
      </div>
    );
  }

  return (
    <div className="er-block">
      <div className="er-block-row">
        <select id={selectID}>
          {propValues.map((prop) => (
            <option key={uuid()} value={prop}>
              {prop}
            </option>
          ))}
        </select>
        <Text id={inputID} onChange={props.onChangeERHandler} />
        <span
          className="add material-icons"
          onClick={() => props.onClickAddHandler(
            document.getElementById(inputID),
            document.getElementById(selectID),
            props.i
          )}
        >
          control_point
        </span>
      </div>
      {blocks}
      <div className="er-block-row">
        <span
          className="remove remove-er material-icons"
          onClick={() => props.onClickDeleteERHandler(idx)}
        >
          highlight_off
        </span>
      </div>
    </div>
  );
}
