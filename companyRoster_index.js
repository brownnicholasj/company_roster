const mysql = require('mysql');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');
const deptHelper = require('./lib/deptHelper');
const roleHelper = require('./lib/roleHelper');
const employeeHelper = require('./lib/employeeHelper');

// connection information for the sql database
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

var deptList = [];
var roleList = [];
var employeeFirst = [];
var employeeLast = [];

const init = () => {
	inquirer
		.prompt({
			name: 'firstChoice',
			type: 'list',
			message: 'What action would you like to take?',
			choices: [
				'View All Employees',
				'View Select Employees',
				'ADD',
				'UPDATE',
				'EXIT',
			],
		})
		.then((answer) => {
			// console.log(dept);
			updateLists();
			switch (answer.firstChoice) {
				case 'View All Employees':
					viewAllEmployees();
					return;
				case 'View Select Employees':
					viewSelectEmployees();
					return;
				case 'ADD':
					console.log(`selected ADD with answer = ${answer.firstChoice}`);
					return;
				case 'UPDATE':
					console.log(`selected UpDATE with answer = ${answer.firstChoice}`);
					return;
				default:
					// console.log(`Logging off, goodbye`);
					endConnection();
					return;
			}
		});
};

//query pulls all employee information from all tables, returns to firstChoice question
function viewAllEmployees() {
	conn.query(
		'SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.id LEFT JOIN department AS department ON role.department_id=department.id',
		(err, res) => {
			if (err) throw err;
			console.table(res);
			init();
		}
	);
}

const viewSelectEmployees = () => {
	inquirer
		.prompt([
			{
				name: 'selectChoice',
				type: 'list',
				message: 'What criteria would you like to filter on?',
				choices: ['Department', 'Role', 'Employee', 'EXIT'],
			},
			{
				name: 'deptSelect',
				type: 'list',
				message: 'Which department would you like to view?',
				choices: deptList,
				when: (answers) => answers.selectChoice === 'Department',
			},
			{
				name: 'roleSelect',
				type: 'list',
				message: 'Which role would you like to view?',
				choices: roleList,
				when: (answers) => answers.selectChoice === 'Role',
			},
			{
				name: 'employeeSelect',
				type: 'list',
				message: 'Search by first name or last name?',
				choices: ['first_name', 'last_name'],
				when: (answers) => answers.selectChoice === 'Employee',
			},
			{
				name: 'nameSelect',
				type: 'input',
				message: (answers) =>
					`Input the ${answers.employeeSelect} of the employee you want to find`,
				when: (answers) => answers.selectChoice === 'Employee',
			},
		])
		.then((answer) => {
			switch (answer.selectChoice) {
				case 'Department':
					return deptQuery(answer.deptSelect);
				case 'Role':
					return roleQuery(answer.roleSelect);
				case 'Employee':
					return employeeQuery(answer.employeeSelect, answer.nameSelect);
				case 'EXIT':
					conn.end();
			}
		});
};

function updateLists(column, name) {
	deptList = new deptHelper();
	roleList = new roleHelper();
	const nameSearch = new employeeHelper();
	employeeFirst = nameSearch.getFirstName();
	employeeLast = nameSearch.getLastName();
}

function deptQuery(filter) {
	conn.query(
		`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.id LEFT JOIN department AS department ON role.department_id=department.id WHERE department.name='${filter}'`,
		(err, res) => {
			if (err) throw err;
			console.table(res);
			init();
		}
	);
}

function roleQuery(filter) {
	conn.query(
		`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.id LEFT JOIN department AS department ON role.department_id=department.id WHERE role.title='${filter}'`,
		(err, res) => {
			if (err) throw err;
			console.table(res);
			init();
		}
	);
}

function employeeQuery(col, select) {
	if (!employeeFirst.includes(select) && !employeeLast.includes(select)) {
		console.log(`${select} is not on the company roster`);
		init();
	} else {
		conn.query(
			`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.id LEFT JOIN department AS department ON role.department_id=department.id WHERE ${col}='${select}'`,
			(err, res) => {
				if (err) throw err;
				console.table(res);
				init();
			}
		);
	}
}

function endConnection() {
	console.log(`closing connection, goodbye`);
	conn.end;
}

// connect to the mysql server and sql database
conn.connect((err) => {
	if (err) throw err;
	init();
});
