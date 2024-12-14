class DataColumn {
    constructor(columnName, dataType = null, allowNull = true, defaultValue = null) {
        this.columnName = columnName;
        this.dataType = dataType;
        this.ordinal = -1;
        this.allowNull = allowNull;
        this.defaultValue = defaultValue;
        this.caption = columnName;
        this.expression = null;
        this.readOnly = false;
        this.unique = false;
        this._table = null;
    }

    get table() {
        return this._table;
    }
}

module.exports = DataColumn;