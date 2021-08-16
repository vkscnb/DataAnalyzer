import React, { Component } from "react";
import '../css/main.css'
import Papa from 'papaparse';
import { connect } from 'react-redux';
import getCookie from "../getCookie";

let csrfToken = getCookie("csrftoken");

class SelectSource extends Component {
    state = {
        filePath: '',
        file: '',
        addFileStatus: 0,
        tranformFileStatus: 0,
        createTableStatus: 0,
        csvData: undefined,
        csvCheckboxStatus: false,
        mysqlCheckboxStatus: false,
        mysqlConectect: {
            username: '',
            password: '',
            host: '',
            database: ''
        },
        // csvMySqlStatus: 0,
        table1: '',
        table2: '',
        allDatabaseName: [],
        allTablesName: {},
        ordersColumnsName: [],
        customersCulumnsName: [],
        selectCustomerColumn: [],
        selectOrderColumn: [],
        customerPrimarykey: '',
        ordersPrimarykey: '',
        transformation: {
            orderby: '',
            selctcId: ''
        },
        connectSqlStatus: false,
        showDatabaseName: false
    }

    handleChange = (e) => {
        this.setState({
            file: e.target.value,
            csvData: e.target.files[0],
            addFileStatus: 0,
            tranformFileStatus: 0,
            createTableStatus: 0

        })
    }

    // cvsMysqlStatus = (status) => {
    //     console.log(">>>>>>")
    //     this.setState({ csvMySqlStatus: status })
    // }

    handleInputChange = (e, name) => {
        let value = e.target.value;
        this.setState({
            mysqlConectect: { ...this.state.mysqlConectect, [name]: value }
        });
    }

    checkCustomerColumnhandler = (e) => {
        let value = e.target.value
        this.setState(prevState => ({
            selectCustomerColumn: [...prevState.selectCustomerColumn, value]
        }))
    }

    checkOrderColumnhandler = (e) => {
        let value = e.target.value
        this.setState(prevState => ({
            selectOrderColumn: [...prevState.selectOrderColumn, value]
        }))
    }

    customerPrimarykeyhandler = (e) => {
        this.setState({ customerPrimarykey: e.target.value })
    }

    ordersPrimarykeyhandler = (e) => {
        this.setState({ ordersPrimarykey: e.target.value })
    }

    selectOptionOderby = (e, value) => {
        // console.log(value,e.target.value,">>>>>>>>.")
        this.setState({ transformation: { ...this.state.transformation, [value]: e.target.value } })
    }

    handleSubmit = (status) => {
        if (status === 1) {
            fetch(
                'http://127.0.0.1:8000/databases/show-database-tables', {
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status) {
                        this.setState({
                            allDatabaseName: res.databases,
                            allTablesName: res.tables,
                            customersCulumnsName: res.customers_columns,
                            ordersColumnsName: res.orders_columns,
                            filePath: '',
                            file: ''
                        })
                    } else {
                        alert(res.msg)
                    }
                })
        } else if (status === 2) {
            this.setState({
                filePath: this.state.file,
                allDatabaseName: [],
                allTablesName: {},
                mysqlConectect: {
                    username: '',
                    password: '',
                    host: '',
                    database: ''
                },
                table1: '',
                table2: ''
            })
            this.props.dispatch({
                type: "SUBMIT_STATUS_OF_DATA_ANALYSER",
                submitStatus: false
            })
        }
    };

    connectionWithMySql = () => {
        let data = this.state.mysqlConectect
        if (
            this.state.mysqlConectect.database &&
            this.state.mysqlConectect &&
            this.state.mysqlConectect &&
            this.state.mysqlConectect
        ) {
            this.setState({ connectSqlStatus: !this.state.connectSqlStatus })
            csrfToken = getCookie("csrftoken");
            fetch(
                'http://127.0.0.1:8000/databases/connection', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status) {
                        this.setState({
                            showDatabaseName: !this.state.showDatabaseName,
                            filePath: '',
                            file: ''
                        })
                    } else {
                        alert(res.msg)
                        this.setState({
                            connectSqlStatus: !this.state.connectSqlStatus,
                            filePath: '',
                            file: ''
                        })
                    }
                })
        }
    }

    findAllColumnName = () => {
        let data = this.state.mysqlConectect
        // fetch(
        //     'http://127.0.0.1:8000/databases/show-columns-name', {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Accept: "application/json",
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(res => res.json())
        //     .then(res => {
        //         if (res.status) {
        //             this.setState({ ordersColumnsName: res.order, customersCulumnsName: res.customers })
        //         }
        //     })
    }

    allowDropFile = (e) => {
        e.preventDefault();
    }

    dragFile = (e) => {
        e.dataTransfer.setData("text", e.target.id);
    }

    csvDropFile = (e, status, name) => {
        e.preventDefault();
        this.setState({ [name]: status })
        if (this.state.addFileStatus === 1 && status === 2) {
            this.tranformedData(this.state.csvData)
        } else if (this.state.addFileStatus === 1 && this.state.tranformFileStatus === 2 && status === 3) {
            this.createTableOfData(this.props.csvData)
        }
    }

    mysqlDroptable = (e, name) => {

        e.preventDefault();

        var tableName = e.dataTransfer.getData("text");
        var nodeCopy = document.getElementById(tableName).cloneNode(true);

        this.setState({ [name]: nodeCopy.id })

        nodeCopy.id = "newId";
        e.target.appendChild(nodeCopy);
    }

    allowDropTable = (e) => {
        e.preventDefault();
    }

    handleSubmitShowData = (buttonStatus) => {

        if (buttonStatus === 1) {
            if (
                this.state.addFileStatus === 1 &&
                this.state.tranformFileStatus === 2 &&
                this.state.createTableStatus === 3
            ) {
                this.props.dispatch({
                    type: "SUBMIT_STATUS_OF_DATA_ANALYSER",
                    submitStatus: true
                })
            }
        } else if (
            buttonStatus === 2 &&
            this.state.customersCulumnsName.length &&
            this.state.ordersColumnsName.length
        ) {
            let joiningData = {
                logindata: this.state.mysqlConectect,
                joinby: {
                    customerId: this.state.customerPrimarykey,
                    orderId: this.state.ordersPrimarykey
                },
            }
            // fetch(
            //     'http://127.0.0.1:8000/databases/show-data', {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Accept: "application/json",
            //     },
            //     body: JSON.stringify(joiningData)
            // })
            //     .then(res => res.json())
            //     .then(res => {
            //         // if (res.status) {
            //         //     this.setState({ allDatabaseName: res.databases })
            //         // }
            //     })
        }
    }

    handleSubmitJoinTable = (id) => {

        csrfToken = getCookie("csrftoken");

        let columnName = this.state.customerPrimarykey,
            orderId = this.state.ordersPrimarykey,
            selectid = this.state.transformation.selctcId,
            orderby = this.state.transformation.orderby,
            selectedColumnsName = [...this.state.selectCustomerColumn, ...this.state.selectOrderColumn]

        selectedColumnsName = selectedColumnsName.filter((a, b) => selectedColumnsName.indexOf(a) === b)

        if (id === 1) {

            fetch(
                'http://127.0.0.1:8000/databases/join-table', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({ "columnName": columnName, "orderId": orderId })
            })
                .then(res => res.json({}))
                .then(res => {
                    if (res.status) {

                        this.props.dispatch({
                            type: "MYSQL_JOIN_TRANSFORM_DATA",
                            tableData: res.join_data,
                            columnName: selectedColumnsName,
                            submitStatus: true
                        })
                        alert(res.msg)
                    } else {
                        alert(res.msg)
                    }
                })
        } else if (id === 2) {

            let data = this.props.tableData

            fetch(
                'http://127.0.0.1:8000/databases/transform-data', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({ "selectid": selectid, "orderby": orderby, "data": data })
            })
                .then(res => res.json({}))
                .then(res => {
                    if (res.status) {

                        this.props.dispatch({
                            type: "MYSQL_JOIN_TRANSFORM_DATA",
                            tableData: res.transform_data,
                            columnName: selectedColumnsName,
                            submitStatus: true
                        })
                        alert(res.msg)
                    } else {
                        alert(res.msg)
                    }
                })
        }
    }
    createTableOfData = (data) => {
        if (this.state.addFileStatus === 1 && this.state.tranformFileStatus === 2) {
            this.props.dispatch({
                type: "DATA_FROM_TABLE",
                tableData: data
            })
        }
    }

    tranformedData = (csvData) => {
        Papa.parse(csvData, {
            complete: (result) => {
                this.props.dispatch({
                    type: 'ANALYZE_ALL_DATA',
                    csvData: result.data
                })
            },
            header: true
        });
    }

    render() {

        const allDatabaseName = this.state.allDatabaseName
        const allTablesName = this.state.allTablesName
        const ordersColumnsName = this.state.ordersColumnsName
        const customersCulumnsName = this.state.customersCulumnsName
        const selectCustomerColumn = this.state.selectCustomerColumn
        const selectOrderColumn = this.state.selectOrderColumn

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div >
                            <td >
                                <b>1. Select Format</b>
                            </td>
                            <br />
                            <td>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    data-toggle="collapse"
                                    id="loginsql"
                                    data-target="#collapseThree"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                />MySQL
                            </td>
                        </div>
                        <div id="collapseThree" className="collapse" aria-labelledby="loginsql" >
                            <div style={{ width: "20%" }}>
                                <input
                                    type="text"
                                    placeholder="database name"
                                    value={this.state.mysqlConectect.database}
                                    onChange={(e) => this.handleInputChange(e, 'database')}
                                />
                                <input
                                    type="text"
                                    placeholder="user name"
                                    value={this.state.mysqlConectect.username}
                                    onChange={(e) => this.handleInputChange(e, 'username')}
                                />
                                <input
                                    type="password"
                                    placeholder="password"
                                    value={this.state.mysqlConectect.password}
                                    onChange={(e) => this.handleInputChange(e, 'password')}
                                />
                                <input
                                    type="localhost"
                                    placeholder="locahost"
                                    value={this.state.mysqlConectect.host}
                                    onChange={(e) => this.handleInputChange(e, 'host')}
                                />
                            </div>
                            {
                                this.state.showDatabaseName ?
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        style={{ float: "left" }}
                                        onClick={(e) => this.handleSubmit(1)}
                                    >Show
                                    </button>
                                    : <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        style={{ float: "left" }}
                                        onClick={(e) => this.connectionWithMySql()}
                                        disabled={this.state.connectSqlStatus}
                                    >Connect
                                    </button>
                            }
                            <br />
                        </div>
                        <br />
                        <td>-------------------------------</td>
                        <div id="clickOnCsv">
                            <br />
                            <td>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    data-toggle="collapse"
                                    data-target="#collapclickOnCsv"
                                    aria-expanded="false"
                                    aria-controls="collapsclickOnCsv"
                                />CSV
                            </td>
                        </div>
                        <div id="collapclickOnCsv" className="collapse" aria-labelledby="clickOnCsv" >
                            <input type="file" className="form-control-file" onChange={this.handleChange} value={this.state.file} />
                            <button type="button" className="btn btn-outline-secondary"
                                onClick={() => this.handleSubmit(2)} style={{ float: "left" }}>Submit</button>
                        </div>
                    </div>

                    <div className="col">
                        <td >
                            <b>2. Select Source</b>
                        </td>
                        <div style={{ float: "left" }}>
                            <span style={{ float: "left" }}>MYSQL</span>
                            <span style={{ float: "right" }}>CSV</span><br />
                            <div className="card" style={{ width: "18rem" }}>
                                {
                                    allDatabaseName.map((item, i) => (
                                        <div className="card-body" >
                                            <div
                                                className="card-header"
                                                data-toggle="collapse"
                                                data-target={`#tables_${item}`}
                                                aria-expanded="false"
                                                aria-controls={`#tables_${item}`}
                                            >
                                                <i
                                                    className="fas fa-plus" // onClick={this.showAllTables}
                                                /> {item}
                                            </div>
                                            {
                                                Object.keys(allTablesName).map((key, i) => (
                                                    key === item ? <div className="collapse card-body" id={`tables_${key}`}>
                                                        {
                                                            allTablesName[key].map((tbl, j) => (
                                                                <li className="list-group-item ">
                                                                    <i
                                                                        className="fas fa-plus"
                                                                        data-toggle="collapse"
                                                                        data-target={`#clolumn_${tbl}`}
                                                                        aria-expanded="false"
                                                                        aria-controls={`#clolumn_${tbl}`}
                                                                    />
                                                                    <span id={tbl} value={tbl} draggable="true" onDragStart={e => this.dragFile(e)}>{tbl}</span>
                                                                    <br />
                                                                    <div className="collapse" id={`clolumn_${tbl}`}>
                                                                        {
                                                                            tbl === "customers" ? customersCulumnsName.map((cus_col, k) => (
                                                                                <>
                                                                                    <input
                                                                                        className="checkbox"
                                                                                        type="checkbox"
                                                                                        style={{ float: "left" }}
                                                                                        value={cus_col}
                                                                                        onChange={(e) => this.checkCustomerColumnhandler(e)}
                                                                                    />{cus_col}<br />
                                                                                </>
                                                                            )) :
                                                                                tbl === "orders" ? ordersColumnsName.map((ord_col, k) => (
                                                                                    <>
                                                                                        <input
                                                                                            className="checkbox"
                                                                                            type="checkbox"
                                                                                            style={{ float: "left" }}
                                                                                            value={ord_col}
                                                                                            onChange={(e) => this.checkOrderColumnhandler(e)}
                                                                                        />{ord_col}<br />
                                                                                    </>
                                                                                )) : null
                                                                        }
                                                                    </div>

                                                                </li>
                                                            ))
                                                        }
                                                    </div> : null
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div><br />
                            <span id="drag1" draggable="true" onDragStart={e => this.dragFile(e)} scope="col" style={{ float: "right" }}>
                                {this.state.filePath}
                            </span>
                        </div>
                    </div>
                    <div className="col">
                        <td >
                            <b>3. Visualizer</b>
                        </td><br /><br />

                        {
                            allDatabaseName.length && Object.keys(allTablesName) ? <>
                                <td>
                                    <div
                                        id="table1"
                                        onDrop={e => this.mysqlDroptable(e, "table1")}
                                        onDragOver={e => this.allowDropTable(e)}
                                    >
                                        {this.state.table1 ? this.state.table1 : "table1"}
                                    </div>
                                </td>
                                <br /> <br /> <br />
                                <td>
                                    <div
                                        id="table1"
                                        onDrop={e => this.mysqlDroptable(e, "table2")}
                                        onDragOver={e => this.allowDropTable(e)}
                                    >
                                        {this.state.table2 ? this.state.table2 : "table2"}
                                    </div>
                                </td>
                            </> : null
                        }
                        <br />
                        {
                            (
                                this.state.table1 &&
                                this.state.table2
                            ) ? <div
                                className="card text-center"
                                className="collapse"
                                id="transformdata"
                            >
                                    <div className="card-header">
                                        <p>Which transformation you want to apply</p>
                                    </div>
                                    <div className="card-body">
                                        <select
                                            className="input-custom-heightqx03 form-control form-control-sm "
                                            value={this.state.transformation.orderby}
                                            onChange={e => this.selectOptionOderby(e, "orderby")}
                                        >
                                            <option value=''>Choose...</option>
                                            <option value="asce">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                        <select
                                            className="input-custom-heightqx03 form-control form-control-sm "
                                            value={this.state.transformation.selectId}
                                            onChange={e => this.selectOptionOderby(e, "selctcId")}
                                        >
                                            <option value=''>Choose...</option>
                                            {
                                                selectCustomerColumn.map((item, i) => (
                                                    <option value={item}>{item}</option>
                                                ))
                                            }
                                            {
                                                selectOrderColumn.map((item, i) => (
                                                    <option value={item}>{item}</option>
                                                ))
                                            }
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            // style={{ float: "left" }}
                                            onClick={(e) => this.handleSubmitJoinTable(2)}
                                        >Transform
                                        </button>
                                    </div>
                                </div> : null
                        }

                    </div>

                    {
                        this.state.filePath ?
                            <div className="col">
                                <br /><br /><br /><br />
                                <td>
                                    <div
                                        id="div1"
                                        onDrop={!this.state.addFileStatus ? e => this.csvDropFile(e, 1, "addFileStatus") : null}
                                        onDragOver={!this.state.addFileStatus ? e => this.allowDropFile(e) : null}
                                        draggable={this.state.addFileStatus ? "true" : "false"}
                                        onDragStart={this.state.addFileStatus ? e => this.dragFile(e) : null}
                                    >
                                        {this.state.addFileStatus === 1 ? "file added" : "file"}
                                    </div>
                                </td>
                                <br /><br /><br />
                                <td>
                                    <div
                                        id="div1"
                                        onDrop={!this.state.tranformFileStatus ? e => this.csvDropFile(e, 2, "tranformFileStatus") : null}
                                        onDragOver={!this.state.tranformFileStatus ? this.state.addFileStatus ? e => this.allowDropFile(e) : null : null}
                                        draggable={this.state.tranformFileStatus ? "true" : "false"}
                                        onDragStart={this.state.tranformFileStatus ? e => this.dragFile(e) : null}
                                    >
                                        {this.state.tranformFileStatus === 2 ? "Tranformed" : "Tranform"}

                                    </div>
                                </td>
                                <br /><br /><br />
                                <td>
                                    <div
                                        id="div1"
                                        onDrop={!this.state.createTableStatus ? e => this.csvDropFile(e, 3, "createTableStatus") : null}
                                        onDragOver={!this.state.createTableStatus ? this.state.tranformFileStatus ? this.state.addFileStatus ? e => this.allowDropFile(e) : null : null : null}
                                    >
                                        {this.state.createTableStatus === 3 ? "Table Created" : "Create Table"}

                                    </div>
                                </td>
                                <br /><br /><br />
                                <button classname="btn btn-primary" onClick={this.handleSubmitShowData(1)}>Submit</button>
                            </div> :

                            allDatabaseName.length && Object.keys(allTablesName) ?
                                <div className="col" style={{ width: "100%" }}>
                                    <br /><br /><br /><br />
                                    <td>
                                        <div
                                            className="divOutline"
                                            data-toggle="collapse"
                                            data-target="#jointables"
                                            aria-expanded="false"
                                            aria-controls="#jointables"
                                            onClick={() => this.findAllColumnName()}
                                        >
                                            Join
                                        </div>
                                    </td>
                                    <br /><br /><br /><br />
                                    <td>
                                        <div
                                            className="divOutline"
                                            data-toggle="collapse"
                                            data-target="#transformdata"
                                            aria-expanded="false"
                                            aria-controls="#transformdata"
                                        >
                                            Transform
                                        </div>
                                    </td>
                                    <br /><br /><br /><br />
                                    <td>
                                        <div className="divOutline">
                                            Output File Type
                                        </div>
                                    </td>
                                    <br /><br /><br />
                                    <button className="btn btn-primary">Submit</button>
                                </div> : null
                    }

                    <div className="col">
                        <br /><br /><br /><br />
                        {
                            (
                                this.state.table1 &&
                                this.state.table2
                            ) ? <div
                                className="card"
                                className="collapse"
                                id="jointables"
                            >
                                    <div className="card-header">
                                        <p>Veryfy primery key</p>
                                    </div>
                                    <div className="card-body">
                                        <select
                                            className="input-custom-heightqx03 form-control form-control-sm "
                                            value={this.state.customerPrimarykey}
                                            onChange={this.customerPrimarykeyhandler}
                                        >
                                            <option value=''>Choose...</option>
                                            {
                                                selectCustomerColumn.map((item, i) => (
                                                    <option value={item}>{item}</option>
                                                ))
                                            }
                                        </select>
                                        <select
                                            className="input-custom-heightqx03 form-control form-control-sm "
                                            value={this.state.ordersPrimarykey}
                                            onChange={this.ordersPrimarykeyhandler}
                                        >
                                            <option value=''>Choose...</option>
                                            {
                                                selectOrderColumn.map((item, i) => (
                                                    <option value={item}>{item}</option>
                                                ))
                                            }

                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            // style={{ float: "left" }}
                                            onClick={(e) => this.handleSubmitJoinTable(1)}
                                        >Join
                                        </button>
                                    </div>
                                </div> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        csvData: state.showdata.csvData,
        tableData: state.showdata.tableData
    }
}
export default connect(mapStateToProps)(SelectSource)