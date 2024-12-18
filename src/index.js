const DataTable = require('./DataTable');
const DataRow = require('./DataRow');
const DataColumn = require('./DataColumn');
const DataRowState = require('./enums/DataRowState');

module.exports = {
    DataTable: DataTable,
    DataRow: DataRow,
    DataColumn: DataColumn,
    DataRowState: DataRowState
};

module.exports.DataTable = DataTable;
module.exports.DataRow = DataRow;
module.exports.DataColumn = DataColumn;
module.exports.DataRowState = DataRowState