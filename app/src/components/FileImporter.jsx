import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';
import Panel from './ui/panel/Panel';
import FileSelector from './ui/inputs/FileSelector';

import './details.scss';

class FileImporter extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSchemaHandler = this.onChangeSchemaHandler.bind(this);
    this.onChangeBundleHandler = this.onChangeBundleHandler.bind(this);
  }

  async onChangeSchemaHandler(event) {
    if (event.target.files && event.target.files[0]) {
      const files = Array.from(event.target.files);
      files.map((file) => {
        const fr = new FileReader();
        fr.readAsText(file, 'UTF-8');
        fr.onload = (e) => {
          const { result, } = e.target;
          this.props.onChangeSchemaHandler(result);
        };
      });
    }
  }

  async onChangeBundleHandler(event) {
    if (event.target.files && event.target.files[0]) {
      const files = Array.from(event.target.files);
      files.map((file) => {
        const fr = new FileReader();
        fr.readAsText(file, 'UTF-8');
        fr.onload = (e) => {
          const { result, } = e.target;
          this.props.onChangeBundleHandler(result);
        };
      });
    }
  }

  render() {
    const details = [];

    let header = (
      <div className="item-header">
        Import Schemas
        <span
          data-tooltip-id="schema-tip"
          data-tooltip-content="Import custom schema objects from file"
          className="material-icons"
        >
          info
        </span>
        <Tooltip id="schema-tip" />
      </div>
    );

    let control = (
      <div className="item" key="schemas">
        {header}
        <FileSelector
          name="schemas"
          type=".json"
          multiple
          onChange={this.onChangeSchemaHandler}
        />
      </div>
    );

    details.push(control);

    header = (
      <div className="item-header">
        Import Bundle
        <span
          data-tooltip-id="file-tooltip"
          data-tooltip-content="Import STIX Bundle from file"
          className="material-icons"
        >
          info
        </span>
        <Tooltip id="file-tooltip" />
      </div>
    );

    control = (
      <div className="item" key="bundle">
        {header}
        <FileSelector
          name="bundle"
          type=".json"
          multiple={false}
          onChange={this.onChangeBundleHandler}
        />
      </div>
    );

    details.push(control);

    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="details">
          <div className="body">{details}</div>
          <div className="footer" />
        </div>
      </Panel>
    );
  }
} export default (observer(FileImporter));
