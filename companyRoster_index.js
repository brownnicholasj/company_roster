const mysql = require('mysql');
const inquirer = require('inquirer');

// connection information for the sql database
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

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
			// based on their answer, either call the bid or the post functions
			console.log(answer);
			switch (answer.firstChoice) {
				case 'View All Employees':
					viewAllEmployees();
					return;
				case 'View All Employees':
					viewSelectEmployees();
					return;
				case 'ADD':
					console.log(`selected ADD with answer = ${answer.firstChoice}`);
					return;
				case 'UPDATE':
					console.log(`selected UpDATE with answer = ${answer.firstChoice}`);
					return;
				default:
					console.log(`Logging off, goodbye`);
					return conn.end();
			}
		});
};

//query pulls all employee information from all tables, returns to firstChoice question
const viewAllEmployees = () => {
	conn.query(
		'SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.id LEFT JOIN department AS department ON role.department_id=department.id',
		(err, res) => {
			if (err) throw err;
			console.table(res);
			init();
		}
	);
};

const viewSelectEmployees = () => {
	inquirer.prompt({
		name: 'selectChoice',
		type: 'list',
		message: 'What criteria would you like to filter on?',
		choices: ['Department', 'Role', 'Employee', 'EXIT'],
	});
	// conn.query(
	// 	'SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.id LEFT JOIN department AS department ON role.department_id=department.id',
	// 	(err, res) => {
	// 		if (err) throw err;
	// 		console.table(res);
	// 		init();
	// 	}
	// );
};

// connect to the mysql server and sql database
conn.connect((err) => {
	if (err) throw err;
	init();
});
