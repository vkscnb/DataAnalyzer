import React, { Component } from "react";
import '../css/main.css'

class SlectSource extends Component {
    render() {
        return (

            <div class="container">
                <div >
                    <div id="loginsqlss">
                        <td>
                            <b>2. Select Source</b>
                        </td>
                        {/* <br />
                        <td>
                            <input class="checkbox" type="checkbox" data-toggle="collapse"
                                data-target="#collapseThreessdsd" aria-expanded="false" aria-controls="collapseThresdsdse" />MySQL
                        </td> */}
                    </div>
                    {/* <div id="collapseThree" class="collapse" aria-labelledby="loginsql" >
                        <div className="card" style={{ width: "50%" }}>
                            <input type="text" placeholder="user name" size="30" />
                            <input type="password" placeholder="password" size="30" />
                            <input type="localhost" placeholder="locahost" />
                        </div>
                        <button type="button" class="btn btn-outline-secondary" style={{ float: "left" }}>Submit</button>
                        <br />
                    </div> */}
                    {/* <br />
                    <td>-------------------------------</td>
                    <div id="clickOnCsv">
                        <br />
                        <td>
                            <input class="checkbox" type="checkbox" data-toggle="collapse"
                                data-target="#collapclickOnCsv" aria-expanded="false" aria-controls="collapsclickOnCsv" />CSV
                        </td>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default SlectSource;