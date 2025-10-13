import React from 'react';
import { observer } from 'mobx-react';
import Text from './Text';

import './csvselector.scss';

class CSVInput extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickHandler(field, value) {
    this.props.onClickHandler(field, value);
  }

  render() {
    const value = this.props.value ?? "";

    return (
      <Text
        name={this.props.name}
        value={value}
        required={this.props.required}
        onChange={this.props.onChangeHandler}
      />
    );
  }
} export default observer(CSVInput);
