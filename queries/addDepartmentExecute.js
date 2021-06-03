const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class AddDepartmentExecute {
	constructor(newDept) {
		conn.query(
			`INSERT INTO department (name) VALUES ('${newDept}')`,
			(err, res) => {
				if (err) throw err;
				return console.log(
					chalk.black.bgGreen.bold(`${newDept} was added to the table`)
				);
			}
		);
	}
}

module.exports = AddDepartmentExecute;
