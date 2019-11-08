'use strict';

import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';
import { createToken } from '../components/Authentication';
import Client from 'fhir-kit-client';




export default class FinalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        
        costMeasureList: props.getStore().costMeasures.measureList,
        qualityMeasureList: props.getStore().qualityImprovement.measureList,
        promotingMeasureList: props.getStore().promotingInteroperability.measureList,
        improvementMeasureList: props.getStore().improvementActivity.measureList,

    };
    this.calculateMeasure = this.calculateMeasure.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  calculateMeasure = async () =>{
    console.log(this.props.getStore())
    let json={}
    json.qualityImprovement= this.props.getStore().qualityImprovement
    json.promotingInteroperability = this.props.getStore().promotingInteroperability
    json.improvementActivity = this.props.getStore().improvementActivity
    json.costMeasures = this.props.getStore().costMeasures
    json.resourceType ='Measure'
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
    
        // return reject(link);
      }).catch((err) => {
        console.error('Cannot grab launch context from the FHIR server endpoint to launch the SMART app. See network calls to the Launch endpoint for more details', err);
        // link.error = true;
        // return reject(link);
      });

  }

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
                <button type="button" class="btn btn-prev btn-primary btn-lg pull-right" id="next-button" onClick={() => this.calculateMeasure()}>Calculate MIPS score</button>
            </div>
    </div>
    )
  }
}