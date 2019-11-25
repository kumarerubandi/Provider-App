'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { createToken } from '../components/Authentication';
import Client from 'fhir-kit-client';
import Inspector from 'react-json-inspector';
import { element } from 'prop-types';
import RecursiveProperty from './RecursiveProperty.tsx';
import DisplayPatientData from '../components//DisplayPatientData';
import DisplayBundle from '../components//DisplayBundle';


export default class FinalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      costMeasures: props.getStore().costMeasures,
      qualityImprovement: props.getStore().qualityImprovement,
      promotingInteroperability: props.getStore().promotingInteroperability,
      improvementActivity: props.getStore().improvementActivity,
      qiLoading : props.getStore().qualityImprovement.loading,
      piLoading : props.getStore().promotingInteroperability.loading,
      iaLoading : props.getStore().improvementActivity.loading,
      cLoading : props.getStore().costMeasures.loading,
      showScore: false,
      score: 0
    };
    this.calculateMeasure = this.calculateMeasure.bind(this);
    this.displayPatientwiseInfo = this.displayPatientwiseInfo.bind();
  }

  componentDidMount() { 
    const interval =setInterval(() => {
      this.setState({
        costMeasures: this.props.getStore().costMeasures,
        qualityImprovement: this.props.getStore().qualityImprovement,
        promotingInteroperability: this.props.getStore().promotingInteroperability,
        improvementActivity: this.props.getStore().improvementActivity,
      })
      if(!this.state.cloading && !this.state.piloading && !this.state.cloading && !this.state.ialoading){
        console.log('poeeee')
        clearInterval(interval);  
      }   
      console.log('how many??',this.props.getStore().qualityImprovement.measureList)
     }, 3000)
  }

  componentWillUnmount() { }

  calculateMeasure = async () => {
    console.log(this.props.getStore())
    let json = {}
    json.qualityImprovement = this.props.getStore().qualityImprovement
    json.promotingInteroperability = this.props.getStore().promotingInteroperability
    json.improvementActivity = this.props.getStore().improvementActivity
    json.costMeasures = this.props.getStore().costMeasures
    json.resourceType = 'Measure'
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
      this.setState({ showScore: true });
      this.setState({ score: result.group[0].measureScore.value });

      window.scrollTop(0);
      // return reject(link);
    }).catch((err) => {
      console.error('Cannot grab launch context from the FHIR server endpoint to launch the SMART app. See network calls to the Launch endpoint for more details', err);
      // link.error = true;
      // return reject(link);
    });

  }

  displayPatientwiseInfo(data) {
    // let data = {
    //   "resourceType": "Bundle",
    //   "type": "transaction",
    //   "entry": [
    //     {
    //       "request": {
    //         "method": "POST",
    //         "url": "Measure/measure-col/$submit-data"
    //       },
    //       "resource": {
    //         "resourceType": "Parameters",
    //         "id": "a0f1e168-1d20-0b48-37af-9dc75c3d796d",
    //         "parameter": [
    //           {
    //             "name": "measure-report",
    //             "resource": {
    //               "resourceType": "MeasureReport",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/measurereport-deqm"
    //                 ]
    //               },
    //               "id": "7df557e7-9bda-81f7-7b3f-80f949b71803",
    //               "status": "complete",
    //               "type": "individual",
    //               "measure": {
    //                 "reference": "https://ncqa.org/fhir/ig/Measure/measure-mrp"
    //               },
    //               "patient": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "date": "2019-11-11T06:33:38.627Z",
    //               "period": {
    //                 "start": "2019-11-11T06:33:38.627Z",
    //                 "end": "2019-11-11T06:33:38.627Z"
    //               },
    //               "reportingOrganization": {
    //                 "reference": "Organization/organization01"
    //               },
    //               "evaluatedResources": {
    //                 "extension": [
    //                   {
    //                     "url": "http://hl7.org/fhir/us/davinci-deqm/StructureDefinition/extension-referenceAny",
    //                     "valueReference": {
    //                       "reference": "Task/8f8637c7-bc02-2524-a279-2ecda8e30370"
    //                     }
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Task",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/hedis/StructureDefinition/hedis-task"
    //                 ]
    //               },
    //               "id": "8f8637c7-bc02-2524-a279-2ecda8e30370",
    //               "identifier": [
    //                 {
    //                   "system": "http://www.acme.org/tasks",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "status": "completed",
    //               "intent": "plan",
    //               "priority": "routine",
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "http://www.ama-assn.org/go/cpt",
    //                     "code": "1111F",
    //                     "display": "Medication Reconciliation"
    //                   }
    //                 ]
    //               },
    //               "for": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "context": {
    //                 "reference": "Encounter/be41da98-9599-5f9b-fb5f-2f58515179bc"
    //               },
    //               "authoredOn": "2019-11-11T06:33:38.627Z",
    //               "executionPeriod": {
    //                 "start": "2019-11-11T06:33:38.627Z",
    //                 "end": "2019-11-11T06:33:38.627Z"
    //               },
    //               "owner": {
    //                 "reference": "Practitioner/practitioner01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Patient",
    //               "id": "patient01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"
    //                 ]
    //               },
    //               "text": {
    //                 "status": "generated",
    //                 "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">Jairo <b>WEBSTER </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>12345</td></tr><tr><td>Address</td><td><span>7496 Beaver Ridge Ave </span><br/><span>Thornton </span><span>NJ </span><span>USA </span></td></tr><tr><td>Date of birth</td><td><span>16 December 1946</span></td></tr></tbody></table></div>"
    //               },
    //               "extension": [
    //                 {
    //                   "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
    //                   "valueCode": "M"
    //                 },
    //                 {
    //                   "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
    //                   "extension": [
    //                     {
    //                       "url": "ombCategory",
    //                       "valueCoding": {
    //                         "system": "urn:oid:2.16.840.1.113883.6.238",
    //                         "code": "2106-3",
    //                         "display": "White"
    //                       }
    //                     },
    //                     {
    //                       "url": "text",
    //                       "valueString": "White"
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
    //                   "extension": [
    //                     {
    //                       "url": "ombCategory",
    //                       "valueCoding": {
    //                         "system": "urn:oid:2.16.840.1.113883.6.238",
    //                         "code": "2186-5",
    //                         "display": "Not Hispanic or Latino"
    //                       }
    //                     },
    //                     {
    //                       "url": "text",
    //                       "valueString": "Not Hispanic or Latino"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "identifier": [
    //                 {
    //                   "use": "usual",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "MR",
    //                         "display": "Medical record number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hospital.davinci.org",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "use": "official",
    //                   "family": "Webster",
    //                   "given": [
    //                     "Jairo"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male",
    //               "birthDate": "1946-12-16",
    //               "deceasedBoolean": false,
    //               "address": [
    //                 {
    //                   "use": "home",
    //                   "line": [
    //                     "7496 Beaver Ridge Ave"
    //                   ],
    //                   "city": "Thornton",
    //                   "state": "NJ",
    //                   "postalCode": "07003",
    //                   "country": "USA"
    //                 }
    //               ],
    //               "maritalStatus": {
    //                 "coding": [
    //                   {
    //                     "system": "http://hl7.org/fhir/v3/MaritalStatus",
    //                     "code": "M",
    //                     "display": "Married"
    //                   }
    //                 ]
    //               },
    //               "communication": [
    //                 {
    //                   "language": {
    //                     "coding": [
    //                       {
    //                         "system": "urn:ietf:bcp:47",
    //                         "code": "en-US",
    //                         "display": "US English"
    //                       }
    //                     ]
    //                   },
    //                   "preferred": true
    //                 }
    //               ],
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Location",
    //               "id": "location01",
    //               "meta": {
    //                 "versionId": "2",
    //                 "lastUpdated": "2019-08-27T06:31:56.795+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"
    //                 ]
    //               },
    //               "name": "DaVinciClinic01",
    //               "address": {
    //                 "line": [
    //                   "102 Heritage Dr."
    //                 ],
    //                 "city": "Somerset",
    //                 "state": "NJ",
    //                 "postalCode": "08873",
    //                 "country": "USA"
    //               },
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Practitioner",
    //               "id": "practitioner01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/practitioner-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "PRN",
    //                         "display": "Provider number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-npi",
    //                   "value": "456789123"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "family": "Hale",
    //                   "given": [
    //                     "Cody"
    //                   ],
    //                   "suffix": [
    //                     "MD"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male"
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "123456789",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "prov",
    //                       "display": "Healthcare Provider"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DaVinciHospital01",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 401-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "73 Lakewood Street"
    //                   ],
    //                   "city": "Warwick",
    //                   "state": "RI",
    //                   "postalCode": "02886",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Encounter",
    //               "id": "be41da98-9599-5f9b-fb5f-2f58515179bc",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"
    //                 ]
    //               },
    //               "status": "finished",
    //               "class": {
    //                 "system": "http://hl7.org/fhir/v3/ActCode",
    //                 "code": "AMB",
    //                 "display": "ambulatory"
    //               },
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://snomed.info/sct",
    //                       "code": "390906007",
    //                       "display": "Follow-up encounter (procedure)"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "period": {
    //                 "start": "2019-11-11T06:33:38.627Z",
    //                 "end": "2019-11-11T06:33:38.627Z"
    //               },
    //               "subject": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "location": [
    //                 {
    //                   "location": {
    //                     "reference": "Location/location01"
    //                   }
    //                 }
    //               ],
    //               "participant": [
    //                 {
    //                   "individual": {
    //                     "reference": "Practitioner/practitioner01"
    //                   }
    //                 }
    //               ],
    //               "serviceProvider": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Coverage",
    //               "id": "coverage01",
    //               "meta": {
    //                 "versionId": "3",
    //                 "lastUpdated": "2019-08-27T06:51:49.411+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/coverage-deqm"
    //                 ]
    //               },
    //               "policyHolder": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "subscriber": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "subscriberId": "A123456789",
    //               "beneficiary": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "relationship": {
    //                 "coding": [
    //                   {
    //                     "code": "self"
    //                   }
    //                 ]
    //               },
    //               "payor": [
    //                 {
    //                   "reference": "Organization/organization04"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Procedure",
    //               "id": "40307",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-10-23T07:34:22.577+00:00"
    //               },
    //               "status": "completed",
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "https://hcpcs.codes/",
    //                     "code": "1.3.6.1.4.1.33895.1.3.0.45",
    //                     "display": "Comfort Measures"
    //                   }
    //                 ],
    //                 "text": "Comfort Measures"
    //               },
    //               "subject": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "performedPeriod": {
    //                 "start": "2019-10-05T09:20:00-04:00",
    //                 "end": "2019-10-05T10:30:00-04:00"
    //               },
    //               "performer": [
    //                 {
    //                   "actor": {
    //                     "reference": "Practitioner/practitioner01"
    //                   }
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Condition",
    //               "id": "40305",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-10-23T07:24:25.142+00:00"
    //               },
    //               "clinicalStatus": {
    //                 "coding": [
    //                   {
    //                     "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
    //                     "code": "active"
    //                   }
    //                 ]
    //               },
    //               "verificationStatus": {
    //                 "coding": [
    //                   {
    //                     "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
    //                     "code": "confirmed"
    //                   }
    //                 ]
    //               },
    //               "category": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://snomed.info/sct",
    //                       "code": "439401001",
    //                       "display": "Diagnosis"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "severity": {
    //                 "coding": [
    //                   {
    //                     "system": "http://snomed.info/sct",
    //                     "code": "24484000",
    //                     "display": "Severe"
    //                   }
    //                 ]
    //               },
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "http://snomed.info/sct",
    //                     "code": "2.16.840.1.113883.3.117.1.7.1.212",
    //                     "display": "Hemorrhagic Stroke"
    //                   }
    //                 ],
    //                 "text": "Hemorrhagic Stroke"
    //               },
    //               "subject": {
    //                 "reference": "Patient/patient01"
    //               },
    //               "onsetDateTime": "2019-10-04"
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization04",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "456789123",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "ins",
    //                       "display": "Insurance Company"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DVPayer04-\n        ",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 616-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "160 Glen Eagles Road"
    //                   ],
    //                   "city": "Grand Rapids",
    //                   "state": "MI",
    //                   "postalCode": "49503",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "request": {
    //         "method": "POST",
    //         "url": "Measure/measure-col/$submit-data"
    //       },
    //       "resource": {
    //         "resourceType": "Parameters",
    //         "id": "5eccc34f-e455-1163-b5fc-0916e5cc1c4a",
    //         "parameter": [
    //           {
    //             "name": "measure-report",
    //             "resource": {
    //               "resourceType": "MeasureReport",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/measurereport-deqm"
    //                 ]
    //               },
    //               "id": "d3a0d05c-4417-6d0b-dd5c-43d160aa30d6",
    //               "status": "complete",
    //               "type": "individual",
    //               "measure": {
    //                 "reference": "https://ncqa.org/fhir/ig/Measure/measure-mrp"
    //               },
    //               "patient": {
    //                 "reference": "Patient/14989"
    //               },
    //               "date": "2019-11-11T06:33:38.930Z",
    //               "period": {
    //                 "start": "2019-11-11T06:33:38.930Z",
    //                 "end": "2019-11-11T06:33:38.930Z"
    //               },
    //               "reportingOrganization": {
    //                 "reference": "Organization/organization01"
    //               },
    //               "evaluatedResources": {
    //                 "extension": [
    //                   {
    //                     "url": "http://hl7.org/fhir/us/davinci-deqm/StructureDefinition/extension-referenceAny",
    //                     "valueReference": {
    //                       "reference": "Task/9e1b60c5-4e3f-0599-872b-e471205b3ac1"
    //                     }
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Task",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/hedis/StructureDefinition/hedis-task"
    //                 ]
    //               },
    //               "id": "9e1b60c5-4e3f-0599-872b-e471205b3ac1",
    //               "identifier": [
    //                 {
    //                   "system": "http://www.acme.org/tasks",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "status": "completed",
    //               "intent": "plan",
    //               "priority": "routine",
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "http://www.ama-assn.org/go/cpt",
    //                     "code": "1111F",
    //                     "display": "Medication Reconciliation"
    //                   }
    //                 ]
    //               },
    //               "for": {
    //                 "reference": "Patient/14989"
    //               },
    //               "context": {
    //                 "reference": "Encounter/cfcada30-fd7a-f82d-cdc0-95be9619bcee"
    //               },
    //               "authoredOn": "2019-11-11T06:33:38.930Z",
    //               "executionPeriod": {
    //                 "start": "2019-11-11T06:33:38.930Z",
    //                 "end": "2019-11-11T06:33:38.930Z"
    //               },
    //               "owner": {
    //                 "reference": "Practitioner/practitioner01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Patient",
    //               "id": "14989",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-28T12:04:05.049+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"
    //                 ]
    //               },
    //               "text": {
    //                 "status": "generated",
    //                 "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">Jairo <b>WEBSTER </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>12345</td></tr><tr><td>Address</td><td><span>7496 Beaver Ridge Ave </span><br/><span>Thornton </span><span>NJ </span><span>USA </span></td></tr><tr><td>Date of birth</td><td><span>16 December 1946</span></td></tr></tbody></table></div>"
    //               },
    //               "extension": [
    //                 {
    //                   "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
    //                   "valueCode": "M"
    //                 },
    //                 {
    //                   "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
    //                   "extension": [
    //                     {
    //                       "url": "ombCategory",
    //                       "valueCoding": {
    //                         "system": "urn:oid:2.16.840.1.113883.6.238",
    //                         "code": "2106-3",
    //                         "display": "White"
    //                       }
    //                     },
    //                     {
    //                       "url": "text",
    //                       "valueString": "White"
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
    //                   "extension": [
    //                     {
    //                       "url": "ombCategory",
    //                       "valueCoding": {
    //                         "system": "urn:oid:2.16.840.1.113883.6.238",
    //                         "code": "2186-5",
    //                         "display": "Not Hispanic or Latino"
    //                       }
    //                     },
    //                     {
    //                       "url": "text",
    //                       "valueString": "Not Hispanic or Latino"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "identifier": [
    //                 {
    //                   "use": "usual",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "MR",
    //                         "display": "Medical record number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hospital.davinci.org",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "use": "official",
    //                   "family": "Reddy",
    //                   "given": [
    //                     "Raj"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male",
    //               "birthDate": "1946-12-16",
    //               "deceasedBoolean": false,
    //               "address": [
    //                 {
    //                   "use": "home",
    //                   "line": [
    //                     "796 Beaver Ridge Ave"
    //                   ],
    //                   "city": "Thornton",
    //                   "state": "MA",
    //                   "postalCode": "02906",
    //                   "country": "USA"
    //                 }
    //               ],
    //               "maritalStatus": {
    //                 "coding": [
    //                   {
    //                     "system": "http://hl7.org/fhir/v3/MaritalStatus",
    //                     "code": "M",
    //                     "display": "Married"
    //                   }
    //                 ]
    //               },
    //               "communication": [
    //                 {
    //                   "language": {
    //                     "coding": [
    //                       {
    //                         "system": "urn:ietf:bcp:47",
    //                         "code": "en-US",
    //                         "display": "US English"
    //                       }
    //                     ]
    //                   },
    //                   "preferred": true
    //                 }
    //               ],
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Location",
    //               "id": "location01",
    //               "meta": {
    //                 "versionId": "2",
    //                 "lastUpdated": "2019-08-27T06:31:56.795+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"
    //                 ]
    //               },
    //               "name": "DaVinciClinic01",
    //               "address": {
    //                 "line": [
    //                   "102 Heritage Dr."
    //                 ],
    //                 "city": "Somerset",
    //                 "state": "NJ",
    //                 "postalCode": "08873",
    //                 "country": "USA"
    //               },
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Practitioner",
    //               "id": "practitioner01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/practitioner-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "PRN",
    //                         "display": "Provider number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-npi",
    //                   "value": "456789123"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "family": "Hale",
    //                   "given": [
    //                     "Cody"
    //                   ],
    //                   "suffix": [
    //                     "MD"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male"
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "123456789",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "prov",
    //                       "display": "Healthcare Provider"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DaVinciHospital01",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 401-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "73 Lakewood Street"
    //                   ],
    //                   "city": "Warwick",
    //                   "state": "RI",
    //                   "postalCode": "02886",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Encounter",
    //               "id": "cfcada30-fd7a-f82d-cdc0-95be9619bcee",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"
    //                 ]
    //               },
    //               "status": "finished",
    //               "class": {
    //                 "system": "http://hl7.org/fhir/v3/ActCode",
    //                 "code": "AMB",
    //                 "display": "ambulatory"
    //               },
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://snomed.info/sct",
    //                       "code": "390906007",
    //                       "display": "Follow-up encounter (procedure)"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "period": {
    //                 "start": "2019-11-11T06:33:38.930Z",
    //                 "end": "2019-11-11T06:33:38.930Z"
    //               },
    //               "subject": {
    //                 "reference": "Patient/14989"
    //               },
    //               "location": [
    //                 {
    //                   "location": {
    //                     "reference": "Location/location01"
    //                   }
    //                 }
    //               ],
    //               "participant": [
    //                 {
    //                   "individual": {
    //                     "reference": "Practitioner/practitioner01"
    //                   }
    //                 }
    //               ],
    //               "serviceProvider": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Coverage",
    //               "id": "14990",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-30T06:07:29.389+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/coverage-deqm"
    //                 ]
    //               },
    //               "policyHolder": {
    //                 "reference": "Patient/14989"
    //               },
    //               "subscriber": {
    //                 "reference": "Patient/14989"
    //               },
    //               "subscriberId": "A123456789",
    //               "beneficiary": {
    //                 "reference": "Patient/14989"
    //               },
    //               "relationship": {
    //                 "coding": [
    //                   {
    //                     "code": "self"
    //                   }
    //                 ]
    //               },
    //               "payor": [
    //                 {
    //                   "reference": "Organization/organization04"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization04",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "456789123",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "ins",
    //                       "display": "Insurance Company"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DVPayer04-\n        ",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 616-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "160 Glen Eagles Road"
    //                   ],
    //                   "city": "Grand Rapids",
    //                   "state": "MI",
    //                   "postalCode": "49503",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "request": {
    //         "method": "POST",
    //         "url": "Measure/measure-col/$submit-data"
    //       },
    //       "resource": {
    //         "resourceType": "Parameters",
    //         "id": "26d8ddc3-ca46-6664-4536-935147a34d54",
    //         "parameter": [
    //           {
    //             "name": "measure-report",
    //             "resource": {
    //               "resourceType": "MeasureReport",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/measurereport-deqm"
    //                 ]
    //               },
    //               "id": "51ff3ad1-48ee-a805-86f5-3a24dbd3a35e",
    //               "status": "complete",
    //               "type": "individual",
    //               "measure": {
    //                 "reference": "https://ncqa.org/fhir/ig/Measure/measure-mrp"
    //               },
    //               "patient": {
    //                 "reference": "Patient/20109"
    //               },
    //               "date": "2019-11-11T06:33:39.242Z",
    //               "period": {
    //                 "start": "2019-11-11T06:33:39.242Z",
    //                 "end": "2019-11-11T06:33:39.242Z"
    //               },
    //               "reportingOrganization": {
    //                 "reference": "Organization/organization01"
    //               },
    //               "evaluatedResources": {
    //                 "extension": [
    //                   {
    //                     "url": "http://hl7.org/fhir/us/davinci-deqm/StructureDefinition/extension-referenceAny",
    //                     "valueReference": {
    //                       "reference": "Task/7849140b-0a08-d5b1-a64c-d8d281d5433c"
    //                     }
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Task",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/hedis/StructureDefinition/hedis-task"
    //                 ]
    //               },
    //               "id": "7849140b-0a08-d5b1-a64c-d8d281d5433c",
    //               "identifier": [
    //                 {
    //                   "system": "http://www.acme.org/tasks",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "status": "completed",
    //               "intent": "plan",
    //               "priority": "routine",
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "http://www.ama-assn.org/go/cpt",
    //                     "code": "1111F",
    //                     "display": "Medication Reconciliation"
    //                   }
    //                 ]
    //               },
    //               "for": {
    //                 "reference": "Patient/20109"
    //               },
    //               "context": {
    //                 "reference": "Encounter/ef8285e8-bdd5-b721-c632-5700bded3b22"
    //               },
    //               "authoredOn": "2019-11-11T06:33:39.242Z",
    //               "executionPeriod": {
    //                 "start": "2019-11-11T06:33:39.242Z",
    //                 "end": "2019-11-11T06:33:39.242Z"
    //               },
    //               "owner": {
    //                 "reference": "Practitioner/practitioner01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Patient",
    //               "id": "20109",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-09-13T18:49:17.454+00:00"
    //               },
    //               "text": {
    //                 "status": "generated",
    //                 "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">Amy V. <b>SHAW </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>1032709</td></tr><tr><td>Address</td><td><span>49 Meadow St </span><br/><span>Mounds </span><span>OK </span><span>US </span></td></tr><tr><td>Date of birth</td><td><span>12 May 1972</span></td></tr></tbody></table></div>"
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "usual",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "MR"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-medicare",
    //                   "value": "7352820",
    //                   "period": {
    //                     "start": "2001-05-06"
    //                   },
    //                   "assigner": {
    //                     "display": "Acme Healthcare"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "use": "official",
    //                   "family": "Shaw",
    //                   "given": [
    //                     "Amy",
    //                     "V."
    //                   ]
    //                 }
    //               ],
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "555-555-5555",
    //                   "use": "home"
    //                 },
    //                 {
    //                   "system": "email",
    //                   "value": "amy.shaw@example.com"
    //                 }
    //               ],
    //               "gender": "female",
    //               "birthDate": "1972-05-12",
    //               "_birthDate": {
    //                 "extension": [
    //                   {
    //                     "url": "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
    //                     "valueDateTime": "1972-05-12T14:02:45-04:00"
    //                   }
    //                 ]
    //               },
    //               "deceasedBoolean": false,
    //               "address": [
    //                 {
    //                   "line": [
    //                     "49 Meadow St"
    //                   ],
    //                   "city": "Mounds",
    //                   "state": "OK",
    //                   "postalCode": "74047",
    //                   "country": "US"
    //                 }
    //               ],
    //               "contact": [
    //                 {
    //                   "relationship": [
    //                     {
    //                       "coding": [
    //                         {
    //                           "system": "http://hl7.org/fhir/v2/0131",
    //                           "code": "R"
    //                         }
    //                       ]
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Location",
    //               "id": "location01",
    //               "meta": {
    //                 "versionId": "2",
    //                 "lastUpdated": "2019-08-27T06:31:56.795+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"
    //                 ]
    //               },
    //               "name": "DaVinciClinic01",
    //               "address": {
    //                 "line": [
    //                   "102 Heritage Dr."
    //                 ],
    //                 "city": "Somerset",
    //                 "state": "NJ",
    //                 "postalCode": "08873",
    //                 "country": "USA"
    //               },
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Practitioner",
    //               "id": "practitioner01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/practitioner-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "PRN",
    //                         "display": "Provider number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-npi",
    //                   "value": "456789123"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "family": "Hale",
    //                   "given": [
    //                     "Cody"
    //                   ],
    //                   "suffix": [
    //                     "MD"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male"
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "123456789",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "prov",
    //                       "display": "Healthcare Provider"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DaVinciHospital01",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 401-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "73 Lakewood Street"
    //                   ],
    //                   "city": "Warwick",
    //                   "state": "RI",
    //                   "postalCode": "02886",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Encounter",
    //               "id": "ef8285e8-bdd5-b721-c632-5700bded3b22",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"
    //                 ]
    //               },
    //               "status": "finished",
    //               "class": {
    //                 "system": "http://hl7.org/fhir/v3/ActCode",
    //                 "code": "AMB",
    //                 "display": "ambulatory"
    //               },
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://snomed.info/sct",
    //                       "code": "390906007",
    //                       "display": "Follow-up encounter (procedure)"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "period": {
    //                 "start": "2019-11-11T06:33:39.242Z",
    //                 "end": "2019-11-11T06:33:39.242Z"
    //               },
    //               "subject": {
    //                 "reference": "Patient/20109"
    //               },
    //               "location": [
    //                 {
    //                   "location": {
    //                     "reference": "Location/location01"
    //                   }
    //                 }
    //               ],
    //               "participant": [
    //                 {
    //                   "individual": {
    //                     "reference": "Practitioner/practitioner01"
    //                   }
    //                 }
    //               ],
    //               "serviceProvider": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Coverage",
    //               "id": "40311",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-11-11T05:47:46.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/coverage-deqm"
    //                 ]
    //               },
    //               "policyHolder": {
    //                 "reference": "Patient/20109"
    //               },
    //               "subscriber": {
    //                 "reference": "Patient/20109"
    //               },
    //               "subscriberId": "A123456789",
    //               "beneficiary": {
    //                 "reference": "Patient/20109"
    //               },
    //               "relationship": {
    //                 "coding": [
    //                   {
    //                     "code": "self"
    //                   }
    //                 ]
    //               },
    //               "payor": [
    //                 {
    //                   "reference": "Organization/organization04"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization04",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "456789123",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "ins",
    //                       "display": "Insurance Company"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DVPayer04-\n        ",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 616-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "160 Glen Eagles Road"
    //                   ],
    //                   "city": "Grand Rapids",
    //                   "state": "MI",
    //                   "postalCode": "49503",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "request": {
    //         "method": "POST",
    //         "url": "Measure/measure-col/$submit-data"
    //       },
    //       "resource": {
    //         "resourceType": "Parameters",
    //         "id": "30b878ad-5d3c-5659-ba14-35e8ea43dfcf",
    //         "parameter": [
    //           {
    //             "name": "measure-report",
    //             "resource": {
    //               "resourceType": "MeasureReport",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/measurereport-deqm"
    //                 ]
    //               },
    //               "id": "a54332c8-4e36-ba8b-60df-5ad76b99ea85",
    //               "status": "complete",
    //               "type": "individual",
    //               "measure": {
    //                 "reference": "https://ncqa.org/fhir/ig/Measure/measure-mrp"
    //               },
    //               "patient": {
    //                 "reference": "Patient/20198"
    //               },
    //               "date": "2019-11-11T06:33:39.549Z",
    //               "period": {
    //                 "start": "2019-11-11T06:33:39.549Z",
    //                 "end": "2019-11-11T06:33:39.549Z"
    //               },
    //               "reportingOrganization": {
    //                 "reference": "Organization/organization04"
    //               },
    //               "evaluatedResources": {
    //                 "extension": [
    //                   {
    //                     "url": "http://hl7.org/fhir/us/davinci-deqm/StructureDefinition/extension-referenceAny",
    //                     "valueReference": {
    //                       "reference": "Task/7f4a848b-2c80-f4ca-f881-bf2b6e5d081d"
    //                     }
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Task",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/hedis/StructureDefinition/hedis-task"
    //                 ]
    //               },
    //               "id": "7f4a848b-2c80-f4ca-f881-bf2b6e5d081d",
    //               "identifier": [
    //                 {
    //                   "system": "http://www.acme.org/tasks",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "status": "completed",
    //               "intent": "plan",
    //               "priority": "routine",
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "http://www.ama-assn.org/go/cpt",
    //                     "code": "1111F",
    //                     "display": "Medication Reconciliation"
    //                   }
    //                 ]
    //               },
    //               "for": {
    //                 "reference": "Patient/20198"
    //               },
    //               "context": {
    //                 "reference": "Encounter/69d72ce6-940f-5ad1-26d2-fb4af6678fdc"
    //               },
    //               "authoredOn": "2019-11-11T06:33:39.549Z",
    //               "executionPeriod": {
    //                 "start": "2019-11-11T06:33:39.549Z",
    //                 "end": "2019-11-11T06:33:39.549Z"
    //               },
    //               "owner": {
    //                 "reference": "Practitioner/practitioner01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Patient",
    //               "id": "20198",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-09-14T12:41:52.102+00:00"
    //               },
    //               "text": {
    //                 "status": "generated",
    //                 "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">Peter James <b>CHALMERS </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>12345</td></tr><tr><td>Address</td><td><span>534 Erewhon St </span><br/><span>PleasantVille </span><span>Vic </span></td></tr><tr><td>Date of birth</td><td><span>25 December 1974</span></td></tr></tbody></table></div>"
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "usual",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "MR"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-medicare",
    //                   "value": "12345",
    //                   "period": {
    //                     "start": "2001-05-06"
    //                   },
    //                   "assigner": {
    //                     "display": "Acme Healthcare"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "use": "official",
    //                   "family": "Chalmers",
    //                   "given": [
    //                     "Peter",
    //                     "James"
    //                   ]
    //                 },
    //                 {
    //                   "use": "usual",
    //                   "family": "Chalmers",
    //                   "given": [
    //                     "Jim"
    //                   ]
    //                 },
    //                 {
    //                   "use": "maiden",
    //                   "family": "Windsor",
    //                   "given": [
    //                     "Peter",
    //                     "James"
    //                   ],
    //                   "period": {
    //                     "end": "2002"
    //                   }
    //                 }
    //               ],
    //               "telecom": [
    //                 {
    //                   "use": "home"
    //                 },
    //                 {
    //                   "system": "phone",
    //                   "value": "(03) 5555 6473",
    //                   "use": "work",
    //                   "rank": 1
    //                 },
    //                 {
    //                   "system": "phone",
    //                   "value": "(03) 3410 5613",
    //                   "use": "mobile",
    //                   "rank": 2
    //                 },
    //                 {
    //                   "system": "phone",
    //                   "value": "(03) 5555 8834",
    //                   "use": "old",
    //                   "period": {
    //                     "end": "2014"
    //                   }
    //                 }
    //               ],
    //               "gender": "male",
    //               "birthDate": "1974-12-25",
    //               "deceasedBoolean": false,
    //               "address": [
    //                 {
    //                   "use": "home",
    //                   "type": "both",
    //                   "text": "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
    //                   "line": [
    //                     "534 Erewhon St"
    //                   ],
    //                   "city": "PleasantVille",
    //                   "district": "Rainbow",
    //                   "state": "Vic",
    //                   "postalCode": "3999",
    //                   "period": {
    //                     "start": "1974-12-25"
    //                   }
    //                 }
    //               ],
    //               "contact": [
    //                 {
    //                   "relationship": [
    //                     {
    //                       "coding": [
    //                         {
    //                           "system": "http://hl7.org/fhir/v2/0131",
    //                           "code": "N"
    //                         }
    //                       ]
    //                     }
    //                   ],
    //                   "name": {
    //                     "family": "du Marché",
    //                     "_family": {
    //                       "extension": [
    //                         {
    //                           "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix",
    //                           "valueString": "VV"
    //                         }
    //                       ]
    //                     },
    //                     "given": [
    //                       "Bénédicte"
    //                     ]
    //                   },
    //                   "telecom": [
    //                     {
    //                       "system": "phone",
    //                       "value": "+33 (237) 998327"
    //                     }
    //                   ],
    //                   "address": {
    //                     "use": "home",
    //                     "type": "both",
    //                     "line": [
    //                       "534 Erewhon St"
    //                     ],
    //                     "city": "PleasantVille",
    //                     "district": "Rainbow",
    //                     "state": "VT",
    //                     "postalCode": "3999",
    //                     "period": {
    //                       "start": "1974-12-25"
    //                     }
    //                   },
    //                   "gender": "female",
    //                   "period": {
    //                     "start": "2012"
    //                   }
    //                 }
    //               ],
    //               "managingOrganization": {
    //                 "reference": "Organization/organization04"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Location",
    //               "id": "20216",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-09-14T13:11:31.037+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"
    //                 ]
    //               },
    //               "name": "DaVinciClinic02",
    //               "address": {
    //                 "line": [
    //                   "103 Heritage Dr."
    //                 ],
    //                 "city": "Somerset",
    //                 "state": "NJ",
    //                 "postalCode": "08873",
    //                 "country": "USA"
    //               },
    //               "managingOrganization": {
    //                 "reference": "Organization/organization04"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Practitioner",
    //               "id": "practitioner01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/practitioner-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "PRN",
    //                         "display": "Provider number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-npi",
    //                   "value": "456789123"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "family": "Hale",
    //                   "given": [
    //                     "Cody"
    //                   ],
    //                   "suffix": [
    //                     "MD"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male"
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization04",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "456789123",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "ins",
    //                       "display": "Insurance Company"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DVPayer04-\n        ",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 616-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "160 Glen Eagles Road"
    //                   ],
    //                   "city": "Grand Rapids",
    //                   "state": "MI",
    //                   "postalCode": "49503",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Encounter",
    //               "id": "69d72ce6-940f-5ad1-26d2-fb4af6678fdc",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"
    //                 ]
    //               },
    //               "status": "finished",
    //               "class": {
    //                 "system": "http://hl7.org/fhir/v3/ActCode",
    //                 "code": "AMB",
    //                 "display": "ambulatory"
    //               },
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://snomed.info/sct",
    //                       "code": "390906007",
    //                       "display": "Follow-up encounter (procedure)"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "period": {
    //                 "start": "2019-11-11T06:33:39.549Z",
    //                 "end": "2019-11-11T06:33:39.549Z"
    //               },
    //               "subject": {
    //                 "reference": "Patient/20198"
    //               },
    //               "location": [
    //                 {
    //                   "location": {
    //                     "reference": "Location/20216"
    //                   }
    //                 }
    //               ],
    //               "participant": [
    //                 {
    //                   "individual": {
    //                     "reference": "Practitioner/practitioner01"
    //                   }
    //                 }
    //               ],
    //               "serviceProvider": {
    //                 "reference": "Organization/organization04"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Coverage",
    //               "id": "40313",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-11-11T05:49:34.793+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/coverage-deqm"
    //                 ]
    //               },
    //               "policyHolder": {
    //                 "reference": "Patient/20198"
    //               },
    //               "subscriber": {
    //                 "reference": "Patient/20198"
    //               },
    //               "subscriberId": "A123456789",
    //               "beneficiary": {
    //                 "reference": "Patient/20198"
    //               },
    //               "relationship": {
    //                 "coding": [
    //                   {
    //                     "code": "self"
    //                   }
    //                 ]
    //               },
    //               "payor": [
    //                 {
    //                   "reference": "Organization/organization04"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization04",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "456789123",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "ins",
    //                       "display": "Insurance Company"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DVPayer04-\n        ",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 616-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "160 Glen Eagles Road"
    //                   ],
    //                   "city": "Grand Rapids",
    //                   "state": "MI",
    //                   "postalCode": "49503",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "request": {
    //         "method": "POST",
    //         "url": "Measure/measure-col/$submit-data"
    //       },
    //       "resource": {
    //         "resourceType": "Parameters",
    //         "id": "473360f9-f33d-70a0-dd25-1461cbeb73c1",
    //         "parameter": [
    //           {
    //             "name": "measure-report",
    //             "resource": {
    //               "resourceType": "MeasureReport",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/measurereport-deqm"
    //                 ]
    //               },
    //               "id": "3473ee3f-4706-8c2d-6bbc-d1b5764b6dc5",
    //               "status": "complete",
    //               "type": "individual",
    //               "measure": {
    //                 "reference": "https://ncqa.org/fhir/ig/Measure/measure-mrp"
    //               },
    //               "patient": {
    //                 "reference": "Patient/patient-1"
    //               },
    //               "date": "2019-11-11T06:33:39.951Z",
    //               "period": {
    //                 "start": "2019-11-11T06:33:39.951Z",
    //                 "end": "2019-11-11T06:33:39.951Z"
    //               },
    //               "reportingOrganization": {
    //                 "reference": "Organization/organization01"
    //               },
    //               "evaluatedResources": {
    //                 "extension": [
    //                   {
    //                     "url": "http://hl7.org/fhir/us/davinci-deqm/StructureDefinition/extension-referenceAny",
    //                     "valueReference": {
    //                       "reference": "Task/11cfea3b-65f9-9b68-0483-8139494cf50b"
    //                     }
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Task",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/hedis/StructureDefinition/hedis-task"
    //                 ]
    //               },
    //               "id": "11cfea3b-65f9-9b68-0483-8139494cf50b",
    //               "identifier": [
    //                 {
    //                   "system": "http://www.acme.org/tasks",
    //                   "value": "12345"
    //                 }
    //               ],
    //               "status": "completed",
    //               "intent": "plan",
    //               "priority": "routine",
    //               "code": {
    //                 "coding": [
    //                   {
    //                     "system": "http://www.ama-assn.org/go/cpt",
    //                     "code": "1111F",
    //                     "display": "Medication Reconciliation"
    //                   }
    //                 ]
    //               },
    //               "for": {
    //                 "reference": "Patient/patient-1"
    //               },
    //               "context": {
    //                 "reference": "Encounter/b4d5e7fe-5fbe-962d-fb1c-802c301d0b6e"
    //               },
    //               "authoredOn": "2019-11-11T06:33:39.951Z",
    //               "executionPeriod": {
    //                 "start": "2019-11-11T06:33:39.951Z",
    //                 "end": "2019-11-11T06:33:39.951Z"
    //               },
    //               "owner": {
    //                 "reference": "Practitioner/practitioner01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Patient",
    //               "id": "patient-1",
    //               "meta": {
    //                 "versionId": "3",
    //                 "lastUpdated": "2019-11-11T06:17:38.858+00:00"
    //               },
    //               "text": {
    //                 "status": "generated",
    //                 "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">P.Sudhaka P.Nageswara <b>RAO </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Address</td><td><span>null </span><br/></td></tr></tbody></table></div>"
    //               },
    //               "active": true,
    //               "name": [
    //                 {
    //                   "use": "official",
    //                   "family": "Rao",
    //                   "given": [
    //                     "P.Sudhaka",
    //                     "P.Nageswara"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male",
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Location",
    //               "id": "location01",
    //               "meta": {
    //                 "versionId": "2",
    //                 "lastUpdated": "2019-08-27T06:31:56.795+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-location"
    //                 ]
    //               },
    //               "name": "DaVinciClinic01",
    //               "address": {
    //                 "line": [
    //                   "102 Heritage Dr."
    //                 ],
    //                 "city": "Somerset",
    //                 "state": "NJ",
    //                 "postalCode": "08873",
    //                 "country": "USA"
    //               },
    //               "managingOrganization": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Practitioner",
    //               "id": "practitioner01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/practitioner-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "PRN",
    //                         "display": "Provider number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "http://hl7.org/fhir/sid/us-npi",
    //                   "value": "456789123"
    //                 }
    //               ],
    //               "active": true,
    //               "name": [
    //                 {
    //                   "family": "Hale",
    //                   "given": [
    //                     "Cody"
    //                   ],
    //                   "suffix": [
    //                     "MD"
    //                   ]
    //                 }
    //               ],
    //               "gender": "male"
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization01",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "123456789",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "prov",
    //                       "display": "Healthcare Provider"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DaVinciHospital01",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 401-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "73 Lakewood Street"
    //                   ],
    //                   "city": "Warwick",
    //                   "state": "RI",
    //                   "postalCode": "02886",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Encounter",
    //               "id": "b4d5e7fe-5fbe-962d-fb1c-802c301d0b6e",
    //               "meta": {
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter"
    //                 ]
    //               },
    //               "status": "finished",
    //               "class": {
    //                 "system": "http://hl7.org/fhir/v3/ActCode",
    //                 "code": "AMB",
    //                 "display": "ambulatory"
    //               },
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://snomed.info/sct",
    //                       "code": "390906007",
    //                       "display": "Follow-up encounter (procedure)"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "period": {
    //                 "start": "2019-11-11T06:33:39.951Z",
    //                 "end": "2019-11-11T06:33:39.951Z"
    //               },
    //               "subject": {
    //                 "reference": "Patient/patient-1"
    //               },
    //               "location": [
    //                 {
    //                   "location": {
    //                     "reference": "Location/location01"
    //                   }
    //                 }
    //               ],
    //               "participant": [
    //                 {
    //                   "individual": {
    //                     "reference": "Practitioner/practitioner01"
    //                   }
    //                 }
    //               ],
    //               "serviceProvider": {
    //                 "reference": "Organization/organization01"
    //               }
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Coverage",
    //               "id": "40314",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-11-11T05:50:03.947+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/coverage-deqm"
    //                 ]
    //               },
    //               "policyHolder": {
    //                 "reference": "Patient/patient-1"
    //               },
    //               "subscriber": {
    //                 "reference": "Patient/patient-1"
    //               },
    //               "subscriberId": "A123456789",
    //               "beneficiary": {
    //                 "reference": "Patient/patient-1"
    //               },
    //               "relationship": {
    //                 "coding": [
    //                   {
    //                     "code": "self"
    //                   }
    //                 ]
    //               },
    //               "payor": [
    //                 {
    //                   "reference": "Organization/organization04"
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "name": "resource",
    //             "resource": {
    //               "resourceType": "Organization",
    //               "id": "organization04",
    //               "meta": {
    //                 "versionId": "1",
    //                 "lastUpdated": "2019-08-26T17:34:18.539+00:00",
    //                 "profile": [
    //                   "http://hl7.org/fhir/us/davinci-deqm/STU3/StructureDefinition/organization-deqm"
    //                 ]
    //               },
    //               "identifier": [
    //                 {
    //                   "use": "official",
    //                   "type": {
    //                     "coding": [
    //                       {
    //                         "system": "http://hl7.org/fhir/v2/0203",
    //                         "code": "TAX",
    //                         "display": "Tax ID number"
    //                       }
    //                     ]
    //                   },
    //                   "system": "urn:oid:2.16.840.1.113883.4.4",
    //                   "value": "456789123",
    //                   "assigner": {
    //                     "display": "www.irs.gov"
    //                   }
    //                 }
    //               ],
    //               "active": true,
    //               "type": [
    //                 {
    //                   "coding": [
    //                     {
    //                       "system": "http://hl7.org/fhir/organization-type",
    //                       "code": "ins",
    //                       "display": "Insurance Company"
    //                     }
    //                   ]
    //                 }
    //               ],
    //               "name": "DVPayer04-\n        ",
    //               "telecom": [
    //                 {
    //                   "system": "phone",
    //                   "value": "(+1) 616-555-1212"
    //                 }
    //               ],
    //               "address": [
    //                 {
    //                   "line": [
    //                     "160 Glen Eagles Road"
    //                   ],
    //                   "city": "Grand Rapids",
    //                   "state": "MI",
    //                   "postalCode": "49503",
    //                   "country": "USA"
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       }
    //     }
    //   ]
    // }
    var finaldata = []
    var patient = ''
    data.entry.map((e, k) => {
      console.log()
      finaldata[k] = []
      e.resource.parameter.forEach(element => {
        finaldata[k].push(element.resource);
      })
    })
    return (
      <DisplayBundle finaldata={finaldata} />
    )
  }
  render() {
    return (
      <div>
        {this.state.showScore &&
          <div>
            <section id="call-to-action" className="call-to-action wow fadeIn">
              <div className="container text-center">
                <h3>Your Calculated Mips Score is {parseFloat((this.state.score).toFixed(4))}</h3>
              </div>
            </section>
          </div>
        }
        <div className="form-row">
          {this.state.qualityImprovement.measureList.length > 0 &&
            <div style={{ width: "100%", margin: "10px" }}>
              <h4 className="title">Quality Improvement</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Measure ID </th>
                    <th>Measure Name</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.qualityImprovement.measureList.map((measure, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <span>{measure.measureId}</span>
                        </td>
                        <td>
                          <span>{measure.measureName}</span>
                        </td>
                        <td>{this.displayPatientwiseInfo(measure.data)}</td>
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
          {this.state.promotingInteroperability.measureList.length > 0 &&
            <div style={{ width: "100%", margin: "10px" }}>
              <h4 className="title">Promoting Interoperability</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Measure ID </th>
                    <th>Measure Name</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.promotingInteroperability.measureList.map((measure, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <span>{measure.measureId}</span>
                        </td>
                        <td>
                          <span>{measure.measureName}</span>
                        </td>
                        <td>{this.displayPatientwiseInfo()}</td>
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
          {this.state.improvementActivity.measureList.length > 0 &&
            <div style={{ width: "100%", margin: "10px" }}>
              <h4 className="title">Improvement Activity</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Measure ID </th>
                    <th>Measure Name</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.improvementActivity.measureList.map((measure, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <span>{measure.measureId}</span>
                        </td>
                        <td>
                          <span>{measure.measureName}</span>
                        </td>
                        <td>{this.displayPatientwiseInfo()}</td>
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
          {this.state.costMeasures.measureList.length > 0 &&
            <div style={{ width: "100%", margin: "10px" }}>
              <h4 className="title">Cost Measure</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Measure ID </th>
                    <th>Measure Name</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.costMeasures.measureList.map((measure, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <span>{measure.measureId}</span>
                        </td>
                        <td>
                          <span>{measure.measureName}</span>
                        </td>
                        <td>{this.displayPatientwiseInfo()}</td>
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