import React, { Component } from 'react';
import Switch from "react-switch";

export default class DisplayQuestionnarie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answer: {},
            quesRes: {
                resourceType: "QuestionnaireResponse",
                id: "response1",
                status: "completed",
                item: []
            }
        };
        this.displayQuestion = this.displayQuestion.bind(this);
        // this.handleQuestion = this.handleQuestion.bind(this);
    }
    componentDidMount() {
        let quesRes = this.state.quesRes;
        {
            this.props.finaldata.map((key, i) => {
                console.log("row--- ", this.props.finaldata[i])
                var itemArr = []
                this.props.finaldata[i].item.map((key, j) => {
                    var itemObj = {
                        "linkId": this.props.finaldata[i].item[j].linkId,
                        "answer": [{
                            "valueBoolean": false
                        }]
                    }
                    itemArr.push(itemObj);
                });
                quesRes.item.push({
                    "linkId": this.props.finaldata[i].linkId,
                    "text": this.props.finaldata[i].text,
                    "item": itemArr
                })
            })
        }
        this.setState({ quesRes });
        this.props.updateCallback(quesRes);
    }
    handleQuestion(linkId, row, value) {
        let quesRes = this.state.quesRes;
        console.log(linkId, value, row, quesRes);
        var found = false;
        quesRes.item[row].item.map((key, i) => {
            if (quesRes.item[row].item[i].linkId === linkId) {
                quesRes.item[row].item[i].answer = [{
                    "valueBoolean": value
                }];
                found = true;
            }
        })
        if (!found) {
            quesRes.item[row].item.push({
                "linkId": linkId,
                "answer": [{
                    "valueBoolean": value
                }]
            });
        }
        console.log(quesRes);
        this.setState({ quesRes });
        let answer = this.state.answer;
        if (answer.hasOwnProperty(linkId)) {
            answer[linkId] = !answer[linkId];
        } else {
            answer[linkId] = value;
        }
        this.setState({ answer });
        this.props.updateCallback(quesRes);
    }
    displayQuestion(question, row) {
        return (
            question.map((key, i) => {
                return (<div className="form-row" key={i}>
                    <div className="form-group col-8 offset-1">
                        <span>{question[i].linkId}  </span>{question[i].text}</div>
                    <div className="form-group col-2">
                        <label>
                            <Switch onChange={this.handleQuestion.bind(this, question[i].linkId, row)} checked={this.state.answer[question[i].linkId]} />
                        </label>
                    </div>
                </div>)
            })
        )
    }
    render() {
        return (
            <div>
                {this.props.finaldata.map((key, i) => {
                    if (this.props.finaldata[i].hasOwnProperty("item")) {
                        return (
                            <div key={i}>
                                <h4>{this.props.finaldata[i].text}</h4>
                                {this.displayQuestion(this.props.finaldata[i].item, i)}
                            </div>
                        )
                    }
                })
                }
            </div>
        )
    }
}