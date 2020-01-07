import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

export default class RenderSubmissionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: []
        }
        this.showPreview = this.showPreview.bind(this)
    }
    componentDidMount() { }

    showPreview(row) {
        let show = this.state.show;
        if (row in show) {
            show[row] = !show[row];
        } else {
            show[row] = true;
        }
        this.setState({ show });
    }
    render() {
        return (
            <div>
                <h4>
                    <div id="fse" className={"spinner " + (this.props.measure.loading ? "visible" : "invisible")}>
                        <Loader
                            type="Oval"
                            color="#000000"
                            height="20"
                            width="20"
                        />
                    </div>
                    {this.props.measure.measureName}</h4>
                {this.props.measure.error &&
                    <div>{this.props.measure.error}</div>}
                {this.props.measure.measureData !== undefined &&
                    <div style={{ marginLeft: "50px" }}>
                        {
                            this.props.measure.measureData.map((subinfo, i) => {
                                return (<div key={i}>
                                    <div className="form-row">
                                        <div className="form-group col-1">
                                            <span>{i + 1}</span>
                                        </div>
                                        <div className="form-group col-2">
                                            <span>{subinfo.patient.name[0].given[0]} {subinfo.patient.name[0].given.length > 1 && <span>{subinfo.patient.name[0].given[1]}</span>} {subinfo.patient.name[0].family} </span>
                                        </div>
                                        <div className="form-group col-2">
                                            <span>{subinfo.submitted &&
                                                <div style={{ color: "green" }}>Submitted successfully.</div>}
                                                {!subinfo.submitted &&
                                                    <div style={{ color: "red" }}>Failed to submit.</div>}</span>
                                        </div>
                                        <div className="form-group col-2">
                                            <button type="button" className="btn" onClick={() => this.showPreview(i)}>Preview</button>
                                        </div>
                                        <div className="form-group col-5">
                                            {this.state.show[i] &&
                                                <div><pre>{JSON.stringify(subinfo.datatosubmit, null, 2)}</pre></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}