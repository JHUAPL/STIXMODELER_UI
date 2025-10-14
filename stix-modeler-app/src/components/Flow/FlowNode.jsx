import React from 'react';
import { Handle, Position } from 'reactflow';
import Images from '../../util/Images';
import classNames from 'classnames';

import './FlowNode.scss';

export default class FlowNode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { node, } = this.props.data;
    let display = node.id.split('--')[0];

    let cls = classNames({
      'node-item': true,
      'selected': node.selected,
    });

    let labelCls = classNames({
      "node-label": true,
    })

    if (node.properties.name && node.properties.name.value) {
      display = node.properties.name.value;
    }
    return (
      <>
        <div className={cls}
          style={{
            backgroundImage: `url(${node.customImg ? node.customImg : Images.getImage(node.img)})`,
          }}
        />
        <Handle
          className="centerHandle"
          id="center"
          type="source"
          isConnectable={this.props.isConnectable}
        />
        <Handle
          position={Position.Left}
          id="left"
          type="source"
          isConnectable={this.props.isConnectable}
        />
        <Handle
          position={Position.Right}
          id="right"
          type="source"
          isConnectable={this.props.isConnectable}
        />
        <Handle
          position={Position.Top}
          id="top"
          type="source"
          isConnectable={this.props.isConnectable}
        />
        <Handle
          position={Position.Bottom}
          id="bottom"
          type="source"
          isConnectable={this.props.isConnectable}
        />

        <div className={labelCls}>
          {display}
        </div>
      </>
    );
  }
}
