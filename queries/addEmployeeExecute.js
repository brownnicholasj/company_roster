const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class AddEmployeeExecute {
	constructor(firstName, lastName, role, roleArr, mgrName, mgrArr) {
		const getMgrIdIndex = mgrArr.findIndex((e) => e.Manager === mgrName);
		let getMgrId = '';
		if (mgrName === 'none') {
			getMgrId = 'NULL';
		} else {
			getMgrId = `\'${mgrArr[getMgrIdIndex].id}\'`;
		}
		const getRoleIdIndex = roleArr.findIndex((e) => e.title === role);
		const getRoleId = roleArr[getRoleIdIndex].role_id;

		conn.query(
			`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}','${lastName}','${getRoleId}',${getMgrId})`,
			(err, res) => {
				if (err) throw err;
				console.log(
					chalk.black.bgGreen.bold(`${firstName} ${lastName} added.`)
				);
			}
		);
	}
}

module.exports = AddEmployeeExecute;
