'use strict';

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import qualityMeasures from '../json/qualityMeasures.json';
import Client from "fhir-kit-client";
import Config from '../globalConfiguration.json';
import { createToken } from '../components/Authentication';
import { findAndReplace } from 'find-and-replace-anything'





var smart = new Client({ baseUrl: "http://cdex.mettles.com:8080/hapi-fhir-jpaserver/fhir" });
var payerSmart = new Client({ baseUrl: "http://cdex.mettles.com:8180/hapi-fhir-jpaserver/fhir" });

// console.log(smart.search({ resourceType: "Patient", searchParams: { _count: '100' } }));


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
    push(collectionTypeOptions, { key: 'all', text: 'All', value: "all" })
    push(collectionTypeOptions, { key: collectionTypeKey, text: qualityMeasures[i]["DATA SUBMISSION METHOD"], value: qualityMeasures[i]["DATA SUBMISSION METHOD"] })

  }
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
      reportingOptions: [
        { key: 'individual', text: "Individual", value: 'individual' },
        { key: 'group', text: "Group (and virtual group) ", value: 'group' },
        { key: '', text: "Third Party", value: 'thirdparty' }
      ],
      practiceOptions: [
        { key: 'small', text: "No. of Clinicians <= 15 ", value: 'small' },
        { key: 'medium', text: "No. of Clinicians > 15 ", value: 'medium' },
        { key: 'large', text: "No. of Clinicians > 25 ", value: 'large' }
      ],
      submissionTypeOptions: [
        { key: 'direct', text: "Direct", value: 'direct' },
        { key: 'upload', text: "Log in and Upload", value: 'upload' },
        { key: 'partb', text: "Medicare Part B claims", value: 'partb' }
      ],
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
      measureObj: {},
      // reporting: props.getStore().qualityImprovement.reporting,
      reporting: (!props.getStore().improvementActivity.group) ? 'individual' : "group",
      practice: props.getStore().qualityImprovement.practice,
      submissionType: props.getStore().qualityImprovement.submissionType,
      saving: false,
      costMeasures: props.getStore().costMeasures,
      promotingInteroperability: props.getStore().promotingInteroperability,
      improvementActivity: props.getStore().improvementActivity,
      group: props.getStore().improvementActivity.group,

    };
    this.handleCollectionTypeChange = this.handleCollectionTypeChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
    this.handleSpecialtyMeasureChange = this.handleSpecialtyMeasureChange.bind(this);
    this.handleMeasureTypeChange = this.handleMeasureTypeChange.bind(this);
    this.handleReportingChange = this.handleReportingChange.bind(this);
    this.handlePracticeChange = this.handlePracticeChange.bind(this);
    this.getDataByCategory = this.getDataByCategory.bind(this);
    // this.submitAndSave = this.submitAndSave.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.isValidated = this.isValidated.bind(this);
    var self = this;
    this.patientsList = [];
    // smart.search({ resourceType: 'Patient', searchParams: { _count: '100' } })
    //   .then((response) => {
    //     // console.log(response);
    //     self.patientsList = response.entry;

    //     // return response;
    //   })
    // console.log("patient list",this.patientsList)
  }

  componentDidMount() {
    var measureOptions = []
    for (var i = 0; i < qualityMeasures.length; i++) {
      if (qualityMeasures[i]['eMEASURE ID'] !== 'None') {
        push(measureOptions, {
          key: qualityMeasures[i]["eMEASURE ID"],
          text: qualityMeasures[i]["MEASURE NAME"],
          value: qualityMeasures[i]["eMEASURE ID"],
          highpriority: qualityMeasures[i]["HIGH PRIORITY MEASURE"].toString(),
          measuretype: qualityMeasures[i]["MEASURE TYPE"]
        }, true)
      }

    }
    this.setState({ measureOptions: measureOptions })
  }

  componentWillUnmount() {
    smart.search({ resourceType: 'Patient', searchParams: { _count: '100' } })
      .then((response) => {
        // console.log(response);
        this.patientsList = response.entry;

        // return response;
      })
  }

  handleReportingChange = (event, data) => {
    this.setState({ reporting: data.value })
    let qualityImprovement = this.state.qualityImprovement
    qualityImprovement.reporting = data.value
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement
    });
  }

  handlePracticeChange = (event, data) => {
    this.setState({ practice: data.value })
    if (data.value === "large") {
      let submissionTypeOptions = [
        { key: 'direct', text: "Direct", value: 'direct' },
        { key: 'upload', text: "Log in and Upload", value: 'upload' },
        { key: 'cms', text: "CMS Web Interface", value: 'cms' },
      ];
      this.setState({ submissionTypeOptions });
    } else {
      let submissionTypeOptions = [
        { key: 'direct', text: "Direct", value: 'direct' },
        { key: 'upload', text: "Log in and Upload", value: 'upload' },
        { key: 'partb', text: "Medicare Part B claims", value: 'partb' }
      ];
      this.setState({ submissionTypeOptions });
    }
    let qualityImprovement = this.state.qualityImprovement
    qualityImprovement.practice = data.value
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement
    });
  }


  handleSubTypeChange = (event, data) => {
    this.setState({ submissionType: data.value })
    let qualityImprovement = this.state.qualityImprovement
    qualityImprovement.submissionType = data.value
    this.setState({ qualityImprovement: qualityImprovement })
    this.props.updateStore({
      qualityImprovement: qualityImprovement
    });
  }

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
      if (filteredMeasures[i]['eMEASURE ID'] !== 'None') {
        push(measureOptions, { key: filteredMeasures[i]["eMEASURE ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["eMEASURE ID"] }, true)
      }
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
      if (filteredMeasures[i]['eMEASURE ID'] !== 'None') {
        push(measureOptions, { key: filteredMeasures[i]["eMEASURE ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["eMEASURE ID"] }, true)
      }
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

      if (filteredMeasures[i]['eMEASURE ID'] !== 'None') {
        push(measureOptions, { key: filteredMeasures[i]["eMEASURE ID"], text: filteredMeasures[i]["MEASURE NAME"], value: filteredMeasures[i]["eMEASURE ID"] }, true)

      }

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
      qualityImprovement: qualityImprovement
    });

  }
  addMeasure() {
    if (this.state.measure !== '') {
      if (!this.state.measureObj.hasOwnProperty(this.state.measure)) {
        let measureObj = this.state.measureObj
        let Obj = this.state.measureOptions.find((m) => {
          return m.key === this.state.measure
        })
        console.log("measure Obj---", Obj);
        measureObj[this.state.measure] = Obj.text
        this.setState({ measureObj: measureObj })
        this.setState(prevState => ({
          measureList: [...prevState.measureList, { measureId: this.state.measure, measureName: Obj.text, highpriority: Obj.highpriority, measuretype: Obj.measuretype, showData: false }]
        }))
        const { measureList } = this.state;
        let tempArr = [...measureList];
        tempArr.push({ measureId: this.state.measure, measureName: Obj.text, highpriority: Obj.highpriority, measuretype: Obj.measuretype, showData: false });
        console.log(tempArr, 'tempArrs')
        let qualityImprovement = this.state.qualityImprovement
        qualityImprovement.measureList = tempArr
        this.props.updateStore({
          qualityImprovement: qualityImprovement
        });
      }
    }
  }

  async getSummaryBundle(dataRequirements, measureId) {
    let summaryBundle = {
      "resourceType": "Bundle",
      "type": "transaction",
      "entry": []
    }

    for (let patientEntry of this.patientsList) {
      console.log('----------------------patient Obj', patient);
      let patient = patientEntry.resource;
      // summaryBundle['entry'] = []
      // this.patient = patient
      let payload = {
        "request": {
          "method": "POST",
          "url": "Measure/measure-col/$submit-data"
        }
      }
      // console.log(Config.operationPayload,'operationpayload in reconcile',patient)
      let resource = await this.reconcile(patient, dataRequirements, measureId);

      // console.log(resource,'what is the value')
      if (resource !== '') {
        payload['resource'] = resource
        payload.resource.id = this.getGUID()
        // console.log('patload',payload)
        summaryBundle.entry.push(payload)
      }

    }
    console.log("\n\n --------Summary Bundle", summaryBundle);
    return summaryBundle
  }

  getDataRequirementsByIdentifier = async (identifier) => {
    let token = await createToken(Config.payer.grant_type, 'payer', sessionStorage.getItem('username'), sessionStorage.getItem('password'));
    token = "Bearer " + token;
    let fhir_url = "http://cdex.mettles.com:8180/hapi-fhir-jpaserver/fhir";
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "authorization": token,
    });
    var url = fhir_url + "/Measure/$data-requirements-by-identfier?identifier=" + identifier + "&periodStart=2019-07-19&periodEnd=2020-10-25";
    let requirements = await fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      console.log("response----------", response);
      return response.json();
    }).then((response) => {
      console.log("----------response", response);
      this.setState({ prefetchloading: false });
      return response;
    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );
    return requirements;
  }

  getGUID = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return 'mettles-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



  // generatePayload = async (patientResource, practitionerResource, organizationResource, locationResource, coverageResource, conditionResource, procedureResource, encounterResource) => {
  generatePayload = async (resourceArray, measureId) => {
    let date = new Date();
    let timestamp = date.toISOString();
    let obj = JSON.stringify(Config.operationPayload)
    let obj2 = JSON.parse(obj)
    console.log(obj, 'ooo')
    let measurereport = obj2.parameter.find(e => e.name === "measure-report");

    // TODO: consider generating using descrete templates instead of extracting from sample
    // let task = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Task");
    // let patient = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Patient");
    // let location = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Location");
    // let practitioner = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Practitioner");
    // let organization = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Organization");
    // let encounter = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Encounter");
    // let coverage = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Coverage");
    // let condition = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Condition");
    // let procedure = obj2.parameter.find(e => e.name === "resource" && e.resource.resourceType === "Procedure");
    // let payor = {
    //         "name": "resource",
    //         "resource": payorResource
    //     };
    let organization = ''
    let practitioner = ''
    let patientResource = ''
    for (var j = 0; j < resourceArray.length; j++) {
      if (resourceArray[j].resourceType === 'Organization') {
        organization = resourceArray[j]
      }
      else if (resourceArray[j].resourceType === 'Practitioner') {
        practitioner = resourceArray[j]
      }
      else if (resourceArray[j].resourceType === 'Patient') {
        patientResource = resourceArray[j]
      }
    }
    obj2.id = this.getGUID();
    measurereport.resource.id = this.getGUID();
    // task.resource.id = this.getGUID();
    // encounter.resource.id = MRP.getGUID();
    // patient.resource = patientResource;
    // console.log(patient.resource.id,'wttf2')

    // practitioner.resource = practitionerResource;
    // organization.resource = organizationResource;
    // procedure.resource = procedureResource;
    // condition.resource = conditionResource;
    // encounter.resource = encounterResource;
    // location.resource = locationResource;
    // coverage.resource = coverageResource;
    let list_of_ids = []
    let res = payerSmart.search({ resourceType: "Measure", searchParams: { identifier: measureId } })
    list_of_ids.push(res)
    let result = await Promise.all(list_of_ids)
    let id = ''
    if ('entry' in result[0]) {
      id= result[0].entry[0].resource.id
     }
    // TODO: look into a more elegant resource generation approach
    measurereport.resource.subject.reference = "Patient/" + patientResource.id;
    measurereport.resource.date = timestamp;
    measurereport.resource.measure = "Measure/"+id;
    measurereport.resource.period.start = timestamp;
    measurereport.resource.period.end = timestamp;
    measurereport.resource.reporter.reference = "Organization/" + organization.id;
    // task.resource.for.reference = "Patient/" + patientResource.id;
    // task.resource.authoredOn = timestamp;
    // task.resource.executionPeriod.start = timestamp;
    // task.resource.executionPeriod.end = timestamp;
    // task.resource.owner.reference = "Practitioner/" + practitioner.id;
    // encounter.resource.period.start = timestamp;
    // encounter.resource.period.end = timestamp;
    // encounter.resource.subject.reference = "Patient/" + patient.resource.id;
    // encounter.resource.location[0].location.reference = "Location/" + location.resource.id;
    // encounter.resource.participant[0].individual.reference = "Practitioner/" + practitioner.resource.id;
    // encounter.resource.serviceProvider.reference = "Organization/" + organization.resource.id;
    // patient.resource.managingOrganization.reference = "Organization/" + organization.resource.id;
    // coverage.resource.policyHolder.reference = "Patient/" + patient.resource.id;
    // coverage.resource.subscriber.reference = "Patient/" + patient.resource.id;
    // coverage.resource.beneficiary.reference = "Patient/" + patient.resource.id;

    let arr = []
    arr.push(measurereport)
    // arr.push(task)
    // function checkFn (foundVal) {
    //   console.log(foundVal,'pleaseeeee')
    //   var val = foundVal.split('-')
    //   let replaceValue=''
    //   if(val[0]!=='mettles'){
    //     replaceValue = 'mettles-'+foundVal
    //     return replaceValue
    //   }
    //   return foundVal
    //   // always return original foundVal when no replacement occurs
    // }
    // var red = findAndReplace(resourceArray,resourceArray[i].id,'mettles-'+resourceArray[i].id)
    // console.log(red,'like this')

    for (var i = 0; i < resourceArray.length; i++) {
      // if(resourceArray[i].hasOwnProperty('id')){
      //   var split=resourceArray[i].split('-')
      //   if(split[0] !=='mettles'){
      //     resourceArray[i].id = 'mettles-'+resourceArray[i].id
      //   }
      // //   // findAndReplaceIf(resourceArray[i], checkFn)
      // // var red = findAndReplace(resourceArray,resourceArray[i].id,'mettles-'+resourceArray[i].id)
      // // console.log(red,'like this')
      // } 
      // if(resourceArray[i].resourceType==='Patient'){
      //   if(resourceArray[i].hasOwnProperty('generalPractitioner')){
      //     var ref=resourceArray[i].generalPractitioner.reference.split('/')
      //     var val=ref[1].split('-')
      //     if(val[0]!=='mettles'){
      //       resourceArray[i].generalPractitioner.reference=ref[0]+'/mettles-'+ref[1]
      //     }
      //   }
      //   if(resourceArray[i].hasOwnProperty('managingOrganization')){
      //     var ref=resourceArray[i].managingOrganization.reference.split('/')
      //     var val=ref[1].split('-')
      //     if(val[0]!=='mettles'){
      //       resourceArray[i].managingOrganization.reference=ref[0]+'/mettles-'+ref[1]
      //     }
      //   }
      // }
      // if(resourceArray[i].resourceType==='Procedure' || resourceArray[i].resourceType==='Condition' || resourceArray[i].resourceType==='Observation'|| resourceArray[i].resourceType==='MedicationRequest'){
      //   if(resourceArray[i].hasOwnProperty('subject')){
      //     var ref=resourceArray[i].subject.reference.split('/')
      //     var val=ref[1].split('-')
      //     if(val[0]!=='mettles'){
      //       resourceArray[i].subject.reference=ref[0]+'/mettles-'+ref[1]
      //     }
      //   }
      // }
      // if(resourceArray[i].resourceType==='Encounter'||resourceArray[i].resourceType==='AllergyIntolerance'){
      //   if(resourceArray[i].hasOwnProperty('patient')){
      //     var ref=resourceArray[i].patient.reference.split('/')
      //     var val=ref[1].split('-')
      //     if(val[0]!=='mettles'){
      //       resourceArray[i].patient.reference=ref[0]+'/mettles-'+ref[1]
      //     }
      //   }
      // }

      arr.push({
        "name": "resource",
        "resource": resourceArray[i]
      })
    }
    console.log('patient1234', patientResource, arr)
    // obj2.parameter = [measurereport, task, patient, location, practitioner, organization, encounter, coverage, condition, procedure];
    obj2.parameter = arr;
    console.log(obj2, 'operation payload')
    return obj2;
  }

  reconcile = async (patient, mlibDR, measureId) => {
    console.log('in reconcile method')
    let libDR = mlibDR
    // console.log(patient,'patient organization',smart,'client')
    let orgID = null
    let practitionerID = null

    if (patient.hasOwnProperty("managingOrganization")) {
      orgID = patient.managingOrganization.reference.split('/')[1];
    }
    if (patient.hasOwnProperty("generalPractitioner")) {
      practitionerID = patient.generalPractitioner[0].reference.split('/')[1];
    }
    var dataToLoad = []
    for (var i = 0; i < libDR.dataRequirement.length; i++) {
      if (libDR.dataRequirement[i].type !== "Patient") {
        if (orgID !== null) {
          dataToLoad.push(smart.read({ resourceType: "Organization", id: orgID }))
        }
        if (practitionerID !== null) {
          dataToLoad.push(smart.read({ resourceType: "Practitioner", id: practitionerID }))
        }

        if (libDR.dataRequirement[i].type === 'Location' && orgID != null) {
          console.log('inside Lcoation if')
          dataToLoad.push(smart.search({ resourceType: "Location", searchParams: { organization: orgID } }))
        }
        else if (libDR.dataRequirement[i].type === 'Coverage') {
          console.log('inside Coverage if')
          dataToLoad.push(smart.search({ resourceType: "Coverage", searchParams: { subscriber: patient.id } }))
        }
        else {
          let identifier = ''
          console.log(libDR.dataRequirement[i].codeFilter[0], 'data req')
          if (libDR.dataRequirement[i].codeFilter[0].hasOwnProperty('valueSet')) {
            identifier = libDR.dataRequirement[i].codeFilter[0].valueSet.substring(8)
          }
          // else if (libDR.dataRequirement[i].codeFilter[2].hasOwnProperty('valueSet')) {
          //   identifier = libDR.dataRequirement[i].codeFilter[2].valueSet.substring(8)
          // }

          console.log(identifier, 'oooooo')
          if (identifier !== '') {
            let valueSet = []
            let res = payerSmart.search({ resourceType: "ValueSet", searchParams: { identifier: identifier } })
            valueSet.push(res)
            let result = await Promise.all(valueSet)
            console.log('inside procedure if', result)
            // console.log('inside procedure if')
            let codes = []
            if ('entry' in result[0]) {
              for (var k = 0; k < result[0].entry[0].resource.compose.include.length; k++) {
                for (var j = 0; j < result[0].entry[0].resource.compose.include[k].concept.length; j++) {
                  codes.push(result[0].entry[0].resource.compose.include[k].concept[j].code)
                }
              }
            }


            // console.log(codes.toString(), 'please dear god')
            if (libDR.dataRequirement[i].type === 'AllergyIntolerance') {
              dataToLoad.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { patient: patient.id, code: codes.toString() } }))
            }
            else if (libDR.dataRequirement[i].type === 'Encounter') {
              dataToLoad.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { patient: patient.id, type: codes.toString() } }))
            }
            else {
              dataToLoad.push(smart.search({ resourceType: libDR.dataRequirement[i].type, searchParams: { subject: patient.id, code: codes.toString() } }))
            }
          }




        }
      }

      // else if(libDR.dataRequirement[i].type='Location')    

    }

    let res = await Promise.all(dataToLoad);
    console.log(JSON.stringify(res), 'what res');

    let location = ''
    let coverage = ''
    let organization = res[0]
    let practitioner = res[1]
    let condition = ''
    let procedure = []
    let encounter = []
    let medicationRequest = []
    let serviceRequest = []
    let observation = []
    let count = 0
    let resultArray = []
    for (var j = 0; j < res.length; j++) {
      // var arr = Object.keys(res[j])
      // console.log(arr,'arr')
      // if(arr.indexOf('entry') !== -1)

      if ('entry' in res[j]) {
        if (res[j].entry.length > 0) {
          for (var i = 0; i < res[j].entry.length; i++) {
            resultArray.push(res[j].entry[i].resource)
            count = count + 1
          }
        }
        else {
          resultArray.push(res[j].entry[0].resource)
          count = count + 1
        }
        // if (res[j].entry[0].resource.resourceType === "Location") {
        //   location = res[j].entry[0].resource
        // }
        // else if (res[j].entry[0].resource.resourceType === "Coverage") {
        //   console.assert(res[j].total <= 1, "No more than 1 Coverage resources found");
        //   console.assert(res[j].total === 1, "Matching Coverage resource found");
        //   coverage = res[j].entry[0].resource
        // }
        // else if (res[j].entry[0].resource.resourceType === "Condition") {
        //   condition = res[j].entry[0].resource
        // }
        // else if (res[j].entry[0].resource.resourceType === "Procedure") {
        //   procedure = res[j].entry[0].resource
        // }
        // else if (res[j].entry[0].resource.resourceType === "Encounter") {
        //   encounter = res[j].entry[0].resource
        // }
        // else if (res[j].entry[0].resource.resourceType === "Organization") {
        //   organization = res[j].entry[0].resource
        // }
        // else if (res[j].entry[0].resource.resourceType === "Practitioner") {
        //   practitioner = res[j].entry[0].resource
        // }

      }

    }


    // let practitioner = res[0];
    // let organization = res[1].data;
    // let location = res[2].data.entry[0].resource;
    // let coverage = res[3].data.entry[0].resource;
    // let payorOrgID = coverage.payor[0].reference.split('/')[1];
    // let payorOrganization = await smart.patient.api.read({type: "Organization", id: payorOrgID});
    // let payor = payorOrganization.data;
    // console.log("payor and Organization",patient,coverage,arr,'arrrrrrrr')
    // let flag = false
    // console.log(condition,'police')
    // let arr = [condition, procedure, encounter]
    // for (var i = 0; i < arr.length; i++) {
    //   console.log("--------", i, arr[i], 'oh yeah')
    //   if (arr[i] === '') {
    //     flag = true
    //   }
    // }
    resultArray.push(patient)
    resultArray.push(organization)
    resultArray.push(practitioner)
    let payload = ''
    if (count > 0) {
      // payload = await this.generatePayload(patient, practitioner, organization, location, coverage, condition, procedure, encounter);
      payload = await this.generatePayload(resultArray, measureId);
      return payload

    }
    else {
      return payload
    }
    // if (flag === false) {
    //   payload = await this.generatePayload(patient, practitioner, organization, location, coverage, condition, procedure, encounter);
    //   return payload
    // }
    // else {
    //   return payload
    // }

  }

  async getDataByCategory(measureList, type) {
    let response = [];
    let qualityImprovement = this.state.qualityImprovement
    let promotingInteroperability = this.state.promotingInteroperability
    let improvementActivity = this.state.improvementActivity
    if (type === 'qi') {
      measureList = qualityImprovement.measureList
    }
    else if (type === 'pi') {
      measureList = promotingInteroperability.measureList
    }
    else if (type === 'ia') {
      measureList = improvementActivity.measureList
    }
    measureList.map((measure, i) => {
      this.getDataRequirementsByIdentifier(measure.measureId).then((result) => {
        if (result.hasOwnProperty("dataRequirement")) {
          this.getSummaryBundle(result, measure.measureId).then((res) => {
            measure.measureData = res
            // measureList.push(measure);
            measure.loading = false
            if (type === 'qi') {
              this.props.updateStore({ qualityImprovement: qualityImprovement })
            }
            else if (type === 'pi') {
              this.props.updateStore({ promotingInteroperability: promotingInteroperability })
            }
            else if (type === 'ia') {
              this.props.updateStore({ improvementActivity: improvementActivity })
            }
          });


        }
        else {
          measure.data = null;
        }
        response.push(measure);
        // measure.dataRequirements = result
        // qualityMeasureList.push(measure);
      }).catch((error) => { console.log(error); });
    });

    return Promise.resolve(response)
  }




  async test() {
    let qualityImprovement = this.state.qualityImprovement
    const result = await this.getDataByCategory(qualityImprovement.measureList);
    return result;
  }
  //SAVe Method is named Validated. SAve button has a defualt method named isValidated
  async isValidated() {
    console.log(this.props);
    let qualityImprovement = this.state.qualityImprovement
    let promotingInteroperability = this.state.promotingInteroperability
    let improvementActivity = this.state.improvementActivity

    await this.getDataByCategory(qualityImprovement.measureList, 'qi').then((result) => {
      qualityImprovement.measureList = result
      qualityImprovement.loading = false
      this.setState({ qualityImprovement: qualityImprovement })
      this.props.updateStore({ qualityImprovement: qualityImprovement })
      console.log(this.state.qualityImprovement, 'qualityimprovement123', result)
    })

    await this.getDataByCategory(promotingInteroperability.measureList, 'pi').then((result) => {
      promotingInteroperability.measureList = result;
      promotingInteroperability.loading = false;
      this.setState({ promotingInteroperability: promotingInteroperability })
      this.props.updateStore({
        promotingInteroperability: promotingInteroperability
      })

    })
    await this.getDataByCategory(improvementActivity.measureList, 'ia').then((result) => {
      improvementActivity.measureList = result;
      improvementActivity.loading = false;
      this.setState({ improvementActivity: improvementActivity })
      this.props.updateStore({
        improvementActivity: improvementActivity
      })

    })

    console.log("--------qualityImprovement", "promotingInteroperability", "improvementActivity");

    console.log(qualityImprovement, promotingInteroperability, improvementActivity);
    console.log('yooo its wroking')
    this.setState({
      saving: true
    })
  }

  previousStep() {
    console.log(this.props);
    this.props.jumpToStep(3);

  }

  render() {
    return (
      <div>
        <p className="text-center"><b>Quality</b> - 45% OF FINAL SCORE
. Quality category carries the maximum weight towards final MIPS score and requires data to be reported for the full calendar year (Jan 1, 2019 – Dec 31, 2019). Quality category weight has been set to 45%  for 2019 unless you apply for PI hardship exception . In that case, the PI category weight of 25% is assigned to Quality category making the Quality category weight 70%.
Submit collected data for at least 6 measures, or a complete specialty measure set. One of these 6 measures should be an outcome measure (if you have no applicable outcome measure, you can submit another high priority measure instead).</p>
        <div className="form-row">
          <div className="form-group col-3 offset-1">
            <span className="title-small">Type of Reporting</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.reportingOptions}
              placeholder='Type of Reporting'
              search
              selection
              fluid
              disabled
              value={this.state.reporting}
              onChange={this.handleReportingChange}
            />
          </div>
          {this.state.reporting === "group" &&
            <div className="form-group col-3">
              <span className="title-small">Type of Practice</span>
              <Dropdown
                className={"blackBorder"}
                options={this.state.practiceOptions}
                placeholder='Type of Practice'
                search
                selection
                fluid
                value={this.state.practice}
                onChange={this.handlePracticeChange}
              />
            </div>
          }
          <div className="form-group col-4">
            <span className="title-small">Submission Type</span>
            <Dropdown
              className={"blackBorder"}
              options={this.state.submissionTypeOptions}
              placeholder='Submission Type'
              search
              selection
              fluid
              value={this.state.submissionType}
              onChange={this.handleSubTypeChange}
            />
          </div>
        </div>
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
            <span><button style={{ marginTop: "22px" }} className="ui circular icon button" onClick={() => this.addMeasure()}><i aria-hidden="true" className="add icon"></i></button></span>
          </div>
        </div>
        <div className="form-row">
          <table className="table col-10 offset-1">
            <thead>
              <tr>
                <th>Measure ID</th>
                <th>Measure Name</th>
                <th>Measure Type</th>
                <th>High Priority</th>
                <th></th>
              </tr>
            </thead>
            {this.state.measureList.length > 0 &&
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
                        <span>{measure.measuretype}</span>
                      </td>
                      <td>
                        {measure.highpriority &&
                          <span>Yes</span>}
                        {!measure.highpriority &&
                          <span>No</span>}
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
        {/* <div class="footer-buttons">
          <button type="button" class="btn btn-prev btn-primary btn-lg pull-right" id="next-button" onClick={() => this.submitAndSave()}>Save</button>
        </div> */}
      </div>
    )
  }
}