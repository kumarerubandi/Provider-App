'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { createToken } from '../components/Authentication';
import Client from 'fhir-kit-client';
import Inspector from 'react-json-inspector';
import { element, object } from 'prop-types';
import RecursiveProperty from './RecursiveProperty.tsx';
import DisplayPatientData from '../components/DisplayPatientData';
import DisplayBundle from '../components//DisplayBundle';
import { throwStatement } from '@babel/types';
import Config from '../globalConfiguration.json';
import Switch from "react-switch";
import Loader from 'react-loader-spinner';
import RenderSubmissionInfo from './RenderSubmissionInfo';

var smart = new Client({ baseUrl: Config.provider.fhir_url });

export default class FinalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: sessionStorage.getItem('config') !== undefined ? JSON.parse(sessionStorage.getItem('config')) : {},
      costMeasures: props.getStore().costMeasures,
      qualityImprovement: props.getStore().qualityImprovement,
      promotingInteroperability: props.getStore().promotingInteroperability,
      improvementActivity: props.getStore().improvementActivity,
      qiLoading: props.getStore().qualityImprovement.loading,
      piLoading: props.getStore().promotingInteroperability.loading,
      iaLoading: props.getStore().improvementActivity.loading,
      cLoading: props.getStore().costMeasures.loading,
      showScore: false,
      score: 0,
      mask: false,
      purpose: this.props.getStore().initialPage.purpose,
      patients: this.props.getStore().initialPage.patients
    };
    this.calculateMeasure = this.calculateMeasure.bind(this);
    this.showMeasureData = this.showMeasureData.bind(this);
    this.displayPatientwiseInfo = this.displayPatientwiseInfo.bind();
    this.handleMask = this.handleMask.bind(this);
    this.renderSubmission = this.renderSubmission.bind(this);
  }

  componentDidMount() {
    let purpose = this.state.purpose;
    if (purpose === "data" || purpose === "both") {
      this.submit_data();
    }
    // const interval = setInterval(() => {
    //   this.setState({
    //     costMeasures: this.props.getStore().costMeasures,
    //     qualityImprovement: this.props.getStore().qualityImprovement,
    //     promotingInteroperability: this.props.getStore().promotingInteroperability,
    //     improvementActivity: this.props.getStore().improvementActivity,
    //   })
    //   if (!this.state.cloading && !this.state.piloading && !this.state.cloading && !this.state.ialoading) {
    //     console.log('poeeee', this.state.improvementActivity)
    //     clearInterval(interval);
    //   }

    // }, 2000)
  }

  submit_data() {
    let patients = this.state.patients;
    let qualityImprovement = this.state.qualityImprovement;
    if (qualityImprovement.measureList.length > 0) {
      qualityImprovement.measureList.map((measure, i) => {
        measure.loading = true;
        this.setState({ qualityImprovement });
        console.log("measure name--", measure.measureId, measure.measureName);
        this.getDataRequirementsByIdentifier(measure.measureId).then((requirements) => {
          console.log("Library-----", requirements);
          if (requirements.hasOwnProperty("dataRequirement")) {
            this.getMeasureId(measure.measureId).then((mid) => {
              console.log("MeasureId-----", mid);
              this.getDataFromRequirements(requirements).then((dataArray) => {
                console.log("All data array---", dataArray);
                measure.measureData = [];
                patients.map(async (patientEntry, key) => {
                  let patient = patientEntry.resource;
                  let loadingInfo = { "patient": patient, "datatosubmit": {}, "submitted": false }
                  this.generatePayloadwithPatient(dataArray, mid, patient).then((dataTosubmit) => {
                    loadingInfo.datatosubmit = dataTosubmit;
                    this.submitData(mid, dataTosubmit).then((submit_res) => {
                      console.log("submit res----", loadingInfo.datatosubmit);
                      if (submit_res.resourceType === "Bundle") {
                        loadingInfo.submitted = true;
                        measure.loading = false;
                        measure.measureData.push(loadingInfo);
                        this.setState({ qualityImprovement });
                      } else {
                        loadingInfo.submitted = false;
                        measure.measureData.push(loadingInfo);
                        measure.loading = false;
                        this.setState({ qualityImprovement });
                      }

                    }).catch((err) => {

                    })
                  })
                });
              });
            });
          } else {
            measure.loading = false;
            measure.error = "Unable to fetch Data Requirements from Library";
            this.setState({ qualityImprovement });
          }
        }).catch((error) => { console.log(error); });
      })
    }
  }


  getGUID = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return 'beryllium-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  componentWillUnmount() { }
  handleMask(mask) {
    this.setState({ mask })
  }
  updateStateElement = (elementName, text) => {
    this.setState({ [elementName]: text });
  }

  /**
   * Function to generate Parameter resource neede for $submit-data for each patient
   * @param {*} dataArray : Array of resources
   * @param {*} measureId
   * @param {*} patient 
   */
  async generatePayloadwithPatient(dataArray, measureId, patient) {
    let practitionerID = null
    let orgID = null
    if (patient.hasOwnProperty("managingOrganization")) {
      orgID = patient.managingOrganization.reference.split('/')[1];
    }
    if (patient.hasOwnProperty("generalPractitioner")) {
      practitionerID = patient.generalPractitioner[0].reference.split('/')[1];
    }
    let practitioner = dataArray.find((r) => {
      return r.id === practitionerID
    })
    let organization = dataArray.find((r) => {
      return r.id === orgID
    })
    let filteredResources = []
    filteredResources = dataArray.filter((r) => {
      return (r.resourceType !== "Organization" && r.resourceType !== "Practitioner") && ((r.resourceType === 'AllergyIntolerance' && r.patient.reference === 'Patient/' + patient.id) || (r.resourceType !== 'AllergyIntolerance' && r.resourceType !== "Organization" && r.resourceType !== "Practitioner" && r.subject.reference === 'Patient/' + patient.id))
    })
    console.log(filteredResources, 'filtered resources')
    if (filteredResources.length > 0) {
      filteredResources.push(practitioner)
      filteredResources.push(patient)
      filteredResources.push(organization)
      return await this.generatePayload(filteredResources, measureId);
    }
  }
  generatePayload = async (resourceArray, measureId) => {
    let date = new Date();
    let timestamp = date.toISOString();
    let obj = JSON.stringify(Config.operationPayload)
    let obj2 = JSON.parse(obj)
    let measurereport = obj2.parameter.find(e => e.name === "measure-report");
    let organization = ''
    let practitioner = ''
    let patientResource = ''
    for (var j = 0; j < resourceArray.length; j++) {
      if (resourceArray[j]) {
        //Appending mettles- to all resource ids needed
        if (resourceArray[j].id.substr(0, 8) !== "mettles-") {
          resourceArray[j].id = "mettles-" + resourceArray[j].id;
        }
        //Adding specific identifier to all resource ids needed
        // var identifier = this.getGUID()
        // resourceArray[j].identifier.push({
        //   "system": "http://www.affosoft.com/identifier",
        //   "use": "usual",
        //   "value": identifier
        // })
        if (resourceArray[j].resourceType === 'Organization') {
          organization = resourceArray[j]
        }
        else if (resourceArray[j].resourceType === 'Practitioner') {
          practitioner = resourceArray[j]
        }
        else if (resourceArray[j].resourceType === 'Patient') {
          patientResource = resourceArray[j]
        }
      }
    }
    obj2.id = this.getGUID();
    measurereport.resource.id = this.getGUID();
    measurereport.resource.subject.reference = "Patient/" + patientResource.id;
    measurereport.resource.date = timestamp;
    measurereport.resource.measure = "Measure/" + measureId;
    measurereport.resource.period.start = timestamp;
    measurereport.resource.period.end = timestamp;
    measurereport.resource.reporter.reference = "Organization/" + organization.id;


    let arr = []
    arr.push(measurereport)
    for (var i = 0; i < resourceArray.length; i++) {
      arr.push({
        "name": "resource",
        "resource": resourceArray[i]
      })
    }
    obj2.parameter = arr;
    return obj2;
  }
  async getMeasureId(identifier) {
    return new Promise(function (resolve, reject) {
      var url = Config.payer.fhir_url + '/Measure?identifier=' + identifier
      // token = await createToken(this.props.config.provider.grant_type, 'provider', sessionStorage.getItem('username'), sessionStorage.getItem('password'))
      let headers = {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + token
      }
      fetch(url, {
        method: "GET",
        headers: headers
      }).then(response => {
        return response.json();
      }).then((response) => {
        let measureId = response.entry[0].resource.id
        resolve(measureId);
      }).catch(reason => {
        console.log("No Measure found", reason)
        reject('No Measure found')
      }
      );
    })
  }
  getDataFromRequirements = async (libDR) => {
    console.log('in getDataFromRequirements method')
    var dataArray = []
    dataArray.push(smart.search({ resourceType: "Organization" }))
    dataArray.push(smart.search({ resourceType: "Practitioner" }))
    for (var i = 0; i < libDR.dataRequirement.length; i++) {
      if (libDR.dataRequirement[i].type !== "Patient") {
        let codes;
        if (libDR.dataRequirement[i].codeFilter[0].hasOwnProperty('valueSet')) {
          codes = libDR.dataRequirement[i].codeFilter[0].valueSet
        }
        else {
          codes = libDR.dataRequirement[i].codeFilter[0].code[0].code
        }
        if (codes.length > 0) {
          if (libDR.dataRequirement[i].type === 'AllergyIntolerance') {
            dataArray.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { code: codes } }))
          }
          else if (libDR.dataRequirement[i].type === 'Encounter') {
            dataArray.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { type: codes } }))
          }
          else if (libDR.dataRequirement[i].type === 'Immunization') {
            dataArray.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { 'reason-code': codes } }))
          }
          else {
            dataArray.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { code: codes } }))
          }
        }
      }
    }

    let res = await Promise.all(dataArray);
    console.log("Full data array---", JSON.stringify(res));

    let count = 0
    let resultArray = []
    for (var j = 0; j < res.length; j++) {
      if ('entry' in res[j]) {
        if (res[j].entry.length > 0) {
          for (var i = 0; i < res[j].entry.length; i++) {
            resultArray.push(res[j].entry[i].resource)
            count = count + 1
          }
        }
        else {
          resultArray.push(res[j].entry[0].resource)
          count = count + 1
        }
      }

    }
    return resultArray
  }
  previousStep() {
    this.props.jumpToStep(4);
  }
  async submitData(measureId, dataTosubmit) {
    let token = await createToken('client_credentials', 'payer', 'john', 'john123');
    token = "Bearer " + token;
    var myHeaders = {
      "Content-Type": "application/json",
      "authorization": token,
    }
    let res = await fetch(this.state.config.payer_fhir_url + "/Measure/" + measureId + "/$submit-data", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(dataTosubmit)
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log("submit_res---", response);
        return response;
      })
      .catch(reason => {
        console.log("Submit failed", reason);
        return false;
      });
    return res;
  }
  calculateMeasure = async () => {
    let qualityImprovement = this.props.getStore().qualityImprovement
    let promotingInteroperability = this.props.getStore().promotingInteroperability
    let improvementActivity = this.props.getStore().improvementActivity
    let costMeasures = this.props.getStore().costMeasures
    let token = await createToken('client_credentials', 'payer', 'john', 'john123');
    token = "Bearer " + token;
    let arr = []
    let identfiers = []
    console.log(this.props.getStore())
    let json = {}
    json.qualityImprovement = qualityImprovement
    json.promotingInteroperability = promotingInteroperability
    json.improvementActivity = improvementActivity
    json.costMeasures = costMeasures
    json.resourceType = 'Measure'
    // let token = await createToken('client_credentials', 'payer', 'john', 'john123');
    const fhirClient = new Client({ baseUrl: this.state.config.payer_fhir_url + "/Measure/$calculate-score" });
    fhirClient.bearerToken = token;
    fhirClient.create({
      resourceType: "Measure",
      body: json,
      headers: {
        "Content-Type": "application/fhir+json",
      }
    }).then((result) => {
      console.log("message def result", result);
      this.setState({ showScore: true });
      this.setState({ score: result.group[0].measureScore.value });

      window.scrollTop(0);
      // return reject(link);
    }).catch((err) => {
      console.error('Cannot grab launch context from the FHIR server endpoint to launch the SMART app. See network calls to the Launch endpoint for more details', err);
      // link.error = true;
      // return reject(link);
    });
  }

  showMeasureData(measureId, category) {
    if (category === "QI") {
      let QI = this.state.qualityImprovement;
      console.log(QI, 'this is qi')
      let measureObj = QI.measureList.find((m) => {
        return m.measureId === measureId
      })
      console.log(measureObj, QI.measureList);
      measureObj.showData = !measureObj.showData;
      this.setState({ qualityImprovement: QI });
    }
    if (category === "PI") {
      let PI = this.state.promotingInteroperability;
      let measureObj = PI.measureList.find((m) => {
        return m.measureId === measureId
      })
      console.log(measureObj, PI.measureList);
      measureObj.showData = !measureObj.showData;
      this.setState({ promotingInteroperability: PI });
    }
    if (category === "IA") {
      let IA = this.state.improvementActivity;
      let measureObj = IA.measureList.find((m) => {
        return m.measureId === measureId
      })
      console.log(measureObj, IA.measureList);
      measureObj.showData = !measureObj.showData;
      this.setState({ improvementActivity: IA });
    }
  }
  displayPatientwiseInfo(data) {
    var finaldata = []
    var patient = ''
    console.log(data, 'tres')
    if (data !== undefined) {
      data.entry.map((e, k) => {
        console.log(e, 'eeeeeeeee')
        if (e !== undefined) {
          finaldata[k] = []
          e.resource.parameter.forEach(element => {
            finaldata[k].push(element.resource);
          })
        }

      })
      return (
        <DisplayBundle finaldata={finaldata} />
      )
    }
  }
  getDataRequirementsByIdentifier = async (identifier) => {
    let token = await createToken(Config.payer.grant_type, 'payer', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
    token = "Bearer " + token;
    let fhir_url = Config.payer.fhir_url;
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "authorization": token,
    });
    // var url = fhir_url + "/Measure/$data-requirements-by-identfier?identifier=" + identifier + "&periodStart=2019-07-19&periodEnd=2020-10-25";
    var url = fhir_url + "/Measure/$data-requirements-by-identifier?identifier=" + identifier;
    let requirements = await fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      console.log("response----------", response);
      return response.json();
    }).then((response) => {
      console.log("----------response", response);
      this.setState({ prefetchloading: false });
      return response;
    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );
    return requirements;
  }
  renderSubmission(measure) {
    return (
      <RenderSubmissionInfo measure={measure} />
    )
  }
  render() {
    console.log(this.state.qualityImprovement, '1234567')
    return (
      <div>
        {this.state.showScore &&
          <div>
            <section id="call-to-action" className="call-to-action wow fadeIn">
              <div className="container text-center">
                <h3>Your Calculated Mips Score is {parseFloat((this.state.score).toFixed(4))}</h3>
                {/* <small><a href="#" >Show details</a></small> */}
              </div>
            </section>
          </div>
        }
        {this.state.purpose === "score" &&
          <div>
            <div className="form-row">
              {this.state.qualityImprovement.measureList.length > 0 &&
                <div style={{ width: "100%", margin: "10px" }}>
                  <h4 className="title">Quality Improvement</h4>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <span className="title-small">Measure ID</span>
                    </div>
                    <div className="form-group col-md-6">
                      <span className="title-small">Measure Name</span>
                    </div>
                    {/* <div className="form-group col-md-2">
                      <span className="title-small">Measure Data</span>
                    </div> */}
                  </div>
                  {this.state.qualityImprovement.measureList.map((measure, i) => {
                    return (<div key={i}>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <span>{measure.measureId}</span>
                        </div>
                        <div className="form-group col-md-6">
                          <span>{measure.measureName}</span>
                        </div>
                        {/* {measure.loading &&
                          <div id="fse" className={"spinner " + (measure.loading ? "visible" : "invisible")}>
                            Loading
                          <Loader
                              type="ThreeDots"
                              color="#fff"
                              height="15"
                              width="15"
                            />
                          </div>
                        }
                        {!measure.loading &&
                          <div className="form-group col-md-2">
                            <a style={{ color: "#18d26e" }} onClick={() => this.showMeasureData(measure.measureId, "QI")}>Show Measure data</a>
                          </div>
                        } */}
                      </div>
                      {/* {measure.showData &&
                        <div className="form-row">
                          <div className="form-group col-12">
                            {this.displayPatientwiseInfo(measure.measureData)}
                          </div>
                        </div>
                      } */}
                    </div>)
                  })
                  }
                </div>
              }
            </div>
            <div className="form-row">
              {this.state.promotingInteroperability.measureList.length > 0 &&
                <div style={{ width: "100%", margin: "10px" }}>
                  <h4 className="title">Promoting Interoperability</h4>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <span className="title-small">Measure ID</span>
                    </div>
                    <div className="form-group col-md-6">
                      <span className="title-small">Measure Name</span>
                    </div>
                    {/* <div className="form-group col-md-2">
                  <span className="title-small">Measure Data</span>
                </div> */}
                  </div>
                  {this.state.promotingInteroperability.measureList.map((measure, i) => {
                    return (<div key={i}>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <span>{measure.measureId}</span>
                        </div>
                        <div className="form-group col-md-6">
                          <span>{measure.measureName}</span>
                        </div>
                        {/* <div className="form-group col-md-2">
                      <a style={{color: "#18d26e",cursor: "pointer"}} onClick={() => this.showMeasureData(measure.measureId, "PI")}>Show Measure data</a>
                    </div> */}
                      </div>
                      {/* {measure.showData &&
                        <div className="form-row">
                          <div className="form-group col-12">
                            {this.displayPatientwiseInfo(measure.data)}
                          </div>
                        </div>
                      } */}
                    </div>)
                  })
                  }
                </div>
              }
            </div>
            <div className="form-row">
              {this.state.improvementActivity.measureList.length > 0 &&
                <div style={{ width: "100%", margin: "10px" }}>
                  <h4 className="title">Improvement Activity</h4>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <span className="title-small">Measure ID</span>
                    </div>
                    <div className="form-group col-md-6">
                      <span className="title-small">Measure Name</span>
                    </div>
                    {/* <div className="form-group col-md-2">
                  <span className="title-small">Measure Data</span>
                </div> */}
                  </div>
                  {this.state.improvementActivity.measureList.map((measure, i) => {
                    return (<div key={i}>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <span>{measure.measureId}</span>
                        </div>
                        <div className="form-group col-md-6">
                          <span>{measure.measureName}</span>
                        </div>
                        {/* <div className="form-group col-md-2">
                      <a style={{color: "#18d26e",cursor: "pointer"}} onClick={() => this.showMeasureData(measure.measureId, "IA")}>Show Measure data</a>
                    </div> */}
                      </div>
                      {/* {measure.showData &&
                        <div className="form-row">
                          <div className="form-group col-12">
                            {this.displayPatientwiseInfo(measure.data)}
                          </div>
                        </div>
                      } */}
                    </div>)
                  })
                  }
                </div>
              }
            </div>
            <div className="form-row">
              {this.state.costMeasures.measureList.length > 0 &&
                <div style={{ width: "100%", margin: "10px" }}>
                  <h4 className="title">Cost Measures</h4>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <span className="title-small">Measure ID</span>
                    </div>
                    <div className="form-group col-md-6">
                      <span className="title-small">Measure Name</span>
                    </div>
                    {/* <div className="form-group col-md-2">
                <span className="title-small">Measure Data</span>
              </div> */}
                  </div>
                  {this.state.costMeasures.measureList.map((measure, i) => {
                    return (<div key={i}>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <span>{measure.measureId}</span>
                        </div>
                        <div className="form-group col-md-6">
                          <span>{measure.measureName}</span>
                        </div>
                        {/* <div className="form-group col-md-2">
                    <a style={{color: "#18d26e",cursor: "pointer"}} onClick={() => this.showMeasureData(measure.measureId, "PI")}>Show Measure data</a>
                  </div> */}
                      </div>
                      {/* {measure.showData &&
                        <div className="form-row">
                          <div className="form-group col-12">
                            {this.displayPatientwiseInfo(measure.data)}
                          </div>
                        </div>
                      } */}
                    </div>)
                  })
                  }
                </div>
              }
            </div>
          </div>
        }
        {(this.state.purpose === "data" || this.state.purpose === "both") &&
          <div>
            {this.state.qualityImprovement.measureList.length > 0 &&
              <div>
                {this.state.qualityImprovement.measureList.map((measure, i) => {
                  return (<div key={i}>
                    {this.renderSubmission(measure)}
                  </div>);
                })
                }
              </div>
            }
          </div>
        }
        {/* <div className="form-row">
          <div className="form-group col-3 offset-8 pad">
            <span padding="0.5%"><i aria-hidden="true" className="ui "></i></span> Mask Patient Health Information
            </div>
          <div className="form-group col-1 ">
            <label>
              <Switch onChange={this.handleMask} checked={this.state.mask} />
            </label>
          </div>
        </div> */}
        <div className="footer-buttons">
          <button type="button" className="btn btn-prev btn-primary btn-lg pull-left" id="next-button" onClick={() => this.previousStep()}>Previous</button>
        </div>
        {(this.state.purpose === "both" || this.state.purpose === "score") &&
          <div className="footer-buttons">
            <button type="button" className="btn btn-prev btn-primary btn-lg pull-right" id="next-button" onClick={() => this.calculateMeasure()}>Calculate MIPS score</button>
          </div>
        }
      </div>
    )
  }
}
