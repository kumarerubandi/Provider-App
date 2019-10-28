'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';
import qualityMeasures from '../json/qualityMeasures.json'


var collectionTypeOptions=[]
var specificMeasureTypeOptions = []
var measureTypeOptions=[]

for(var i =0;i<qualityMeasures.length;i++){
  var collectionTypeKey=qualityMeasures[i]["DATA SUBMISSION METHOD"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');
  
  //setting options for Specific measure type
  if(qualityMeasures[i]["SPECIALTY MEASURE SET"].indexOf(',') >-1){
    var arr =qualityMeasures[i]["SPECIALTY MEASURE SET"].split(',')
    for(var j=0;j<arr.length;j++){
      var specificMeasureTypeKey = arr[j].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
      push(specificMeasureTypeOptions, {key:'all', text:'All', value: "all" })
      push(specificMeasureTypeOptions, {key:specificMeasureTypeKey, text:arr[j], value: arr[j] })
    }
  }
  else{
    var specificMeasureTypeKey = qualityMeasures[i]["SPECIALTY MEASURE SET"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
    push(specificMeasureTypeOptions, {key:'all', text:'All', value: "all" })
    push(specificMeasureTypeOptions, {key:specificMeasureTypeKey, text:qualityMeasures[i]["SPECIALTY MEASURE SET"], value: qualityMeasures[i]["SPECIALTY MEASURE SET"] })

  }


  //setting options for measure type
  var measureTypeKey = qualityMeasures[i]["MEASURE TYPE"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
  push(measureTypeOptions, {key:'all', text:'All', value:'all' })
  push(measureTypeOptions, {key:measureTypeKey, text:qualityMeasures[i]["MEASURE TYPE"], value:qualityMeasures[i]["MEASURE TYPE"] })


  //setting options for Collection type
  if(qualityMeasures[i]["DATA SUBMISSION METHOD"].indexOf(',') >-1){
    var collectionTypeArr =qualityMeasures[i]["DATA SUBMISSION METHOD"].split(',')
    for(var j=0;j<collectionTypeArr.length;j++){
      var collectionTypeKey = collectionTypeArr[j].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');
      push(collectionTypeOptions, {key:'all', text:'All', value: "all" })
      push(collectionTypeOptions, {key:collectionTypeKey, text:collectionTypeArr[j], value: collectionTypeArr[j] })
    }
  }
  else{
    // var collectionTypeKey = qualityMeasures[i]["SPECIALTY MEASURE SET"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
    push(collectionTypeOptions, {key:'all', text:'All', value: "all" })
    push(collectionTypeOptions, {key:collectionTypeKey, text:qualityMeasures[i]["DATA SUBMISSION METHOD"], value: qualityMeasures[i]["DATA SUBMISSION METHOD"] })

  }
  console.log('collectiont type',collectionTypeOptions)
}


function push(array, item) {
  if (!array.find(({text}) => text === item.text)) {
    array.push(item);
  }
}


export default class QualityImprovement extends Component {
  constructor(props) {
    super(props);

    this.state = {
        collectionType: props.getStore().qualityImprovement.collectionType,
        measure:props.getStore().qualityImprovement.measure,
        measureList:props.getStore().qualityImprovement.measureList,
        qualityImprovement:props.getStore().qualityImprovement,
        specialtyMeasureSet:props.getStore().qualityImprovement.specialtyMeasureSet,
        // specialtyMeasureSetOptions:specialtyMeasureSetOptions,
        measureOptions: props.getStore().qualityImprovement.measureOptions,
        collectionTypeOptions:collectionTypeOptions,
        measureType:props.getStore().qualityImprovement.measureType,
        measureTypeOptions:measureTypeOptions,
        specialtyMeasureSetOptions:specificMeasureTypeOptions,
        filteredMeasures:[],
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
    this.handleSpecialtyMeasureChange = this.handleSpecialtyMeasureChange.bind(this);
    this.handleMeasureTypeChange = this.handleMeasureTypeChange.bind(this);

  }

  componentDidMount() {
    var measureOptions=[]
    for(var i =0;i<qualityMeasures.length;i++){ 
      push(measureOptions, {
        key:qualityMeasures[i]["QUALITY ID"],
        text:qualityMeasures[i]["MEASURE NAME"],
        value: qualityMeasures[i]["MEASURE NAME"],
        collectionType:qualityMeasures[i]["DATA SUBMISSION METHOD"],
        specialtyMeasureSet:qualityMeasures[i]["SPECIALTY MEASURE SET"],
        measureType:qualityMeasures[i]["MEASURE TYPE"]
       })
    }
    this.setState({measureOptions:measureOptions})
  //   var arr =[]
  //   for(var i =0;i<this.state.measures.length;i++){
  //     if(this.state.collectionType ===this.state.measures[i].category){
  //       arr.push(this.state.measures[i])
  //     }
  //   }
  //   this.setState({measureOptions:arr})
    
  }

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleCollectionTypeChange = (event, data) => {
    this.setState({ collectionType: data.value })
    let qualityImprovement = this.state.qualityImprovement
    
    let measureOptions=[]
  
    if(data.value === 'all'){
      for(var i =0;i<qualityMeasures.length;i++){ 
        push(measureOptions, {key:qualityMeasures[i]["QUALITY ID"], text:qualityMeasures[i]["MEASURE NAME"], value: qualityMeasures[i]["MEASURE NAME"] })
      }
    }
    else{
      var filteredMeasures = qualityMeasures.filter((measure)=>{
        console.log(measure["DATA SUBMISSION METHOD"].includes(data.value) > 0,data.value)
        return measure["DATA SUBMISSION METHOD"].includes(data.value) > 0 
      })
      console.log(filteredMeasures,'here')
      this.setState({filteredMeasures:filteredMeasures})
      
      for(var i =0;i<filteredMeasures.length;i++){ 
        push(measureOptions, {key:filteredMeasures[i]["QUALITY ID"], text:filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE NAME"] })
      }


    }
    this.setState({measureOptions:measureOptions})
    qualityImprovement.collectionType = data.value
    qualityImprovement.measureOptions = measureOptions
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement:qualityImprovement,
      // collectionType: collectionType,
    });  // Update store here (this is just an example, in reality you will do it via redux or flux)
  }

 
  handleSpecialtyMeasureChange = (event,data) => {
    this.setState({ specialtyMeasureSet: data.value })
    
    
    var measureOptions = [] 

    if(data.value === 'all' && this.state.collectionType === 'all' && this.state.measureType==='all'){
      for(var i =0;i<qualityMeasures.length;i++){ 
        push(measureOptions, {key:qualityMeasures[i]["QUALITY ID"], text:qualityMeasures[i]["MEASURE NAME"], value: qualityMeasures[i]["MEASURE NAME"] })
      }
    }
    else if(data.value === 'all' ){
      var filteredMeasures = this.state.filteredMeasures
      for(var i =0;i<filteredMeasures.length;i++){ 
        push(measureOptions, {key:filteredMeasures[i]["QUALITY ID"], text:filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE NAME"] })
      }
    }
    else{
      var filteredMeasures = this.state.filteredMeasures.filter((measure)=>{
        console.log(measure["SPECIALTY MEASURE SET"].includes(data.value) > 0,data.value)
        return measure["SPECIALTY MEASURE SET"].includes(data.value) > 0
      })
      console.log(filteredMeasures,'here')
      this.setState({filteredMeasures:filteredMeasures})  


      for(var i =0;i<filteredMeasures.length;i++){ 
        push(measureOptions, {key:filteredMeasures[i]["QUALITY ID"], text:filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE NAME"] })
      }

    }
    let qualityImprovement = this.state.qualityImprovement
    this.setState({measureOptions:measureOptions})
    qualityImprovement.specialtyMeasureSet = data.value
    qualityImprovement.measureOptions = measureOptions
    this.setState({ qualityImprovement: qualityImprovement })
    // this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement:qualityImprovement,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
    
  }
  handleMeasureTypeChange = (event,data) => {
    this.setState({ measureType: data.value })
    var measureOptions=[]
    if(data.value === 'all' && this.state.collectionType === 'all' && this.state.specialtyMeasureSet==='all'){
      for(var i =0;i<qualityMeasures.length;i++){ 
        push(measureOptions, {key:qualityMeasures[i]["QUALITY ID"], text:qualityMeasures[i]["MEASURE NAME"], value: qualityMeasures[i]["MEASURE NAME"] })
      }
    }
    else if(data.value === 'all'){
      var filteredMeasures = this.state.filteredMeasures
      for(var i =0;i<filteredMeasures.length;i++){ 
        push(measureOptions, {key:filteredMeasures[i]["QUALITY ID"], text:filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE NAME"] })
      }
    }
    else{
      var filteredMeasures = this.state.filteredMeasures.filter((measure)=>{
        console.log(measure["MEASURE TYPE"].includes(data.value) > 0,data.value)
        return measure["MEASURE TYPE"].includes(data.value) > 0
      })
      // this.setState({filteredMeasures:filteredMeasures})

      for(var i =0;i<filteredMeasures.length;i++){ 
        push(measureOptions, {key:filteredMeasures[i]["QUALITY ID"], text:filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["MEASURE NAME"] })
      }
    }

    let qualityImprovement = this.state.qualityImprovement
    this.setState({measureOptions:measureOptions})
    qualityImprovement.measureType = data.value
    qualityImprovement.measureOptions = measureOptions
    this.setState({ qualityImprovement: qualityImprovement })
    // this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement:qualityImprovement,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
    
  }
  handleMeasureChange = (event,data) => {
    console.log(data,'in measure data')
    this.setState({ measure: data.value })
    let qualityImprovement = this.state.qualityImprovement
    qualityImprovement.measure = data.value
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement:qualityImprovement,
      // measure:data.value,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
    
  }
  clearMeasure(index){
    let measureList = this.state.measureList
    if (index !== -1) {
      measureList.splice(index, 1);
    }
    this.setState({measureList: measureList});
      let qualityImprovement = this.state.qualityImprovement
      qualityImprovement.measureList = measureList
      this.props.updateStore({
        qualityImprovement:qualityImprovement,
        // measureList:measureList,
        savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
      });
    
  }
  addMeasure(){
    if(!(this.state.measureList.includes(this.state.measure)) && this.state.measure !== ''){
      this.setState(prevState => ({
        measureList: [...prevState.measureList, this.state.measure]
      }))
      const { measureList } = this.state;
      let tempArr = [...measureList];
      // var measureList = this.state.measureList
      tempArr.push(this.state.measure);
      console.log(tempArr,'tempArrs')
      let qualityImprovement = this.state.qualityImprovement
      // var newArray = tempArr.slice();
      qualityImprovement.measureList = tempArr
      this.props.updateStore({
        qualityImprovement:qualityImprovement,
        // measureList:tempArr,
        savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
      });
    }
    
  }
  render() {
    return (
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
                    <div className="form-row">
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Specialty Measure Set</h4>
                      </div>
                      <div className="form-group col-md-6">
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
                      <div className="form-group col-md-2 offset-2">
                        <h4 className="title">Measure Type</h4>
                      </div>
                      <div className="form-group col-md-6">
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
                      
                    </div> 
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