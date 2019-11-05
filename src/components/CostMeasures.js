'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';
import costMeasureOptions from '../json/costMeasuresOptions.json';


export default class Cost extends Component {
  constructor(props) {
    super(props);

    this.state = {
        collectionType:'',
        measure:props.getStore().costMeasures.measure,
        measureList: props.getStore().costMeasures.measureList,
        costMeasures: props.getStore().costMeasures,
        measureOptions: props.getStore().costMeasures.measureOptions,
        measureObj:{}


    };
    this.handleMeasureChange = this.handleMeasureChange.bind(this);

  }

  componentDidMount() {
    var arr =[]
    for(var i=0;i<costMeasureOptions.length;i++){
      arr.push({key:costMeasureOptions[i]["MEASURE ID"], text:costMeasureOptions[i]["MEASURE NAME"], value: costMeasureOptions[i]["MEASURE ID"] })
    }
    this.setState({measureOptions:arr})
  }

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  handleMeasureChange = (event,data) => {
    this.setState({ measure: data.value })
    let costMeasures = this.state.costMeasures
    costMeasures.measure = data.value
    this.setState({ costMeasures: costMeasures })
    this.props.updateStore({
      costMeasures:costMeasures,
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
      let costMeasures = this.state.costMeasures
      costMeasures.measureList = measureList
      this.setState({ costMeasures: costMeasures })
      this.props.updateStore({
        costMeasures:costMeasures,
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
        let costMeasures = this.state.costMeasures
        costMeasures.measureList = tempArr
        this.props.updateStore({
          costMeasures:costMeasures,
          savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
        });
      }
    }
    
  }
  render() {
    return (
    <div>
      <p className="text-center"><b>Cost</b> - The Cost performance category has 15% weight for the 2019 performance year. CMS will calculate the score for the Cost category from the Medicare Administrative Claims data for the entire calendar year 2019. Thus, no data submission is required.
</p>
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
                     <span><button style={{marginTop:"22px"}} class="ui circular icon button"  onClick={() => this.addMeasure()}><i aria-hidden="true" class="add icon"></i></button></span>
                     </div>
                   </div>    
                   
               <div className="form-row">
               <table className="table col-10 offset-1">
                 <thead>
                   <tr>
                     <th>Measure Name</th>
                     <th>Measure ID </th>
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