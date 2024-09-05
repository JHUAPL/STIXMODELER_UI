import React from 'react';
import { observer } from 'mobx-react';

import './fileselector.scss';

class FileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(event) {
    this.props.onChange(event);
  }

  render() {
    return (
      <div>
        <input
          className="def custom-file-selector"
          type="file"
          id="file-selector"
          name="file"
          multiple={this.props.multiple}
          accept={this.props.type}
          onChange={this.onChangeHandler}
        />
      </div>
    );
  }
} export default observer(FileSelector);
