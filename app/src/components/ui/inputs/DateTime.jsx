import React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './datetime.scss';

export default class DateTime extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(datetime) {
    this.props.onChange(this.props.name, datetime);
  }

  render() {
    let dts = this.props.selected;

    if (typeof dts === 'string') {
      const dateObj = new Date(dts);
      dts = dateObj;
    }

    return (
      <DatePicker selected={dts} onChange={this.onChange} name={this.props.name} />
    );
  }
}
