import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-tooltip';

import './killchain.scss';

class KillChain extends React.Component {
  constructor(props) {
    super(props);

    this.onChangePhaseHandler = this.onChangePhaseHandler.bind(this);
    this.populatePhase = this.populatePhase.bind(this);
  }

  componentDidMount() {

  }

  onChangePhaseHandler(event) {
    const kcDomName = `kc-name-${this.props.node.id}`;
    const phaseDomName = `phase-${this.props.node.id}`;
    const kcIndex = document.getElementById(kcDomName).selectedIndex;
    const kcValue = document.getElementById(kcDomName)[kcIndex].value;
    const phaseValue = event.currentTarget.value;

    const value = {
      kill_chain_name: kcValue,
      phase_name: phaseValue,
    };

    this.props.onChangeHandler(this.props.field, value);

    document.getElementById(kcDomName).selectedIndex = 0;
    document.getElementById(phaseDomName).selectedIndex = 0;

    // Reset phase name so we don't keep adding the same values
    // multiple times.
    document.getElementById(phaseDomName).innerHTML = '';
    const option = document.createElement('option');
    option.value = 0;
    option.text = ' -- Select Phase -- ';
    document.getElementById(phaseDomName).add(option);
  }

  populatePhase(event) {
    const phaseDomName = `phase-${this.props.node.id}`;
    const phaseDOM = document.getElementById(phaseDomName);
    const kc = event.currentTarget.value;

    this.props.vocab.map((item) => {
      if (item.value === kc) {
        item.phases.map((phase) => {
          const option = document.createElement('option');
          option.value = phase.phase_name;
          option.text = phase.label;
          phaseDOM.add(option);
        });
      }
    });
  }

  render() {
    const vocab = this.props.vocab ? this.props.vocab : [];
    const { field, } = this.props;
    const value = this.props.value ? this.props.value : [];
    const { description, } = this.props;

    const kcName = `kc-name-${this.props.node.id}`;
    const phaseName = `phase-${this.props.node.id}`;

    return (
      <div className="kill-chain-container">
        <div className="kill-chain-header">
          {field}
          <span
            data-tooltip-id={`${field}-tooltip`}
            className="material-icons"
            data-tooltip-content={description}
          >
            info
          </span>
          <Tooltip id={`${field}-tooltip`} />
        </div>
        <div className="kill-chain-body">
          <div className="kill-chain-options">
            <select id={kcName} onChange={this.populatePhase}>
              <option value={0}> -- Select Kill Chain -- </option>
              {
                                vocab.map((item) => (
                                  <option
                                    key={item.value}
                                    value={item.value}
                                  >
                                    {item.label}
                                  </option>
                                ))
                            }
            </select>

            <select id={phaseName} onChange={this.onChangePhaseHandler}>
              <option value={0}> -- Select Phase -- </option>
            </select>
          </div>

          {
                        value.map((p, i) => (
                          <div key={i} className="kill-chain-row">
                            <div>
                              {p.kill_chain_name}
                              {' '}
                              -
                              {' '}
                              {p.phase_name}
                              {' '}
                              <span onClick={() => this.props.onClickRemoveHandler(field, p)} className="material-icons">highlight_off</span>
                            </div>
                          </div>
                        ))
                    }
        </div>
      </div>
    );
  }
} export default observer(KillChain);
