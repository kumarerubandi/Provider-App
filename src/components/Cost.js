'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';


export default class Cost extends Component {
  constructor(props) {
    super(props);

    this.state = {
        collectionType:'',
        collectionTypeOptions:[{ key: 'eCQMs', text: 'eCQMs (EHR measures or electronic Clinical Quality Measures)', value: 'eCQMs' },
      { key: 'MIPS-CQMs', text: 'MIPS CQMs (previously known as Registry measures)', value: 'MIPSCQMs' },
      { key: 'QCDR', text: 'QCDR measures', value: 'QCDR'},
      { key: 'Claims_measures', text: 'Claims measures (available only to small practices of 1-15 eligible clinicians submitting as individuals, groups, or virtual groups)', value: 'Claims_measures'},
      { key: 'CAHPS', text: 'CAHPS for MIPS survey (available only to groups)', value: 'CAHPS'},
      { key: 'CMS', text: 'CMS Web Interface measures (available only to groups of 25 or more)', value: 'CMS'},

    ],
    };
    this.handlecollectionTypeChange = this.handlecollectionTypeChange.bind(this);

  }

  componentDidMount() {}

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  handlecollectionTypeChange = (event) => {
    this.setState({ collectionType: event.target.value })
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
            <div className="header">
            Cost
                </div>  
                {/* <div className="dropdown">
                <Dropdown
                    className={"blackBorder"}
                        options={this.state.collectionTypeOptions}
                        placeholder='Collection Type'
                        search
                        selection
                        fluid
                        value={this.state.collectionType}
                        onChange={this.handlecollectionTypeChange}
                    />
                    </div>                  */}
    </div>
    )
  }
}