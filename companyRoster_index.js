const mysql = require('mysql');
const inquirer = require('inquirer');
// const { restoreDefaultPrompts } = require('inquirer');
const chalk = require('chalk');
const logo = require('asciiart-logo');
const cTable = require('console.table');
const viewAllEmployees = require('./queries/viewAllEmployees');
const viewEmployeeDepartment = require('./queries/viewEmployeeDepartment');
const viewEmployeeManager = require('./queries/viewEmployeeManager');
const addEmployeeExecute = require('./queries/addEmployeeExecute');
const updateEmployeeRole = require('./queries/updateEmployeeRole');
const updateEmployeeManager = require('./queries/updateEmployeeManager');
const deleteEmployeeExecute = require('./queries/deleteEmployeeExecute');
const viewAllDepartments = require('./queries/viewAllDepartments');
const addDepartmentExecute = require('./queries/addDepartmentExecute');
const deleteDepartmentExecute = require('./queries/deleteDepartmentExecute');
const viewAllRoles = require('./queries/viewAllRoles');
const addRoleExecute = require('./queries/addRoleExecute');
const deleteRoleExecute = require('./queries/deleteRoleExecute');
const viewBudget = require('./queries/viewBudget');

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
				'View Employees by Department',
				'View Employees by Manager',
				'Add Employee',
				'Update Employee Role',
				'Update Employee Manager',
				'Delete Employee',
				'View Departments',
				'Add Department',
				'Delete Department',
				'View Roles',
				'Add Role',
				'Delete Role',
				'View Utilized Budget',
				'EXIT',
			],
		})
		.then((answer) => {
			switch (answer.firstChoice) {
				case 'View All Employees':
					new viewAllEmployees();
					setTimeout(() => init(), 2000);
					break;
				case 'View Employees by Department':
					deptSelect();
					break;
				case 'View Employees by Manager':
					managerSelect();
					break;
				case 'Add Employee':
					addEmployee();
					break;
				case 'Update Employee Role':
					updateRole();
					break;
				case 'Update Employee Manager':
					updateManager();
					break;
				case 'Delete Employee':
					deleteEmployee();
					break;
				case 'View Departments':
					new viewAllDepartments();
					setTimeout(() => init(), 2000);
					break;
				case 'Add Department':
					addDepartment();
					break;
				case 'Delete Department':
					deleteDepartment();
					break;
				case 'View Roles':
					new viewAllRoles();
					setTimeout(() => init(), 2000);
					break;
				case 'Add Role':
					addRole();
					break;
				case 'Delete Role':
					deleteRole();
					break;
				case 'View Utilized Budget':
					new viewBudget();
					setTimeout(() => init(), 2000);
					break;
				default:
					endConnection();
					return;
			}
		});
};

const deptSelect = () => {
	conn.query('SELECT name FROM department', (err, results) => {
		if (err) throw err;
		// once you have the items, prompt the user for which they'd like to bid on
		inquirer
			.prompt([
				{
					name: 'choice',
					type: 'list',
					choices() {
						const choiceArray = [];
						results.forEach(({ name }) => {
							choiceArray.push(name);
						});
						return choiceArray;
					},
					message: 'What Department would you like to view?',
				},
			])
			.then((answer) => {
				new viewEmployeeDepartment(answer.choice);
			})
			.then(() => setTimeout(() => init(), 2000));
	});
};

const managerSelect = () => {
	conn.query(
		`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Manager FROM employee AS e INNER JOIN employee AS m ON e.id = m.manager_id GROUP BY Manager`,
		(err, results) => {
			if (err) throw err;
			const managerIdList = [];
			results.forEach(({ id, Manager }) => {
				managerIdList.push({ id, Manager });
			});
			inquirer
				.prompt([
					{
						name: 'mgrChoice',
						type: 'list',
						choices() {
							const mgrChoiceArr = [];
							results.forEach(({ Manager }) => {
								mgrChoiceArr.push(Manager);
							});
							return mgrChoiceArr;
						},
						message: 'Which Manager would you like to view?',
					},
				])
				.then((answer) => {
					new viewEmployeeManager(answer.mgrChoice, managerIdList);
				})
				.then(() => setTimeout(() => init(), 2000));
		}
	);
};

const addEmployee = () => {
	inquirer
		.prompt([
			{
				name: 'empFirst',
				type: 'input',
				message: 'What is the employees first name?',
			},
			{
				name: 'empLast',
				type: 'input',
				message: 'What is the employees last name?',
			},
		])
		.then((answers) => {
			const firstName = formatInput(answers.empFirst);
			const lastName = formatInput(answers.empLast);
			conn.query(`SELECT * FROM role`, (err, results) => {
				if (err) throw err;
				const roleList = [];
				results.forEach(({ role_id, title }) => {
					roleList.push({ role_id, title });
				});
				inquirer
					.prompt([
						{
							name: 'empRole',
							type: 'list',
							choices() {
								const roleChoiceArr = [];
								results.forEach(({ title }) => {
									roleChoiceArr.push(title);
								});
								return roleChoiceArr;
							},
							message: 'What role will the employee have?',
						},
					])
					.then((answers) => {
						const role = answers.empRole;
						conn.query(
							`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Manager FROM employee AS e`,
							(err, results) => {
								if (err) throw err;
								const managerIdList = [];
								results.forEach(({ id, Manager }) => {
									managerIdList.push({ id, Manager });
								});
								inquirer
									.prompt([
										{
											name: 'mgrChoice',
											type: 'list',
											choices() {
												const mgrChoiceArr = ['none'];
												results.forEach(({ Manager }) => {
													mgrChoiceArr.push(Manager);
												});
												return mgrChoiceArr;
											},
											message: `Who will be ${firstName} ${lastName}'s Manager?`,
										},
									])
									.then((answer) => {
										new addEmployeeExecute(
											firstName,
											lastName,
											role,
											roleList,
											answer.mgrChoice,
											managerIdList
										);
									})
									.then(() => setTimeout(() => init(), 2000));
							}
						);
					});
			});
		});
};

const updateRole = () => {
	conn.query(
		`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, r.title AS Current_Role FROM employee AS e INNER JOIN role AS r ON e.role_id = r.role_id`,
		(err, results) => {
			if (err) throw err;
			const empList = [];
			results.forEach(({ id, Employee, Current_Role }) => {
				empList.push({ id, Employee, Current_Role });
			});
			inquirer
				.prompt([
					{
						name: 'choice',
						type: 'list',
						choices() {
							const choiceArr = ['Exit'];
							results.forEach(({ id, Employee, Current_Role }) => {
								choiceArr.push(`${id} - ${Employee} as ${Current_Role}`);
							});
							return choiceArr;
						},
						message: 'Which Employee would you like change roles?',
					},
				])
				.then((answer) => {
					const empString = answer.choice;
					conn.query(`SELECT * FROM role`, (err, results) => {
						if (err) throw err;
						const roleList = [];
						results.forEach(({ role_id, title }) => {
							roleList.push({ role_id, title });
						});
						inquirer
							.prompt([
								{
									name: 'roleChoice',
									type: 'list',
									choices() {
										const roleChoiceArr = ['Exit'];
										results.forEach(({ role_id, title }) => {
											roleChoiceArr.push(title);
										});
										return roleChoiceArr;
									},
									message: 'What is the new Role?',
								},
							])
							.then((answer) => {
								new updateEmployeeRole(answer.roleChoice, roleList, empString);
							})
							.then(() => setTimeout(() => init(), 2000));
					});
				});
		}
	);
};

const updateManager = () => {
	conn.query(
		`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, CONCAT(m.first_name,' ',m.last_name) AS Current_Mgr FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id`,
		(err, results) => {
			if (err) throw err;
			const empList = [];
			results.forEach(({ id, Employee, Current_Mgr }) => {
				empList.push({ id, Employee, Current_Mgr });
			});
			inquirer
				.prompt([
					{
						name: 'choice',
						type: 'list',
						choices() {
							const choiceArr = ['Exit'];
							results.forEach(({ id, Employee, Current_Mgr }) => {
								choiceArr.push(
									`${id} - ${Employee} reporting to ${Current_Mgr}`
								);
							});
							return choiceArr;
						},
						message: 'Which Employee would you like change Managers?',
					},
				])
				.then((answer) => {
					const empString = answer.choice;
					conn.query(
						`SELECT e.id, CONCAT(e.first_name,' ',e.last_name) AS name, r.title FROM employee AS e INNER JOIN role AS r ON e.role_id = r.role_id`,
						(err, results) => {
							if (err) throw err;
							const empList = [];
							results.forEach(({ id, title, name }) => {
								empList.push({ id, title, name });
							});
							inquirer
								.prompt([
									{
										name: 'mgrChoice',
										type: 'list',
										choices() {
											const mgrChoiceArr = ['None'];
											results.forEach(({ id, title, name }) => {
												mgrChoiceArr.push(`${id} - ${name}, ${title}`);
											});
											return mgrChoiceArr;
										},
										message: 'What is the new Manager?',
									},
								])
								.then((answer) => {
									new updateEmployeeManager(answer.mgrChoice, empString);
								})
								.then(() => setTimeout(() => init(), 2000));
						}
					);
				});
		}
	);
};

const deleteEmployee = () => {
	conn.query(
		`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, r.title AS Title, d.name AS Dept FROM employee AS e INNER JOIN role AS r ON e.role_id = r.role_id INNER JOIN department AS d ON r.department_id=d.department_id`,
		(err, results) => {
			if (err) throw err;
			const empList = [];
			results.forEach(({ id, Employee, Title, Dept }) => {
				empList.push({ id, Employee, Title, Dept });
			});
			inquirer
				.prompt([
					{
						name: 'choice',
						type: 'list',
						choices() {
							const choiceArr = ['Exit'];
							results.forEach(({ id, Employee, Title, Dept }) => {
								choiceArr.push(`${id} - ${Employee}, ${Title} in ${Dept}`);
							});
							return choiceArr;
						},
						message: 'Which Employee would you like to delete?',
					},
				])
				.then((answer) => {
					new deleteEmployeeExecute(answer.choice);
				})
				.then(() => setTimeout(() => init(), 2000));
		}
	);
};

const addDepartment = () => {
	conn.query(`SELECT * FROM department`, (err, results) => {
		if (err) throw err;
		const deptList = [];
		results.forEach(({ department_id, name }) => {
			deptList.push({ department_id, name });
		});
		inquirer
			.prompt([
				{
					name: 'deptInput',
					type: 'input',
					message: 'What is the name of the new Department?',
					validate(value) {
						for (let i = 0; i < deptList.length; i++) {
							if (deptList[i].name.toLowerCase() === value.toLowerCase()) {
								console.log(
									chalk.white.bgRed.bold(`${value} is already a Department`)
								);
								return false;
							}
						}
						return true;
					},
				},
			])
			.then((answer) => {
				let deptInput = formatInput(answer.deptInput);
				new addDepartmentExecute(deptInput);
			})
			.then(() => setTimeout(() => init(), 2000));
	});
};

const deleteDepartment = () => {
	conn.query(`SELECT * FROM department`, (err, results) => {
		if (err) throw err;
		const deptList = [];
		results.forEach(({ department_id, name }) => {
			deptList.push({ department_id, name });
		});
		inquirer
			.prompt([
				{
					name: 'deptSelect',
					type: 'list',
					message: 'What Department do you want to Delete?',
					choices() {
						const choiceArr = ['Exit'];
						results.forEach(({ department_id, name }) => {
							choiceArr.push(`${department_id} - ${name}`);
						});
						return choiceArr;
					},
				},
			])
			.then((answer) => {
				new deleteDepartmentExecute(answer.deptSelect);
			})
			.then(() => setTimeout(() => init(), 2000));
	});
};

const addRole = () => {
	conn.query(`SELECT * FROM department`, (err, results) => {
		if (err) throw err;
		const deptList = [];
		results.forEach(({ department_id, name }) => {
			deptList.push({ department_id, name });
		});
		inquirer
			.prompt([
				{
					name: 'deptSelect',
					type: 'list',
					message: 'What Department will the new role be in?',
					choices() {
						const choiceArr = ['Exit'];
						results.forEach(({ department_id, name }) => {
							choiceArr.push(`${department_id} - ${name}`);
						});
						return choiceArr;
					},
				},
			])
			.then((answer) => {
				const strDeconstruct = answer.deptSelect.split('-');
				const deptId = strDeconstruct[0].trim();
				const deptName = strDeconstruct[1].trim();

				conn.query(`SELECT * FROM role`, (err, results) => {
					if (err) throw err;
					const roleList = [];
					results.forEach(({ role_id, title, salary, department_id }) => {
						roleList.push({ role_id, title, salary, department_id });
					});
					inquirer
						.prompt([
							{
								name: 'roleInput',
								type: 'input',
								message: 'What is the title of the new Role?',
								validate(value) {
									for (let i = 0; i < roleList.length; i++) {
										if (
											roleList[i].title.toLowerCase() === value.toLowerCase() &&
											roleList[i].department_id === deptId
										) {
											console.log(
												chalk.white.bgRed.bold(
													`${value} is already a Role in ${deptName}`
												)
											);
											return false;
										}
									}
									return true;
								},
							},
							{
								name: 'roleSalary',
								type: 'input',
								message: 'What is the Salary of the new Role?',
								validate(value) {
									if (isNaN(value) === false) {
										return true;
									}
									return false;
								},
							},
						])
						.then((answer) => {
							let roleInput = formatInput(answer.roleInput);
							new addRoleExecute(
								roleInput,
								answer.roleSalary,
								deptId,
								deptName
							);
						})
						.then(() => setTimeout(() => init(), 2000));
				});
			});
	});
};

const deleteRole = () => {
	conn.query(
		`SELECT * FROM role INNER JOIN department ON role.department_id=department.department_id`,
		(err, results) => {
			if (err) throw err;
			const roleList = [];
			results.forEach(({ role_id, title, salary, department_id, name }) => {
				roleList.push({ role_id, title, salary, department_id, name });
			});
			inquirer
				.prompt([
					{
						name: 'roleSelect',
						type: 'list',
						message: 'What Role do you want to Delete?',
						choices() {
							const choiceArr = ['Exit'];
							results.forEach(({ role_id, title, name }) => {
								choiceArr.push(`${role_id} - ${title} in ${name}`);
							});
							return choiceArr;
						},
					},
				])
				.then((answer) => {
					new deleteRoleExecute(answer.roleSelect);
				})
				.then(() => setTimeout(() => init(), 2000));
		}
	);
};

function formatInput(string) {
	let stringLower = string.toLowerCase();
	let stringFormatted = stringLower[0].toUpperCase() + stringLower.substring(1);
	return stringFormatted;
}

const endConnection = () => {
	console.log(chalk.white.bgRed.bold(`closing connection, goodbye`));
	conn.end();
};

// connect to the mysql server and sql database
conn.connect((err) => {
	if (err) throw err;
	console.log(
		logo({
			name: 'Company Roster',
			lineChars: 10,
			padding: 2,
			margin: 3,
			borderColor: 'green',
			logoColor: 'bold-green',
			textColor: 'green',
		}).render()
	);
	init();
});
