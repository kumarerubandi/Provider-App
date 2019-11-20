import React, { Component } from 'react';
import moment from "moment";
import RecursiveProperty from './RecursiveProperty.tsx';


export default class DisplayPatientData extends Component {
    constructor(props) {
        super(props);
        let patient = ''
        let practitioner = ''
        let organization = ''
        let encounterArray = []
        let procedureArray = []
        let conditionArray = []
        let resourcesObj = {}

        this.props.data.forEach(element => {
            console.log('element', element)
            if (element.resourceType === 'Patient') {
                patient = element
            }
            else if (element.resourceType === 'Practitioner') {
                practitioner = element
            }
            else if (element.resourceType === 'Organization') {
                organization = element
            }
            else if (element.resourceType === 'Procedure') {
                procedureArray.push(element)
            }
            else if (element.resourceType === 'Encounter') {
                encounterArray.push(element)
            }
            else if (element.resourceType === 'Condition') {
                conditionArray.push(element)
            }
            else if (element.resourceType !== 'MeasureReport' && element.resourceType !== 'Task') {
                resourcesObj[element.resourceType] = []
                if (resourcesObj.hasOwnProperty(element.resourceType)) {
                    resourcesObj[element.resourceType].push(element)
                }

            }
        })

        this.state = {
            collectionType: '',
            patient: patient,
            practitioner: practitioner,
            organization: organization,
            procedureArray: procedureArray,
            encounterArray: encounterArray,
            conditionArray: conditionArray,
            resourcesObj: resourcesObj,
            //   name:'',
            //   gender:'',
            //   address:'',
            //   postalCode:'',
            //   state:'',
            //   birthDate:''
            //   measure:props.getStore().costMeasures.measure,
            //   measureList: props.getStore().costMeasures.measureList,
            //   costMeasures: props.getStore().costMeasures,
            //   measureOptions: props.getStore().costMeasures.measureOptions,
            //   measureObj:{}


        };
        //   this.handleMeasureChange = this.handleMeasureChange.bind(this);

    }
    componentDidMount() {
        console.log('police', this.props.data,this.props.id)

        // this.props.data.forEach(element => {
        //     console.log('element',element   )
        //     if(element.resourceType === 'Patient'){

        //         this.setState({patient:element})
        //     }
        //     else if(element.resourceType=== 'Practitioner'){
        //         this.setState({practitioner:element})
        //     }
        //     else if(element.resourceType=== 'Organization'){
        //         this.setState({organization:element})
        //     }
        //     // else if(element.resourceType=== 'Encounter'){
        //     //     this.setState({organization:element})
        //     // }
        //     // else if(element.resourceType=== 'Organization'){
        //     //     this.setState({organization:element})
        //     // }
        // });
        //    console.log( this.props.patient,'police')
        // let patient = this.props.patient
        // let givenName =patient.name[0].given.join(' ')
        // let state = patient.address[0].state
        // let postalCode = patient.address[0].postalCode
        // // let address = patient.address[0].line+" "+patient.address[0].city+" "+patient.address[0].state+" "+patient.address[0].country+" "+patient.address[0].postalCode
        // this.setState({name:givenName+" "+patient.name[0].family})
        // this.setState({gender:patient.gender})
        // this.setState({birthDate:patient.birthDate})
        // this.setState({state:state})
        // this.setState({postalCode:postalCode})
        // name = givenName+" "+patient.name[0].family
        // gender = patient.gender

    }

    render() {
        let patientName = this.state.patient.name[0].given.join(' ') + " " + this.state.patient.name[0].family
        let practitionerName = this.state.practitioner.name[0].given.join(' ') + " " + this.state.practitioner.name[0].family
        var cur = new Date();
        var birthDate = new Date(this.state.patient.birthDate);
        var diff = cur - birthDate; // This is the difference in milliseconds
        var age = Math.floor(diff / 31557600000); // Divide by 1000*60*60*24*365.25
        console.log(age, 'age', this.state.resourcesObj)
        Object.keys(this.state.resourcesObj).map(key => {
            console.log(key, this.state.resourcesObj[key], 'tree')
        })
        return (
            <div>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id={"patient-tab" + this.props.id} data-toggle="tab" href={"#patient" + this.props.id} role="tab" aria-controls={"patient" + this.props.id} aria-selected="true">Patient</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id={"practitioner-tab" + this.props.id} data-toggle="tab" href={"#practitioner" + this.props.id} role="tab" aria-controls={"practitioner" + this.props.id} aria-selected="false">Practitioner</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id={"organization-tab" + this.props.id} data-toggle="tab" href={"#organization" + this.props.id} role="tab" aria-controls={"organization" + this.props.id} aria-selected="false">Organization</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id={"encounter-tab" + this.props.id} data-toggle="tab" href={"#encounter" + this.props.id} role="tab" aria-controls={"encounter" + this.props.id} aria-selected="false">Encounter</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id={"procedure-tab" + this.props.id} data-toggle="tab" href={"#procedure" + this.props.id} role="tab" aria-controls={"procedure" + this.props.id} aria-selected="false">Procedure</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id={"condition-tab" + this.props.id} data-toggle="tab" href={"#condition" + this.props.id} role="tab" aria-controls={"condition" + this.props.id} aria-selected="false">Condition</a>
                    </li>
                    {Object.keys(this.state.resourcesObj).map((key, i) => {
                        return (
                            <li class="nav-item" key={i}>
                                <a class="nav-link" id={key.toLowerCase() + "-tab" + this.props.id} data-toggle="tab" href={"#" + key.toLowerCase() + this.props.id} role="tab" aria-controls={key.toLowerCase() + this.props.id} aria-selected="false">{key}</a>
                            </li>
                        )
                    })
                    }
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id={"patient" + this.props.id} role="tabpanel" aria-labelledby={"patient-tab" + this.props.id}>
                        <div className="form-row">
                            <div class="form-group col-md-6">
                                <span className="title-small">Name - </span>
                                <span>{patientName}</span>
                            </div>
                            {this.state.patient.hasOwnProperty('identifier') &&
                                <div class="form-group col-md-6">
                                    <span className="title-small"> Identifier - </span>
                                    <span>{this.state.patient.identifier[0].value}</span>
                                </div>
                            }
                        </div>
                        <div className="form-row">
                            {this.state.patient.hasOwnProperty('birthDate') &&
                                <div class="form-group col-md-6">
                                    <span className="title-small">Age - </span>
                                    <span>{age + ' years'}</span>
                                </div>
                            }
                            <div class="form-group col-md-6">
                                <span className="title-small">Gender - </span>
                                <span>{this.state.patient.gender}</span>
                            </div>
                        </div>
                        {this.state.patient.hasOwnProperty('address') &&
                            <div className="form-row">
                                <div class="form-group col-md-6">
                                    <span className="title-small">State - </span>
                                    <span>{this.state.patient.address[0].state}</span>
                                </div>
                                <div class="form-group col-md-6">
                                    <span className="title-small">Postal Code - </span>
                                    <span>{this.state.patient.address[0].postalCode}</span>
                                </div>
                            </div>
                        }

                        <div className="form-row">
                            <div class="form-group col-md-12">
                                <span className="title-small">Managing Organization - </span>
                                <span>{this.state.organization.name}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id={"practitioner" + this.props.id} role="tabpanel" aria-labelledby={"practitioner-tab" + this.props.id}>
                        <div className="form-row">
                            <div class="form-group col-md-6">
                                <span className="title-small">Name - </span>
                                <span>{practitionerName}</span>
                            </div>
                            <div class="form-group col-md-6">
                                <span className="title-small"> Gender - </span>
                                <span>{this.state.practitioner.gender}</span>
                            </div>
                        </div>
                        <div className="form-row">
                            <div class="form-group col-md-6">
                                <span className="title-small">Identifier - </span>
                                <span>{this.state.practitioner.identifier[0].value}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id={"organization" + this.props.id} role="tabpanel" aria-labelledby={"organization-tab" + this.props.id}>
                        <div className="form-row">
                            <div class="form-group col-md-6">
                                <span className="title-small">Name - </span>
                                <span>{this.state.organization.name}</span>
                            </div>
                            <div class="form-group col-md-6">
                                <span className="title-small"> Identifier - </span>
                                <span>{this.state.organization.identifier[0].value}</span>
                            </div>
                        </div>
                        {this.state.organization.hasOwnProperty('type') &&
                            <div className="form-row">
                                <div class="form-group col-md-6">
                                    <span className="title-small">Type - </span>
                                    <span>{this.state.organization.type[0].coding[0].display}</span>
                                </div>
                            </div>
                        }
                        <div className="form-row">
                            <div class="form-group col-md-6">
                                <span className="title-small">State - </span>
                                <span>{this.state.organization.address[0].state}</span>
                            </div>
                            <div class="form-group col-md-6">
                                <span className="title-small">Postal Code - </span>
                                <span>{this.state.organization.address[0].postalCode}</span>
                            </div>
                        </div>

                    </div>
                    <div class="tab-pane fade" id={"encounter" + this.props.id} role="tabpanel" aria-labelledby={"encounter-tab" + this.props.id}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type </th>
                                    <th>Status</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.encounterArray.map((encounter, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <span>{encounter.type[0].coding[0].display}</span>
                                            </td>
                                            <td>
                                                <span>{encounter.status}</span>
                                            </td>
                                            <td>
                                                <span>{moment(encounter.period.start).format(" YYYY-MM-DD, hh:mm a")}</span>
                                            </td>
                                            <td>
                                                <span>{moment(encounter.period.end).format(" YYYY-MM-DD, hh:mm a")}</span>
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div class="tab-pane fade" id={"procedure" + this.props.id} role="tabpanel" aria-labelledby={"procedure-tab" + this.props.id}>
                        <RecursiveProperty property={this.state.procedureArray} propertyName="Procedure" excludeBottomBorder={false} rootProperty={false} />
                    </div>
                    <div class="tab-pane fade" id={"condition" + this.props.id} role="tabpanel" aria-labelledby={"condition-tab" + this.props.id}>
                        <RecursiveProperty property={this.state.conditionArray} propertyName="Condition" excludeBottomBorder={false} rootProperty={false} />
                    </div>
                    {Object.keys(this.state.resourcesObj).map(key => {
                        return (
                            <div class="tab-pane fade" id={key.toLowerCase() + this.props.id} role="tabpanel" aria-labelledby={key.toLowerCase() + "-tab" + this.props.id}>
                                <RecursiveProperty property={this.state.resourcesObj[key]} propertyName={key} excludeBottomBorder={false} rootProperty={false} />
                            </div>
                        )
                    })
                    }
                </div>

            </div>
        )
    }
}