import React from 'react';
import { observer } from 'mobx-react';
import Text from './Text';

import './csvselector.scss';

class CSVInput extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  onClickHandler(field, value) {
    this.props.onClickHandler(field, value);
  }

  render() {
    const value = this.props.value ? this.props.value.join() : '';

    return (
      <Text
        name={this.props.name}
        value={value}
        onChange={this.props.onChangeHandler}
      />
    );
  }
} export default observer(CSVInput);
