const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});
const chalk = require('chalk');

class DeleteRoleExecute {
	constructor(roleSelect) {
		const roleStr = roleSelect.split('-');
		const role = roleStr[0].trim();
		conn.query(`DELETE FROM role WHERE role_id='${role}'`, (err, res) => {
			if (err)
				return console.log(
					chalk.white.bgRed.bold(
						`${roleSelect} is linked to Employees, cannot delete.`
					)
				);
			return console.log(chalk.black.bgGreen.bold(`${roleSelect} was deleted`));
		});
	}
}

module.exports = DeleteRoleExecute;
