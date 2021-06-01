const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');
const inquirer = require('inquirer');

class AddTables {
	constructor(answer, deptList) {
		if (answer.addChoice === 'Department') {
			let deptInput = answer.deptAdd;
			if (deptList.includes(deptInput)) {
				console.log(chalk.white.bgRed(`${deptInput} is already in the table`));
				addEntry();
			} else {
				inquirer
					.prompt([
						{
							name: 'confirmDept',
							type: 'confirm',
							message: `Are you sure you want to add ${deptInput} as a department?`,
						},
					])
					.then((answers) => {
						answers.confirmDept
							? conn.query(
									`INSERT INTO department (name) VALUES ('${deptInput}')`,
									(err, res) => {
										if (err) throw err;
										console.log(
											chalk.white.bgGreen(`${deptInput} was added to the table`)
										);
									}
							  )
							: addEntry();
					});
			}
		} else if (answer.addChoice === 'Role') {
			let roleInput = answer.roleAdd;
			let roleSalary = answer.roleSalary;
			let roleDept = answer.roleDept;
			let getDeptId = '';

			conn.query(
				`SELECT department.department_id FROM department WHERE name='${roleDept}'`,
				(err, res) => {
					getDeptId = res[0].department_id;
				}
			);

			if (roleList.includes(roleInput)) {
				console.log(chalk.white.bgRed(`${roleInput} is already in the table`));
				addEntry();
			} else {
				inquirer
					.prompt([
						{
							name: 'confirmRole',
							type: 'confirm',
							message: `Are you sure you want to add ${roleInput} as a role?`,
						},
					])
					.then((answers) => {
						answers.confirmRole
							? conn.query(
									`INSERT INTO role (title,salary,department_id) VALUES ('${roleInput}', '${roleSalary}','${getDeptId}')`,
									(err, res) => {
										console.log(
											chalk.white.bgGreen(`${roleInput} was added to the table`)
										);
									}
							  )
							: addEntry();
					});
			}
		} else if (answer.addChoice === 'Employee') {
			let first_name = answer.employeeAddFirst;
			let last_name = answer.employeeAddLast;
			let roleArray = answer.employeeRole.split('-');
			let employee_role = roleArray[1].trim();
			let employee_mgr = '';
			if (answer.employeeMgr === 'none') {
				employee_mgr = '';
			} else {
				employee_mgr = answer.employeeMgr.split('-');
			}
			let mgr_name = employee_mgr[1];
			let getRoleId = '';
			let getMgrId = employee_mgr[0];

			conn.query(
				`SELECT role.role_id FROM role WHERE title='${employee_role}'`,
				(err, res) => {
					getRoleId = res[0].role_id;
				}
			);

			inquirer
				.prompt([
					{
						name: 'confirmEmployee',
						type: 'confirm',
						message: `Are you sure you want to add ${first_name} ${last_name} as a ${employee_role}, reporting to ${mgr_name}?`,
					},
				])
				.then((answers) => {
					if ((answers.confirmEmployee = false)) {
						addEntry();
					} else if (getMgrId !== 'none') {
						conn.query(
							`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${first_name}', '${last_name}','${getRoleId}','${getMgrId}')`,
							(err, res) => {
								console.log(
									chalk.white.bgGreen(
										`${first_name} ${last_name} was added to the table`
									)
								);
							}
						);
					} else {
						conn.query(
							`INSERT INTO employee (first_name,last_name,role_id) VALUES ('${first_name}', '${last_name}','${getRoleId}')`,
							(err, res) => {
								console.log(
									chalk.red.bgGreen(
										`${first_name} ${last_name} was added to the table`
									)
								);
							}
						);
					}
				});
		} else {
		}
	}
}

module.exports = AddTables;
