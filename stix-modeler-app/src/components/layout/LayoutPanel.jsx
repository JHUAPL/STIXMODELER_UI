import React from 'react';
import { inject, observer } from 'mobx-react';
import Panel from '../ui/panel/Panel';
import RadioGroup from '../ui/inputs/RadioGroup';
import OrientationRadioGroup from '../ui/inputs/OrientationRadioGroup';

import '../layout/LayoutPanel.scss';

class LayoutPanel extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appStore;    
    this.store.setNodeTypes(["campaign", "identity"]);
    this.layoutMethod = this.store.getLayoutMethod();
    this.state = {
      horizontalSpacing: '',
      verticalSpacing: '',
    };
  }

  handleLayoutChange = (newLayoutMethod) => {
    this.store.setLayoutMethod(newLayoutMethod); // Update store
    this.store.setNodeLayout(); // Redraw graph
  };
  
  handleOrientationChange = (newOrientation) => {
    this.store.setOrientation(newOrientation); // Update store
    this.store.setNodeLayout(); // Redraw graph
  } 

  handleHorizontalSpacingChange = (event) => {
    const newValue = event.target.value;
    this.store.setHorizontalSpacing(newValue);
    this.store.setNodeLayout(); // Redraw graph
  };

  handleVerticalSpacingChange = (event) => {
    const newValue = event.target.value;
    this.store.setVerticalSpacing(newValue);
    this.store.setNodeLayout(); // Redraw graph
  };

  handleAlignDistributeClick = (action) => {
    this.store.setAlignmentOrDistribution(action); // Store action type
    // this.store.updateNodeLayout(); // Apply layout changes
  };

  render() {
    return (
      <Panel
        show={this.props.show}
        onClickHideHandler={this.props.onClickHideHandler}
      >
        <div className="layout-panel">
          <div className="header">Layout Panel</div>
          <div className="content">
          <RadioGroup 
            // defaultLayoutMethod={this.store.getLayoutMethod()} 
            defaultLayoutMethod={""} 
            onLayoutChange={this.handleLayoutChange} 
          />
          <OrientationRadioGroup 
            defaultOrientation={this.store.getOrientation()} 
            onOrientationChange={this.handleOrientationChange} 
          />
            <hr />
            <p>Node Default Spacing Options (pixels)</p>
              <div className="spacing-input">
                <label htmlFor="horizontalSpacing">Horizontal Spacing:</label>
                <input
                  type="text"
                  id="horizontalSpacing"
                  value={this.store.getHorizontalSpacing()}
                  onChange={this.handleHorizontalSpacingChange}
                />
              </div>
              <div className="spacing-input">
                <label htmlFor="verticalSpacing">Vertical Spacing:</label>
                <input
                  type="text"
                  id="verticalSpacing"
                  value={this.store.getVerticalSpacing()}
                  onChange={this.handleVerticalSpacingChange}
                />
              </div>
            
          </div>
        </div>
      </Panel>
    );
  }
} 

export default inject('store')(observer(LayoutPanel));
