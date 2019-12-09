'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import improvementMeasures from '../json/improvementActivitiesMeasures.json';
import QualityImprovement from './QualityImprovement.js';
import Switch from "react-switch";


var activityWeightOptions = []
var subCategoryOptions = []

for (var i = 0; i < improvementMeasures.length; i++) {

  //setting options for Subcategory Name
  var subCategoryKey = improvementMeasures[i]["SUBCATEGORY NAME"].toString().replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
  push(subCategoryOptions, { key: 'all', text: 'All', value: "all" })
  push(subCategoryOptions, { key: subCategoryKey, text: improvementMeasures[i]["SUBCATEGORY NAME"], value: improvementMeasures[i]["SUBCATEGORY NAME"] })

  //setting options for Activity Weight
  var objectiveKey = improvementMeasures[i]["ACTIVITY WEIGHTING"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');
  push(activityWeightOptions, { key: 'all', text: 'All', value: "all" })
  push(activityWeightOptions, { key: objectiveKey, text: improvementMeasures[i]["ACTIVITY WEIGHTING"], value: improvementMeasures[i]["ACTIVITY WEIGHTING"] })

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
export default class ImprovementActivities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionType: '',
      measureList: props.getStore().improvementActivity.measureList,
      activityWeightOptions: activityWeightOptions,
      subCategoryOptions: subCategoryOptions,
      improvementActivity: props.getStore().improvementActivity,
      measure: props.getStore().improvementActivity.measure,
      measureObj: {},
      measureOptions: props.getStore().improvementActivity.measureOptions,
      subCategoryName: props.getStore().improvementActivity.subCategoryName,
      activityWeight: props.getStore().improvementActivity.activityWeight,
      filteredMeasures: [],
      hpsa: props.getStore().improvementActivity.hpsa,
      tin: props.getStore().improvementActivity.tin,
      practice: props.getStore().improvementActivity.practice,
      npf: props.getStore().improvementActivity.npf,
      group: props.getStore().improvementActivity.group
    };
    this.handleActivityWeightChange = this.handleActivityWeightChange.bind(this);
    this.handleSubcategoryNameChange = this.handleSubcategoryNameChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
    this.handleHpsa = this.handleHpsa.bind(this);
    this.handleTin = this.handleTin.bind(this);
    this.handlePractice = this.handlePractice.bind(this);
    this.handleNpf = this.handleNpf.bind(this);
    this.handleGroup = this.handleGroup.bind(this);
  }


  componentDidMount() {
    var measureOptions = []
    for (var i = 0; i < improvementMeasures.length; i++) {
      push(measureOptions, { key: improvementMeasures[i]["ACTIVITY ID"], text: improvementMeasures[i]["ACTIVITY NAME"], value: improvementMeasures[i]["ACTIVITY ID"], activityWeight: improvementMeasures[i]["ACTIVITY WEIGHTING"] }, true)
    }
    this.setState({ measureOptions: measureOptions })
  }

  componentWillUnmount() { }

  handleGroup(group) {
    this.setState({ group });
    let improvementActivity = this.state.improvementActivity
    improvementActivity.group = group;
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });
  }

  handleHpsa(hpsa) {
    this.setState({ hpsa });
    let improvementActivity = this.state.improvementActivity
    improvementActivity.hpsa = hpsa;
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });
  }
  handleTin(tin) {
    this.setState({ tin });
    let improvementActivity = this.state.improvementActivity
    improvementActivity.tin = tin;
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });
  }
  handlePractice(practice) {
    this.setState({ practice });
    let improvementActivity = this.state.improvementActivity
    improvementActivity.practice = practice;
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });
  }
  handleNpf(npf) {
    this.setState({ npf });
    let improvementActivity = this.state.improvementActivity
    improvementActivity.npf = npf;
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });
  }

  handleSubcategoryNameChange = (event, data) => {
    this.setState({ subCategoryName: data.value })
    let improvementActivity = this.state.improvementActivity

    var filteredMeasures = []

    var measureOptions = []
    if (data.value === 'all' && this.state.activityWeight === 'all') {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return measure["SUBCATEGORY NAME"]
      })
    }
    else if (data.value !== 'all' && this.state.activityWeight === 'all') {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return measure["SUBCATEGORY NAME"].includes(data.value) > 0
      })
    }
    else if (data.value === 'all' && this.state.activityWeight !== 'all') {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return measure["ACTIVITY WEIGHTING"].includes(this.state.activityWeight) > 0
      })
    }
    else {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["SUBCATEGORY NAME"].includes(data.value) > 0) &&
          (this.state.activityWeight != 'all' && measure["ACTIVITY WEIGHTING"].includes(this.state.activityWeight) > 0))
      })

    }

    console.log(filteredMeasures, 'is it working')
    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: improvementMeasures[i]["ACTIVITY ID"], text: improvementMeasures[i]["ACTIVITY NAME"], value: improvementMeasures[i]["ACTIVITY ID"] }, true)
    }
    this.setState({ measureOptions: measureOptions })
    improvementActivity.subCategoryName = data.value
    improvementActivity.measureOptions = measureOptions
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });


  }

  handleActivityWeightChange = (event, data) => {
    this.setState({ activityWeight: data.value })
    let improvementActivity = this.state.improvementActivity
    var filteredMeasures = []
    var measureOptions = []

    if (data.value === 'all' && this.state.subCategoryName === 'all') {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return measure["ACTIVITY WEIGHTING"]
      })
    }
    else if (data.value !== 'all' && this.state.subCategoryName === 'all') {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return measure["ACTIVITY WEIGHTING"].includes(data.value) > 0
      })
    }
    else if (data.value === 'all' && this.state.subCategoryName !== 'all') {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return measure["SUBCATEGORY NAME"].includes(this.state.subCategoryName) > 0
      })
    }
    else {
      filteredMeasures = improvementMeasures.filter((measure) => {
        return (
          (data.value !== 'all' && measure["ACTIVITY WEIGHTING"].includes(data.value) > 0) &&
          (this.state.subCategoryName != 'all' && measure["SUBCATEGORY NAME"].includes(this.state.subCategoryName) > 0))
      })

    }
    console.log(filteredMeasures, 'is it working for sure')
    // this.setState({filteredMeasures:filteredMeasures})

    for (var i = 0; i < filteredMeasures.length; i++) {
      push(measureOptions, { key: improvementMeasures[i]["ACTIVITY ID"], text: improvementMeasures[i]["ACTIVITY NAME"], value: improvementMeasures[i]["ACTIVITY ID"] }, true)
    }
    this.setState({ measureOptions: measureOptions })
    improvementActivity.activityWeight = data.value
    improvementActivity.measureOptions = measureOptions
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });
  }

  handleMeasureChange = (event, data) => {
    console.log(data, 'so this is data')
    this.setState({ measure: data.value })
    let improvementActivity = this.state.improvementActivity
    improvementActivity.measure = data.value
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity: improvementActivity
    });

  }
  clearMeasure(index) {
    let measureList = this.state.measureList
    if (index !== -1) {
      measureList.splice(index, 1);
    }
    this.setState({ measureList: measureList });
    let improvementActivity = this.state.improvementActivity
    improvementActivity.measureList = measureList
    this.props.updateStore({
      improvementActivity: improvementActivity
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
          measureList: [...prevState.measureList, { measureId: this.state.measure, measureName: Obj.text, activityWeight: Obj.activityWeight, showData: false, loading: true }]
        }))
        const { measureList } = this.state;
        let tempArr = [...measureList];
        tempArr.push({ measureId: this.state.measure, measureName: Obj.text, activityWeight: Obj.activityWeight, showData: false, loading: true });
        console.log(tempArr, 'tempArrs')
        let improvementActivity = this.state.improvementActivity
        improvementActivity.measureList = tempArr
        this.props.updateStore({
          improvementActivity: improvementActivity
        });
      }
    }

  }
  render() {
    return (
      <div>
        <p className="text-center"><b>Improvement Activities</b>– 15% OF FINAL SCORE.  The Improvement Activities performance category rewards clinicians for delivering care that emphasizes care coordination, patient engagement, and patient safety. For 2019, data for a minimum of 90 continuous days will need to be reported for the IA category. You have to attest that you completed <b>one or more</b> out of <b>118</b> Improvement Activities available in 2019.</p>
        <div className="form-row">
          <div className="form-group col-8 offset-1">
          <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you reporting as a group?
          </div>
          <div className="form-group col-2">
            <label>
              <Switch onChange={this.handleGroup} checked={this.state.group} />
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-8 offset-1">
          <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Is the practice in a Rural area or a Health Professional Shortage area (HPSA) ?
          </div>
          <div className="form-group col-2">
            <label>
              <Switch onChange={this.handleHpsa} checked={this.state.hpsa} />
            </label>
          </div>
        </div>
        {this.state.group &&
          <div className="form-row">
            <div className="form-group col-8 offset-1">
            <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Does the practice have less than or equal to 15 Eligible Clinicians ?
        </div>
            <div className="form-group col-2">
              <label>
                <Switch onChange={this.handlePractice} checked={this.state.practice} />
              </label>
            </div>
          </div>
        }
        <div className="form-row">
          <div className="form-group col-8 offset-1">
          <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Are you a non-patient-facing Clinician?
          </div>
          <div className="form-group col-2">
            <label>
              <Switch onChange={this.handleNpf} checked={this.state.npf} />
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-8 offset-1">
          <span><i aria-hidden="true" className="ui caret right small icon"></i></span> Does more than half (50 percent) of the practice sites within your TIN  certified as Patient Centered Medical Home (PCMH) ?
          </div>
          <div className="form-group col-2">
            <label>
              <Switch onChange={this.handleTin} checked={this.state.tin} />
            </label>
          </div>
        </div>
        {!this.state.tin &&
          <div>
            <div className="form-row">
              <div className="form-group col-5 offset-1">
                <span className="title-small">Subcategory Name</span>
                <Dropdown
                  className={"blackBorder"}
                  options={this.state.subCategoryOptions}
                  placeholder='Subcategory Name'
                  search
                  selection
                  fluid
                  value={this.state.subCategoryName}
                  onChange={this.handleSubcategoryNameChange}
                />
              </div>
              <div className="form-group col-5">
                <span className="title-small">Activity Weight</span>
                <Dropdown
                  className={"blackBorder"}
                  options={this.state.activityWeightOptions}
                  placeholder='Activity Weight'
                  search
                  selection
                  fluid
                  value={this.state.activityWeight}
                  onChange={this.handleActivityWeightChange}
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
                <span><button style={{ marginTop: "22px" }} class="ui circular icon button" onClick={() => this.addMeasure()}><i aria-hidden="true" class="add icon"></i></button></span>
              </div>
            </div>

            <div className="form-row">
              <table className="table col-10 offset-1">
                <thead>
                  <tr>
                    <th>Activity ID </th>
                    <th>Activity Name </th>
                    <th>Activity Weight </th>
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
                          <span>{measure.activityWeight}</span>
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
        }
      </div>
    )
  }
}