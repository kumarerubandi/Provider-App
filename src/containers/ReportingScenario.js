import React, { Component } from 'react';
import claim_json from '../claim.json';
// import ReactJson from 'react-json-view';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown,Input } from 'semantic-ui-react';
import DropdownMeasure from '../components/DropdownMeasure';
import Loader from 'react-loader-spinner';
import { createToken } from '../components/Authentication';
import moment from "moment"



let blackBorder = "blackBorder";

const types = {
    error: "errorClass",
    info: "infoClass",
    debug: "debugClass",
    warning: "warningClass"
  }
class ReportingScenario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            measure:null,
            validatePatient: false,
            logs: [],
            measureTypeOptions : [
                {key:'individual', value: 'individual', text:"Individual"} ,
                {key:'summary', value: 'summary', text:"Summary"}],
            measureType:'',
            patientId:'',
            reqId: '',

            dataLoaded: false

        };
        this.goHome = this.goHome.bind(this);
        this.onPatientChange = this.onPatientChange.bind(this);
        this.handleMeasureTypeChange = this.handleMeasureTypeChange.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.submit_info = this.submit_info.bind(this);




        // this.createX12Response = this.createX12Response.bind(this);
        // this.convertJsonToX12 = this.convertJsonToX12.bind(this);
        // this.handleClaimJson = this.handleClaimJson.bind(this);
    }

    goHome() {
        window.location = `${window.location.protocol}//${window.location.host}/provider_request`;
    }
    updateStateElement = (elementName, text) => {
      this.setState({ [elementName]: text });

    
    }
    consoleLog(content, type) {
        let jsonContent = {
          content: content,
          type: type
        }
        this.setState(prevState => ({
          logs: [...prevState.logs, jsonContent]
        }))
      }
    validateForm() {
        let formValidate = true;
        if(this.state.measureType === 'individual'){
            if (this.state.patientId === '') {
                formValidate = false;
                this.setState({ validatePatient: true });
              }
        }
        
        // if ((this.state.hook === '' || this.state.hook === null) ) {
        //   formValidate = false;
        //   this.setState({ validateIcdCode: true });
        // }
        console.log('heree',formValidate )

        return formValidate;
      }
    startLoading() {
        if (this.validateForm()) {
          this.setState({ loading: true }, () => {
            var today = new Date();
            console.log(today,(today.getFullYear()-1))
            this.submit_info();
          })
        }
      }
      async submit_info() {
         this.setState({ dataLoaded: false, reqId: '' })

        let token = await createToken('password','provider',sessionStorage.getItem('username'), sessionStorage.getItem('password'),true);
        token = "Bearer " + token;
        var myHeaders = new Headers({
          "Content-Type": "application/json",
          "authorization": token,
        });
        let accessToken = this.state.accessToken;
        accessToken = token;
        // console.log(accessToken,'accesstoken')
        this.setState({ accessToken });
        let json_request =  this.getJson();
        
        let url = this.props.config.measure.fhir_url+'/MeasureReport';
    
        // console.log("Fetching response from " + url + ",types.info")
        console.log("json_request",JSON.stringify(json_request))
        try {
          const fhirResponse = await fetch(url, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(json_request)
          })
          console.log("fhir-----------",fhirResponse);
          const res_json = await fhirResponse.json();
          this.setState({ response: res_json });
          console.log('ss',res_json)
        //   var commReqId= data.entry[2].response.location.split('/')[1]
          this.setState({ reqId: res_json.id })
          // console.log("------response json",res_json);
          this.setState({ dataLoaded: true })
          if (fhirResponse && fhirResponse.status) {
            this.consoleLog("Server returned status "
              + fhirResponse.status + ": "
              + fhirResponse.error, types.error);
            this.consoleLog(fhirResponse.message, types.error);
          } else {
            this.setState({ response: res_json });
          }
          this.setState({ loading: false });
        //   this.setState({ "loadCards": true });
          window.scrollTo(0, 0)
        } catch (error) {
        //   var res_json = {
        //     "cards": [{
        //       "source": {
        //         "label": "CMS Medicare coverage database",
        //         "url": "https://www.cms.gov/medicare-coverage-database/details/ncd-details.aspx?NCDId=70&ncdver=3&bc=AAAAgAAAAAAA&\n",
        //       },
        //       "suggestions": [],
        //       "summary": "Requirements for Home Oxygen Theraphy",
        //       "indicator": "info",
        //       "detail": "The requested procedure needs more documentation to process further",
        //       "links": [{
        //         "url": "/index?npi=" + this.state.practitionerId,
        //         "type": "smart",
        //         "label": "SMART App"
        //       }]
    
        //     }]
        //   }
        //   this.setState({ response: res_json });
          this.setState({ loading: false });
          this.setState({ dataLoaded: false })

          console.log('error')
        //   this.consoleLog("Unexpected error occured", types.error)
        //   if (error instanceof TypeError) {
        //     this.consoleLog(error.name + ": " + error.message, types.error);
        //   }
        }
      }
       getJson() {
        var patientId = null;
        patientId = this.state.patientId;
        var measureType = this.state.measureType;
        var measure = this.state.measure;
        var today = new Date();
        var date = today.toISOString();
        // var date = new Date(d)
        // date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
        // console.log(date,'date',date.toLocaleDateString('en-US'))
        // date = new Date('2013-08-03T02:00:00Z');
        var currentYear = today.getFullYear();
        var lastYear = today.getFullYear()-1;
        var  month = today.getMonth()+1;
        var dt = today.getDate();

        if (dt < 10) {
        dt = '0' + dt;
        }
        if (month < 10) {
        month = '0' + month;
        }
       
        var endDate = month+'-' + dt + '-'+lastYear;
        var ed = new Date(endDate)
        console.log(ed)
        var startDate = month+'-'+dt+'-'+currentYear;
        var sd = new Date(endDate)

        let request = {
            "resourceType" : "MeasureReport",
            "status" : "pending",
            "measure" : {
              "reference" : "Measure/"+measure
            },
            "date" : date,
            "reportingOrganization" : {
              "reference" : "Organization/organization01"
            },
            "period" : {
              "start":sd,
              "end" : ed
            },
          }

        if(measureType ==='individual'){
            request.type = 'individual'
            request.patient= {
                "reference" : "Patient/"+patientId
              }
        }
        else{
            request.type = 'summary'
        }
        return request;
        
      }
    // async createX12Response() {
    //     var tempURL = this.props.config.xmlx12_url + "xmlx12";
    //     console.log("x12 URL", tempURL);
    //     let req = await fetch(tempURL, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: this.state.claim_json
    //     }).then((response) => {
    //         return response.json();
    //     }).then((response) => {
    //         return response;
    //     }).catch(err => err);
    //     return req;
    // }

    // async convertJsonToX12() {
    //     this.setState({ 'x12_response': "" });
    //     this.setState({ 'x12_error': "" });
    //     let x12_data = await this.createX12Response();
    //     console.log("x12-------", x12_data)
    //     if (x12_data.error == "") {
    //         this.setState({ 'x12_response': x12_data['x12_response'] });
    //     }
    //     else {
    //         this.setState({ 'x12_error': x12_data['error'] });
    //     }
    //     console.log("state------", this.state);
    // }

    // handleClaimJson(event) {
    //     console.log(this.state.claim_json);
    //     this.setState({ claim_json: event.target.value });
    //     console.log(this.state.claim_json);
    // }
    handleMeasureTypeChange = (e, { value }) => {
        // console.log(this.props, value);
        console.log(value)
        this.setState({ measureType: value })
    }
    onPatientChange(event) {
        this.setState({ patientId: event.target.value });
        this.setState({ validatePatient: false });
        // this.setState({ validatePatient: false });
      }



    render() {
        return (
            <React.Fragment>
                <div>
                    <div>
                        <div className="main_heading">
                            <span style={{ lineHeight: "35px" }}>PILOT INCUBATOR - Measure Reporting</span>
                            <div className="menu_conf" onClick={() => this.goHome()}>
                                <i style={{ paddingLeft: "5px", paddingRight: "7px" }} className="fa fa-home"></i>
                                Home</div>
                        </div>
                    </div>
                    <div className="content">
                     <div className="left-form">

                        <div className="header">
                            Measure
                        </div>
                            <div className="dropdown">
                                <DropdownMeasure
                                elementName='measure'
                                updateCB={this.updateStateElement}
                                />
                            </div>
                            <div className="header">
                            Measure Type
                        </div>
                            <div className="dropdown">
                            <Dropdown
                                className={blackBorder}
                                options={this.state.measureTypeOptions}
                                placeholder='Select Measure Type'
                                search
                                selection
                                fluid
                                onChange={this.handleMeasureTypeChange}
                            />
                            </div>
                            {this.state.measureType === 'individual' &&
                                <div>
                                    <div className="header">
                                        Patient                        
                                    </div>
                                    <div className="dropdown">
                                        <Input className='ui fluid   input' type="text" name="patient" fluid value={this.state.patientId} onChange={this.onPatientChange}></Input>
                                    </div>
                                    {this.state.validatePatient === true &&
                                        <div className='errorMsg dropdown'>{this.props.config.errorMsg}</div>
                                        }
                                </div>
                                
                        
                             }
                             <button className="submit-btn btn btn-class button-ready" onClick={this.startLoading}>Submit
                                    <div id="fse" className={"spinner " + (this.state.loading ? "visible" : "invisible")}>
                                <Loader
                                    type="Oval"
                                    color="#fff"
                                    height="15"
                                    width="15"
                                />
                                </div>
                            </button>
                            
                        </div>
                        <div className="right-form" style={{ marginTop: "50px" }}>
                            {this.state.dataLoaded &&
                                <div style={{ textAlign: "center", paddingTop: "5%" }}>
                                <p style={{ color: "green" }}>{"MeasureReport has been created successfully with id : " + this.state.reqId + "."}</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {
        config: state.config,
    };
};

export default withRouter(connect(mapStateToProps)(ReportingScenario));