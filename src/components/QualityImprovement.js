'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import qualityMeasures from '../json/qualityMeasures.json'


var collectionTypeOptions = []
var specificMeasureTypeOptions = []
var measureTypeOptions = []

for (var i = 0; i < qualityMeasures.length; i++) {
  var collectionTypeKey = qualityMeasures[i]["DATA SUBMISSION METHOD"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');

  //setting options for Specific measure type
  if (qualityMeasures[i]["SPECIALTY MEASURE SET"].indexOf(',') > -1) {
    var arr = qualityMeasures[i]["SPECIALTY MEASURE SET"].split(',')
    for (var j = 0; j < arr.length; j++) {
      var specificMeasureTypeKey = arr[j].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
      push(specificMeasureTypeOptions, { key: 'all', text: 'All', value: "all" })
      push(specificMeasureTypeOptions, { key: specificMeasureTypeKey, text: arr[j], value: arr[j] })
    }
  }
  else {
    var specificMeasureTypeKey = qualityMeasures[i]["SPECIALTY MEASURE SET"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
    push(specificMeasureTypeOptions, { key: 'all', text: 'All', value: "all" })
    push(specificMeasureTypeOptions, { key: specificMeasureTypeKey, text: qualityMeasures[i]["SPECIALTY MEASURE SET"], value: qualityMeasures[i]["SPECIALTY MEASURE SET"] })

  }


  //setting options for measure type
  var measureTypeKey = qualityMeasures[i]["MEASURE TYPE"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
  push(measureTypeOptions, { key: 'all', text: 'All', value: 'all' })
  push(measureTypeOptions, { key: measureTypeKey, text: qualityMeasures[i]["MEASURE TYPE"], value: qualityMeasures[i]["MEASURE TYPE"] })


  //setting options for Collection type
  if (qualityMeasures[i]["DATA SUBMISSION METHOD"].indexOf(',') > -1) {
    var collectionTypeArr = qualityMeasures[i]["DATA SUBMISSION METHOD"].split(',')
    for (var j = 0; j < collectionTypeArr.length; j++) {
      var collectionTypeKey = collectionTypeArr[j].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');
      push(collectionTypeOptions, { key: 'all', text: 'All', value: "all" })
      push(collectionTypeOptions, { key: collectionTypeKey, text: collectionTypeArr[j], value: collectionTypeArr[j] })
    }
  }
  else {
    // var collectionTypeKey = qualityMeasures[i]["SPECIALTY MEASURE SET"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
    push(collectionTypeOptions, { key: 'all', text: 'All', value: "all" })
    push(collectionTypeOptions, { key: collectionTypeKey, text: qualityMeasures[i]["DATA SUBMISSION METHOD"], value: qualityMeasures[i]["DATA SUBMISSION METHOD"] })

  }
  console.log('collectiont type', collectionTypeOptions)
}


function push(array, item) {
  if (!array.find(({ text }) => text === item.text)) {
    array.push(item);
  }
}


export default class QualityImprovement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionType: props.getStore().qualityImprovement.collectionType,
      measure: props.getStore().qualityImprovement.measure,
      measureList: props.getStore().qualityImprovement.measureList,
      qualityImprovement: props.getStore().qualityImprovement,
      specialtyMeasureSet: props.getStore().qualityImprovement.specialtyMeasureSet,
      // specialtyMeasureSetOptions:specialtyMeasureSetOptions,
      measureOptions: props.getStore().qualityImprovement.measureOptions,
      collectionTypeOptions: collectionTypeOptions,
      measureType: props.getStore().qualityImprovement.measureType,
      measureTypeOptions: measureTypeOptions,
      specialtyMeasureSetOptions: specificMeasureTypeOptions,
      filteredMeasures: [],
      measureObj: {}
    };
    this.handleCollectionTypeChange = this.handleCollectionTypeChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
    this.handleSpecialtyMeasureChange = this.handleSpecialtyMeasureChange.bind(this);
    this.handleMeasureTypeChange = this.handleMeasureTypeChange.bind(this);
  }

  componentDidMount() {
    var measureOptions = []
    for (var i = 0; i < qualityMeasures.length; i++) {
      push(measureOptions, {
        key: qualityMeasures[i]["QUALITY ID"],
        text: qualityMeasures[i]["MEASURE NAME"],
        value: qualityMeasures[i]["QUALITY ID"]
      }, true)
    }
    this.setState({ measureOptions: measureOptions })
    //   var arr =[]
    //   for(var i =0;i<this.state.measures.length;i++){
    //     if(this.state.collectionType ===this.state.measures[i].category){
    //       arr.push(this.state.measures[i])
    //     }
    //   }
    //   this.setState({measureOptions:arr})

  }

  componentWillUnmount() { }

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleCollectionTypeChange = (event, data) => {
    this.setState({ collectionType: data.value })
    let qualityImprovement = this.state.qualityImprovement
    var filteredMeasures = []
    let measureOptions = []
    if (data.value === 'all' && this.state.specialtyMeasureSet === 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["DATA SUBMISSION METHOD"]
      })
    }
    else if (data.value !== 'all' && this.state.specialtyMeasureSet === 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["DATA SUBMISSION METHOD"].includes(data.value)
      })
    }
    else if (data.value === 'all' && this.state.specialtyMeasureSet === 'all' && this.state.measureType !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["MEASURE TYPE"].includes(this.state.measureType)
      })
    }
    else if (data.value === 'all' && this.state.specialtyMeasureSet !== 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet)
      })
    }
    else if (data.value !== 'all' && this.state.specialtyMeasureSet !== 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["DATA SUBMISSION METHOD"].includes(data.value) > 0) &&
          (this.state.specialtyMeasureSet != 'all' && measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet) > 0))
      })
    }
    else if (data.value !== 'all' && this.state.specialtyMeasureSet === 'all' && this.state.measureType !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["DATA SUBMISSION METHOD"].includes(data.value) > 0) &&
          (this.state.measureType != 'all' && measure["MEASURE TYPE"].includes(this.state.measureType) > 0))
      })
    }
    else if (data.value === 'all' && this.state.specialtyMeasureSet !== 'all' && this.state.measureType !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (this.state.specialtyMeasureSet !== 'all' && measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet) > 0) &&
          (this.state.measureType != 'all' && measure["MEASURE TYPE"].includes(this.state.measureType) > 0))
      })
    }
    else {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["DATA SUBMISSION METHOD"].includes(data.value) > 0) &&
          (this.state.specialtyMeasureSet !== 'all' && measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet) > 0) &&
          (this.state.measureType != 'all' && measure["MEASURE TYPE"].includes(this.state.measureType) > 0))
      })

    }

    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: filteredMeasures[i]["QUALITY ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["QUALITY ID"] }, true)
    }


    this.setState({ measureOptions: measureOptions })
    qualityImprovement.collectionType = data.value
    qualityImprovement.measureOptions = measureOptions
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement,
      // collectionType: collectionType,
    });  // Update store here (this is just an example, in reality you will do it via redux or flux)
  }


  handleSpecialtyMeasureChange = (event, data) => {
    this.setState({ specialtyMeasureSet: data.value })
    var filteredMeasures = []

    var measureOptions = []

    if (data.value === 'all' && this.state.collectionType === 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["SPECIALTY MEASURE SET"]
      })
    }
    else if (data.value !== 'all' && this.state.collectionType === 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["SPECIALTY MEASURE SET"].includes(data.value)
      })
    }
    else if (data.value === 'all' && this.state.collectionType === 'all' && this.state.measureType !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["MEASURE TYPE"].includes(this.state.measureType)
      })
    }
    else if (data.value === 'all' && this.state.collectionType !== 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["SPECIALTY MEASURE SET"].includes(this.state.measureType)
      })
    }
    else if (data.value !== 'all' && this.state.collectionType !== 'all' && this.state.measureType === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["SPECIALTY MEASURE SET"].includes(data.value) > 0) &&
          (this.state.collectionType != 'all' && measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType) > 0))
      })
    }
    else if (data.value !== 'all' && this.state.collectionType === 'all' && this.state.measureType !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["SPECIALTY MEASURE SET"].includes(data.value) > 0) &&
          (this.state.measureType != 'all' && measure["MEASURE TYPE"].includes(this.state.measureType) > 0))
      })
    }
    else if (data.value === 'all' && this.state.collectionType !== 'all' && this.state.measureType !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (this.state.collectionType !== 'all' && measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType) > 0) &&
          (this.state.measureType != 'all' && measure["MEASURE TYPE"].includes(this.state.measureType) > 0))
      })
    }
    else {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["SPECIALTY MEASURE SET"].includes(data.value) > 0) &&
          (this.state.collectionType !== 'all' && measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType) > 0) &&
          (this.state.measureType != 'all' && measure["MEASURE TYPE"].includes(this.state.measureType) > 0))
      })

    }
    console.log(filteredMeasures, 'oh yeha')
    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: filteredMeasures[i]["QUALITY ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["QUALITY ID"] }, true)
    }
    let qualityImprovement = this.state.qualityImprovement
    this.setState({ measureOptions: measureOptions })
    qualityImprovement.specialtyMeasureSet = data.value
    qualityImprovement.measureOptions = measureOptions
    this.setState({ qualityImprovement: qualityImprovement })
    // this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });

  }
  handleMeasureTypeChange = (event, data) => {
    this.setState({ measureType: data.value })
    var measureOptions = []
    var filteredMeasures = []
    if (data.value === 'all' && this.state.collectionType === 'all' && this.state.specialtyMeasureSet === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["MEASURE TYPE"]
      })
    }
    else if (data.value !== 'all' && this.state.collectionType === 'all' && this.state.specialtyMeasureSet === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["MEASURE TYPE"].includes(data.value)
      })
    }
    else if (data.value === 'all' && this.state.collectionType === 'all' && this.state.specialtyMeasureSet !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet)
      })
    }
    else if (data.value === 'all' && this.state.collectionType !== 'all' && this.state.specialtyMeasureSet === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType)
      })
    }
    else if (data.value !== 'all' && this.state.collectionType !== 'all' && this.state.specialtyMeasureSet === 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["MEASURE TYPE"].includes(data.value) > 0) &&
          (this.state.collectionType != 'all' && measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType) > 0))
      })
    }
    else if (data.value !== 'all' && this.state.collectionType === 'all' && this.state.specialtyMeasureSet !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["MEASURE TYPE"].includes(data.value) > 0) &&
          (this.state.specialtyMeasureSet != 'all' && measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet) > 0))
      })
    }
    else if (data.value === 'all' && this.state.collectionType !== 'all' && this.state.specialtyMeasureSet !== 'all') {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (this.state.collectionType !== 'all' && measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType) > 0) &&
          (this.state.specialtyMeasureSet != 'all' && measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet) > 0))
      })
    }
    else {
      filteredMeasures = qualityMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["MEASURE TYPE"].includes(data.value) > 0) &&
          (this.state.collectionType !== 'all' && measure["DATA SUBMISSION METHOD"].includes(this.state.collectionType) > 0) &&
          (this.state.specialtyMeasureSet != 'all' && measure["SPECIALTY MEASURE SET"].includes(this.state.specialtyMeasureSet) > 0))
      })

    }

    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: filteredMeasures[i]["QUALITY ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["QUALITY ID"] })
    }

    let qualityImprovement = this.state.qualityImprovement
    this.setState({ measureOptions: measureOptions })
    qualityImprovement.measureType = data.value
    qualityImprovement.measureOptions = measureOptions
    this.setState({ qualityImprovement: qualityImprovement })
    // this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });

  }
  handleMeasureChange = (event, data) => {
    console.log(data, 'in measure data')
    this.setState({ measure: data.value })
    let qualityImprovement = this.state.qualityImprovement
    qualityImprovement.measure = data.value
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement,
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
    let qualityImprovement = this.state.qualityImprovement
    qualityImprovement.measureList = measureList
    this.props.updateStore({
      qualityImprovement: qualityImprovement,
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
        let qualityImprovement = this.state.qualityImprovement
        qualityImprovement.measureList = tempArr
        this.props.updateStore({
          qualityImprovement: qualityImprovement,
          savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
        });
      }
    }
  }
  render() {
    return (
      <div>
        <p className="text-center"><b>Quality</b> - worth 45% of the total. Must report on 6 measures worth up to 10 points each and scored against benchmarks.  Bonus points for reporting an additional outcome or high-priority measure and for end-to-end reporting.</p>
        <div className="form-row">
          {/* <div className="form-group col-2 offset-1">
            <h4 className="title">Filter Measures</h4>
          </div> */}
          <div className="form-group col-3 offset-1">
            <span className="title-small">Collection Type</span>
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
          <div className="form-group col-3">
            <span className="title-small">Measure Type</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.measureTypeOptions}
              placeholder='Measure Type'
              search
              selection
              fluid
              value={this.state.measureType}
              onChange={this.handleMeasureTypeChange}
            />
          </div>

          <div className="form-group col-4">
            <span className="title-small">Specialty Measure Set</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.specialtyMeasureSetOptions}
              placeholder='Specialty Measure Set'
              search
              selection
              fluid
              value={this.state.specialtyMeasureSet}
              onChange={this.handleSpecialtyMeasureChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-9 offset-1">
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
          <div className="form-group col-2">
            <span><button style={{marginTop: "22px"}} class="ui circular icon button" onClick={() => this.addMeasure()}><i aria-hidden="true" class="add icon"></i></button></span>
          </div>
        </div>
        <div className="form-row">
          <table className="table col-10 offset-1">
            <thead>
              <tr>
                <th>Measure Name</th>
                <th>Measure ID</th>
                <th></th>
              </tr>
            </thead>
            {this.state.measureList.length > 0 &&
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
            }
          </table>
        </div>
      </div>
    )
  }
}