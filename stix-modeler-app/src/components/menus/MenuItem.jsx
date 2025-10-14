import React from 'react';
import { Tooltip } from 'react-tooltip';
import { observer } from 'mobx-react';

import './BottomMenu.scss';

class MenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.onDragStartHandler = this.onDragStartHandler.bind(this);
  }

  onDragStartHandler(event) {
    const id = this.props.generateNodeID(this.props.object.prefix);
    this.props.object.id = id;
    event.dataTransfer.setData('node', JSON.stringify(this.props.object));

    this.props.onDragStartHandler(event);
  }

  render() {
    const { object, } = this.props;

    return (
      <div>
        <span data-tooltip-id={`${object.title}-tooltip`} data-tooltip-content={object.title}>
          <div
            className="menu-item"
            draggable="true"
            onDragStart={this.onDragStartHandler}
          >
            <img src={this.props.image} alt={object.title} draggable="false" />

          </div>
        </span>
        <Tooltip id={`${object.title}-tooltip`} />
      </div>
    );
  }
} export default (observer(MenuItem));
