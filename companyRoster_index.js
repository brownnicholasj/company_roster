const mysql = require('mysql');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');
const chalk = require('chalk');
const deptHelper = require('./lib/deptHelper');
const roleHelper = require('./lib/roleHelper');
const employeeHelper = require('./lib/employeeHelper');
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
const deptQuery = require('./queries/deptQuery');
const roleQuery = require('./queries/roleQuery');
const employeeQuery = require('./queries/employeeQuery');
const managerQuery = require('./queries/managerQuery');
// const addDepartment = require('./queries/addDepartment');
// const addRole = require('./queries/addRole');
// const addTables = require('./queries/addTables');

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
			const firstName = answers.empFirst;
			const lastName = answers.empLast;
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
				new addDepartmentExecute(answer.deptInput);
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
							new addRoleExecute(
								answer.roleInput,
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
					break;
				case 'Role':
					new roleQuery(answer.roleSelect);
					break;
				case 'Employee':
					new employeeQuery(
						answer.employeeSelect,
						answer.nameSelect,
						employeeFirst,
						employeeLast
					);
					break;
				case 'Manager':
					new managerQuery(answer.mgrSelect);
					break;
				case 'EXIT':
					break;
			}
		})
		.then(() => setTimeout(() => init(), 2000));
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
			if (answer.addChoice === 'Department') {
				new addDepartment(answer, deptList);
			} else if (answer.addChoice === 'Role') {
				new addRole(answer, roleList);
			}
		})
		.then(() => setTimeout(() => init(), 2000));
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

const endConnection = () => {
	console.log(chalk.white.bgRed.bold(`closing connection, goodbye`));
	conn.connect((err) => {
		end();
	});
};

// connect to the mysql server and sql database
conn.connect((err) => {
	if (err) throw err;
	init();
});
