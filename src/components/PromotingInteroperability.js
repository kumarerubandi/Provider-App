'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Promise from 'promise';
import promotingInteroperabilityMeasures from '../json/promotingInteroperabilityMeasures.json'


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

  console.log('collectiont type', objectiveOptions)
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
      measureObj: {},

      scoreWeight: props.getStore().promotingInteroperability.scoreWeight,
      measureOptions: props.getStore().promotingInteroperability.measureOptions,
    };
    this.handleObjectiveChange = this.handleObjectiveChange.bind(this);
    this.handleScoreWeightChange = this.handleScoreWeightChange.bind(this);

    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  componentDidMount() {
    var measureOptions = []
    for (var i = 0; i < promotingInteroperabilityMeasures.length; i++) {
      push(measureOptions, { key: promotingInteroperabilityMeasures[i]["MEASURE ID"], text: promotingInteroperabilityMeasures[i]["MEASURE NAME"], value: promotingInteroperabilityMeasures[i]["MEASURE ID"] }, true)
    }
    this.setState({ measureOptions: measureOptions })
  }

  componentWillUnmount() { }

  // not required as this component has no forms or user entry
  // isValidated() {}


  handleObjectiveChange = (event, data) => {
    this.setState({ objectiveName: data.value })
    let promotingInteroperability = this.state.promotingInteroperability
    var filteredMeasures = []
    var measureOptions = []


    if (data.value === 'all' && this.state.scoreWeight === 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["OBJECTIVE NAME"]
      })
    }
    else if (data.value !== 'all' && this.state.scoreWeight === 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["OBJECTIVE NAME"].includes(data.value) > 0
      })
    }
    else if (data.value === 'all' && this.state.scoreWeight !== 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["PERFORMANCE SCORE WEIGHT"].includes(this.state.scoreWeight) > 0
      })
    }
    else {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["OBJECTIVE NAME"].includes(data.value) > 0) &&
          (this.state.scoreWeight != 'all' && measure["PERFORMANCE SCORE WEIGHT"].includes(this.state.scoreWeight) > 0))
      })

    }
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

  handleScoreWeightChange = (event, data) => {
    this.setState({ scoreWeight: data.value })
    let promotingInteroperability = this.state.promotingInteroperability
    var filteredMeasures = []
    var measureOptions = []

    if (data.value === 'all' && this.state.objectiveName === 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["PERFORMANCE SCORE WEIGHT"]
      })
    }
    else if (data.value !== 'all' && this.state.objectiveName === 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        console.log(data.value, measure["PERFORMANCE SCORE WEIGHT"].includes(data.value))
        return measure["PERFORMANCE SCORE WEIGHT"].includes(data.value) > 0
      })
    }
    else if (data.value === 'all' && this.state.objectiveName !== 'all') {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return measure["OBJECTIVE NAME"].includes(this.state.objectiveName) > 0
      })
    }
    else {
      filteredMeasures = promotingInteroperabilityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["PERFORMANCE SCORE WEIGHT"].includes(data.value) > 0) &&
          (this.state.objectiveName != 'all' && measure["OBJECTIVE NAME"].includes(this.state.objectiveName) > 0))
      })

    }
    // this.setState({filteredMeasures:filteredMeasures})
    console.log(filteredMeasures, 'is it working for sure')

    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: filteredMeasures[i]["MEASURE ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE ID"] }, true)
    }
    this.setState({ measureOptions: measureOptions })
    promotingInteroperability.scoreWeight = data.value
    promotingInteroperability.measureOptions = measureOptions
    this.setState({ promotingInteroperability: promotingInteroperability })
    this.props.updateStore({
      promotingInteroperability: promotingInteroperability,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
  }


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
      promotingInteroperability: promotingInteroperability,
      // measureList:measureList,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });

  }
  addMeasure() {
    if (this.state.measure !== '') {
      if (!this.state.measureObj.hasOwnProperty(this.state.measure)) {
        let measureObj = this.state.measureObj
        let Obj = this.state.measureOptions.find((m) => {
          return m.key === this.state.measure
        })
        measureObj[this.state.measure] = Obj.text
        this.setState({ measureObj: measureObj })
        this.setState(prevState => ({
          measureList: [...prevState.measureList, { measureId: this.state.measure, measureName: Obj.text }]
        }))
        const { measureList } = this.state;
        let tempArr = [...measureList];
        tempArr.push({ measureId: this.state.measure, measureName: Obj.text });
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
        <p className="text-center"><b>Promoting Interoperability</b>- worth 25% of the total.  Base score is worth 50 points, and performance plus bonus score potential points are 155, but with a maximum score of 100 (base+ performance+ bonus)</p>
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
          <div className="form-group col-md-5">
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
          </div>
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
            <span><button style={{marginTop:"22px"}} class="ui circular icon button" onClick={() => this.addMeasure()}><i aria-hidden="true" class="add icon"></i></button></span>
          </div>
        </div>

        <div className="form-row ">
          <table className="table col-10 offset-1">
            <thead>
              <tr>
                <th>Measure Name</th>
                <th>Measure ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.measureList.map((measure, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <span>{measure.measureName}</span>
                    </td>
                    <td>
                      <span>{measure.measureId}</span>
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