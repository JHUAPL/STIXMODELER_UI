import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './text.scss';

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.state = {
      value: [],
    };
  }

  componentDidMount() {
    if (this.props.hasInitialFocus) {
      this.focus();
    }
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  onKeyDownHandler(event) {
    if (event.keyCode === 13 && this.props.onReturn) {
      this.props.onReturn();
    } else if (event.keyCode === 27 && this.props.onEscape) {
      this.props.onEscape();
    }
  }

  onChangeHandler(event) {
    this.props.onChange(event);
  }

  render() {
    const {required, } = this.props;
    const { value, } = this.props;
    const invalid = required && !value.length;
    const warning = invalid? (<div className='required-warning'>This field is required</div>) : "";

    return (
      <div>
        <textarea
          name={this.props.name}
          ref={(c) => {
            this.input = c;
          }}
          autoComplete={this.props.autocomplete || 'off'}
          className={classNames({
            "def": true,
            "invalid":  invalid
          })}
          placeholder={this.props.placeholder}
          onChange={this.onChangeHandler}
          onKeyDown={(e) => this.onKeyDownHandler(e)}
          value={value}
          disabled={this.props.disabled}
          id={this.props.id}
        />
        {warning}
      </div>
    );
  }
} export default observer(TextArea);
