# dtable-js

A lightweight and flexible package for managing tabular data with features similar to .NET's DataTable. This package provides an efficient way to handle structured data with support for typed columns, data validation, sorting, and filtering. It can be used with any SQL database like PostgreSQL, MySQL, SQLite, or SQL Server.

  <div align="center">
  <p>
    <a href="https://github.com/mazeor7/dtable-js/releases/latest">
  <img src="https://img.shields.io/github/v/release/mazeor7/dtable-js?style=for-the-badge" alt="GitHub release (latest SemVer)" /></a>
    <a href="https://github.com/mazeor7/dtable-js/releases/latest">
    <img src="https://img.shields.io/github/release-date/mazeor7/dtable-js?label=latest%20release&style=for-the-badge" alt="Latest release" /></a>
   <a href="https://www.npmjs.com/package/dtable-js"><img src="https://img.shields.io/npm/v/dtable-js.svg?logo=npm&style=for-the-badge" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/dtable-js"><img src="https://img.shields.io/npm/dt/dtable-js.svg?style=for-the-badge" alt="NPM downloads" /></a>
  </p>
</div>

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
- DataSet support for related tables 
- DataView for filtered views of tables
- Advanced schema management and serialization

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
// Get value using row index and column name (recommended method)
const value = dt.rows(0).get("value");  // Gets value from first row, column "value"
const name = dt.rows(1).get("name");    // Gets value from second row, column "name"

// Alternative ways to get values
const name = row.get('name');    // Recommended
const age = row.item('age');     // Supported for backwards compatibility

// Set value
row.set('name', 'NewName');

// Remove row
dt.removeRow(0);

// Clear all rows
dt.clear();
```

### Data Operations

#### Filtering Data
The DataTable provides two methods for filtering data:
- `select()`: Works directly with row values as plain objects. Access values using dot notation (e.g., `row.age`)
- `findRows()`: Works with DataRow objects. Access values using the get() method (e.g., `row.get('age')`)

Examples:
```javascript
// Using select - direct property access
const adults = dt.select(row => row.age >= 18);
const activeUsers = dt.select(row => row.age > 25 && row.active === true);

// Using findRows - using get() method
const johns = dt.findRows({ name: 'John' });
const over25 = dt.findRows(row => row.get('age') > 25);
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
for (const row of newTable) {
    console.log(row.get('name')); // using recommended get() method
}
```

### DataSet Operations
DataSet allows you to manage multiple related tables and define relationships between them.

```javascript
const { DataSet, DataTable } = require('dtable-js');

// Create a new dataset
const ds = new DataSet('CompanyData');

// Add tables to the dataset
const employees = ds.addTable('Employees');
employees.addColumn('id', 'number');
employees.addColumn('name', 'string');
employees.addColumn('departmentId', 'number');

const departments = ds.addTable('Departments');
departments.addColumn('id', 'number');
departments.addColumn('name', 'string');

// Add data
departments.addRow({ id: 1, name: 'HR' });
departments.addRow({ id: 2, name: 'IT' });

employees.addRow({ id: 1, name: 'John', departmentId: 2 });
employees.addRow({ id: 2, name: 'Jane', departmentId: 1 });

// Create a relation between tables
const relation = ds.addRelation(
    'EmpDeptRelation',
    'Departments', 
    'Employees',
    'id',
    'departmentId'
);

// Get related rows
const itDept = departments.findOne({ id: 2 });
const itEmployees = ds.getChildRows(itDept, 'EmpDeptRelation');
console.log(itEmployees); // [{ id: 1, name: 'John', departmentId: 2 }]

// Get parent row
const john = employees.findOne({ name: 'John' });
const johnsDept = ds.getParentRow(john, 'EmpDeptRelation');
console.log(johnsDept.get('name')); // 'IT'
```

### DataView Operations
DataView provides a filtered and sorted view of a DataTable.
```javascript
const { DataTable, DataView } = require('dtable-js');

// Create a table
const users = new DataTable('Users');
users.addColumn('id', 'number');
users.addColumn('name', 'string');
users.addColumn('age', 'number');
users.addColumn('active', 'boolean');

// Add some data
users.addRow({ id: 1, name: 'John', age: 25, active: true });
users.addRow({ id: 2, name: 'Jane', age: 30, active: true });
users.addRow({ id: 3, name: 'Bob', age: 22, active: false });
users.addRow({ id: 4, name: 'Alice', age: 35, active: true });

// Create a view of active users sorted by age
const activeUsersView = new DataView(
    users,
    { active: true },  // Filter
    'age',            // Sort by
    'desc'            // Sort order
);

// Use the view
console.log(`Active users: ${activeUsersView.count}`); // 3

// Get the first row (oldest active user due to desc sort)
const oldest = activeUsersView.firstRow;
console.log(oldest.get('name')); // 'Alice'

// Iterate through view rows
for (const row of activeUsersView) {
    console.log(`${row.get('name')}: ${row.get('age')}`);
}
// Output:
// Alice: 35
// Jane: 30
// John: 25

// Create a new table from the view
const activeUsersTable = activeUsersView.toTable();

// Get view data as array of objects
const activeUsersArray = activeUsersView.toArray();
```

### Advanced Schema Management

The DataTable provides advanced schema management capabilities for working with table structures:

```javascript
const { DataTable } = require('dtable-js');

// Create a table with schema
const users = new DataTable('Users');
users.addColumn('id', 'number');
users.addColumn('name', 'string');
users.addColumn('age', 'number');

// Mark column as primary key
users.columns._columns.get('id').isPrimaryKey = true;
users.columns._columns.get('id').allowNull = false;

// Export the schema to a portable format
const schema = users.exportSchema();
console.log(schema);
/* Output:
{
  tableName: 'Users',
  caseSensitive: false,
  columns: [
    {
      name: 'id',
      dataType: 'number',
      allowNull: false,
      defaultValue: null,
      expression: null,
      readOnly: false,
      unique: true,
      ordinal: 0,
      caption: 'id',
      isPrimaryKey: true
    },
    // ...other columns
  ],
  primaryKey: ['id'],
  uniqueConstraints: []
}
*/

// Save schema to JSON
const schemaJson = users.serializeSchema();
// Later, recreate the table from JSON
const recreatedTable = DataTable.deserializeSchema(schemaJson);

// Create another table with a different schema
const updatedUsers = new DataTable('UpdatedUsers');
updatedUsers.addColumn('id', 'number');
updatedUsers.addColumn('name', 'string');
updatedUsers.addColumn('age', 'number');
updatedUsers.addColumn('email', 'string'); // New column
updatedUsers.columns._columns.get('name').allowNull = false; // Changed nullability

// Compare schemas
const differences = users.compareSchema(updatedUsers);
console.log(differences);
/* Output:
{
  missingColumns: ['email'],
  extraColumns: [],
  typeMismatches: [],
  nullabilityDifferences: [
    {
      column: 'name',
      thisAllowNull: true,
      otherAllowNull: false
    }
  ]
}
*/

// Update schema
const updateResult = users.updateSchema(updatedUsers);
console.log(updateResult);
/* Output:
{
  addedColumns: ['email'],
  removedColumns: [],
  modifiedColumns: [
    {
      column: 'name',
      change: 'allowNull',
      from: true,
      to: false
    }
  ]
}
*/

// Create a table from an existing schema
const newTable = DataTable.importSchema({
  tableName: 'Products',
  columns: [
    { name: 'id', dataType: 'number', allowNull: false, defaultValue: null },
    { name: 'name', dataType: 'string', allowNull: false },
    { name: 'price', dataType: 'number', defaultValue: 0 },
    { name: 'createdAt', dataType: 'date', defaultValue: () => new Date() }
  ],
  primaryKey: ['id']
});
```
The schema management features allow you to:

- Export table structure to a portable format
- Create tables from existing schemas
- Compare schemas between tables to identify differences
- Update a table's schema to match another
- Serialize/deserialize schemas to JSON

This is especially useful for:

- -Creating table structures dynamically based on configuration
- Migrating data between different schema versions
- Generating table documentation
- Schema validation and enforcement

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
