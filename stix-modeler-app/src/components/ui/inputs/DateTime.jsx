import React from 'react';
import DatePicker from 'react-datepicker';

import Text from './Text.jsx';

import 'react-datepicker/dist/react-datepicker.css';
import './datetime.scss';

export default class DateTime extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(datetime) {
    this.props.onDateChange(this.props.name, datetime);
  }

  render() {
    let dts = this.props.selected;
    let control = (<Text
      name={this.props.name} value={dts} required={this.props.required}
      onChange={this.props.onTextChange}
    />);


    if (typeof dts === 'string') {
      const dateObj = new Date(dts);
      if (isNaN(dateObj.getTime())) {
        return control;
      } else {
        dts = dateObj;
      }
    }

    return (
      <DatePicker selected={dts} onChange={this.onChange} name={this.props.name} />
    );
  }
}
