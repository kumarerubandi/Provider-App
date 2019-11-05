'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';


export default class FinalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        
        costMeasureList: props.getStore().costMeasures.measureList,
        qualityMeasureList: props.getStore().qualityImprovement.measureList,
        promotingMeasureList: props.getStore().promotingInteroperability.measureList,
        improvementMeasureList: props.getStore().improvementActivity.measureList,

    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
        <div>
               <div className="form-row">
            {this.state.qualityMeasureList.length>0 &&
            <div>
               <h4 className="title">Quality Improvement</h4>
               <table className="table">
                 <thead>
                   <tr>
                     <th>Measure ID </th>
                     <th>Measure Name</th>
                     {/* <th></th> */}
                   </tr>
                 </thead>
                 <tbody>
                   {this.state.qualityMeasureList.map((measure, i) => {
                     return(
                       <tr key={i}>
                         <td>
                         <span>{measure.measureId}</span>
                          </td>
                          <td>
                           <span>{measure.measureName}</span>
                          </td>
                        
                       </tr>
                     )
                   })

                   }
                
                 </tbody>
               </table>
               </div>
            }
            </div>
            <div className="form-row">
            {this.state.promotingMeasureList.length>0 &&
            <div>
               <h4 className="title">Promoting Interoperability</h4>
               <table className="table">
                 <thead>
                   <tr>
                   <th>Measure ID </th>
                     <th>Measure Name</th>
                     {/* <th></th> */}
                   </tr>
                 </thead>
                 <tbody>
                   {this.state.promotingMeasureList.map((measure, i) => {
                     return(
                       <tr key={i}>
                         <td>
                         <span>{measure.measureId}</span>
                          </td>
                          <td>
                           <span>{measure.measureName}</span>
                          </td>
                        
                       </tr>
                     )
                   })

                   }
                
                 </tbody>
               </table>
            </div>
            }
            </div>
            <div className="form-row">
            {this.state.improvementMeasureList.length>0 &&
            <div>   
               <h4 className="title">Improvement Activity</h4>
               <table className="table">
                 <thead>
                   <tr>
                   <th>Measure ID </th>
                     <th>Measure Name</th>
                     {/* <th></th> */}
                   </tr>
                 </thead>
                 <tbody>
                   {this.state.improvementMeasureList.map((measure, i) => {
                     return(
                       <tr key={i}>
                         <td>
                         <span>{measure.measureId}</span>
                          </td>
                          <td>
                           <span>{measure.measureName}</span>
                          </td>
                        
                       </tr>
                     )
                   })

                   }
                
                 </tbody>
               </table>
            </div>
            }
            </div>

            <div className="form-row">
            {this.state.costMeasureList.length>0 &&
            <div>
               <h4 className="title">Cost Measure</h4>
               <table className="table">
                 <thead>
                   <tr>
                   <th>Measure ID </th>
                     <th>Measure Name</th>
                     {/* <th></th> */}
                   </tr>
                 </thead>
                 <tbody>
                   {this.state.costMeasureList.map((measure, i) => {
                     return(
                       <tr key={i}>
                         <td>
                         <span>{measure.measureId}</span>
                          </td>
                          <td>
                           <span>{measure.measureName}</span>
                          </td>
                       </tr>
                     )
                   })

                   }
                
                 </tbody>
               </table>
            </div>
            }
        </div>
        <div class="footer-buttons">
                <button type="button" class="btn btn-prev btn-primary btn-lg pull-right" id="next-button">Calculate MIPS score</button>
            </div>
    </div>
    )
  }
}