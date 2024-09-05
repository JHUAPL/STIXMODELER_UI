import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';
import Text from '../inputs/Text';
import './externalreferences.scss';

class ObjectArray extends React.Component {
  constructor(props) {
    super(props);

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onChangeArrayObjectHandler = this.onChangeArrayObjectHandler.bind(this);
    this.onClickDeleteObjectHandler = this.onClickDeleteObjectHandler.bind(this);
    this.onClickAddHandler = this.onClickAddHandler.bind(this);
    this.onClickDeletePropertyHandler = this.onClickDeletePropertyHandler.bind(this);
  }

  componentDidMount() {}

  onChangeArrayObjectHandler(event, value) {
    return undefined;
  }

  onClickAddHandler(input, field, idx) {
    this.props.onChangeObjectHandler(
      input.value,
      field.value,
      idx,
      this.props.field
    );
    field.value = '';
    input.value = '';
  }

  onClickHandler() {
    return undefined;
  }

  onClickDeletePropertyHandler(select, idx) {
    this.props.onClickDeleteArrayObjectPropertyHandler(select, idx, this.props.field);
  }

  onClickDeleteObjectHandler(idx, property) {
    this.props.onClickDeleteArrayObjectHandler(idx, property);
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
            className="material-icons"
            data-tooltip-content={description}
          >
            info
          </span>
          <span
            data-tooltip-id={`add-${field}-tooltip`}
            data-tooltip-content={`Add to ${field}`}
            onClick={() => this.props.onClickAddObjectHandler(field, [])}
            className="add material-icons"
          >
            control_point
          </span>
          <Tooltip id={`${field}-tooltip`} />
          <Tooltip id={`add-${field}-tooltip`} />
        </div>
        <div className="er-body">
          {value.map((p, i) => (
            <ObjectBlock
              key={i}
              i={i}
              kv={p}
              field={field}
              onChangeArrayObjectHandler={this.onChangeArrayObjectHandler}
              onClickDeleteObjectHandler={this.onClickDeleteObjectHandler}
              onClickAddHandler={this.onClickAddHandler}
              onClickDeletePropertyHandler={this.onClickDeletePropertyHandler}
            />
          ))}
        </div>
      </div>
    );
  }
} export default observer(ObjectArray);

function ObjectBlock(props) {
  const blocks = [];
  const idx = props.i;
  const fieldID = `field-${props.i}`;
  const inputID = `input-${props.i}`;
  const { field, } = props;

  for (const item in props.kv) {
    let remove = (
      <span
        onClick={() => props.onClickDeletePropertyHandler(item, props.i)}
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

        <Text id={fieldID} onChange={props.onChangeArrayObjectHandler} />
        <Text id={inputID} onChange={props.onChangeArrayObjectHandler} />
        <span
          className="add material-icons"
          onClick={() => props.onClickAddHandler(
            document.getElementById(inputID),
            document.getElementById(fieldID),
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
          onClick={() => props.onClickDeleteObjectHandler(idx, field)}
        >
          highlight_off
        </span>
      </div>
    </div>
  );
}
