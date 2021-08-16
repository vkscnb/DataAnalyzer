import React, { Component } from "react";
import "../css/slider.css"
import { connect } from 'react-redux'
import CsvMysqlSlider from './csvMysqlSlider'

class Slider extends Component {
    state = {
        status: false
    }
    openNav1 = () => {
        if (document.getElementById("myNav") && !this.state.status) {
            document.getElementById("myNav").style.width = "90%";
            this.setState({ status: !this.state.status })
        } else if (document.getElementById("myNav") && this.state.status) {
            document.getElementById("myNav").style.width = "0%";
            this.setState({ status: !this.state.status })
        }
    }

    render() {
        let tableData = this.props.tableData
        return (
            <div>
                <div id="myNav" className="overlay">

                    {
                        this.props.submitStatus && this.state.status
                            ? <CsvMysqlSlider /> : null
                    }

                </div>
                <span
                    style={{ fontSize: "30px", cursor: "pointer", float: "right" }}
                    onClick={this.openNav1}

                >&#9776;
                    {!this.state.status ? "show" : "close"}
                </span>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        submitStatus: state.showdata.submitStatus
    }
}
export default connect(mapStateToProps)(Slider)