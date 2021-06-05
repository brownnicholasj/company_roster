# Company Roster Application

![License: MIT](https://img.shields.io/badge/License-MIT-green)

## Description

- This Company Rost CLI application will allow the user to manage their
  Employees, Roles and Departments.
- The technology used for this application are: node, javascript, mysql (npm),
  inquirer (npm), chalk (npm), asciiart-logo (npm), console.table (npm)
- The biggest challenge within this project was organizing the code and having a
  reliable pattern to store, once I landed on one that worked for me, the
  solution came together pretty quickly.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Demo](#demo)
- [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

```
npm i
```

The following dependencies will be installed:

- mysql
- inquirer
- chalk
- asciiart-logo
- console.table

## Usage

A user will start the app in their console log and be presented with the splash
logo and their options ![usage001](./assets/images/usage001.jpg)

The user can navigate from a series of options to select what action or
information they would like to access. ![usage002](./assets/images/usage002.gif)

- View All Employees
- View Employees by Department
- View Employees by Manager
- Add Employee
- Update Employee Role
- Update Employee Manager
- Delete Employee
- View Departments
- Add Department
- Delete Department
- View Roles
- Add Role
- Delete Role
- View Utilized Budget
- EXIT

Informational query actions will perform a 'SELECT' query from mysql database to
get the requested data ![usage003](./assets/images/usage003.gif)

Add actions will perform an 'INSERT ITEM' query to add a new item to the mysql
database. ![usage004](./assets/images/usage004.gif)

Update actions will perform an 'UPDATE' query a specific record within the
database. ![usage005](./assets/images/usage005.gif)

Delete actions will perform a 'DELETE' query to remove a record from the
database ![usage006](./assets/images/usage006.gif)

## License

This project is licensed under the MIT license.

## Contributing

A thanks to the following contributors to this project:

- Nicholas Brown (brownnicholasj.dev@gmail.com)

## Demo

Click the following link to watch video demo of the application (3min41sec
runtime)<br> https://youtu.be/AW5_VCIXF4w

### Demo Script

- 00:00 - start node app
- 00:05 - cycle through options
- 00:08 - View All Employees
- 00:18 - View Departments
- 00:23 - Add Department
- 00:38 - View Roles
- 00:43 - Add Role
- 01:00 - Add Role, trigger duplicate notification
- 01:18 - Add Employee
- 01:41 - View Employee by Department
- 01:53 - View Employee by Manager
- 02:05 - Update Employee Role
- 02:42 - Update Employee Manager
- 03:02 - Delete Dept, trigger dependency message
- 03:13 - Delete Role
- 03:22 - Delete Department
- 03:33 - View Utilized Budget

### Behind the Code

- Constructors created and stored to organize code and actions. This allowed me
  to build the application while minimizing possible bugs across multiple
  actions <br> ![btc001](./assets/images/btc001.jpg)

- Main inquirer prompt serves and the navigation for the application. Users will
  be brought back to this menu after an action is completed: <br>
  ![btc002](./assets/images/btc002.jpg)

- switch method used to process the users selection to the proper action within
  the program: <br> ![btc003](./assets/images/btc003.jpg)

- Functions used to ask for additional user input, if needed, and to give all of
  the properties to the proper constructor, based on the users selection: <br>
  ![btc004](./assets/images/btc004.jpg)

  ![btc004)2](./assets/images/btc004_2.jpg)

- Constructors requested the query using mysql and console.table the results<br>
  ![btc005](./assets/images/btc005.jpg)

- User inputs where the user must type (vs select), function used to format all
  input the same (capitalize first, lowercase the rest)
  ![btc006](./assets/images/btc006.jpg)

- 'Exit' option triggers the endConnection function to close the connection <br>
  ![btc007](./assets/images/btc007.jpg)

## Questions

If you have any questions about the repo, open an issue or contact me directly
at brownnicholasj.dev@gmail.com.You can find more of my work on my GitHub:
[brownnicholasj](https://github.com/brownnicholasj/).
