const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class deleteDepartmentExecute {
	constructor(deptSelect) {
		const deptStr = deptSelect.split('-');
		const dept = deptStr[0].trim();
		conn.query(
			`DELETE FROM department WHERE department_id='${dept}'`,
			(err, res) => {
				if (err)
					return console.log(
						chalk.white.bgRed.bold(
							`${deptSelect} is linked to Roles and/or Employees, cannot delete.`
						)
					);
				return console.log(
					chalk.black.bgGreen.bold(`${deptSelect} was deleted`)
				);
			}
		);
	}
}

module.exports = deleteDepartmentExecute;
