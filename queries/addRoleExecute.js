const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class addRoleExecute {
	constructor(newRole, newSalary, deptId, deptName) {
		conn.query(
			`INSERT INTO role (title,salary,department_id) VALUES ('${newRole}','${newSalary}','${deptId}')`,
			(err, res) => {
				if (err) throw err;
				return console.log(
					chalk.black.bgGreen.bold(`${newRole} was added to the table`)
				);
			}
		);
	}
}

module.exports = addRoleExecute;
