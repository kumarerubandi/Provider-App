'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Config from '../globalConfiguration.json';
import Client from 'fhir-kit-client';

var smart = new Client({ baseUrl: Config.provider.fhir_url });

export default class InitialPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reportingOptions: [
        { key: 'individual', text: "Individual", value: 'individual' },
        { key: 'group', text: "Group (and virtual group) ", value: 'group' },
        { key: '', text: "Third Party", value: 'thirdparty' }
      ],
      practiceOptions: [
        { key: 'small', text: "No. of Clinicians <= 15 ", value: 'small' },
        { key: 'medium', text: "No. of Clinicians > 15 ", value: 'medium' },
        { key: 'large', text: "No. of Clinicians > 25 ", value: 'large' }
      ],
      purposeOptions: [
        { key: 'data', value: 'data', text: 'Data Submission Only' },
        { key: 'score', value: 'score', text: 'Score Calculation Only' },
        { key: 'both', value: 'both', text: 'Both' },
      ],
      submissionTypeOptions: [
        { key: 'direct', text: "Direct", value: 'direct' },
        { key: 'upload', text: "Log in and Upload", value: 'upload' },
        { key: 'partb', text: "Medicare Part B claims", value: 'partb' }
      ],
      reporting: props.getStore().initialPage.reporting,
      practice: props.getStore().initialPage.practice,
      initialPage: props.getStore().initialPage,
      purpose: props.getStore().initialPage.purpose,
      patients: props.getStore().initialPage.patients
    };
    this.handleReportingChange = this.handleReportingChange.bind(this);
    this.handlePracticeChange = this.handlePracticeChange.bind(this);
    this.handlePurposeChange = this.handlePurposeChange.bind(this);
    this.handleSubTypeChange = this.handleSubTypeChange.bind(this);
  }

  componentDidMount() {
    smart.search({ resourceType: 'Patient', searchParams: { _count: '10000' } })
      .then((response) => {
        this.setState({ patients: response.entry });
        let initialPage = this.state.initialPage
        initialPage.patients = response.entry;
        this.setState({ initialPage: initialPage })
        this.props.updateStore({
          initialPage: initialPage
        });
      });
  }

  nextStep() {
    console.log("step---",sessionStorage.getItem("step"));
    if (this.state.purpose === "data") {
      this.props.jumpToStep(4);
    } else {
      this.props.jumpToStep(1);
    }
  }
  componentWillUnmount() { }

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleReportingChange = (event, data) => {
    this.setState({ reporting: data.value })
    let initialPage = this.state.initialPage
    initialPage.reporting = data.value
    this.setState({ initialPage: initialPage })
    this.props.updateStore({
      initialPage: initialPage
    });
  }

  handlePracticeChange = (event, data) => {
    this.setState({ practice: data.value })
    if (data.value === "large") {
      let submissionTypeOptions = [
        { key: 'direct', text: "Direct", value: 'direct' },
        { key: 'upload', text: "Log in and Upload", value: 'upload' },
        { key: 'cms', text: "CMS Web Interface", value: 'cms' },
      ];
      this.setState({ submissionTypeOptions });
    } else {
      let submissionTypeOptions = [
        { key: 'direct', text: "Direct", value: 'direct' },
        { key: 'upload', text: "Log in and Upload", value: 'upload' },
        { key: 'partb', text: "Medicare Part B claims", value: 'partb' }
      ];
      this.setState({ submissionTypeOptions });
    }
    let initialPage = this.state.initialPage
    initialPage.practice = data.value
    this.setState({ initialPage: initialPage })
    this.props.updateStore({
      initialPage: initialPage
    });
  }


  handleSubTypeChange = (event, data) => {
    this.setState({ submissionType: data.value })
    let initialPage = this.state.initialPage
    initialPage.submissionType = data.value
    this.setState({ initialPage: initialPage })
    this.props.updateStore({
      initialPage: initialPage
    });
  }

  handlePurposeChange = (event, data) => {
    this.setState({ purpose: data.value })
    let initialPage = this.state.initialPage
    initialPage.purpose = data.value
    this.setState({ initialPage: initialPage })
    this.props.updateStore({
      initialPage: initialPage
    });
  }

  render() {
    return (
      <div>
        <div className="form-row ">
          <div className="form-group col-5 offset-1">
            <span className="title-small">Purpose</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.purposeOptions}
              placeholder='Purpose'
              search
              selection
              fluid
              value={this.state.purpose}
              onChange={this.handlePurposeChange}
            />
          </div>
          <div className="form-group col-5">
            <span className="title-small">Submission Type</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.submissionTypeOptions}
              placeholder='Submission Type'
              search
              selection
              fluid
              value={this.state.submissionType}
              onChange={this.handleSubTypeChange}
            />
          </div>
        </div>
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
          {this.state.reporting === "group" &&
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
          }
        </div>
        <div class="footer-buttons">
          <button type="button" class="btn btn-prev btn-primary btn-lg pull-right" id="next-button" onClick={() => this.nextStep()}>Next</button>
        </div>
      </div>
    )
  }
}