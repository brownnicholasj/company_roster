const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class ManagerQuery {
	constructor(select) {
		let mgrArray = select.split('-');
		let mgrId = mgrArray[0].trim();
		let mgrName = mgrArray[1].trim();

		conn.query(
			`SELECT employee.id,employee.first_name,employee.last_name,role.title,role.salary,department.name FROM employee AS employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id WHERE manager_id='${mgrId}'`,
			(err, res) => {
				if (err) throw err;
				console.table(res);
			}
		);
	}
}

module.exports = ManagerQuery;
