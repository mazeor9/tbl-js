class DataView {
    /**
     * @param {DataTable} table - Table to create view for
     * @param {Function|Object} [rowFilter=null] - Filter function or criteria
     * @param {string|Function} [sort=null] - Sort expression or function
     * @param {string} [sortOrder='asc'] - Sort order ('asc' or 'desc')
     */
    constructor(table, rowFilter = null, sort = null, sortOrder = 'asc') {
        this._table = table;
        this._rowFilter = rowFilter;
        this._sort = sort;
        this._sortOrder = sortOrder;
    }

    /**
     * Sets the filter for the view
     * @param {Function|Object} filter - Filter function or criteria object
     * @returns {DataView} The current view instance for chaining
     */
    setFilter(filter) {
        this._rowFilter = filter;
        return this;
    }

    /**
     * Sets the sort expression for the view
     * @param {string|Function} sort - Column name or sort function
     * @param {string} [order='asc'] - Sort order ('asc' or 'desc')
     * @returns {DataView} The current view instance for chaining
     */
    setSort(sort, order = 'asc') {
        this._sort = sort;
        this._sortOrder = order;
        return this;
    }

    /**
     * Gets the filtered and sorted rows
     * @returns {Array<DataRow>} Array of DataRow objects
     */
    getRows() {
        let rows = this._table.rows._rows;
        
        // Apply filter if exists
        if (this._rowFilter) {
            if (typeof this._rowFilter === 'function') {
                rows = rows.filter(row => this._rowFilter(row));
            } else {
                rows = this._table.findRows(this._rowFilter);
            }
        }
        
        // Apply sort if exists
        if (this._sort) {
            const sortedTable = this._cloneTableWithRows(rows);
            
            if (typeof this._sort === 'function') {
                sortedTable.sortBy(this._sort);
            } else {
                sortedTable.sort(this._sort, this._sortOrder);
            }
            
            rows = sortedTable.rows._rows;
        }
        
        return rows;
    }

    /**
     * Creates a new DataTable with the view results
     * @returns {DataTable} A new DataTable containing the view results
     */
    toTable() {
        const newTable = this._table.clone();
        newTable.clear();
        
        const rows = this.getRows();
        for (const row of rows) {
            const newRow = newTable.newRow();
            for (const column of this._table.columns) {
                newRow.set(column.columnName, row.get(column.columnName));
            }
            newTable.rows.add(newRow);
        }
        
        return newTable;
    }

    /**
     * Creates a JSON representation of the view data
     * @returns {Array<Object>} Array of plain objects with row data
     */
    toArray() {
        return this.getRows().map(row => {
            const result = {};
            for (const column of this._table.columns) {
                result[column.columnName] = row.get(column.columnName);
            }
            return result;
        });
    }

    /**
     * Returns the number of rows in the view
     * @returns {number} Number of rows
     */
    get count() {
        return this.getRows().length;
    }

    /**
     * Creates a temporary table for sorting operations
     * @param {Array<DataRow>} rows - Rows to include
     * @returns {DataTable} Temporary table
     * @private
     */
    _cloneTableWithRows(rows) {
        const tempTable = this._table.clone();
        tempTable.clear();
        
        for (const row of rows) {
            const newRow = tempTable.newRow();
            for (const column of this._table.columns) {
                newRow.set(column.columnName, row.get(column.columnName));
            }
            tempTable.rows.add(newRow);
        }
        
        return tempTable;
    }

    /**
     * Gets the first row in the view
     * @returns {DataRow|null} First row or null if the view is empty
     */
    get firstRow() {
        const rows = this.getRows();
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Iterates through the rows in the view
     */
    *[Symbol.iterator]() {
        yield* this.getRows();
    }

    /**
     * Returns the ith row in the view
     * @param {number} index - Row index
     * @returns {DataRow} DataRow at the specified index
     * @throws {Error} If index is out of range
     */
    row(index) {
        const rows = this.getRows();
        if (index < 0 || index >= rows.length) {
            throw new Error(`Index ${index} out of range [0, ${rows.length - 1}]`);
        }
        return rows[index];
    }
}

module.exports = DataView;