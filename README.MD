# dtable-js

A lightweight and flexible package for managing tabular data with features similar to .NET's DataTable. This package provides an efficient way to handle structured data with support for typed columns, data validation, sorting, and filtering. It can be used with any SQL database like PostgreSQL, MySQL, SQLite, or SQL Server.

## Installation

```bash
npm install dtable-js
```

## Basic Usage

```javascript
// Destructuring
const { DataTable } = require('dtable-js');

// Direct import
const DataTable = require('dtable-js').DataTable;

// Create a new table
const dt = new DataTable('Users');
```

## Database Integration
The library seamlessly integrates with any database query results. You can directly load data from:
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- Any other database that returns query results as objects

Example with different databases:

```javascript
// PostgreSQL
const { Pool } = require('pg');
const pool = new Pool(config);
const dt = new DataTable('Products');

const result = await pool.query('SELECT * FROM products');
dt.loadFromQuery(result.rows);

// MySQL
const mysql = require('mysql2/promise');
const connection = await mysql.createConnection(config);
const [rows] = await connection.execute('SELECT * FROM products');
dt.loadFromQuery(rows);

// SQLite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydb.sqlite');
db.all('SELECT * FROM products', [], (err, rows) => {
    dt.loadFromQuery(rows);
});
```

## Features

- Strongly typed columns
- Row management
- Sorting and filtering
- Data validation
- Query result loading
- Database integration

## API Reference

### Table Operations

#### Creating a Table
```javascript
const dt = new DataTable('TableName');
```

#### Adding Columns
```javascript
// Add a column with type
dt.addColumn('age', 'number');
dt.addColumn('name', 'string');
dt.addColumn('birthDate', 'date');

// Add column without type
dt.addColumn('description');
```

#### Adding Rows
```javascript
// Add row with object
dt.addRow({ name: 'John', age: 30, birthDate: new Date('1993-01-01') });

// Add row with array
dt.addRow(['Jane', 25, new Date('1998-01-01')]);

// Create and add row manually
const row = dt.newRow();
row.set('name', 'Alice');
row.set('age', 28);
dt.rows.add(row);
```

### Row Operations
```javascript
// Get value using row index and column name
const value = dt.rows(0).item("value");  // Gets value from first row, column "value"
const name = dt.rows(1).item("name");    // Gets value from second row, column "name"

// Alternative ways to get values
const name = row.get('name');
const age = row.item('age');

// Set value
row.set('name', 'NewName');

// Remove row
dt.removeRow(0);

// Clear all rows
dt.clear();
```

### Data Operations

#### Filtering Data
```javascript
// Using select
const adults = dt.select(row => row.age >= 18);

// Using findRows
const johns = dt.findRows({ name: 'John' });
const over25 = dt.findRows(row => row.age > 25);
```

### Advanced Filtering Criteria
DataTable-js supports various operators for advanced filtering. Here are all available operators:

```javascript
// Examples of all available operators
dt.findRows({
    // Comparison operators
    age: { $gt: 25 },          // Greater than (>)
    score: { $gte: 90 },       // Greater than or equal (>=)
    price: { $lt: 100 },       // Less than (<)
    quantity: { $lte: 50 },    // Less than or equal (<=)
    status: { $ne: 'active' }, // Not equal (!=)
    
    // Membership operators
    category: { $in: ['A', 'B', 'C'] },  // Value exists in array
    
    // String operators
    name: { $contains: 'john' },     // String contains 'john'
    
    // Regular expressions
    email: /gmail\.com$/,  // Ends with gmail.com
    
    // Exact values
    active: true,          // Exactly matches true
    type: 'user'          // Exactly matches 'user'
});

// Practical examples of combined use
const results = dt.findRows({
    age: { $gt: 18, $lt: 30 },           // Age between 18 and 30
    name: { $contains: 'smith' },         // Name contains 'smith'
    roles: { $in: ['admin', 'editor'] },  // Role is admin or editor
    email: /^[a-z]+@company\.com$/        // Company email
});

// Custom function search
const filtered = dt.findRows(row => {
    const age = row.get('age');
    const status = row.get('status');
    return age > 25 && status === 'active';
});
```

All supported operators:
- `$gt`: Greater than
- `$gte`: Greater than or equal to
- `$lt`: Less than
- `$lte`: Less than or equal to
- `$ne`: Not equal to
- `$in`: Value exists in array
- `$contains`: String contains value
- RegExp: Support for regular expressions

#### Sorting
```javascript
// Simple sort
dt.sort('age', 'asc');

// Multiple criteria sort
dt.sortMultiple(
    { column: 'age', order: 'desc' },
    { column: 'name', order: 'asc' }
);

// Custom sort
dt.sortBy(row => row.get('age') + row.get('name'));
```

#### Loading Data from Database
```javascript
// PostgreSQL example
const { Pool } = require('pg');
const pool = new Pool(config);
const dt = new DataTable('Products');

// Direct loading from query results
const result = await pool.query('SELECT * FROM products WHERE category = $1', ['electronics']);
dt.loadFromQuery(result.rows);

// MySQL example
const mysql = require('mysql2/promise');
const connection = await mysql.createConnection(config);
const [rows] = await connection.execute('SELECT * FROM products WHERE price > ?', [100]);
dt.loadFromQuery(rows);

// Using async version
await dt.loadFromQueryAsync(
    pool.query('SELECT * FROM products').then(result => result.rows)
);

// Load from array of objects
const data = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
];
dt.loadFromQuery(data);
```

### Column Operations
```javascript
// Check if column exists
dt.columnExists('name');

// Remove column
dt.removeColumn('age');
```

### Table Manipulation
```javascript
// Clone table
const newTable = dt.clone();

// Iterate through rows
for (const row of dt) {
    console.log(row.get('name'));
}
```

## Supported Data Types
* string
* number
* date
* boolean

## Advanced Database Usage
The DataTable automatically creates columns based on the database query results, matching the types from your database:
- INTEGER/BIGINT → number
- VARCHAR/TEXT → string
- TIMESTAMP/DATE → date
- BOOLEAN → boolean

This makes it perfect for scenarios where you need to:
- Cache database results
- Manipulate query results before display
- Create temporary data structures from database queries
- Transform data before sending to the frontend

## Error Handling
The library throws errors for:
* Invalid column operations
* Type mismatches
* Null violations
* Duplicate columns

## License
MIT