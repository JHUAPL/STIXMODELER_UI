import React from 'react';
import { Handle, Position } from 'reactflow';
import Images from '../../imgs/Images';

import './FlowNode.scss';

export default class FlowNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  render() {
    const { node, } = this.props.data;
    let display = node.id.split('--')[0];
    const border = node.selected ? 'solid 1px blue' : '';
    if (node.properties.name && node.properties.name.value) {
      display = node.properties.name.value;
    }
    return (
      <>
        <div
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundSize: 'contain',
            backgroundImage: `url(${node.customImg ? node.customImg : Images.getImage(node.img)})`,
            backgroundRepeat: 'no-repeat',
            border: `${border}`,
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

        <div className="nodeLabel">
          {display}
        </div>
      </>
    );
  }
}
