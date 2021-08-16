import React, { Component } from "react";
import "../css/slider.css"
import { connect } from 'react-redux'

class CsvMysqlSlider extends Component {

    render() {
        let tableData = this.props.tableData
        return (
            <div>
                {
                    tableData.length
                        ? <table className="tablecontent ">
                            <tr>
                                {
                                    this.props.columnName.map((item, i) => (
                                        <th className="tableth">{item}</th>
                                    ))
                                }

                            </tr>
                            {
                                tableData.map((item, i) => (
                                    <tr>
                                        {
                                            this.props.columnName.map((key, i) => (
                                                <td className="tabletd">{item[key]}</td>
                                            ))
                                        }
                                    </tr>

                                ))
                            }
                        </table> : null
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        tableData: state.showdata.tableData,
        columnName: state.showdata.columnName
    }
}
export default connect(mapStateToProps)(CsvMysqlSlider)