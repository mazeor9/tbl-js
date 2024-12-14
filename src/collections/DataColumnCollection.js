const DataColumn = require("../DataColumn");

class DataColumnCollection {
  constructor(table) {
    this._table = table;
    this._columns = new Map();
  }

  /**
   * @param {DataColumn|string} columnOrName - DataColumn instance or name of the column to add
   * @param {string|null} [dataType=null] - Data type of the column (only used if columnOrName is a string)
   * @returns {DataColumn} The added column
   * @throws {Error} If a column with the same name already exists
   */
  add(columnOrName, dataType = null) {
    const column =
      columnOrName instanceof DataColumn
        ? columnOrName
        : new DataColumn(columnOrName, dataType);

    if (this._columns.has(column.columnName)) {
      throw new Error(`Column '${column.columnName}' already exists`);
    }

    column._table = this._table;
    column.ordinal = this._columns.size;
    this._columns.set(column.columnName, column);

    // Adds the column to all existing rows
    if (this._table.rows && this._table.rows._rows) {
      this._table.rows._rows.forEach((row) => {
        row._values[column.columnName] = column.defaultValue;
      });
    }

    return column;
  }

  /**
   * @param {string} columnName - Name of the column to remove
   * @throws {Error} If the column doesn't exist
   */
  remove(columnName) {
    if (!this._columns.has(columnName)) {
      throw new Error(`Column '${columnName}' does not exist`);
    }

    this._columns.delete(columnName);

    // Removes column values ​​from all rows
    if (this._table.rows && this._table.rows._rows) {
      this._table.rows._rows.forEach((row) => {
        delete row._values[columnName];
      });
    }

    // Update the ordinals
    let ordinal = 0;
    for (const col of this._columns.values()) {
      col.ordinal = ordinal++;
    }
  }

  /**
   * @param {string} columnName - Name of the column to check
   * @returns {boolean} True if the column exists, false otherwise
   */
  contains(columnName) {
    return this._columns.has(columnName);
  }

  get count() {
    return this._columns.size;
  }

  *[Symbol.iterator]() {
    yield* this._columns.values();
  }
}

module.exports = DataColumnCollection;
