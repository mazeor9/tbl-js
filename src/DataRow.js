const DataRowState = require('./enums/DataRowState');

class DataRow {
    constructor(table) {
        this._table = table;
        this._values = {};
        this._rowState = DataRowState.ADDED;
        this._originalValues = {};

        for (const column of table.columns) {
            this._values[column.columnName] = column.defaultValue;
        }
    }

    /**
     * Alias for get()
     * @param {string} columnName - Name of the column to retrieve value from
     * @returns {*} The value stored in the specified column
     * @throws {Error} If the column doesn't exist
     */
    item(columnName) {
        return this.get(columnName);
    }

    /**
     * @param {number|string} index - Numeric index or column name
     * @returns {*} The value stored at the specified index or column name
     * @throws {Error} If the column doesn't exist
     */
    get(index) {
        if (typeof index === 'number') {
            const columnNames = Array.from(this._table.columns._columns.keys());
            const columnName = columnNames[index];
            if (!this._table.columns.contains(columnName)) {
                throw new Error(`Column at index ${index} does not exist`);
            }
            return this._values[columnName];
        }
        if (!this._table.columns.contains(index)) {
            throw new Error(`Column '${index}' does not exist`);
        }
        return this._values[index];
    }

    /**
     * @param {string} columnName - Name of the column to set value for
     * @param {*} value - Value to set in the specified column
     * @throws {Error} If the column doesn't exist
     * @throws {Error} If null is not allowed for the column
     * @throws {Error} If value type doesn't match column data type
     */
    set(columnName, value) {
        if (!this._table.columns.contains(columnName)) {
            throw new Error(`Column '${columnName}' does not exist`);
        }
    
        const column = this._table.columns._columns.get(columnName);
    
        // Null validation
        if (value === null && !column.allowNull) {
            throw new Error(`Column '${columnName}' does not allow null values`);
        }
    
        // Type validation
        if (value !== null && column.dataType) {
            switch(column.dataType.toLowerCase()) {
                case 'number':
                    if (isNaN(Number(value))) {
                        throw new Error(`Value '${value}' cannot be converted to number for column '${columnName}'`);
                    }
                    value = Number(value);
                    break;
                case 'date':
                    if (!(value instanceof Date) && isNaN(Date.parse(value))) {
                        throw new Error(`Value '${value}' cannot be converted to date for column '${columnName}'`);
                    }
                    value = new Date(value);
                    break;
                case 'string':
                    value = String(value);
                    break;
                case 'boolean':
                    if (typeof value !== 'boolean') {
                        value = Boolean(value);
                    }
                    break;
            }
        }
    
        if (!this._originalValues.hasOwnProperty(columnName)) {
            this._originalValues[columnName] = this._values[columnName];
        }
    
        this._values[columnName] = value;
        this._rowState = DataRowState.MODIFIED;
    }

    toJSON() {
        return this._values;
    }

    toString() {
        return JSON.stringify(this._values);
    }
}

module.exports = DataRow;