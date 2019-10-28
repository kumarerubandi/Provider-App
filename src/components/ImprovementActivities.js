'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';
import improvementMeasures from '../json/improvementActivitiesMeasures.json';
import QualityImprovement from './QualityImprovement.js';


var activityWeightOptions=[]
var subCategoryOptions = []

for(var i =0;i<improvementMeasures.length;i++){
  
  //setting options for Subcategory Name
  var subCategoryKey = improvementMeasures[i]["SUBCATEGORY NAME"].toString().replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "");
  push(subCategoryOptions, {key:'all', text:'All', value: "all" })
  push(subCategoryOptions, {key:subCategoryKey, text:improvementMeasures[i]["SUBCATEGORY NAME"], value: improvementMeasures[i]["SUBCATEGORY NAME"] })

  //setting options for Activity Weight
  var objectiveKey=improvementMeasures[i]["ACTIVITY WEIGHTING"].replace(/\s+/g, '_').toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/\s+$/, '');
  push(activityWeightOptions, {key:'all', text:'All', value: "all" })
  push(activityWeightOptions, {key:objectiveKey, text:improvementMeasures[i]["ACTIVITY WEIGHTING"], value: improvementMeasures[i]["ACTIVITY WEIGHTING"] })

}
function push(array, item,key=false) {
  if (!array.find(({text}) => text === item.text)) {
    array.push(item);
  }
  if(key){
    if (!array.find(({key}) => key === item.key)) {
      array.push(item);
    }
  }
}
export default class ImprovementActivities extends Component {
  constructor(props) {
    super(props);

    this.state = {
        collectionType:'',
        measureList: props.getStore().improvementActivity.measureList,
        activityWeightOptions:activityWeightOptions,
        subCategoryOptions:subCategoryOptions,
        improvementActivity:props.getStore().improvementActivity,
        measure:props.getStore().improvementActivity.measure,
        measureObj:{},
        measureOptions: props.getStore().improvementActivity.measureOptions,
        subCategoryName:props.getStore().improvementActivity.subCategoryName,
        activityWeight:props.getStore().improvementActivity.activityWeight,
        filteredMeasures:[],
    };
    this.handleActivityWeightChange = this.handleActivityWeightChange.bind(this);
    this.handleSubcategoryNameChange = this.handleSubcategoryNameChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);

  }

  componentDidMount() {
    var measureOptions=[]
    for(var i =0;i<improvementMeasures.length;i++){ 
      push(measureOptions, {key:improvementMeasures[i]["ACTIVITY ID"], text:improvementMeasures[i]["ACTIVITY NAME"],value: improvementMeasures[i]["ACTIVITY ID"]},true)
    }
    this.setState({measureOptions:measureOptions})
  }

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleSubcategoryNameChange = (event,data) => {
    this.setState({ subCategoryName: data.value })
    let improvementActivity = this.state.improvementActivity

    var filteredMeasures= []

    var measureOptions =[]
    if(data.value === 'all' && this.state.activityWeight === 'all'){
      filteredMeasures = improvementMeasures.filter((measure)=>{
        return measure["SUBCATEGORY NAME"]
      })
    }
    else if(data.value!=='all' && this.state.activityWeight ==='all'){
      filteredMeasures = improvementMeasures.filter((measure)=>{
        return measure["SUBCATEGORY NAME"].includes(data.value)
      })
    }
    else if(data.value ==='all' && this.state.activityWeight!=='all'){
      filteredMeasures = improvementMeasures.filter((measure)=>{
        return measure["ACTIVITY WEIGHTING"].includes(this.state.activityWeight)
      })
    }
    else{
      filteredMeasures = improvementMeasures.filter((measure) =>{
          return (
            (data.value!== 'all' && measure["SUBCATEGORY NAME"].includes(data.value) > 0 ) &&
            ( this.state.activityWeight !='all'&& measure["ACTIVITY WEIGHTING"].includes(this.state.activityWeight)))
        })

    }
      
    console.log(filteredMeasures,'is it working')
    for(var i =0;i<filteredMeasures.length;i++){ 
      push(measureOptions, {key:improvementMeasures[i]["ACTIVITY ID"], text:improvementMeasures[i]["ACTIVITY NAME"],value: improvementMeasures[i]["ACTIVITY ID"]},true)
    }
    this.setState({measureOptions:measureOptions})
    improvementActivity.subCategoryName = data.value
    improvementActivity.measureOptions = measureOptions
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity:improvementActivity,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
    

  }

  handleActivityWeightChange = (event,data) => {
    this.setState({ activityWeight: data.value })
    let improvementActivity = this.state.improvementActivity
    var filteredMeasures=[]
    var measureOptions =[]
    
    if(data.value === 'all' && this.state.subCategoryName === 'all'){
      filteredMeasures = improvementMeasures.filter((measure)=>{
        return measure["ACTIVITY WEIGHTING"]
      })
    }
    else if(data.value!=='all' && this.state.subCategoryName ==='all'){
      filteredMeasures = improvementMeasures.filter((measure)=>{
        return measure["ACTIVITY WEIGHTING"].includes(data.value)
      })
    }
    else if(data.value ==='all' && this.state.subCategoryName!=='all'){
      filteredMeasures = improvementMeasures.filter((measure)=>{
        return measure["SUBCATEGORY NAME"].includes(this.state.subCategoryName)
      })
    }
    else{
      filteredMeasures = improvementMeasures.filter((measure) =>{
          return (
            (data.value!== 'all' && measure["ACTIVITY WEIGHTING"].includes(data.value) > 0 ) &&
            ( this.state.subCategoryName !='all'&& measure["SUBCATEGORY NAME"].includes(this.state.subCategoryName)))
        })

    }
    console.log(filteredMeasures,'is it working for sure')
      // this.setState({filteredMeasures:filteredMeasures})
     
    for(var i =0;i<filteredMeasures.length;i++){ 
      push(measureOptions, {key:improvementMeasures[i]["ACTIVITY ID"],text:improvementMeasures[i]["ACTIVITY NAME"],value: improvementMeasures[i]["ACTIVITY ID"] },true)
    }
    this.setState({measureOptions:measureOptions})
    improvementActivity.activityWeight = data.value
    improvementActivity.measureOptions = measureOptions
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity:improvementActivity,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });

  }

  handleMeasureChange = (event,data) => {
    console.log(data,'so this is data')
    this.setState({ measure: data.value })
    let improvementActivity = this.state.improvementActivity
    improvementActivity.measure = data.value
    this.setState({ improvementActivity: improvementActivity })
    this.props.updateStore({
      improvementActivity:improvementActivity,
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
      let improvementActivity = this.state.improvementActivity
      improvementActivity.measureList = measureList
      this.props.updateStore({
        improvementActivity:improvementActivity,
        // measureList:measureList,
        savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
      });
    
  }
  addMeasure(){
    if(this.state.measure !==''){
      if(!this.state.measureObj.hasOwnProperty(this.state.measure)){
        let measureObj = this.state.measureObj
        let Obj = this.state.measureOptions.find((m)=>{
            return m.key === this.state.measure
          })
        measureObj[this.state.measure]=Obj.text
        this.setState({measureObj:measureObj})
        this.setState(prevState => ({
            measureList: [...prevState.measureList, {measureId:this.state.measure,measureName:Obj.text}]
          }))
        const { measureList } = this.state;
        let tempArr = [...measureList];
        tempArr.push({measureId:this.state.measure,measureName:Obj.text});
        console.log(tempArr,'tempArrs')
        let improvementActivity = this.state.improvementActivity
        improvementActivity.measureList = tempArr
        this.props.updateStore({
          improvementActivity:improvementActivity,
          savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
        });
      }
    }
     
  }
  render() {
    return (
    <div>
            <div className="form-row">
                     <div className="form-group col-md-2 offset-2">
                       <h4 className="title">Subcategory Name</h4>
                     </div>
                     <div className="form-group col-md-6">
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
                   </div>
                   <div className="form-row">
                     <div className="form-group col-md-2 offset-2">
                       <h4 className="title">Activity Weight</h4>
                     </div>
                     <div className="form-group col-md-6">
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
                     <th>Activity Name </th>
                     <th>Activity ID </th>
                     <th></th>
                   </tr>
                 </thead>
                 <tbody>
                   {this.state.measureList.map((measure, i) => {
                     return(
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