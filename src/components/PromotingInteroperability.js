'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Promise from 'promise';
import promotingInteroperabilityMeasures from '../json/promotingInteroperabilityMeasures.json'
import Switch from "react-switch";
import DisplayQuestionnarie from './DisplayQuestionnarie.js';
import { createToken } from '../components/Authentication';
import { async } from 'q';
// import { FlatList } from 'react-native';

var objectiveOptions = []
var scoreWeightOptions = []

for (var i = 0; i < promotingInteroperabilityMeasures.length; i++) {

  //setting options for Score weight
  var scoreWeightKey = promotingInteroperabilityMeasures[i]["PERFORMANCE SCORE WEIGHT"].toString().replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
  push(scoreWeightOptions, { key: 'all', text: 'All', value: "all" })
  push(scoreWeightOptions, { key: scoreWeightKey, text: promotingInteroperabilityMeasures[i]["PERFORMANCE SCORE WEIGHT"], value: promotingInteroperabilityMeasures[i]["PERFORMANCE SCORE WEIGHT"] })

  //setting options for Objective Name
  var objectiveKey = promotingInteroperabilityMeasures[i]["OBJECTIVE NAME"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');
  push(objectiveOptions, { key: 'all', text: 'All', value: "all" })
  push(objectiveOptions, { key: objectiveKey, text: promotingInteroperabilityMeasures[i]["OBJECTIVE NAME"], value: promotingInteroperabilityMeasures[i]["OBJECTIVE NAME"] })
}
function push(array, item, key = false) {
  if (!array.find(({ text }) => text === item.text)) {
    array.push(item);
  }
  if (key) {
    if (!array.find(({ key }) => key === item.key)) {
      array.push(item);
    }
  }
}


export default class PromotingInteroperability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionType: props.getStore().promotingInteroperability.collectionType,
      measure: props.getStore().promotingInteroperability.measure,
      measureList: props.getStore().promotingInteroperability.measureList,
      promotingInteroperability: props.getStore().promotingInteroperability,
      objectiveOptions: objectiveOptions,
      scoreWeightOptions: scoreWeightOptions,
      objectiveName: props.getStore().promotingInteroperability.objectiveName,
      filteredMeasures: [],
      measureObj: props.getStore().promotingInteroperability.measureObj,

      scoreWeight: props.getStore().promotingInteroperability.scoreWeight,
      measureOptions: props.getStore().promotingInteroperability.measureOptions,
      group: props.getStore().improvementActivity.group,
      Q1: props.getStore().promotingInteroperability.Q1,
      Q2: props.getStore().promotingInteroperability.Q2,
      Q3: props.getStore().promotingInteroperability.Q3,
      Q4: props.getStore().promotingInteroperability.Q4,
      Q5: props.getStore().promotingInteroperability.Q5,
      Q6: props.getStore().promotingInteroperability.Q6,
      Q7: props.getStore().promotingInteroperability.Q7,
      Q8: props.getStore().promotingInteroperability.Q8,
      Q9: props.getStore().promotingInteroperability.Q9
    };
    this.handleObjectiveChange = this.handleObjectiveChange.bind(this);
    // this.handleScoreWeightChange = this.handleScoreWeightChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
    this.handleQ1 = this.handleQ1.bind(this);
    this.handleQ2 = this.handleQ2.bind(this);
    this.handleQ3 = this.handleQ3.bind(this);
    this.handleQ4 = this.handleQ4.bind(this);
    this.handleQ5 = this.handleQ5.bind(this);
    this.handleQ6 = this.handleQ6.bind(this);
    this.handleQ7 = this.handleQ7.bind(this);
    this.handleQ8 = this.handleQ8.bind(this);
    this.handleQ9 = this.handleQ9.bind(this);
    this.getQuestionnarieByIdentifier = this.getQuestionnarieByIdentifier.bind(this);
    this.displayQuestionnarie = this.displayQuestionnarie.bind(this);
    this.showMeasureQuestionnarie = this.showMeasureQuestionnarie.bind(this);
  }

  componentDidMount() {
    var measureOptions = []
    for (var i = 0; i < promotingInteroperabilityMeasures.length; i++) {
      push(measureOptions, { key: promotingInteroperabilityMeasures[i]["MEASURE ID"], text: promotingInteroperabilityMeasures[i]["MEASURE NAME"], value: promotingInteroperabilityMeasures[i]["MEASURE ID"], objectivename: promotingInteroperabilityMeasures[i]["OBJECTIVE NAME"], measureweight: promotingInteroperabilityMeasures[i]["PERFORMANCE SCORE WEIGHT"] }, true)
    }
    this.setState({ measureOptions: measureOptions })
  }

  componentWillUnmount() { }


  handleQ1(Q1) {
    this.setState({ Q1 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q1 = Q1;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ2(Q2) {
    this.setState({ Q2 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q2 = Q2;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ3(Q3) {
    this.setState({ Q3 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q3 = Q3;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ4(Q4) {
    this.setState({ Q4 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q4 = Q4;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ5(Q5) {
    this.setState({ Q5 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q5 = Q5;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ6(Q6) {
    this.setState({ Q6 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q6 = Q6;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ7(Q7) {
    this.setState({ Q7 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q7 = Q7;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ8(Q8) {
    this.setState({ Q8 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q8 = Q8;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  handleQ9(Q9) {
    this.setState({ Q9 });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.Q9 = Q9;
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }

  handleObjectiveChange = (event, data) => {
    this.setState({ objectiveName: data.value })
    let promotingInteroperability = this.state.promotingInteroperability
    var filteredMeasures = []
    var measureOptions = []

    if (data.value === 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["OBJECTIVE NAME"]
      })
    }
    else {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["OBJECTIVE NAME"].includes(data.value) > 0
      })
    }

    // if (data.value === 'all' && this.state.scoreWeight === 'all') {
    //   filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
    //     return measure["OBJECTIVE NAME"]
    //   })
    // }
    // else if (data.value !== 'all' && this.state.scoreWeight === 'all') {
    //   filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
    //     return measure["OBJECTIVE NAME"].includes(data.value) > 0
    //   })
    // }
    // else if (data.value === 'all' && this.state.scoreWeight !== 'all') {
    //   filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
    //     return measure["PERFORMANCE SCORE WEIGHT"].includes(this.state.scoreWeight) > 0
    //   })
    // }
    // else {
    //   filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
    //     return (
    //       (data.value !== 'all' && measure["OBJECTIVE NAME"].includes(data.value) > 0) &&
    //       (this.state.scoreWeight != 'all' && measure["PERFORMANCE SCORE WEIGHT"].includes(this.state.scoreWeight) > 0))
    //   })

    // }
    console.log(filteredMeasures, 'is it working')

    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: filteredMeasures[i]["MEASURE ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE ID"] }, true)
    }

    this.setState({ measureOptions: measureOptions })

    promotingInteroperability.objectiveName = data.value
    promotingInteroperability.measureOptions = measureOptions
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });  // Update store here (this is just an example, in reality you will do it via redux or flux)
  }

  // handleScoreWeightChange = (event, data) => {
  //   this.setState({ scoreWeight: data.value })
  //   let promotingInteroperability = this.state.promotingInteroperability
  //   var filteredMeasures = []
  //   var measureOptions = []

  //   if (data.value === 'all' && this.state.objectiveName === 'all') {
  //     filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
  //       return measure["PERFORMANCE SCORE WEIGHT"]
  //     })
  //   }
  //   else if (data.value !== 'all' && this.state.objectiveName === 'all') {
  //     filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
  //       console.log(data.value, measure["PERFORMANCE SCORE WEIGHT"].includes(data.value))
  //       return measure["PERFORMANCE SCORE WEIGHT"].includes(data.value) > 0
  //     })
  //   }
  //   else if (data.value === 'all' && this.state.objectiveName !== 'all') {
  //     filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
  //       return measure["OBJECTIVE NAME"].includes(this.state.objectiveName) > 0
  //     })
  //   }
  //   else {
  //     filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
  //       return (
  //         (data.value !== 'all' && measure["PERFORMANCE SCORE WEIGHT"].includes(data.value) > 0) &&
  //         (this.state.objectiveName != 'all' && measure["OBJECTIVE NAME"].includes(this.state.objectiveName) > 0))
  //     })

  //   }
  //   // this.setState({filteredMeasures:filteredMeasures})
  //   console.log(filteredMeasures, 'is it working for sure')

  //   for (var i = 0; i < filteredMeasures.length; i++) {
  //     push(measureOptions, { key: filteredMeasures[i]["MEASURE ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE ID"] }, true)
  //   }
  //   this.setState({ measureOptions: measureOptions })
  //   promotingInteroperability.scoreWeight = data.value
  //   promotingInteroperability.measureOptions = measureOptions
  //   this.setState({ promotingInteroperability: promotingInteroperability })
  //   this.props.updateStore({
  //     promotingInteroperability: promotingInteroperability,
  //     savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
  //   });
  // }


  handleMeasureChange = (event, data) => {
    console.log(data, 'so this is data')
    this.setState({ measure: data.value })
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.measure = data.value
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability,
      // measure:data.value,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });

  }
  clearMeasure(index) {
    let measureList = this.state.measureList
    if (index !== -1) {
      measureList.splice(index, 1);
    }
    this.setState({ measureList: measureList });
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.measureList = measureList
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });
  }
  setQuestionnarieResponse(measureId, questionnarieResponse) {
    let measureList = this.state.measureList;
    console.log("In set question res--", questionnarieResponse, measureId);
    let measureObj = measureList.find((m) => {
      return m.measureId === measureId
    })
    console.log(measureObj, measureList);
    measureObj["questionnarieResponse"] = questionnarieResponse;
    this.setState({ measureList });
    console.log("Measure List---", this.state.measureList);
    let promotingInteroperability = this.state.promotingInteroperability
    promotingInteroperability.measureList = measureList
    promotingInteroperability.measureObj = measureObj
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability
    });

  }
  showMeasureQuestionnarie(measureId) {
    let measureList = this.state.measureList;
    let measureObj = measureList.find((m) => {
      return m.measureId === measureId
    })
    console.log(measureObj, measureList);
    measureObj.showQuestionnarie = !measureObj.showQuestionnarie
    this.setState({ measureList });
  }
  displayQuestionnarie(data, measureId) {
    return (
      <DisplayQuestionnarie finaldata={data.item} updateCallback={this.setQuestionnarieResponse.bind(this, measureId)} />
    )
  }

  getQuestionnarieByIdentifier = async (identifier) => {
    let token = await createToken("client_credentials", 'payer', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
    token = "Bearer " + token;
    let fhir_url = "http://cdex.mettles.com:8180/hapi-fhir-jpaserver/fhir";
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "authorization": token,
    });
    var url = fhir_url + "/Measure?identifier=" + identifier;
    let questionnarie = await fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      return response.json();
    }).then(async (response) => {
      console.log("----------response", response.entry);
      if (response.hasOwnProperty('entry')) {
        console.log("url----" + response.entry);
        let measure = response.entry[0].resource
        if (measure.hasOwnProperty('relatedArtifact')) {
          var url = fhir_url + "/" + measure.relatedArtifact[0].resource;
          console.log("url----" + url);
          let questionnarieResource = await fetch(url, {
            method: "GET",
            headers: myHeaders
          }).then(res => {
            console.log("response----------", res);
            return res.json();
          }).then((res) => {
            console.log("---------Questionnarie-response", res);
            return res;
          }).catch(reason => {
            console.log("No Questionnarie response recieved from the server", reason)
            return false;
          }
          );
          return questionnarieResource;
        }
      }
    }).catch(reason => {
      console.log("No response recieved from the server", reason)
      return false;
    }
    );
    return questionnarie;
  }
  previousStep() {
    this.props.jumpToStep(2);
  }
  nextStep() {
    this.props.jumpToStep(4);
  }
  async addMeasure() {
    if (this.state.measure !== '') {
      if (!this.state.measureObj.hasOwnProperty(this.state.measure)) {
        let measureObj = this.state.measureObj
        let Obj = this.state.measureOptions.find((m) => {
          return m.key === this.state.measure
        })
        // let questionnarie = await this.getQuestionnarieByIdentifier(this.state.measure);
        let showQues = true;
        // if (!questionnarie) {
        //   showQues = false
        // }
        measureObj[this.state.measure] = Obj.text
        this.setState({ measureObj: measureObj })
        this.setState(prevState => ({
          measureList: [...prevState.measureList, {
            measureId: this.state.measure, measureName: Obj.text,
            objectivename: Obj.objectivename, measureweight: Obj.measureweight,
            showData: false, loading: true,
            //  questionnarie: questionnarie,
              // showQuestionnarie: showQues
          }]
        }))
        const { measureList } = this.state;
        let tempArr = [...measureList];
        tempArr.push({
          measureId: this.state.measure, measureName: Obj.text,
          objectivename: Obj.objectivename, measureweight: Obj.measureweight, showData: false,
          loading: true, 
          // questionnarie: questionnarie, showQuestionnarie: showQues
        });
        console.log(tempArr, 'tempArrs')
        let promotingInteroperability = this.state.promotingInteroperability
        promotingInteroperability.measureList = tempArr
        this.props.updateStore({
          promotingInteroperability: promotingInteroperability,
          savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
        });
      }
    }
  }
  render() {
    // console.log(this.props.getStore().measureList,'yess',this.props.getStore().promotingInteroperability.measureList)
    return (
      <div>
        <p className="text-center"><b>Promoting Interoperability</b>- 25% OF FINAL SCORE.  The Promoting Interoperability (PI) performance category assesses the meaningful use of certified EHR technology under the Quality Payment Program (QPP).
</p>
        <div className="form-row">
          <div className="form-group col-8 offset-1">
            <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you a Hospital-based MIPS eligible clinician?
          </div>
          <div className="form-group col-2">
            <label>
              <Switch onChange={this.handleQ1} checked={this.state.Q1} />
            </label>
          </div>
        </div>
        {!this.state.group &&
          <div className="form-row">
            <div className="form-group col-8 offset-1">
              <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you a Non-Patient-Facing clinicians?(Reporting as individual)
            </div>
            <div className="form-group col-2">
              <label>
                <Switch onChange={this.handleQ2} checked={this.state.Q2} />
              </label>
            </div>
          </div>
        }
        {this.state.group &&
          <div className="form-row">
            <div className="form-group col-8 offset-1">
              <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you a  group with greater than seventy five percent NPF clinicians?(Reporting as group)
          </div>
            <div className="form-group col-2">
              <label>
                <Switch onChange={this.handleQ2} checked={this.state.Q2} />
              </label>
            </div>
          </div>
        }
        <div className="form-row">
          <div className="form-group col-8 offset-1">
            <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you an Ambulatory Surgical Center (ASC) based MIPS eligible clinician?
          </div>
          <div className="form-group col-2">
            <label>
              <Switch onChange={this.handleQ3} checked={this.state.Q3} />
            </label>
          </div>
        </div>
        {this.state.group &&
          <div className="form-row">
            <div className="form-group col-8 offset-1">
              <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you MIPS-eligible clinician in small practice ( less than or equal to 15) ?(Reporting as group)
          </div>
            <div className="form-group col-2">
              <label>
                <Switch onChange={this.handleQ4} checked={this.state.Q4} />
              </label>
            </div>
          </div>
        }
        {(!this.state.Q1 && !this.state.Q2 && !this.state.Q3 && !this.state.Q4) &&
          <div>
            <div className="form-row">
              <div className="form-group col-8 offset-1">
                <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you MIPS-eligible clinicians using decertified EHR technology?
          </div>
              <div className="form-group col-2">
                <label>
                  <Switch onChange={this.handleQ5} checked={this.state.Q5} />
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-8 offset-1">
                <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Do you Lack control over the availability of CEHRT?
          </div>
              <div className="form-group col-2">
                <label>
                  <Switch onChange={this.handleQ6} checked={this.state.Q6} />
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-8 offset-1">
                <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Do you have Insufficient Internet connectivity?
          </div>
              <div className="form-group col-2">
                <label>
                  <Switch onChange={this.handleQ7} checked={this.state.Q7} />
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-8 offset-1">
                <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you a victim of Extreme and uncontrollable circumstances (Natural Disasters, Practice Closure, Severe Financial Distress, or Vendor Issues)?
          </div>
              <div className="form-group col-2">
                <label>
                  <Switch onChange={this.handleQ8} checked={this.state.Q8} />
                </label>
              </div>
            </div>
            {/* <div className="form-row">
              <div className="form-group col-8 offset-1">
                9. Are you a victim of Extreme and uncontrollable circumstances (Natural Disasters, Practice Closure, Severe Financial Distress, or Vendor Issues)?
          </div>
              <div className="form-group col-2">
                <label>
                  <Switch onChange={this.handleQ9} checked={this.state.Q9} />
                </label>
              </div>
            </div> */}
          </div>
        }

        {(!this.state.Q1 && !this.state.Q2 && !this.state.Q3 && !this.state.Q4 && !this.state.Q5 && !this.state.Q6 && !this.state.Q7 && !this.state.Q8) &&
          <div>
            <div className="form-row">
              <div className="form-group col-md-5 offset-1">
                <span className="title-small">Objective Name</span>
                <Dropdown
                  className={"blackBorder"}
                  options={this.state.objectiveOptions}
                  placeholder='Objective Name'
                  search
                  selection
                  fluid
                  value={this.state.objectiveName}
                  onChange={this.handleObjectiveChange}
                />
              </div>
              {/* <div className="form-group col-md-5">
                <span className="title-small">Score Weight</span>
                <Dropdown
                  className={"blackBorder"}
                  options={this.state.scoreWeightOptions}
                  placeholder='Score Weight'
                  search
                  selection
                  fluid
                  value={this.state.scoreWeight}
                  onChange={this.handleScoreWeightChange}
                />
              </div> */}
            </div>
            <div className="form-row">
              <div className="form-group col-md-9 offset-1">
                <span className="title-small">Search and Select Measure</span>
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
                <span><button style={{ marginTop: "22px" }} className="ui circular icon button" onClick={() => this.addMeasure()}><i aria-hidden="true" className="add icon"></i></button></span>
              </div>
            </div>

            <div className="form-row ">
              <div style={{ width: "100%", margin: "10px" }}>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <span className="title-small">Measure ID</span>
                  </div>
                  <div className="form-group col-md-5">
                    <span className="title-small">Measure Name</span>
                  </div>
                  <div className="form-group col-md-2">
                    <span className="title-small">Measure Questionnarie</span>
                  </div>
                  <div className="form-group col-md-1">
                  </div>
                </div>
                {this.state.measureList.map((measure, i) => {
                  return (<div key={i}>
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <span>{measure.measureId}</span>
                      </div>
                      <div className="form-group col-md-5">
                        <span>{measure.measureName}</span>
                      </div>
                      {measure.showQuestionnarie &&
                        <div className="form-group col-md-2">
                          <a style={{ color: "#18d26e", cursor: "pointer" }} onClick={() => this.showMeasureQuestionnarie(measure.measureId)}>Show Questionnarie</a>
                        </div>
                      }
                      <div className="form-group col-md-1">
                        <button className="btn list-btn" onClick={() => this.clearMeasure(i)}>
                          x
                           </button>
                      </div>
                    </div>
                    {measure.showQuestionnarie &&
                      <div className="form-row">
                        <div className="form-group col-12">
                          {this.displayQuestionnarie(measure.questionnarie, measure.measureId)}
                        </div>
                      </div>
                    }
                  </div>)
                })
                }
              </div>
              {/* <table className="table col-10 offset-1">
                <thead>
                  <tr>
                    <th>Measure ID</th>
                    <th>Measure Name</th>
                    <th>Objective</th>
                    <th>Weight</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.measureList.map((measure, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <span>{measure.measureId}</span>
                        </td>
                        <td>
                          <span>{measure.measureName}</span>
                        </td>
                        <td>
                          <span>{measure.objectivename}</span>
                        </td>
                        <td>
                          <span>{measure.measureweight}</span>
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
              </table> */}
            </div>
          </div>
        }
        <div class="footer-buttons">
          <button type="button" class="btn btn-prev btn-primary btn-lg pull-left" id="next-button" onClick={() => this.previousStep()}>Previous</button>
          <button type="button" class="btn btn-prev btn-primary btn-lg pull-right" id="next-button" onClick={() => this.nextStep()}>Next</button>
        </div>
      </div>
    )
  }
}
