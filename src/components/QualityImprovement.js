'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';



export default class QualityImprovement extends Component {
  constructor(props) {
    super(props);

    this.state = {
        collectionType:'',
        measure:'',
        measureList:[],
        collectionTypeOptions:[
      { key: 'e-Prescribing', text: 'e-Prescribing', value: 'e-Prescribing'},
      { key: 'health_information_exchange', text: 'Health Information exchange', value: 'health_information_exchange'},
      { key: 'provider_patient_exchange', text: 'Provider to Patient Exchange', value: 'provider_patient_exchange'},
      { key: 'public_health_clinical_data_exchange', text: 'Public Health and Clinical Data Exchange', value: 'public_health_clinical_data_exchange'},
      { key: 'protect_patient_health_information ', text: 'Protect Patient Health Information', value: 'Protect_patient_health_information'},
      { key: 'eCQMs', text: 'eCQMs (EHR measures or electronic Clinical Quality Measures)', value: 'eCQMs' },
      { key: 'MIPS-CQMs', text: 'MIPS CQMs (previously known as Registry measures)', value: 'MIPSCQMs' },
      { key: 'QCDR', text: 'QCDR measures', value: 'QCDR'},
      { key: 'Claims_measures', text: 'Claims measures (available only to small practices of 1-15 eligible clinicians submitting as individuals, groups, or virtual groups)', value: 'Claims_measures'},
      { key: 'CAHPS', text: 'CAHPS for MIPS survey (available only to groups)', value: 'CAHPS'},
      { key: 'CMS', text: 'CMS Web Interface measures (available only to groups of 25 or more)', value: 'CMS'},
    ],
    measureOptions:[],
    measures:[{ key: 'e-Prescribing', text: 'e-Prescribing ', value: 'e-Prescribing' ,category:'e-Prescribing'},
      { key: 'pdmp', text: 'Query of prescription Drug Monitoring Program(PDMP)', value: 'Query of prescription Drug Monitoring Program(PDMP)',category:'e-Prescribing' },
      { key: 'ota', text: 'Verify Opioid Treatment Agreement', value: 'Verify Opioid Treatment Agreement',category:'e-Prescribing' },
      { key: 'electronic_referral_loops_sending', text: 'Support Electronic Referral Loops By Sending Health Information Exclusion', value: 'Support Electronic Referral Loops By Sending Health Information Exclusion',category:"health_information_exchange"},
      { key: 'electronic_referral_loops_receiving', text: 'Support Electronic Referral Loops By Receiving and Incorporating Health Information Exclusion', value: 'Support Electronic Referral Loops By Receiving and Incorporating Health Information Exclusion',category:"health_information_exchange"},
      { key: 'patient_electronic_access', text: 'Provide Patients Electronic Access to Their Health Information', value: 'Provide Patients Electronic Access to Their Health Information',category:'provider_patient_exchange'},
      { key: 'immunization_registry_reporting', text: 'Immunization Registry Reporting', value: 'Immunization Registry Reporting',category:'public_health_clinical_data_exchange'},
      { key: 'public_health_registry_reporting', text: 'Public Health Registry Reporting', value: 'Public Health Registry Reporting',category:'public_health_clinical_data_exchange'},
      { key: 'syndromic_surveillance_reporting', text: 'Syndromic Surveillance Reporting', value: 'Syndromic Surveillance Reporting',category:'public_health_clinical_data_exchange'},
      { key: 'electronic_case_reporting', text: 'Electronic Case Reporting', value: 'Electronic Case Reporting',category:'public_health_clinical_data_exchange'},
      { key: 'clinical_data_registry_reporting', text: 'Clinical Data Registry Reporting', value: 'Clinical Data Registry Reporting',category:'public_health_clinical_data_exchange'},
      { key: 'security_risk_analysis', text: 'Security Risk Analysis', value: 'Security Risk Analysis',category:'protect_patient_health_information'},
    ],
    };
    this.handleCollectionTypeChange = this.handleCollectionTypeChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);

  }

  componentDidMount() {}

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleCollectionTypeChange = (event, data) => {
    this.setState({ collectionType: data.value })
    var arr =[]
    for(var i =0;i<this.state.measures.length;i++){
      if(data.value ===this.state.measures[i].category){
        arr.push(this.state.measures[i])
      }
    }
    this.setState({measureOptions:arr})
  }
  handleMeasureChange = (event,data) => {
    this.setState({ measure: data.value })
  }
  clearMeasure(index){
    let measureList = this.state.measureList
    if (index !== -1) {
      measureList.splice(index, 1);
      this.setState({measureList: measureList});
    }
  }
  addMeasure(){
    if(!this.state.measureList.includes(this.state.measure)){
      this.setState(prevState => ({
        measureList: [...prevState.measureList, this.state.measure]
      }))
    }
    
    
  }
  render() {
    return (
    //   <div className="step step1">
    //     <div className="row">
    //       <form id="Form" className="form-horizontal">
    //         <div className="form-group">
    //           <label className="col-md-12 control-label">
    //             <h1>Step 1: Welcome to the official React StepZilla Example</h1>
    //             <h3>Source, Installation Instructions and Docs can be found here: <a href="https://github.com/newbreedofgeek/react-stepzilla" target="_blank">https://github.com/newbreedofgeek/react-stepzilla</a></h3>
    //           </label>
    //           <div className="row">
    //             <div className="col-md-12">
    //               <div className="col-md-6">
    //                 <h3>This example uses this custom config (which overwrites the default config):</h3>
    //                 <code>
    //                     preventEnterSubmission=true<br />
    //                     nextTextOnFinalActionStep="Save"<br />
    //                     hocValidationAppliedTo=[3]<br />
    //                     startAtStep=window.sessionStorage.getItem('step') ? parseFloat(window.sessionStorage.getItem('step')) : 0<br />
    //                     onStepChange=(step) => window.sessionStorage.setItem('step', step)
    //                 </code>
    //               </div>
    //               <div className="col-md-6">
    //                 <h3>The default config settings are...</h3>
    //                 <code>
    //                   showSteps=true<br />
    //                   showNavigation=true<br />
    //                   stepsNavigation=true<br />
    //                   prevBtnOnLastStep=true<br />
    //                   dontValidate=false<br />
    //                   preventEnterSubmission=false<br />
    //                   startAtStep=0<br />
    //                   nextButtonText='Next'<br />
    //                   backButtonText='Previous'<br />
    //                   nextButtonCls='btn btn-prev btn-primary btn-lg pull-right'<br />
    //                   backButtonCls='btn btn-next btn-primary btn-lg pull-left'<br />
    //                   nextTextOnFinalActionStep='[default value of nextButtonText]'<br />
    //                   hocValidationAppliedTo: []
    //                 </code>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    <div>
       <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Collection Type</h4>
                      </div>
                      <div className="form-group col-md-6">
                      <Dropdown
                    className={"blackBorder"}
                        options={this.state.collectionTypeOptions}
                        placeholder='Collection Type'
                        search
                        selection
                        fluid
                        value={this.state.collectionType}
                        onChange={this.handleCollectionTypeChange}
                    />
                      </div>
                    </div>
            {/* <div className="header">
            Collection Type
                </div>  
                <div className="dropdown">
                <Dropdown
                    className={"blackBorder"}
                        options={this.state.collectionTypeOptions}
                        placeholder='Collection Type'
                        search
                        selection
                        fluid
                        value={this.state.collectionType}
                        onChange={this.handleCollectionTypeChange}
                    />
                    </div> */}
                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Measure</h4>
                      </div>
                      <div className="form-group col-md-6">
                      <Dropdown
                    className={"blackBorder"}
                        options={this.state.measureOptions}
                        placeholder='Measure'
                        search
                        selection
                        fluid
                        value={this.state.measure}
                        onChange={this.handleMeasureChange}
/>      
                      </div>
                      <div className="form-group col-md-2">
                      <span><button class="ui circular icon button"  onClick={() => this.addMeasure()}><i aria-hidden="true" class="add icon"></i></button></span>

                      </div>
                    </div>    
                    {/* <div className="header">
                    Measure
                </div>  
                <div className="dropdown">
                <Dropdown
                    className={"blackBorder"}
                        options={this.state.measureOptions}
                        placeholder='Measure'
                        search
                        selection
                        fluid
                        value={this.state.measure}
                        onChange={this.handleMeasureChange}
                    />
                    </div>   */}
                <div className="form-row">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Measure </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.measureList.map((key, i) => {
                      return(
                        <tr key={key}>
                          <td>
                            <span>{this.state.measureList[i]}</span>
                           </td>
                          <td>
                            <button className="btn list-btn" onClick={() => this.clearMeasure(i)}>
                              x
                            </button>
                          </td>
                        </tr>
                      )
                    })

                    }
                 
                  </tbody>
                </table>
                </div>
    </div>
    )
  }
}