const initialState = {
    csvData: [],
    tableData: [],
    submitStatus: false,
    columnName: []
};

const dataAnalyzer = (state = initialState, action) => {
    switch (action.type) {
        case 'ANALYZE_ALL_DATA':
            let csvData = action.csvData
            return {
                ...state,
                csvData
            };

        case "DATA_FROM_TABLE":
            let tableData = action.tableData
            let columnName = []
            Object.keys(tableData[0]).map((key, i) => {
                columnName.push(key)
            })
            return {
                ...state,
                tableData,
                columnName
            }
        case "SUBMIT_STATUS_OF_DATA_ANALYSER":
            return {
                ...state,
                submitStatus: action.submitStatus
            }
        case "MYSQL_JOIN_TRANSFORM_DATA":
            return {
                ...state,
                tableData:action.tableData,
                columnName:action.columnName,
                submitStatus:action.submitStatus
            }
        default:
            return state
    }
}

export default dataAnalyzer;
