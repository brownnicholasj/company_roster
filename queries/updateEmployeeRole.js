const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class UpdateEmployeeRole {
	constructor(newRole, roleArr, employeeString) {
		const strSplit = employeeString.split('-');
		const empId = strSplit[0].trim();
		const getRoleIdIndex = roleArr.findIndex((e) => e.title === newRole);
		const getRoleId = roleArr[getRoleIdIndex].role_id;

		conn.query(
			`UPDATE employee SET role_id='${getRoleId}' WHERE id='${empId}'`,
			(err, res) => {
				if (err) throw err;
				console.log(chalk.black.bgGreen.bold(`Role is updated`));
			}
		);
	}
}

module.exports = UpdateEmployeeRole;
