const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class AddRole {
	constructor(answer, roleList) {
		let roleInput = answer.roleAdd;
		let roleSalary = answer.roleSalary;
		let roleDept = answer.roleDept;
		let deptId = '';
		const getDeptId = new Promise((resolve, reject) => {
			setTimeout(() => {
				conn.query(
					`SELECT department.department_id FROM department WHERE name='${roleDept}'`,
					(err, res) => {
						resolve((deptId = res[0].department_id));
					}
				);
			}, 500);
		});

		getDeptId.then(() => {
			if (roleList.includes(roleInput)) {
				return console.log(
					chalk.white.bgRed(`${roleInput} is already in the table`)
				);
			} else {
				conn.query(
					`INSERT INTO role (title,salary,department_id) VALUES ('${roleInput}', '${roleSalary}','${deptId}')`,
					(err, res) => {
						return console.log(
							chalk.white.bgGreen(`${roleInput} was added to the table`)
						);
					}
				);
			}
		});
	}
}

module.exports = AddRole;
