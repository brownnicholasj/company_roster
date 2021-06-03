const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class deleteEmployeeExecute {
	constructor(employeeString) {
		const strSplit = employeeString.split('-');
		const empId = strSplit[0].trim();

		conn.query(`DELETE FROM employee WHERE id='${empId}'`, (err, res) => {
			if (err) throw err;
			console.log(chalk.black.bgGreen.bold(`${strSplit[1]} has been Deleted`));
		});
	}
}

module.exports = deleteEmployeeExecute;
