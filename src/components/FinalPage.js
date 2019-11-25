'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { createToken } from '../components/Authentication';
import Client from 'fhir-kit-client';
import Inspector from 'react-json-inspector';
import { element, object } from 'prop-types';
import RecursiveProperty from './RecursiveProperty.tsx';
import DisplayPatientData from '../components//DisplayPatientData';
import DisplayBundle from '../components//DisplayBundle';
import { throwStatement } from '@babel/types';


export default class FinalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      costMeasures: props.getStore().costMeasures,
      qualityImprovement: props.getStore().qualityImprovement,
      promotingInteroperability: props.getStore().promotingInteroperability,
      improvementActivity: props.getStore().improvementActivity,
      qiLoading: props.getStore().qualityImprovement.loading,
      piLoading: props.getStore().promotingInteroperability.loading,
      iaLoading: props.getStore().improvementActivity.loading,
      cLoading: props.getStore().costMeasures.loading,
      showScore: false,
      score: 0
    };
    this.calculateMeasure = this.calculateMeasure.bind(this);
    this.showMeasureData = this.showMeasureData.bind(this);
    this.displayPatientwiseInfo = this.displayPatientwiseInfo.bind();
  }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState({
        costMeasures: this.props.getStore().costMeasures,
        qualityImprovement: this.props.getStore().qualityImprovement,
        promotingInteroperability: this.props.getStore().promotingInteroperability,
        improvementActivity: this.props.getStore().improvementActivity,
      })
      if (!this.state.cloading && !this.state.piloading && !this.state.cloading && !this.state.ialoading) {
        console.log('poeeee')
        clearInterval(interval);
      }
      console.log('how many??', this.props.getStore().qualityImprovement.measureList)
    }, 3000)
  }

  componentWillUnmount() { }

  calculateMeasure = async () => {
    console.log(this.props.getStore())
    let json = {}
    json.qualityImprovement = this.props.getStore().qualityImprovement
    json.promotingInteroperability = this.props.getStore().promotingInteroperability
    json.improvementActivity = this.props.getStore().improvementActivity
    json.costMeasures = this.props.getStore().costMeasures
    json.resourceType = 'Measure'
    let token = await createToken('client_credentials', 'payer', 'john', 'john123');
    const fhirClient = new Client({ baseUrl: "http://cdex.mettles.com:8180/hapi-fhir-jpaserver/fhir/Measure/$calculate-score" });
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
      console.log(QI,'this is qi')
      let measureObj = QI.measureList.find((m) => {
        return m.measureId === measureId
      })
      console.log(measureObj, QI.measureList);
      measureObj.showData= !measureObj.showData;
      this.setState({ qualityImprovement: QI });
    }
    if (category === "PI") {
      let QI = this.state.promotingInteroperability;
      let measureObj = QI.measureList.find((m) => {
        return m.measureId === measureId
      })
      console.log(measureObj, QI.measureList);
      measureObj.showData= !measureObj.showData;
      this.setState({ promotingInteroperability: QI });
    }
    if (category === "IA") {
      let QI = this.state.improvementActivity;
      let measureObj = QI.measureList.find((m) => {
        return m.measureId === measureId
      })
      console.log(measureObj, QI.measureList);
      measureObj.showData= !measureObj.showData;
      this.setState({ improvementActivity: QI });
    }

  }
  displayPatientwiseInfo(data) {
    var finaldata = []
    var patient = ''
    console.log(data, 'tres')
    if (data !== undefined) {
      data.entry.map((e, k) => {
        console.log()
        finaldata[k] = []
        e.resource.parameter.forEach(element => {
          finaldata[k].push(element.resource);
      })
    })
      return (
        <DisplayBundle finaldata={finaldata} />
      )
    }
  }
  render() {
    console.log(this.state.qualityImprovement, '1234567')
    return (
      <div>
        {this.state.showScore &&
          <div>
            <section id="call-to-action" className="call-to-action wow fadeIn">
              <div className="container text-center">
                <h3>Your Calculated Mips Score is {parseFloat((this.state.score).toFixed(4))}<small><a href="#" >Show details</a></small></h3>
              </div>
            </section>
          </div>
        }
        <div className="form-row">
              <div className="form-group col-md-2">
                  <span className="title-small">Type of Reporting</span>
                </div>
                <div className="form-group col-md-4">
                  <span>{this.state.qualityImprovement.reporting}</span>
                </div>
                <div className="form-group col-md-2">
                  <span className="title-small">Submission Type</span>
                </div>
                <div className="form-group col-md-4">
                  <span>{this.state.qualityImprovement.submissionType}</span>
                </div>
        </div>
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
                <div className="form-group col-md-2">
                  <span className="title-small">Measure Data</span>
                </div>
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
                    <div className="form-group col-md-2">
                      <a style={{color: "#18d26e"}} onClick={() => this.showMeasureData(measure.measureId, "QI")}>Show Measure data</a>
                    </div>
                  </div>
                  {measure.showData &&
                  <div className="form-row">
                    <div className="form-group col-12">
                      {this.displayPatientwiseInfo(measure.measureData)}
                    </div>
                  </div>
                  }
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
              <div className="form-group col-md-2">
                <span className="title-small">Measure Data</span>
              </div>
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
                  <div className="form-group col-md-2">
                    <a style={{color: "#18d26e",cursor: "pointer"}} onClick={() => this.showMeasureData(measure.measureId, "PI")}>Show Measure data</a>
                  </div>
                </div>
                {measure.showData &&
                <div className="form-row">
                  <div className="form-group col-12">
                    {this.displayPatientwiseInfo(measure.data)}
                  </div>
                </div>
                }
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
              <div className="form-group col-md-2">
                <span className="title-small">Measure Data</span>
              </div>
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
                  <div className="form-group col-md-2">
                    <a style={{color: "#18d26e",cursor: "pointer"}} onClick={() => this.showMeasureData(measure.measureId, "IA")}>Show Measure data</a>
                  </div>
                </div>
                {measure.showData &&
                <div className="form-row">
                  <div className="form-group col-12">
                    {this.displayPatientwiseInfo(measure.data)}
                  </div>
                </div>
                }
              </div>)
            })
            }
          </div>
          }
        </div>
        <div className="form-row">
          {this.state.costMeasures.measureList.length > 0 &&
            <div style={{ width: "100%", margin: "10px" }}>
            <h4 className="title">Promoting Interoperability</h4>
            <div className="form-row">
              <div className="form-group col-md-4">
                <span className="title-small">Measure ID</span>
              </div>
              <div className="form-group col-md-6">
                <span className="title-small">Measure Name</span>
              </div>
              <div className="form-group col-md-2">
                <span className="title-small">Measure Data</span>
              </div>
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
                  <div className="form-group col-md-2">
                    <a style={{color: "#18d26e",cursor: "pointer"}} onClick={() => this.showMeasureData(measure.measureId, "PI")}>Show Measure data</a>
                  </div>
                </div>
                {measure.showData &&
                <div className="form-row">
                  <div className="form-group col-12">
                    {this.displayPatientwiseInfo(measure.data)}
                  </div>
                </div>
                }
              </div>)
            })
            }
          </div>
          }
        </div>
        <div className="form-row">
          {this.state.improvementActivity.measureList.length > 0 &&
            <div style={{ width: "100%", margin: "10px" }}>
            <h4 className="title">Cost Measure</h4>
            <div className="form-row">
              <div className="form-group col-md-4">
                <span className="title-small">Measure ID</span>
              </div>
              <div className="form-group col-md-8">
                <span className="title-small">Measure Name</span>
              </div>
            </div>
            {this.state.improvementActivity.measureList.map((measure, i) => {
              return (<div key={i}>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <span>{measure.measureId}</span>
                  </div>
                  <div className="form-group col-md-8">
                    <span>{measure.measureName}</span>
                  </div>
                  
                </div>
                
              </div>)
            })
            }
          </div>
          }
        </div>
        <div class="footer-buttons">
          <button type="button" className="btn btn-prev btn-primary btn-lg pull-right" id="next-button" onClick={() => this.calculateMeasure()}>Calculate MIPS score</button>
        </div>
      </div>
    )
  }
}