const DataRow = require('../DataRow');

class DataRowCollection {
    constructor(table) {
        this._table = table;
        this._rows = [];
         // direct access to index column
         const func = (index) => this._rows[index];
        
        // Copia tutte le proprietà e metodi nell'oggetto funzione
        Object.setPrototypeOf(func, DataRowCollection.prototype);
        Object.assign(func, this);
        
        // Crea un proxy per gestire sia l'accesso via indice che via funzione
        return new Proxy(func, {
            get: (target, prop) => {
                if (typeof prop === 'string' && !isNaN(Number(prop))) {
                    return target._rows[prop];
                }
                return target[prop];
            },
            apply: (target, thisArg, [index]) => {
                return target._rows[index];
            }
        });
    }

    /**
     * @param {DataRow|Array|Object} row - Row to add: can be a DataRow instance, array of values, or object with column-value pairs
     * @returns {DataRow} The added row
     */
    add(row) {
        if (!(row instanceof DataRow)) {
            const newRow = new DataRow(this._table);
            if (Array.isArray(row)) {
                Array.from(this._table.columns).forEach((col, index) => {
                    newRow._values[col.columnName] = row[index];
                });
            } else if (typeof row === 'object') {
                Object.entries(row).forEach(([key, value]) => {
                    if (this._table.columns.contains(key)) {
                        newRow._values[key] = value;
                    }
                });
            }
            row = newRow;
        }
        
        this._rows.push(row);
        return row;
    }

    /**
     * @param {DataRow} row - The row instance to remove from the collection
     */
    remove(row) {
        const index = this._rows.indexOf(row);
        if (index !== -1) {
            this._rows.splice(index, 1);
        }
    }

    /**
     * @param {number} index - The index of the row to remove
     */
    removeAt(index) {
        if (index >= 0 && index < this._rows.length) {
            this._rows.splice(index, 1);
        }
    }

    clear() {
        this._rows = [];
    }

    get count() {
        return this._rows.length;
    }

    *[Symbol.iterator]() {
        yield* this._rows;
    }
}

module.exports = DataRowCollection;