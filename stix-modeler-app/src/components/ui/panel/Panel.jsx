import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import './panel.scss';

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.onClickHideHandler = this.onClickHideHandler.bind(this);
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
      mask: true,
      'hide-mask': !this.props.show,
    });

    return (
      <div className={cls} onClick={this.onClickHideHandler}>
        <div className="panel" onClick={this.onClickPanelHandler}>
          {this.props.children}
        </div>
      </div>
    );
  }
} export default (observer(Panel));
