'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';


export default class InitialPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reportingOptions: [
        { key: 'individual', text: "Individual", value: 'individual' },
        { key: 'group', text: "Group", value: 'group' },
        { key: 'virtualGroup', text: "Virtual Group", value: 'virtualGroup' },
        { key: 'mips-apms', text: "MIPS APMs", value: 'mips-apms' }
      ],
      practiceOptions: [
        { key: 'small', text: "Small Practice (1-15 eligible clinicians)", value: 'small' },
        { key: 'large', text: "Large Practice (>15 eligible clinicians)", value: 'large' }
      ],
      reporting: props.getStore().initialPage.reporting,
      practice: props.getStore().initialPage.practice,
      initialPage: props.getStore().initialPage

    };
    this.handleReportingChange = this.handleReportingChange.bind(this);
    this.handlePracticeChange = this.handlePracticeChange.bind(this);

  }

  componentDidMount() { }

  componentWillUnmount() { }

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleReportingChange = (event, data) => {
    this.setState({ reporting: data.value })
    let initialPage = this.state.initialPage
    initialPage.reporting = data.value
    this.setState({ initialPage: initialPage })
    this.props.updateStore({
      initialPage: initialPage,
      // measure:data.value,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
  }

  handlePracticeChange = (event, data) => {
    this.setState({ practice: data.value })
    let initialPage = this.state.initialPage
    initialPage.practice = data.value
    this.setState({ initialPage: initialPage })
    this.props.updateStore({
      initialPage: initialPage,
      // measure:data.value,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
  }

  render() {
    return (
      <div>
        <p className="text-center"><b>MIPS Score Calculator</b> - Calculates MIPS Score on a 100 points scale based on the Quality, Promoting Interoperability and
  
  Improvement Activities.
</p>
        <div className="form-row">
          <div className="form-group col-5 offset-1">
            <span className="title-small">Type of Reporting</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.reportingOptions}
              placeholder='Type of Reporting'
              search
              selection
              fluid
              value={this.state.reporting}
              onChange={this.handleReportingChange}
            />
          </div>
          <div className="form-group col-5">
            <span className="title-small">Type of Practice</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.practiceOptions}
              placeholder='Type of Practice'
              search
              selection
              fluid
              value={this.state.practice}
              onChange={this.handlePracticeChange}
            />

          </div>
        </div>
      </div>
    )
  }
}