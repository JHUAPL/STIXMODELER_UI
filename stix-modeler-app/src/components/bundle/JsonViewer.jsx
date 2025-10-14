import React from 'react';
import { observer } from 'mobx-react';
import Panel from '../ui/panel/Panel';
import Button from '../ui/button/Button';

import './JsonViewer.scss';

class JsonViewer extends React.Component {
  constructor(props) {
    super(props);

    this.onClickCopyJSONHandler = this.onClickCopyJSONHandler.bind(this);
  }

  onClickCopyJSONHandler() {
    const range = document.createRange();
    const message = 'JSON Copied to Clipboard';

    range.selectNode(
      document.getElementById('json-content')
    );

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');

    window.getSelection().removeAllRanges();

    this.props.onClickShowGrowlHandler(message);
  }

  render() {
    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="json-viewer">
          <div className="json-content">
            <pre id="json-content">{this.props.json}</pre>
          </div>

          <div className="json-controls">
            <Button cls="def standard json-copy" text="Copy" onClick={this.onClickCopyJSONHandler}>
              <i className="material-icons">file_copy</i>
            </Button>
          </div>
        </div>
      </Panel>
    );
  }
} export default (observer(JsonViewer));
