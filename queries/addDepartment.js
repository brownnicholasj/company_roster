const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class AddDepartment {
	constructor(answer, deptList) {
		let deptInput = answer.deptAdd;
		if (deptList.includes(deptInput)) {
			return console.log(
				chalk.white.bgRed(`${deptInput} is already in the table`)
			);
		} else {
			conn.query(
				`INSERT INTO department (name) VALUES ('${deptInput}')`,
				(err, res) => {
					if (err) throw err;
					return console.log(
						chalk.white.bgGreen(`${deptInput} was added to the table`)
					);
				}
			);
		}
	}
}

module.exports = AddDepartment;
