import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './growl.scss';

class Growl extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickHideHandler() {
    if (this.props.onClickHideHandler) {
      this.props.onClickHideHandler();
    } else {
      console.warn('No JSON Viewer close handler');
    }
  }

  onClickPanelHandler(event) {
    event.stopPropagation();
  }

  render() {
    const cls = classNames({
      growl: true,
      'hide-mask': !this.props.show,
    });

    if (this.props.timer) {
      this.props.timer();
    }

    return (
      <div className={cls}>
        <div className="panel">
          {this.props.message}
        </div>
      </div>
    );
  }
} export default (observer(Growl));
