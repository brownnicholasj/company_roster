const mysql = require('mysql');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');
const deptHelper = require('./lib/deptHelper');

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

const init = () => {
	deptList = new deptHelper();
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
		])
		.then((answer) => {
			console.log(`selectionchoice is ====> ${answer.selectChoice}`);
			switch (answer.selectChoice) {
				case 'Department':
					return deptQuery(answer.deptSelect);
				default:
					return conn.end();
			}
		});
};

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

function endConnection() {
	console.log(`closing connection, goodbye`);
	conn.end();
}

// connect to the mysql server and sql database
conn.connect((err) => {
	if (err) throw err;
	init();
});
