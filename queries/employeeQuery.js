const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');
const formatInput = require('../lib/formatInput');

class EmployeeQuery {
	constructor(col, select, employeeFirst, employeeLast) {
		let string = new formatInput(select);
		let selectFormatted = string.getString();

		if (
			!employeeFirst.includes(selectFormatted) &&
			!employeeLast.includes(selectFormatted)
		) {
			console.log(
				chalk.white.bgBlue(`${selectFormatted} is not on the company roster`)
			);
		} else {
			conn.query(
				`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id WHERE ${col}='${select}'`,
				(err, res) => {
					if (err) throw err;
					console.table(res);
				}
			);
		}
	}
}

module.exports = EmployeeQuery;
