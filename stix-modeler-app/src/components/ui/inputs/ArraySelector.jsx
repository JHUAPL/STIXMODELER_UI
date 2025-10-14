import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Tooltip } from 'react-tooltip';

import './arrayselector.scss';

class ArraySelector extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickHandler(field, value) {
    this.props.onClickHandler(field, value);
  }

  render() {
    const items = this.props.vocab ? this.props.vocab : [];
    const { field, } = this.props;
    const { value, } = this.props ?? [];
    const { description, } = this.props;
    const { required, } = this.props;
    const invalid = required && !value.length;
    const warning = invalid? (<div className='required-warning'>This field is required</div>) : "";

    let cls = classNames({
      'array-container-item': true,
    });

    return (
      <div className="array-container">
        <div className="array-container-header">
          {field}
          {' '}
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
          "array-container-body": true,
          "invalid":  invalid
        })}>
          {items.map((item, i) => {
            if (value && value.indexOf(item) > -1) {
              cls = classNames({
                'array-container-item': true,
                'array-container-selected': true,
              });
            } else {
              cls = classNames({
                'array-container-item': true,
              });
            }
            return (
              <div
                className={cls}
                key={i}
                onClick={() => this.onClickHandler(field, item)}
              >
                {item}
              </div>
            );
          })}
        </div>
        {warning}
      </div>
    );
  }
} export default observer(ArraySelector);
