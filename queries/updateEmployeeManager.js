const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class UpdateEmployeeManager {
	constructor(newMgrStr, employeeString) {
		const strSplit = employeeString.split('-');
		const empId = strSplit[0].trim();
		const mgrSplit = newMgrStr.split('-');
		const newMgr = mgrSplit[0].trim();

		conn.query(
			`UPDATE employee SET manager_id='${newMgr}' WHERE id='${empId}'`,
			(err, res) => {
				if (err) throw err;
				console.log(chalk.black.bgGreen.bold(`Manager is updated`));
			}
		);
	}
}

module.exports = UpdateEmployeeManager;
