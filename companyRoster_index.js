const mysql = require('mysql');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');
const chalk = require('chalk');
const deptHelper = require('./lib/deptHelper');
const roleHelper = require('./lib/roleHelper');
const employeeHelper = require('./lib/employeeHelper');
const viewAllEmployees = require('./queries/viewAllEmployees');
const deptQuery = require('./queries/deptQuery');
const roleQuery = require('./queries/roleQuery');
const employeeQuery = require('./queries/employeeQuery');
const managerQuery = require('./queries/managerQuery');
const addTables = require('./queries/addTables');

// connection information for the sql database
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

//store variables used when evaluating what is able to be selected and queried
var deptList = [];
var roleList = [];
var employeeFirst = [];
var employeeLast = [];
var mgrList = [];
var employeeList = [];

const init = () => {
	inquirer
		.prompt({
			name: 'firstChoice',
			type: 'list',
			message: 'What action would you like to take?',
			choices: [
				'View All Employees',
				'View Select Employees',
				'Add New Department, Role, or Employee',
				'Update Employees, Role, or Manager',
				'Delete Employee, Role, or Department',
				'View Budget',
				'EXIT',
			],
		})
		.then((answer) => {
			// run updateList function to populate those lists when needed
			updateLists();
			switch (answer.firstChoice) {
				case 'View All Employees':
					new viewAllEmployees();
					setTimeout(() => init(), 2000);
					return;
				case 'View Select Employees':
					viewSelectEmployees();
					return;
				case 'Add New Department, Role, or Employee':
					addEntry();
					return;
				case 'Update Employees, Role, or Manager':
					updateEmployee();
					return;
				case 'Delete Employee, Role, or Department':
					deleteItem();
					return;
				case 'View Budget':
					budget();
					return;
				default:
					endConnection();
					return;
			}
		});
};

//query pulls all employee information from all tables, returns to firstChoice question
// function viewAllEmployees() {
// 	conn.query(
// 		'SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id',
// 		(err, res) => {
// 			if (err) throw err;
// 			console.table(res);
// 			setTimeout(() => init(), 2000);
// 		}
// 	);
// }

const viewSelectEmployees = () => {
	inquirer
		.prompt([
			{
				name: 'selectChoice',
				type: 'list',
				message: 'What criteria would you like to filter on?',
				choices: ['Department', 'Role', 'Employee', 'Manager', 'EXIT'],
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
			{
				name: 'mgrSelect',
				type: 'list',
				message: `What manager's direct reports would you like to see?`,
				choices: mgrList,
				when: (answers) => answers.selectChoice === 'Manager',
			},
		])
		.then((answer) => {
			switch (answer.selectChoice) {
				case 'Department':
					new deptQuery(answer.deptSelect);
					setTimeout(() => init(), 2000);
					break;
				case 'Role':
					new roleQuery(answer.roleSelect);
					setTimeout(() => init(), 2000);
					break;
				case 'Employee':
					new employeeQuery(
						answer.employeeSelect,
						answer.nameSelect,
						employeeFirst,
						employeeLast
					);
					setTimeout(() => init(), 2000);
					break;
				case 'Manager':
					new managerQuery(answer.mgrSelect);
					setTimeout(() => init(), 2000);
					break;
				case 'EXIT':
					init();
					break;
			}
		});
};

const addEntry = () => {
	inquirer
		.prompt([
			{
				name: 'addChoice',
				type: 'list',
				message: 'What would you like to add?',
				choices: ['Department', 'Role', 'Employee', 'EXIT'],
			},
			{
				name: 'deptAdd',
				type: 'input',
				message: 'What is the name of the Department?',
				when: (answers) => answers.addChoice === 'Department',
			},
			{
				name: 'roleAdd',
				type: 'input',
				message: 'What is the Title of the role you would like to add?',
				when: (answers) => answers.addChoice === 'Role',
			},
			{
				name: 'roleSalary',
				type: 'input',
				message: 'What is the salary of the role? (format: ######.##)',
				when: (answers) => answers.addChoice === 'Role',
				validate(value) {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				},
			},
			{
				name: 'roleDept',
				type: 'list',
				message: 'What department does this role belong to?',
				choices: deptList,
				when: (answers) => answers.addChoice === 'Role',
			},
			{
				name: 'employeeAddFirst',
				type: 'input',
				message: 'What is the employees first name?',
				when: (answers) => answers.addChoice === 'Employee',
			},
			{
				name: 'employeeAddLast',
				type: 'input',
				message: 'What is the employees last name?',
				when: (answers) => answers.addChoice === 'Employee',
			},
			{
				name: 'employeeRole',
				type: 'list',
				message: 'What is the employees Role?',
				choices: roleList,
				when: (answers) => answers.addChoice === 'Employee',
			},
			{
				name: 'employeeMgr',
				type: 'list',
				message: 'Who is the employees Manager?',
				choices: mgrList,
				when: (answers) => answers.addChoice === 'Employee',
			},
		])
		.then((answer) => {
			if (answer.addChoice !== 'EXIT') {
				new addTables(answer, deptList, roleList);
			}
		})
		.then(() => {
			setTimeout(() => init(), 2000);
		});
};

const updateEmployee = () => {
	inquirer
		.prompt([
			{
				name: 'updateChoice',
				type: 'list',
				message: 'What would you like to Update?',
				choices: ['Employee Role', 'Employee Manager', 'EXIT'],
			},
			{
				name: 'employeeSelect',
				type: 'list',
				message: 'Which employee would you like to update?',
				choices: employeeList,
			},
			{
				name: 'newRole',
				type: 'list',
				message: `What is the employee's new role?`,
				choices: roleList,
				when: (answers) => answers.updateChoice === 'Employee Role',
			},
			{
				name: 'newManager',
				type: 'list',
				message: `Who is the employee's new manager?`,
				choices: mgrList,
				when: (answers) => answers.updateChoice === 'Employee Manager',
			},
		])
		.then((answers) => {
			updateTables(answers);
		});
};

function updateTables(answers) {
	let employeeArray = answers.employeeSelect.split('-');
	let employeeId = employeeArray[0].trim();
	let employee_name = employeeArray[1].trim();
	let roleId = employeeArray[3].trim();
	let managerId = employeeArray[5].trim();
	if (answers.newRole) {
		var roleArray = answers.newRole.split('-');
		var newRole = roleArray[0].trim();
	}
	if (answers.newManager) {
		var mgrArray = answers.newManager.split('-');

		var newMgr = mgrArray[0].trim();
	}

	if (answers.updateChoice === 'Employee Role') {
		conn.query(
			`UPDATE employee SET role_id = '${newRole}' WHERE id = '${employeeId}'`,
			(err, res) => {
				if (err) throw err;
				console.log(chalk.white.bgGreen(`${employee_name}'s role was updated`));
				setTimeout(() => init(), 2000);
			}
		);
	} else if (answers.updateChoice === 'Employee Manager') {
		conn.query(
			`UPDATE employee SET manager_id = '${newMgr}' WHERE id = '${employeeId}'`,
			(err, res) => {
				if (err) throw err;
				console.log(
					chalk.white.bgGreen(`${employee_name}'s manager was updated`)
				);
				setTimeout(() => init(), 2000);
			}
		);
	} else {
		setTimeout(() => init(), 2000);
	}
}

// function addTables(answer) {
// 	if (answer.addChoice === 'Department') {
// 		let deptInput = answer.deptAdd;
// 		if (deptList.includes(deptInput)) {
// 			console.log(chalk.white.bgRed(`${deptInput} is already in the table`));
// 			addEntry();
// 		} else {
// 			inquirer
// 				.prompt([
// 					{
// 						name: 'confirmDept',
// 						type: 'confirm',
// 						message: `Are you sure you want to add ${deptInput} as a department?`,
// 					},
// 				])
// 				.then((answers) => {
// 					answers.confirmDept
// 						? conn.query(
// 								`INSERT INTO department (name) VALUES ('${deptInput}')`,
// 								(err, res) => {
// 									if (err) throw err;
// 									console.log(
// 										chalk.white.bgGreen(`${deptInput} was added to the table`)
// 									);
// 									setTimeout(() => init(), 2000);
// 								}
// 						  )
// 						: addEntry();
// 				});
// 		}
// 	} else if (answer.addChoice === 'Role') {
// 		let roleInput = answer.roleAdd;
// 		let roleSalary = answer.roleSalary;
// 		let roleDept = answer.roleDept;
// 		let getDeptId = '';

// 		conn.query(
// 			`SELECT department.department_id FROM department WHERE name='${roleDept}'`,
// 			(err, res) => {
// 				getDeptId = res[0].department_id;
// 			}
// 		);

// 		if (roleList.includes(roleInput)) {
// 			console.log(chalk.white.bgRed(`${roleInput} is already in the table`));
// 			addEntry();
// 		} else {
// 			inquirer
// 				.prompt([
// 					{
// 						name: 'confirmRole',
// 						type: 'confirm',
// 						message: `Are you sure you want to add ${roleInput} as a role?`,
// 					},
// 				])
// 				.then((answers) => {
// 					answers.confirmRole
// 						? conn.query(
// 								`INSERT INTO role (title,salary,department_id) VALUES ('${roleInput}', '${roleSalary}','${getDeptId}')`,
// 								(err, res) => {
// 									console.log(
// 										chalk.white.bgGreen(`${roleInput} was added to the table`)
// 									);
// 									setTimeout(() => init(), 2000);
// 								}
// 						  )
// 						: addEntry();
// 				});
// 		}
// 	} else if (answer.addChoice === 'Employee') {
// 		let first_name = answer.employeeAddFirst;
// 		let last_name = answer.employeeAddLast;
// 		let roleArray = answer.employeeRole.split('-');
// 		let employee_role = roleArray[1].trim();
// 		let employee_mgr = '';
// 		if (answer.employeeMgr === 'none') {
// 			employee_mgr = '';
// 		} else {
// 			employee_mgr = answer.employeeMgr.split('-');
// 		}
// 		let mgr_name = employee_mgr[1];
// 		let getRoleId = '';
// 		let getMgrId = employee_mgr[0];

// 		conn.query(
// 			`SELECT role.role_id FROM role WHERE title='${employee_role}'`,
// 			(err, res) => {
// 				getRoleId = res[0].role_id;
// 			}
// 		);

// 		inquirer
// 			.prompt([
// 				{
// 					name: 'confirmEmployee',
// 					type: 'confirm',
// 					message: `Are you sure you want to add ${first_name} ${last_name} as a ${employee_role}, reporting to ${mgr_name}?`,
// 				},
// 			])
// 			.then((answers) => {
// 				if ((answers.confirmEmployee = false)) {
// 					addEntry();
// 				} else if (getMgrId !== 'none') {
// 					conn.query(
// 						`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${first_name}', '${last_name}','${getRoleId}','${getMgrId}')`,
// 						(err, res) => {
// 							console.log(
// 								chalk.white.bgGreen(
// 									`${first_name} ${last_name} was added to the table`
// 								)
// 							);
// 							setTimeout(() => init(), 2000);
// 						}
// 					);
// 				} else {
// 					conn.query(
// 						`INSERT INTO employee (first_name,last_name,role_id) VALUES ('${first_name}', '${last_name}','${getRoleId}')`,
// 						(err, res) => {
// 							console.log(
// 								chalk.red.bgGreen(
// 									`${first_name} ${last_name} was added to the table`
// 								)
// 							);
// 							setTimeout(() => init(), 2000);
// 						}
// 					);
// 				}
// 			});
// 	} else {
// 		init();
// 	}
// }

//function to update Lists of roles and departments used in inquire questions
function updateLists(column, name) {
	deptList = new deptHelper();
	roleList = new roleHelper();
	const nameSearch = new employeeHelper();
	employeeFirst = nameSearch.getFirstName();
	employeeLast = nameSearch.getLastName();
	mgrList = nameSearch.getManagers();
	employeeList = nameSearch.getEmployees();
}

//function to handle dept query requests
// function deptQuery(filter) {
// 	conn.query(
// 		`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id WHERE department.name='${filter}'`,
// 		(err, res) => {
// 			if (err) throw err;
// 			console.table(res);
// 			setTimeout(() => init(), 2000);
// 		}
// 	);
// }

// //function to handle role query requests
// function roleQuery(filter) {
// 	let roleArray = filter.split('-');
// 	let role = roleArray[1].trim();

// 	conn.query(
// 		`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id WHERE role.title='${role}'`,
// 		(err, res) => {
// 			if (err) throw err;
// 			console.table(res);
// 			setTimeout(() => init(), 2000);
// 		}
// 	);
// }

// //function to handle employee specific requests
// function employeeQuery(col, select) {
// 	let selectFormatted = formatInput(select);

// 	if (
// 		!employeeFirst.includes(selectFormatted) &&
// 		!employeeLast.includes(selectFormatted)
// 	) {
// 		console.log(
// 			chalk.white.bgBlue(`${selectFormatted} is not on the company roster`)
// 		);
// 		setTimeout(() => init(), 2000);
// 	} else {
// 		conn.query(
// 			`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id WHERE ${col}='${select}'`,
// 			(err, res) => {
// 				if (err) throw err;
// 				console.table(res);
// 				setTimeout(() => init(), 2000);
// 			}
// 		);
// 	}
// }

// //function to handle employee specific requests
// function managerQuery(select) {
// 	let mgrArray = select.split('-');
// 	let mgrId = mgrArray[0].trim();
// 	let mgrName = mgrArray[1].trim();

// 	conn.query(
// 		`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id WHERE manager_id='${mgrId}'`,
// 		(err, res) => {
// 			if (err) throw err;
// 			console.table(res);
// 			setTimeout(() => init(), 2000);
// 		}
// 	);
// }

//function to format the input to first letter capitalized lowercase to the rest of the string, plan to use at multiple points
// function formatInput(string) {
// 	let stringLower = string.toLowerCase();
// 	let stringFormatted = stringLower[0].toUpperCase() + stringLower.substring(1);
// 	return stringFormatted;
// }

const deleteItem = () => {
	inquirer
		.prompt([
			{
				name: 'deleteChoice',
				type: 'list',
				message: 'What would you like to Delete?',
				choices: ['Employee', 'Role', 'Department', 'EXIT'],
			},
			{
				name: 'employeeDelete',
				type: 'list',
				message: 'Which employee would you like to Delete?',
				choices: employeeList,
				when: (answers) => answers.deleteChoice === 'Employee',
			},
			{
				name: 'roleDelete',
				type: 'list',
				message: `What role would you like to Delete?`,
				choices: roleList,
				when: (answers) => answers.deleteChoice === 'Role',
			},
			{
				name: 'deptDelete',
				type: 'list',
				message: `What department would you like to Delete?`,
				choices: deptList,
				when: (answers) => answers.deleteChoice === 'Department',
			},
		])
		.then((answers) => {
			switch (answers.deleteChoice) {
				case 'Employee':
					deleteConfirm(
						answers.deleteChoice.toLowerCase(),
						answers.employeeDelete
					);
					return;
				case 'Role':
					deleteConfirm(answers.deleteChoice.toLowerCase(), answers.roleDelete);
					return;
				case 'Department':
					deleteConfirm(answers.deleteChoice.toLowerCase(), answers.deptDelete);
					return;
				default:
					endConnection();
					return;
			}
		});

	function deleteConfirm(choice, select) {
		let table = choice;
		let selectArray = select.split('-');
		let idnum = selectArray[0].trim();
		let col = '';
		switch (choice) {
			case 'employee':
				col = 'id';
				break;
			case 'role':
				col = 'role_id';
				break;
			case 'department':
				col = 'name';
				break;
		}

		inquirer
			.prompt([
				{
					name: 'confirmDelete',
					type: 'confirm',
					message: `Are you sure you want to delete ${select} from ${table}?`,
				},
			])
			.then((answer) => {
				if (answer.confirmDelete === false) {
					deleteItem();
				} else {
					conn.query(
						`DELETE FROM ${table} WHERE ${col} = '${idnum}'`,
						(err, res) => {
							if (err) {
								console.log(
									chalk.white.bgRed(
										`This ${table} still has linked associations to other tables, need to remove before you can delete the ${table}.`
									)
								);
								return setTimeout(() => deleteItem());
							}
							console.log(chalk.white.bgGreen(`Item has been Deleted`));
							setTimeout(() => init(), 2000);
						}
					);
				}
			})
			.catch((err) => console.log(err));
	}
};

const budget = () => {
	inquirer
		.prompt([
			{
				name: 'budgetChoice',
				type: 'list',
				message: 'How would you like to review the budget?',
				choices: ['Total Budget', 'Department', 'EXIT'],
			},
			{
				name: 'deptBudget',
				type: 'list',
				message: 'Which department would you like to review?',
				choices: deptList,
				when: (answers) => answers.budgetChoice === 'Department',
			},
		])
		.then((answers) => {
			if (answers.budgetChoice === 'Department') {
				let deptSelect = answers.deptBudget;

				conn.query(
					`SELECT department.name, SUM(salary) AS salaries FROM employee INNER JOIN role USING (role_id) INNER JOIN department USING (department_id) WHERE department.name = '${deptSelect}' GROUP BY department.name`,
					(err, res) => {
						if (err) throw err;
						console.table(res);
						setTimeout(() => init(), 2000);
					}
				);
			} else if (answers.budgetChoice === 'Total Budget') {
				conn.query(
					`SELECT department.name, SUM(salary) AS salaries FROM employee INNER JOIN role USING (role_id) INNER JOIN department USING (department_id) GROUP BY department.name`,
					(err, res) => {
						if (err) throw err;
						console.table(res);
						setTimeout(() => init(), 2000);
					}
				);
			} else {
				setTimeout(() => init(), 2000);
			}
		});
};

function endConnection() {
	console.log(chalk.white.bgRed.bold(`closing connection, goodbye`));
	conn.end();
}

// connect to the mysql server and sql database
conn.connect((err) => {
	if (err) throw err;
	init();
});
